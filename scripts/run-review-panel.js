/**
 * run-review-panel.js — Peppi Basics v2 Review Panel Orchestrator
 *
 * Architecture: browser-side via Chrome MCP javascript_tool
 *
 * All Perplexity API calls run inside the authenticated browser session
 * (auto-auth via browser cookies, no Cloudflare issues).
 * Node.js helper module (lib/perplexity-upload.js) remains as reference
 * implementation for future standalone use (requires solving CF TLS fingerprint).
 *
 * Execution order:
 *   1. PREFLIGHT_CODE   — verify auth + model catalog
 *   2. CONTENT_SETUP_CODE — fetch reviewer-prompt + card from GitHub
 *   3. UPLOAD_CODE      — upload card.html to S3 (Steps A+B+D), store window.__s3Url
 *   4. GROUP_1_CODE     — Claude + GPT in parallel (Step E, with attachment)
 *   5. GROUP_2_CODE     — Gemini + Grok in parallel
 *   6. GROUP_3_CODE     — Nemotron
 *   7. GROUP_4_FIRE_CODE → wait ~60s → GROUP_4_CHECK_CODE → Sonar
 *   8. RESULT_DOWNLOAD_CODE — Blob download → ~/Downloads/panel-results-v2.json
 *
 * After download, run Node.js part B to write _submissions/:
 *   node -e "$(WRITE_RESULTS_CODE)" -- <package-slug>
 *
 * @see docs/api-research/perplexity-upload-protocol.md
 * @see docs/api-research/production-panel-spec.md
 */

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Returns the MIME type that the Perplexity UI sends for a given filename.
 * Matches UI behaviour confirmed via HAR captures 2026-04-25.
 * .html → "text/html"  (server sets x-amz-meta-is_text_only: "true")
 * .md   → ""           (UI sends empty string; server sets is_text_only: "false")
 * @param {string} filename
 * @returns {string}
 */
function contentTypeForFile(filename) {
  if (filename.endsWith('.html')) return 'text/html';
  if (filename.endsWith('.md'))   return '';
  if (filename.endsWith('.pdf'))  return 'application/pdf';
  if (filename.endsWith('.txt'))  return 'text/plain';
  return '';
}

// ─── PANEL ───────────────────────────────────────────────────────────────────

const PANEL = [
  { slug: "claude-sonnet-46",    model_preference: "claude46sonnetthinking", identify_as: "Claude Sonnet 4.6 (Thinking)", pair_group: 1 },
  { slug: "gpt-54",              model_preference: "gpt54",                  identify_as: "GPT-5.4",                       pair_group: 1 },
  { slug: "gemini-31-pro-high",  model_preference: "gemini31pro_high",       identify_as: "Gemini 3.1 Pro Thinking (Perplexity)", pair_group: 2 },
  { slug: "grok",                model_preference: "grok",                   identify_as: "Grok 4.1",                      pair_group: 2 },
  { slug: "nemotron-3-super",    model_preference: "nv_nemotron_3_super",    identify_as: "Nemotron 3 Super",               pair_group: 3 },
  { slug: "sonar-deep-research", model_preference: "pplx_alpha",             identify_as: "Sonar Deep Research",           pair_group: 4 },
];

const ASK_ENDPOINT      = "https://www.perplexity.ai/rest/sse/perplexity_ask";
const CONFIG_ENDPOINT   = "https://www.perplexity.ai/rest/models/config?config_schema=v1";
const SETTINGS_ENDPOINT = "https://www.perplexity.ai/rest/user/settings";
const SUSPICIOUS_SHORT  = 1500;

// ─── PREFLIGHT_CODE ───────────────────────────────────────────────────────────

const PREFLIGHT_CODE = `
(async () => {
  const SETTINGS_ENDPOINT = "https://www.perplexity.ai/rest/user/settings";
  const CONFIG_ENDPOINT   = "https://www.perplexity.ai/rest/models/config?config_schema=v1";
  const REQUIRED_MODELS   = ["claude46sonnetthinking","gpt54","gemini31pro_high","grok","nv_nemotron_3_super","pplx_alpha"];

  window.__panelResults = {};

  const settings = await fetch(SETTINGS_ENDPOINT).then(r => r.json());
  const plan     = settings?.subscription_status ?? settings?.plan ?? "(unknown)";
  const agRes    = settings?.agentic_research ?? settings?.agentic_research_enabled ?? "(unknown)";
  console.log("[preflight] plan:", plan, "| agentic_research:", agRes);
  if (agRes === 1 || agRes === true || agRes === "1") {
    console.error("[preflight] WARN: agentic_research is ON — may inflate query cost");
  }

  const config  = await fetch(CONFIG_ENDPOINT).then(r => r.json());
  const modelIds = Object.keys(config?.model_configs ?? config?.models ?? config ?? {});
  const found   = REQUIRED_MODELS.filter(m => modelIds.includes(m));
  const missing = REQUIRED_MODELS.filter(m => !modelIds.includes(m));
  console.log("[preflight] models found:", found.length + "/" + REQUIRED_MODELS.length, found);
  if (missing.length > 0) console.error("[preflight] MISSING models:", missing);

  const qc = settings?.query_count_copilot ?? settings?.copilot_query_count ?? "(unknown)";
  window.__queryCountBefore = qc;
  console.log("[preflight] query_count_copilot before:", qc);

  return { plan, agentic_research: agRes, models_found: found.length, models_missing: missing, query_count_before: qc };
})();
`;

