# Peppi Basics Review Panel — Production Spec

**Last verified:** 2026-04-24
**Status:** Ready for first production pilot (croissant)

---

## Panel composition

Seven reviewers, executed for every card version review session.

### REST path (6 reviewers — parallel via `/rest/sse/perplexity_ask`)

| # | `model_preference` | Identify as | Provider |
|---|---|---|---|
| 1 | `claude46sonnet` | Claude Sonnet 4.6 | Anthropic |
| 2 | `gpt54` | GPT-5.4 | OpenAI |
| 3 | `gemini31pro_high` | Gemini 3.1 Pro Thinking (Perplexity) | Google (via Perplexity) |
| 4 | `nv_nemotron_3_super` | Nemotron 3 Super | NVIDIA |
| 5 | `pplx_alpha` | Sonar Deep Research | Perplexity |
| 6 | `grok` | Grok 4.1 | xAI |

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

> **`search_focus: "writing"` is mandatory.** Reviewers must evaluate based on the
> provided card content only — not web search results. Using `"internet"` mode causes
> web search contamination (models find news about AI models and report incorrect
> self-identities).

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
| `claude46sonnet` | ANTHROPIC |
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
| `claude46sonnet` | ~2–5 s |
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
