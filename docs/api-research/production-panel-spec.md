# Peppi Basics Review Panel — Production Spec

**Last verified:** 2026-04-24
**Status:** Ready for first production pilot (croissant)

---

## Panel composition

Seven reviewers, executed for every card version review session.

### REST path (6 reviewers — parallel via `/rest/sse/perplexity_ask`)

| # | `model_preference` | Identify as | Provider |
|---|---|---|---|
| 1 | `claude46sonnetthinking` | Claude Sonnet 4.6 (Thinking) | Anthropic |
| 2 | `gpt54` | GPT-5.4 | OpenAI |
| 3 | `gemini31pro_high` | Gemini 3.1 Pro Thinking (Perplexity) | Google (via Perplexity) |
| 4 | `nv_nemotron_3_super` | Nemotron 3 Super | NVIDIA |
| 5 | `pplx_alpha` | Sonar Deep Research | Perplexity |
| 6 | `grok` | Grok 4.1 | xAI |

> **Note (2026-04-24):** Claude identifier updated from `claude46sonnet` to `claude46sonnetthinking` (Thinking variant).
> This matches what the Perplexity UI sends when the user selects "Claude Sonnet 4.6" — confirmed via network capture.

### Copy-paste path (1 reviewer)

| # | URL | Identify as |
|---|---|---|
| 7 | https://gemini.google.com | Gemini 3.1 Pro (direct) |

**Reason for copy-paste:** Gemini via Perplexity REST has heavy wrapper wrapping —
self-ID is blocked, version unverifiable. Gemini direct at gemini.google.com gives
cleaner, less-filtered reviews and serves as a "second opinion" against
Perplexity-routed models.

---

## Request parameters (REST path)

For each REST call, use this JSON body:

```json
{
  "query_str": "<reviewer prompt from review-packages/SLUG/reviewer-prompt.md>",
  "params": {
    "model_preference": "<one of the 6 identifiers above>",
    "mode": "copilot",
    "search_focus": "writing",
    "language": "en-US",
    "timezone": "Europe/Prague",
    "use_schematized_api": true,
    "frontend_uuid": "<random UUID>",
    "frontend_context_uuid": "<random UUID>"
  }
}
```