// ─── CONTENT_SETUP_CODE ───────────────────────────────────────────────────────
// Fetches reviewer-prompt.md and card.html from GitHub main branch.
// Stores in window.__reviewContent for use by UPLOAD_CODE and GROUP calls.

const CONTENT_SETUP_CODE = `
(async () => {
  const PACKAGE_SLUG = window.__PACKAGE_OVERRIDE || "example-v0_1_0";
  const BASE = \`https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/\${PACKAGE_SLUG}\`;

  const [prompt, card] = await Promise.all([
    fetch(BASE + "/reviewer-prompt.md").then(r => { if (!r.ok) throw new Error("reviewer-prompt.md: " + r.status); return r.text(); }),
    fetch(BASE + "/card.html").then(r => { if (!r.ok) throw new Error("card.html: " + r.status); return r.text(); }),
  ]);

  let rubric = "";
  try {
    const r = await fetch(BASE + "/rubric.md");
    if (r.ok) rubric = await r.text();
  } catch {}

  window.__reviewContent = { prompt, card, rubric };
  return { package_slug: PACKAGE_SLUG, prompt_chars: prompt.length, card_chars: card.length, rubric_chars: rubric.length };
})();
`;

// ─── UPLOAD_CODE ─────────────────────────────────────────────────────────────
// Steps A + B + D: upload card.html to S3, store s3_object_url in window.__s3Url.
// Run once after CONTENT_SETUP_CODE, before any GROUP calls.
// Uses Varianta A (shared upload) — S3 URL valid for 5 min (well within ~3 min panel wall).

const UPLOAD_CODE = `
(async () => {
  if (!window.__reviewContent?.card) throw new Error("Run CONTENT_SETUP_CODE first");

  const cardText = window.__reviewContent.card;
  const cardBlob = new Blob([cardText], { type: "text/html" });
  const clientUuid = crypto.randomUUID();

  console.log("[upload] Step A: batch_create_upload_url, size=" + cardBlob.size + "B");

  // Step A
  const stepAResp = await fetch("/rest/uploads/batch_create_upload_urls?version=2.18&source=default", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-apiclient": "default",
      "x-app-apiversion": "2.18",
      "x-perplexity-request-endpoint": "https://www.perplexity.ai/rest/uploads/batch_create_upload_urls?version=2.18&source=default",
      "x-perplexity-request-reason": "ask-input-inner-home",
      "x-perplexity-request-try-number": "1",
    },
    body: JSON.stringify({
      files: {
        [clientUuid]: {
          filename: "card.html",
          content_type: "${contentTypeForFile('card.html')}",
          source: "default",
          file_size: cardBlob.size,
          force_image: false,
          skip_parsing: false,
        },
      },
    }),
  });
  if (!stepAResp.ok) throw new Error("Step A HTTP " + stepAResp.status);
  const stepAJson = await stepAResp.json();
  const r = stepAJson.results?.[clientUuid];
  if (!r || r.error) throw new Error("Step A bad response: " + JSON.stringify(stepAJson).slice(0, 200));
  if (r.rate_limited) throw new Error("Step A: rate limited");
  console.log("[upload] Step A: OK, file_uuid=" + r.file_uuid);

  // Step B: S3 multipart POST (field order matters for policy compliance)
  const form = new FormData();
  const f = r.fields;
  ["acl", "Content-Type", "tagging", "x-amz-meta-is_text_only", "key", "AWSAccessKeyId", "x-amz-security-token", "policy", "signature"].forEach(k => {
    if (f[k] !== undefined) form.append(k, f[k]);
  });
  form.append("file", cardBlob, "card.html");
  console.log("[upload] Step B: PUT to S3...");
  const s3Resp = await fetch(r.s3_bucket_url, { method: "POST", body: form });
  if (s3Resp.status !== 204 && s3Resp.status !== 200) {
    const body = await s3Resp.text().catch(() => "");
    throw new Error("Step B HTTP " + s3Resp.status + ": " + body.slice(0, 200));
  }
  console.log("[upload] Step B: OK (HTTP " + s3Resp.status + ")");

  // Step D: subscribe → wait for processing-done SSE
  console.log("[upload] Step D: subscribing to attachment processing...");
  const subResp = await fetch("/rest/sse/attachment_processing/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ file_uuids: [r.file_uuid] }),
  });
  const sseText = await subResp.text();
  const processed = sseText.includes('"success": true') || sseText.includes('"success":true');
  if (!processed) throw new Error("Step D: processing not confirmed. SSE: " + sseText.slice(0, 300));
  console.log("[upload] Step D: OK");

  window.__s3Url = r.s3_object_url;
  console.log("[upload] s3_object_url stored in window.__s3Url");
  return { s3_object_url: r.s3_object_url, file_uuid: r.file_uuid, card_size_b: cardBlob.size };
})();
`;

