/**
 * run-review-mvp.js — Peppi Basics REST Review Panel Orchestrator (MVP)
 *
 * Architecture: two-part execution
 *
 * PART A (browser-side via Chrome MCP javascript_tool):
 *   - Runs inside the authenticated Perplexity browser session
 *   - Performs pre-flight checks (login + /rest/models/config)
 *   - Fires 6 parallel POST /rest/sse/perplexity_ask calls
 *   - Parses SSE streams and collects final answers
 *   - Returns JSON results to Code session
 *   NOTE: pplx_alpha (Sonar DR) runs as a separate call due to ~40s response
 *         time vs. ~45s CDP timeout. Run PANEL_FAST (5 models) first, then
 *         PANEL_SONAR separately.
 *
 * PART B (host-side via Claude Code Write tool):
 *   - Receives JSON results from Part A
 *   - Writes review-packages/<PACKAGE_SLUG>/_submissions/<slug>.md for each OK result
 *   - Writes <slug>.FAILED.md for failed results
 *
 * Usage:
 *   Not run directly via `node`. Copy PART_A_CODE into Chrome MCP javascript_tool
 *   while on https://www.perplexity.ai — the session cookie provides auth.
 *
 * @see docs/api-research/production-panel-spec.md for full spec
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const PANEL = [
  { slug: "claude-sonnet-46",    model_preference: "claude46sonnet",      identify_as: "Claude Sonnet 4.6" },
  { slug: "gpt-54",              model_preference: "gpt54",               identify_as: "GPT-5.4" },
  { slug: "gemini-31-pro-high",  model_preference: "gemini31pro_high",    identify_as: "Gemini 3.1 Pro Thinking (Perplexity)" },
  { slug: "nemotron-3-super",    model_preference: "nv_nemotron_3_super", identify_as: "Nemotron 3 Super" },
  { slug: "sonar-deep-research", model_preference: "pplx_alpha",          identify_as: "Sonar Deep Research" },
  { slug: "grok",                model_preference: "grok",                identify_as: "Grok 4.1" },
];

const PANEL_FAST  = PANEL.filter(r => r.model_preference !== "pplx_alpha"); // 5 models, parallel
const PANEL_SONAR = PANEL.filter(r => r.model_preference === "pplx_alpha"); // 1 model, separate call

const ENDPOINT         = "https://www.perplexity.ai/rest/sse/perplexity_ask";
const CONFIG_ENDPOINT  = "https://www.perplexity.ai/rest/models/config?config_schema=v1";
const SETTINGS_ENDPOINT = "https://www.perplexity.ai/rest/user/settings";

const REQUEST_PARAMS_BASE = {
  mode: "copilot",
  search_focus: "writing", // CRITICAL: no web search — reviewers evaluate card content only
  language: "en-US",
  timezone: "Europe/Prague",
  use_schematized_api: true,
};

const PACKAGE_SLUG = "example-v0_1_0";
const TIMEOUT_MS   = 85_000; // 85s per individual request (pplx_alpha needs ~40s)

// ─── PART A: BROWSER-SIDE CODE (run via javascript_tool) ─────────────────────
//
// Paste the async IIFE below into javascript_tool on https://www.perplexity.ai
// Returns: { preflightOk, queryCountBefore, results: [...] }
//
// async function callModel(reviewer, reviewerPrompt, cardHtml, rubricMd) { ... }
// async function runPanel(panelSubset) { return Promise.all(...) }
// async function preflight() { ... }
//
// See PART_A_CODE template below — the actual embedded content is injected
// by Claude Code at runtime because file content changes per review package.

// ─── PART B: HOST-SIDE (Claude Code Write tool) ───────────────────────────────
//
// After javascript_tool returns JSON, Code writes:
//   review-packages/example-v0_1_0/_submissions/<slug>.md       (success)
//   review-packages/example-v0_1_0/_submissions/<slug>.FAILED.md (failure)
//
// File format (success):
//   # Review by [identify_as]
//   **Model preference (API):** `[model_preference]`
//   **Display model (response):** `[displayModel]`
//   **Duration:** [ms] ms
//   **Timestamp:** [ISO 8601]
//   ---
//   [answer]
//
// File format (failure):
//   # FAILED: Review by [identify_as]
//   **Status:** [HTTP_ERROR / EXCEPTION / TIMEOUT]
//   **Details:** [error detail]
//   **Duration:** [ms] ms
//   **Timestamp:** [ISO 8601]