> **`search_focus: "writing"` is used in the current orchestrator** as an attempt to suppress
> web search. However, this conclusion was based on incomplete observation — see
> **[Known parameter inaccuracies (2026-04-24)](#known-parameter-inaccuracies-2026-04-24)** below
> for the correction. The actual "no web search" toggle confirmed via UI network capture is
> `skip_search_enabled: true`.

---

## Real attachment workflow (target architecture)

> **TARGET — not yet implemented.** This section documents the upload flow observed via
> network capture of Robinson's manual UI workflow (2026-04-24). The current orchestrator
> (`scripts/run-review-panel.js`) does NOT use this flow — it inlines the full card HTML
> in `query_str`, which exhausts the shared input/output budget for some models.
> See handover: `_handoff/2026-04-25-review-pipeline-attachment-fix.md`.

The Perplexity UI uploads `card.html` to S3 as a separate step before the ask call, then
references it via `params.attachments`. This keeps `query_str` at ~16 kB (reviewer-prompt only),
leaving full output budget for the review text.

### Three-step upload flow (before `perplexity_ask` call)

**Step A — Presign request**
- Endpoint: UNKNOWN (blocked by Chrome MCP auth-token check in URL — needs second capture)
- Returns: presigned S3 upload URL + `upload_uuid`

**Step B — S3 upload**
- PUT request directly to S3 presigned URL (blob upload of `card.html`)
- No Perplexity auth header — direct S3 PUT

**Step C — File register**
- Endpoint: UNKNOWN (blocked — needs second capture)
- Sends: filename, content_type (`text/html`), file_size metadata, `upload_uuid`
- Returns: `processed_uuid` (Perplexity-side file handle)

**Step D — Processing subscribe**
- POST to `/rest/sse/attachment_processing/subscribe` with `processed_uuid`
- Wait for SSE event confirming processing complete

**Ask call (after upload complete)**

```json
{
  "query_str": "<reviewer-prompt only, ~16 kB>",
  "params": {
    "model_preference": "<model identifier>",
    "mode": "copilot",
    "attachments": ["<s3_url_from_step_b>"],
    "dsl_query": "<same as query_str>",
    "search_focus": "internet",
    "skip_search_enabled": true,
    "use_schematized_api": true,
    "version": "2.18",
    "language": "en-US",
    "timezone": "Europe/Prague",
    "frontend_uuid": "<random UUID>",
    "frontend_context_uuid": "<random UUID>"
  }
}
```

> Step A and Step C URLs are the current implementation blocker. Once captured,
> implementation proceeds as described in the handover doc.

---

## Known parameter inaccuracies (2026-04-24)

The following items in this spec were incorrect as of the 2026-04-24 network capture:

1. **`search_focus: "writing"` does NOT mean "no web search."** That conclusion was based
   on incomplete observation of a single field. The Perplexity UI uses `search_focus: "internet"`
   for normal assistant conversations and still produces web-search-free responses when
   `skip_search_enabled: true` is set. The correct "no web search" toggle is
   **`skip_search_enabled: true`** in `params`.

2. **Until the orchestrator is rewritten with the full S3 attachment flow** (Cesta 1),
   the current production script may behave unpredictably with respect to web search
   activation — `search_focus: "writing"` may or may not suppress search across all
   six model backends.

3. **`params.version`, `params.dsl_query`, `params.send_back_text_in_streaming_api`,
   and `params.attachments`** are present in live UI requests but absent from the current
   orchestrator body. Their omission may contribute to behavioral differences.

---

## Pre-flight verification (run before every panel)

### Step 1 — Login check

```
GET https://www.perplexity.ai/rest/user/settings
```

Verify:
- HTTP 200
- `plan === "active"` (Pro subscription)
- `agentic_research === 0` — Computer agent must NOT be active (credit-based)

If either check fails, **STOP** and alert Robinson.

### Step 2 — Model catalog check

```
GET https://www.perplexity.ai/rest/models/config?config_schema=v1
```

Verify that all 6 REST `model_preference` identifiers appear in the catalog with
expected providers:

| Identifier | Expected provider |
|---|---|
| `claude46sonnetthinking` | ANTHROPIC |
| `gpt54` | OPENAI |
| `gemini31pro_high` | GOOGLE |
| `nv_nemotron_3_super` | NVIDIA |
| `pplx_alpha` | PERPLEXITY |
| `grok` | XAI |

If any identifier is missing or provider has changed, **STOP** and alert Robinson.
Perplexity may remap backend routing without notice (as happened with `claude2` →
Grok remap discovered 2026-04-24).

---

## SSE response parsing

Endpoint returns a Server-Sent Events stream. Parse as follows:

```javascript
const reader = resp.body.getReader();
const decoder = new TextDecoder();
let buffer = '';
let finalAnswer = null;
let displayModel = null;

outer: while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const obj = JSON.parse(line.slice(6));

    if (obj.display_model) displayModel = obj.display_model;

    if (obj.blocks) {
      for (const block of obj.blocks) {
        if (block.markdown_block?.progress === 'DONE') {
          finalAnswer = block.markdown_block.answer;
        }
      }
    }

    if (obj.final_sse_message === true) break outer;
  }
}
```

---

## Expected timing per panel run

| Reviewer | Expected time |
|---|---|
| `claude46sonnetthinking` | ~2–5 s |
| `gpt54` | ~5–10 s |
| `gemini31pro_high` | ~10–15 s |
| `nv_nemotron_3_super` | ~5–10 s |
| `pplx_alpha` (Sonar DR) | ~35–45 s |
| `grok` | ~2–5 s |

Run the 6 REST calls in parallel (`Promise.all`). Wall-clock time dominated by
`pplx_alpha` (~40 s). Gemini direct (copy-paste) is async and runs separately.

---

## Expected quota consumption per panel run

- 6 REST calls × 1 card = **6 queries** from `query_count_copilot`
- Sonar DR (`pplx_alpha`) is slower but uses the same Pro quota bucket (not credits)
- Gemini direct (copy-paste) = **0 Perplexity quota**
- `agentic_research` must remain 0 throughout

---

## GitHub Issue creation (after panel completes)

For each of the 7 reviews, create a GitHub Issue in `lucierobinson/peppi-basics`:

- **Title:** `[Review] <product>-v<version> — <Reviewer Name>`
- **Body:** Full review text (between `---REVIEW-SUBMISSION-START---` and
  `---REVIEW-SUBMISSION-END---` markers, as specified in the reviewer prompt)
- **Labels:** `review-submission`, `product:<product>`

Claude Code creates REST-path issues automatically. Gemini direct issue is created
manually by Robinson after copy-pasting the response.

---

## Descoped — not in current panel

| Model | Reason |
|---|---|
| `kimik26instant` (Kimi K2.6) | Self-identifies as "Sonar" due to wrapper; review quality unverified. Candidate for future panel expansion. |
| `claude47opus` (Claude Opus 4.7) | Max-only, unavailable on Pro plan. |
| `gemini31pro_low` (Gemini 3.1 Pro) | Redundant with `gemini31pro_high`; removed to avoid duplication. |
| `grok` direct (grok.com) | Removed. REST `grok` already routes to Grok 4.1; browser-based Grok was redundant. |
| `claude2` | ❌ Do NOT use. Routes to Grok 4.1 (`grok41nonreasoning`), not Claude. Config label "Claude Sonnet 4.0" is stale/incorrect. |

---

## Fallback: Comet Skills

If the REST API breaks (403/500 errors, auth expiry, Perplexity endpoint change):

1. Install the 8 Comet skills from `comet/shortcuts-v2/` — see `comet/README.md`
2. Switch to manual `/peppi-panel <slug>` workflow in Comet
3. Continue review sessions manually until REST is restored

See GitHub Issue #1 for the full fallback setup checklist.