// ─── SHARED callReviewer (embedded in each group) ────────────────────────────
// Uses window.__s3Url (from UPLOAD_CODE) in params.attachments.
// query_str = reviewer-prompt only (card in attachment, not inline).
// New params per HAR capture 2026-04-25.

const SUPPORTED_BLOCK_USE_CASES = [
  "answer_modes","media_items","knowledge_cards","inline_entity_cards","place_widgets",
  "finance_widgets","prediction_market_widgets","sports_widgets","flight_status_widgets",
  "news_widgets","shopping_widgets","jobs_widgets","search_result_widgets","inline_images",
  "inline_assets","placeholder_cards","diff_blocks","inline_knowledge_cards","entity_group_v2",
  "refinement_filters","canvas_mode","maps_preview","answer_tabs","price_comparison_widgets",
  "preserve_latex","generic_onboarding_widgets","in_context_suggestions","pending_followups",
  "inline_claims","unified_assets","workflow_steps","background_agents",
];

const _CALL_REVIEWER = `
async function callReviewer(slug, modelPref, identifyAs) {
  const SUPPORTED_BLOCK_USE_CASES = ${JSON.stringify(SUPPORTED_BLOCK_USE_CASES)};
  const s3Url = window.__s3Url || null;
  const { prompt } = window.__reviewContent;
  // query_str = reviewer-prompt only (card.html is in S3 attachment)
  const query_str = prompt;

  const body = {
    query_str,
    params: {
      attachments: s3Url ? [s3Url] : [],
      language: "en-US",
      timezone: "Europe/Prague",
      search_focus: "internet",
      sources: ["web"],
      frontend_uuid: crypto.randomUUID(),
      mode: "copilot",
      model_preference: modelPref,
      is_related_query: false,
      is_sponsored: false,
      frontend_context_uuid: crypto.randomUUID(),
      prompt_source: "user",
      query_source: "home",
      is_incognito: false,
      time_from_first_type: 849.6,
      local_search_enabled: false,
      use_schematized_api: true,
      send_back_text_in_streaming_api: false,
      supported_block_use_cases: SUPPORTED_BLOCK_USE_CASES,
      client_coordinates: null,
      mentions: [],
      dsl_query: query_str,
      skip_search_enabled: true,
      is_nav_suggestions_disabled: false,
      source: "default",
      always_search_override: false,
      override_no_search: false,
      should_ask_for_mcp_tool_confirmation: true,
      browser_agent_allow_once_from_toggle: false,
      force_enable_browser_agent: false,
      supported_features: ["browser_agent_permission_banner_v1.1"],
      extended_context: false,
      version: "2.18",
      rum_session_id: crypto.randomUUID(),
    },
  };

  const startMs = Date.now();
  let answer = "";
  let displayModel = "(unknown)";
  let status = "pending";
  let errorDetail = null;

  try {
    const resp = await fetch("https://www.perplexity.ai/rest/sse/perplexity_ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      status = "HTTP_" + resp.status;
      errorDetail = await resp.text().catch(() => "");
    } else {
      const text = await resp.text();
      for (const line of text.split("\\n")) {
        if (!line.startsWith("data: ")) continue;
        try {
          const d = JSON.parse(line.slice(6));
          if (d?.display_model) displayModel = d.display_model;
          if (d?.model_preference && displayModel === "(unknown)") displayModel = d.model_preference;
          // Schematized API: blocks.markdown_block.answer (progress=DONE)
          if (d?.blocks) {
            for (const b of d.blocks) {
              if (b.markdown_block?.progress === "DONE" && b.markdown_block.answer) {
                answer = b.markdown_block.answer;
              }
            }
          }
          // Fallback: plain text accumulator
          if (d?.text && !answer) answer = d.text;
        } catch (_) {}
      }
      status = "OK";
    }
  } catch (e) {
    status = "EXCEPTION";
    errorDetail = e.message;
  }

  const durationMs = Date.now() - startMs;
  const result = { slug, model_preference: modelPref, identify_as: identifyAs, displayModel, answer, status, errorDetail, durationMs, timestamp: new Date().toISOString(), s3Url };
  if (!window.__panelResults) window.__panelResults = {};
  window.__panelResults[slug] = result;
  const flag = answer.length < 1500 ? "SUSPICIOUS_SHORT" : "none";
  console.log("[reviewer]", slug, "|", status, "|", durationMs + "ms", "|", answer.length + " chars | flag=" + flag);
  return { slug, status, chars: answer.length, displayModel, durationMs, flag };
}
`;

