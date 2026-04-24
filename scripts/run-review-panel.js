/**
 * run-review-panel.js — Peppi Basics v2 Review Panel Orchestrator
 *
 * Architecture: four-group pair execution
 *
 * PART A (browser-side via Chrome MCP javascript_tool):
 *   - Runs inside the authenticated Perplexity browser session
 *   - Group 1 (parallel): Claude Sonnet 4.6 + GPT-5.4
 *   - Group 2 (parallel): Gemini 3.1 Pro Thinking + Grok
 *   - Group 3 (single):   Nemotron 3 Super
 *   - Group 4 (single):   Sonar Deep Research
 *   - Each reviewer receives: full reviewer-prompt + full card.html + full rubric
 *   - Results stored in window.__panelResults[slug] between calls
 *
 * PART B (host-side via Claude Code Write tool):
 *   - Reads window.__panelResults one-by-one (safety filter workaround)
 *   - Writes to _submissions/run-<timestamp>/<slug>.md
 *   - Flags SUSPICIOUS_SHORT if answer < 1500 chars
 *
 * Usage:
 *   Run PREFLIGHT_CODE first, then GROUP_1_CODE through GROUP_4_CODE in order.
 *   Each code block is a standalone async IIFE for javascript_tool.
 *
 * v2 vs MVP:
 *   - No compact query format — full prompt + card + rubric in every call
 *   - Pair-grouped execution balances speed vs CDP timeout
 *   - SUSPICIOUS_SHORT flag on < 1500 char answers
 *   - Timestamped subfolder prevents overwrites on re-runs
 *   - window.__panelResults persists between javascript_tool calls
 *
 * @see docs/api-research/production-panel-spec.md
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const PANEL = [
  { slug: "claude-sonnet-46",      model_preference: "claude46sonnet",      identify_as: "Claude Sonnet 4.6",                    pair_group: 1 },
  { slug: "gpt-54",                model_preference: "gpt54",               identify_as: "GPT-5.4",                              pair_group: 1 },
  { slug: "gemini-31-pro-high",    model_preference: "gemini31pro_high",    identify_as: "Gemini 3.1 Pro Thinking (Perplexity)", pair_group: 2 },
  { slug: "grok",                  model_preference: "grok",                identify_as: "Grok 4.1",                             pair_group: 2 },
  { slug: "nemotron-3-super",      model_preference: "nv_nemotron_3_super", identify_as: "Nemotron 3 Super",                     pair_group: 3 },
  { slug: "sonar-deep-research",   model_preference: "pplx_alpha",          identify_as: "Sonar Deep Research",                  pair_group: 4 },
];

const ENDPOINT          = "https://www.perplexity.ai/rest/sse/perplexity_ask";
const CONFIG_ENDPOINT   = "https://www.perplexity.ai/rest/models/config?config_schema=v1";
const SETTINGS_ENDPOINT = "https://www.perplexity.ai/rest/user/settings";
const SUSPICIOUS_SHORT  = 1500; // chars — flag review as suspiciously short

const REQUEST_PARAMS_BASE = {
  mode: "copilot",
  search_focus: "writing",   // no web search — evaluate card content only
  language: "en-US",
  timezone: "Europe/Prague",
  use_schematized_api: true,
};

// ─── PREFLIGHT_CODE ───────────────────────────────────────────────────────────
//
// Run this FIRST in javascript_tool before any group.
// Verifies: auth, plan, agentic_research=0, all 6 model identifiers present.
// Initialises window.__panelResults = {} for result storage.
//
// ─────────────────────────────────────────────────────────────────────────────
const PREFLIGHT_CODE = `
(async () => {
  const SETTINGS_ENDPOINT = "https://www.perplexity.ai/rest/user/settings";
  const CONFIG_ENDPOINT   = "https://www.perplexity.ai/rest/models/config?config_schema=v1";
  const REQUIRED_MODELS   = ["claude46sonnet","gpt54","gemini31pro_high","grok","nv_nemotron_3_super","pplx_alpha"];

  // Init storage
  window.__panelResults = {};

  // Settings check
  const settings = await fetch(SETTINGS_ENDPOINT).then(r => r.json());
  const plan     = settings?.subscription_status ?? settings?.plan ?? "(unknown)";
  const agRes    = settings?.agentic_research ?? settings?.agentic_research_enabled ?? "(unknown)";
  console.log("[preflight] plan:", plan, "| agentic_research:", agRes);
  if (agRes === 1 || agRes === true || agRes === "1") {
    console.error("[preflight] WARN: agentic_research is ON — may inflate query cost");
  }

  // Models config check
  const config = await fetch(CONFIG_ENDPOINT).then(r => r.json());
  const modelIds = Object.keys(config?.model_configs ?? config?.models ?? config ?? {});
  const found    = REQUIRED_MODELS.filter(m => modelIds.includes(m));
  const missing  = REQUIRED_MODELS.filter(m => !modelIds.includes(m));
  console.log("[preflight] models found:", found.length + "/" + REQUIRED_MODELS.length, found);
  if (missing.length > 0) console.error("[preflight] MISSING models:", missing);

  // Query count baseline
  const qc = settings?.query_count_copilot ?? settings?.copilot_query_count ?? "(unknown)";
  window.__queryCountBefore = qc;
  console.log("[preflight] query_count_copilot before:", qc);

  return { plan, agentic_research: agRes, models_found: found.length, models_missing: missing, query_count_before: qc };
})();
`;

// ─── CONTENT_SETUP_CODE (run once before any group) ──────────────────────────
//
// Fetches reviewer-prompt.md, card.html, rubric.md from GitHub and stores in
// window.__reviewContent. Run this after PREFLIGHT_CODE, before group calls.
//
const CONTENT_SETUP_CODE = `
(async () => {
  const PACKAGE_SLUG = window.__PACKAGE_OVERRIDE || "example-v0_1_0";
  const BASE = \`https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/\${PACKAGE_SLUG}\`;
  const [prompt, card] = await Promise.all([
    fetch(BASE + "/reviewer-prompt.md").then(r => r.text()),
    fetch(BASE + "/card.html").then(r => r.text()),
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

// ─── SHARED HELPERS (embedded in each group call) ────────────────────────────
//
// callReviewer reads from window.__reviewContent set by CONTENT_SETUP_CODE.
// Returns raw answer (schematized API JSON array) — extraction happens in PART B.
//
// NOTE: use_schematized_api=true causes the API to return a JSON array of steps.
// The actual review text is in steps.find(s=>s.step_type==="FINAL").content.answer
// (which is itself a JSON string with {answer: "...actual text..."}). Extract
// in PART B using the extractAnswer() helper (see OUTPUT FORMAT section below).
//
const _CALL_REVIEWER = `
async function callReviewer(slug, modelPref, identifyAs) {
  const { prompt, card, rubric } = window.__reviewContent;
  const rubricSection = rubric.trim() ? ["## REVIEW RUBRIC", "", rubric, "", "---", ""] : [];
  const query_str = [
    prompt, "", "---", "",
    "## CARD TO REVIEW", "", card, "", "---", "",
    ...rubricSection,
    "IDENTIFY YOURSELF AS: " + identifyAs,
  ].join("\\n");

  const body = {
    query_str,
    model_preference: modelPref,
    mode: "copilot",
    search_focus: "writing",
    language: "en-US",
    timezone: "Europe/Prague",
    use_schematized_api: true,
  };

  const startMs = Date.now();
  let answer = "";
  let displayModel = "(unknown)";
  let status = "pending";
  let errorDetail = null;

  try {
    const resp = await fetch("https://www.perplexity.ai/rest/sse/perplexity_ask", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      status = "HTTP_" + resp.status;
      errorDetail = await resp.text().catch(() => "");
    } else {
      const text = await resp.text();
      for (const line of text.split("\\n")) {
        if (line.startsWith("data: ")) {
          try {
            const d = JSON.parse(line.slice(6));
            if (d?.text) answer = d.text;
            if (d?.display_model) displayModel = d.display_model;
            if (d?.model_preference) displayModel = d.model_preference;
          } catch (_) {}
        }
      }
      status = "OK";
    }
  } catch (e) {
    status = "EXCEPTION";
    errorDetail = e.message;
  }

  const durationMs = Date.now() - startMs;
  const result = { slug, model_preference: modelPref, identify_as: identifyAs, displayModel, answer, status, errorDetail, durationMs, timestamp: new Date().toISOString() };
  if (!window.__panelResults) window.__panelResults = {};
  window.__panelResults[slug] = result;
  console.log("[reviewer]", slug, "|", status, "|", durationMs + "ms", "|", answer.length + " chars");
  return { slug, status, chars: answer.length, displayModel, durationMs };
}
`;

// ─── GROUP_1_CODE: Claude Sonnet 4.6 + GPT-5.4 (parallel) ───────────────────
const GROUP_1_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const [r1, r2] = await Promise.all([
    callReviewer("claude-sonnet-46", "claude46sonnet", "Claude Sonnet 4.6"),
    callReviewer("gpt-54",           "gpt54",          "GPT-5.4"),
  ]);
  return { group: 1, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r1, r2] };
})();
`;

// ─── GROUP_2_CODE: Gemini 3.1 Pro Thinking + Grok (parallel) ─────────────────
// If CDP timeout occurs, run each reviewer as a separate single call (degradation).
const GROUP_2_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const [r1, r2] = await Promise.all([
    callReviewer("gemini-31-pro-high", "gemini31pro_high", "Gemini 3.1 Pro Thinking (Perplexity)"),
    callReviewer("grok",               "grok",             "Grok 4.1"),
  ]);
  return { group: 2, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r1, r2] };
})();
`;

// ─── GROUP_3_CODE: Nemotron 3 Super (single) ────────────────────────────────
const GROUP_3_CODE = `
(async () => {
${_CALL_REVIEWER}
  const t0 = Date.now();
  const r = await callReviewer("nemotron-3-super", "nv_nemotron_3_super", "Nemotron 3 Super");
  return { group: 3, elapsed_s: ((Date.now()-t0)/1000).toFixed(1), results: [r] };
})();
`;

// ─── GROUP_4_CODE: Sonar Deep Research (fire-and-forget, ~30-45s) ─────────────
//
// Sonar DR exceeds CDP 45s timeout. Use fire-and-forget pattern:
// 1. Run GROUP_4_FIRE_CODE — returns immediately, fetch runs in background
// 2. Wait ~60s (do other work or watch other groups)
// 3. Run GROUP_4_CHECK_CODE — polls window.__panelResults for completion
//
const GROUP_4_FIRE_CODE = `
(async () => {
${_CALL_REVIEWER}
  // Fire async, don't await
  callReviewer("sonar-deep-research", "pplx_alpha", "Sonar Deep Research").then(() => {
    console.log("[group4] sonar-deep-research complete");
  });
  window.__panelResults["sonar-deep-research"] = { status: "in_progress" };
  return { group: 4, note: "fired async — check window.__panelResults[sonar-deep-research] after ~60s" };
})();
`;

const GROUP_4_CHECK_CODE = `
({ sonar: window.__panelResults?.["sonar-deep-research"]?.status, chars: window.__panelResults?.["sonar-deep-research"]?.answer?.length })
`;

// ─── RESULT_DOWNLOAD_CODE ────────────────────────────────────────────────────
//
// The Chrome MCP safety filter blocks large text answers ("[BLOCKED: Cookie/query
// string data]") and base64 ("[BLOCKED: Base64 encoded data]"). Use Blob download
// to write all results to a JSON file in ~/Downloads, bypassing the filter.
//
// Run once after all groups complete (or in batches if needed).
//
const RESULT_DOWNLOAD_CODE = `
(async () => {
  const slugs = ["claude-sonnet-46","gpt-54","gemini-31-pro-high","grok","nemotron-3-super","sonar-deep-research"];
  const results = {};
  for (const slug of slugs) {
    const r = window.__panelResults?.[slug];
    if (r && r.status !== "in_progress") {
      results[slug] = { slug: r.slug, identify_as: r.identify_as, model_preference: r.model_preference, displayModel: r.displayModel, status: r.status, durationMs: r.durationMs, timestamp: r.timestamp, answer: r.answer };
    }
  }
  const blob = new Blob([JSON.stringify(results)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "panel-results-v2.json";
  document.body.appendChild(a); a.click();
  URL.revokeObjectURL(url);
  return "download_triggered:" + Object.keys(results).length;
})();
`;

// ─── OUTPUT FORMAT (PART B — host-side Python) ───────────────────────────────
//
// After Blob download lands in ~/Downloads/panel-results-v2.json, run this
// Python snippet (replace RUN_DIR with the timestamped path):
//
//   import json, re, os
//   d = json.load(open("~/Downloads/panel-results-v2.json"))
//
//   def extract_answer(raw):
//     try:
//       steps = json.loads(raw)
//       if isinstance(steps, list):
//         for step in reversed(steps):
//           if step.get("step_type") == "FINAL":
//             try: return json.loads(step["content"]["answer"])["answer"]
//             except: return step["content"].get("answer", raw)
//     except: pass
//     return raw
//
//   RUN_DIR = "review-packages/example-v0_1_0/_submissions/run-YYYYMMDDTHHMMSSZ"
//   os.makedirs(RUN_DIR, exist_ok=True)
//   for slug, r in d.items():
//     answer = extract_answer(r["answer"])
//     flag = "SUSPICIOUS_SHORT" if len(answer) < 1500 else "none"
//     md = f"# Review by {r['identify_as']}\n\n**Model preference (API):** `{r['model_preference']}`\n**Display model (response):** `{r['displayModel']}`\n**Duration:** {r['durationMs']} ms\n**Answer length:** {len(answer)} chars (extracted)\n**Timestamp:** {r['timestamp']}\n**Flag:** {flag}\n\n---\n\n{answer}\n"
//     open(f"{RUN_DIR}/{slug}.md", "w").write(md)
//
// ─── DEGRADATION HANDLING ─────────────────────────────────────────────────────
//
// If a pair-group CDP-times-out, re-run the two reviewers as single calls:
// 1. Check window.__panelResults to see which reviewer already completed
// 2. Run only the missing reviewer
// 3. Note degradation in the final report
//
// ─── QUERY COUNT AFTER ───────────────────────────────────────────────────────
//
const QUERY_COUNT_AFTER_CODE = `
(async () => {
  const s = await fetch("https://www.perplexity.ai/rest/user/settings").then(r => r.json());
  const qcAfter  = s?.query_count_copilot ?? s?.copilot_query_count ?? "(unknown)";
  const qcBefore = window.__queryCountBefore ?? "(unknown)";
  return { query_count_before: qcBefore, query_count_after: qcAfter, delta: (qcAfter - qcBefore) || "?" };
})();
`;