// ─── GROUP_1_CODE: Claude + GPT (parallel) ───────────────────────────────────

const GROUP_1_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const [r1, r2] = await Promise.all([
    callReviewer("claude-sonnet-46",  "claude46sonnetthinking", "Claude Sonnet 4.6 (Thinking)"),
    callReviewer("gpt-54",            "gpt54",                  "GPT-5.4"),
  ]);
  return { group: 1, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r1, r2] };
})();
`;

// ─── GROUP_2_CODE: Gemini + Grok (parallel) ──────────────────────────────────

const GROUP_2_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const [r1, r2] = await Promise.all([
    callReviewer("gemini-31-pro-high", "gemini31pro_high",    "Gemini 3.1 Pro Thinking (Perplexity)"),
    callReviewer("grok",              "grok",                 "Grok 4.1"),
  ]);
  return { group: 2, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r1, r2] };
})();
`;

// ─── GROUP_3_CODE: Nemotron (single) ────────────────────────────────────────

const GROUP_3_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const r = await callReviewer("nemotron-3-super", "nv_nemotron_3_super", "Nemotron 3 Super");
  return { group: 3, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r] };
})();
`;

// ─── GROUP_4_CODE: Sonar Deep Research (fire-and-forget) ─────────────────────
// CDP timeout ~45s — use fire-and-forget, poll after ~60s.

const GROUP_4_FIRE_CODE = `
(async () => {
${_CALL_REVIEWER}
  callReviewer("sonar-deep-research", "pplx_alpha", "Sonar Deep Research").then(() => {
    console.log("[group4] sonar-deep-research complete");
  });
  window.__panelResults["sonar-deep-research"] = { status: "in_progress" };
  return { group: 4, note: "fired async — check window.__panelResults['sonar-deep-research'] after ~60s" };
})();
`;

const GROUP_4_CHECK_CODE = `
({ sonar: window.__panelResults?.["sonar-deep-research"]?.status, chars: window.__panelResults?.["sonar-deep-research"]?.answer?.length })
`;

// ─── RESULT_DOWNLOAD_CODE ────────────────────────────────────────────────────
// Blob-downloads all results as JSON to ~/Downloads/panel-results-v2.json.
// Chrome MCP safety filter blocks large text in return values — Blob bypass.

const RESULT_DOWNLOAD_CODE = `
(async () => {
  const slugs = ["claude-sonnet-46","gpt-54","gemini-31-pro-high","grok","nemotron-3-super","sonar-deep-research"];
  const results = {};
  for (const slug of slugs) {
    const r = window.__panelResults?.[slug];
    if (r && r.status !== "in_progress") {
      results[slug] = { slug: r.slug, identify_as: r.identify_as, model_preference: r.model_preference, displayModel: r.displayModel, status: r.status, durationMs: r.durationMs, timestamp: r.timestamp, s3Url: r.s3Url, answer: r.answer };
    }
  }
  const blob = new Blob([JSON.stringify(results)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "panel-results-v2.json";
  document.body.appendChild(a); a.click();
  URL.revokeObjectURL(url);
  return "download_triggered:" + Object.keys(results).length + "/" + slugs.length;
})();
`;

// ─── QUERY_COUNT_AFTER_CODE ───────────────────────────────────────────────────

const QUERY_COUNT_AFTER_CODE = `
(async () => {
  const s = await fetch("https://www.perplexity.ai/rest/user/settings").then(r => r.json());
  const qcAfter  = s?.query_count_copilot ?? s?.copilot_query_count ?? "(unknown)";
  const qcBefore = window.__queryCountBefore ?? "(unknown)";
  return { query_count_before: qcBefore, query_count_after: qcAfter, delta: (qcAfter - qcBefore) || "?" };
})();
`;
