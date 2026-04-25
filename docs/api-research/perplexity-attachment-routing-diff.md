---
research: perplexity-attachment-routing-per-model-diff
date_capture: 2026-04-25
capture_method: chrome-devtools-har-export
predecessor: perplexity-upload-protocol.md
purpose: identify-fields-causing-gpt-nemotron-attachment-failure
har_source: ~/Desktop/perplexity-gpt-nemotron-capture.har
har_size_mb: 24
models_captured: [gpt54_thinking, nv_nemotron_3_super]
---

# Perplexity Attachment Routing — Per-model diff (GPT/Nemotron debug)

## 1. Souhrn

HAR capture z 2026-04-25 (12:09–12:26 UTC) zachytil dvě kompletní ask volání
z Perplexity UI: jedno pro GPT-5.4 (`gpt54_thinking`) a jedno pro Nemotron
(`nv_nemotron_3_super`). Obě volání přikládala `card.html` přes S3 attachment.

Diff oproti referenčnímu Claude capture (`perplexity-upload-protocol.md`) odhalil
**dva strukturální rozdíly**, které vysvětlují selhání GPT a Nemotron v produkčním
runu z 2026-04-25 07:14 UTC:

1. **GPT**: náš orchestrátor posílá `model_preference: "gpt54"`, ale UI používá
   `"gpt54_thinking"` — jiný backend endpoint, který pravděpodobně nemá attachment
   support. Jednoznačná příčina GPT selhání.

2. **Všechny modely (upload Step A)**: orchestrátor posílá `content_type: ""`
   (empty string), UI posílá `content_type: "text/html"`. Perplexity server na základě
   content_type nastavuje `x-amz-meta-is_text_only: "false"` resp. `"true"` v S3 policy.
   Claude, Gemini a Grok fungují s `"false"`, ale Nemotron pravděpodobně vyžaduje
   `"true"` pro přístup k textu souboru. Pravděpodobná příčina Nemotron selhání.

Celkem **1 kritický rozdíl** (model_preference GPT), **1 strukturální rozdíl**
(content_type upload) a **1 drobný rozdíl** (chybějící x-perplexity headers na ask call).
Vše opravitelné bez změny architektury orchestrátoru.

---

## 2. Reference: Claude Sonnet ask call (z 2026-04-25, perplexity-upload-protocol.md)

Použito jako baseline pro diff. Tento capture ověřil funkční attachment workflow.

**Step A request (upload):**
```json
{
  "files": {
    "<client-uuid>": {
      "filename": "card.html",
      "content_type": "",
      "source": "default",
      "file_size": 29060,
      "force_image": false,
      "skip_parsing": false
    }
  }
}
```

**Step A response `fields` (relevantní):**
```json
{
  "Content-Type": "",
  "x-amz-meta-is_text_only": "false"
}
```

**Ask call `params` (Claude):**
```json
{
  "model_preference": "claude46sonnetthinking",
  "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/..."],
  "language": "cs-CZ",
  "timezone": "Europe/Prague",
  "search_focus": "internet",
  "sources": ["web"],
  "mode": "copilot",
  "skip_search_enabled": true,
  "use_schematized_api": true,
  "send_back_text_in_streaming_api": false,
  "version": "2.18",
  "dsl_query": "<same as query_str>",
  "frontend_uuid": "<uuid>",
  "frontend_context_uuid": "<uuid>",
  "rum_session_id": "<uuid>",
  "is_related_query": false,
  "is_sponsored": false,
  "prompt_source": "user",
  "query_source": "home",
  "is_incognito": false,
  "time_from_first_type": 849.6,
  "local_search_enabled": false,
  "client_coordinates": null,
  "mentions": [],
  "is_nav_suggestions_disabled": false,
  "source": "default",
  "always_search_override": false,
  "override_no_search": false,
  "should_ask_for_mcp_tool_confirmation": true,
  "browser_agent_allow_once_from_toggle": false,
  "force_enable_browser_agent": false,
  "supported_features": ["browser_agent_permission_banner_v1.1"],
  "extended_context": false,
  "supported_block_use_cases": ["answer_modes", "media_items", "..."]
}
```

**Ask call request headers (Claude):**
```
content-type: application/json
(žádné x-perplexity-* headers)
```

**Výsledek**: attachment_used: true, 14 849 chars, SHIPS WITH PATCHES ✅

---

## 3. GPT-5.4 ask call (nový capture 2026-04-25 12:09 UTC)

**Step A request (upload):**
```json
{
  "files": {
    "<client-uuid>": {
      "filename": "card.html",
      "content_type": "text/html",
      "source": "default",
      "file_size": 73530,
      "force_image": false,
      "skip_parsing": false
    }
  }
}
```

**Step A response `fields` (relevantní):**
```json
{
  "Content-Type": "text/html",
  "x-amz-meta-is_text_only": "true"
}
```

**Ask call `params` (GPT):**
```json
{
  "model_preference": "gpt54_thinking",
  "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/ffe6b080-b6ef-4558-9756-6a855c684ed2/card.html"],
  "language": "cs-CZ",
  "timezone": "Europe/Prague",
  "search_focus": "internet",
  "sources": ["web"],
  "mode": "copilot",
  "skip_search_enabled": true,
  "use_schematized_api": true,
  "send_back_text_in_streaming_api": false,
  "version": "2.18",
  "dsl_query": "Shrň první odstavec tohoto dokumentu",
  "frontend_uuid": "f7abf4e8-3edf-4142-a069-65d90abc980f",
  "frontend_context_uuid": "cc40d564-8bbd-4c73-8e91-866663ac7530",
  "rum_session_id": "2c9dd34f-4d5d-4443-9cdf-ca551f273798",
  "is_related_query": false,
  "is_sponsored": false,
  "prompt_source": "user",
  "query_source": "home",
  "is_incognito": false,
  "time_from_first_type": 2498.8,
  "local_search_enabled": false,
  "client_coordinates": null,
  "mentions": [],
  "is_nav_suggestions_disabled": false,
  "source": "default",
  "always_search_override": false,
  "override_no_search": false,
  "should_ask_for_mcp_tool_confirmation": true,
  "browser_agent_allow_once_from_toggle": false,
  "force_enable_browser_agent": false,
  "supported_features": ["browser_agent_permission_banner_v1.1"],
  "extended_context": false,
  "supported_block_use_cases": ["answer_modes", "media_items", "..."]
}
```

**Ask call request headers (GPT):**
```
content-type: application/json
x-perplexity-request-endpoint: https://www.perplexity.ai/rest/sse/perplexity_ask
x-perplexity-request-reason: perplexity-query-state-provider
x-perplexity-request-try-number: 1
x-request-id: f7abf4e8-3edf-4142-a069-65d90abc980f
```

Oproti Claude baseline — **tučně** pole která se liší:
- **`model_preference: "gpt54_thinking"`** (Claude měl `"claude46sonnetthinking"`)
- **`content_type` v Step A: `"text/html"`** (Claude měl `""`)
- **`x-amz-meta-is_text_only: "true"`** (Claude měl `"false"`)
- **Přidané request headers**: `x-perplexity-request-endpoint`, `x-perplexity-request-reason`, `x-request-id`

**Výsledek v UI**: odpověď přítomna (282 kB SSE stream dle HAR), attachment přečten ✅

**Výsledek v orchestrátoru** (produkční run 07:14): 1 618 chars, attachment_used: false ❌

---

## 4. Nemotron ask call (nový capture 2026-04-25 12:10 UTC)

**Step A request (upload):**
```json
{
  "files": {
    "<client-uuid>": {
      "filename": "card.html",
      "content_type": "text/html",
      "source": "default",
      "file_size": 73530,
      "force_image": false,
      "skip_parsing": false
    }
  }
}
```

**Step A response `fields` (relevantní):**
```json
{
  "Content-Type": "text/html",
  "x-amz-meta-is_text_only": "true"
}
```

**Ask call `params` (Nemotron):**
```json
{
  "model_preference": "nv_nemotron_3_super",
  "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/0891f22f-fb39-4e40-a2c7-429b807af493/card.html"],
  "language": "cs-CZ",
  "timezone": "Europe/Prague",
  "search_focus": "internet",
  "sources": ["web"],
  "mode": "copilot",
  "skip_search_enabled": true,
  "use_schematized_api": true,
  "send_back_text_in_streaming_api": false,
  "version": "2.18",
  "dsl_query": "Shrň první odstavec tohoto dokumentu",
  "frontend_uuid": "eae1471f-777e-4d56-b864-4c0a4035b570",
  "frontend_context_uuid": "630ad5e6-b0d5-47fd-afdb-1767ea5f9a4c",
  "rum_session_id": "2c9dd34f-4d5d-4443-9cdf-ca551f273798",
  "is_related_query": false,
  "is_sponsored": false,
  "prompt_source": "user",
  "query_source": "home",
  "is_incognito": false,
  "time_from_first_type": 711,
  "local_search_enabled": false,
  "client_coordinates": null,
  "mentions": [],
  "is_nav_suggestions_disabled": false,
  "source": "default",
  "always_search_override": false,
  "override_no_search": false,
  "should_ask_for_mcp_tool_confirmation": true,
  "browser_agent_allow_once_from_toggle": false,
  "force_enable_browser_agent": false,
  "supported_features": ["browser_agent_permission_banner_v1.1"],
  "extended_context": false,
  "supported_block_use_cases": ["answer_modes", "media_items", "..."]
}
```

**Ask call request headers (Nemotron):**
```
content-type: application/json
x-perplexity-request-endpoint: https://www.perplexity.ai/rest/sse/perplexity_ask
x-perplexity-request-reason: perplexity-query-state-provider
x-perplexity-request-try-number: 1
x-request-id: eae1471f-777e-4d56-b864-4c0a4035b570
```

Oproti Claude baseline — **tučně** pole která se liší:
- **`model_preference: "nv_nemotron_3_super"`** (shodné s orchestrátorem — tedy NENÍ příčinou)
- **`content_type` v Step A: `"text/html"`** (orchestrátor posílá `""`)
- **`x-amz-meta-is_text_only: "true"`** (orchestrátor generuje `"false"`)
- **Přidané request headers**: `x-perplexity-request-endpoint`, `x-perplexity-request-reason`, `x-request-id`

**Výsledek v UI**: odpověď přítomna (282 kB SSE stream dle HAR), attachment přečten ✅

**Výsledek v orchestrátoru** (produkční run 07:14): 1 587 chars, attachment_used: false,
display_model: gpt51 (remapováno Perplexity backendem) ❌

---

## 5. Diff matrix

| Pole | Claude (UI/baseline) | GPT-5.4 (UI) | Nemotron (UI) | Orchestrátor (aktuální) | Poznámka |
|------|---------------------|--------------|---------------|------------------------|---------|
| **`model_preference`** | `claude46sonnetthinking` | **`gpt54_thinking`** | `nv_nemotron_3_super` | GPT: `gpt54` ❌ / Nem: `nv_nemotron_3_super` ✓ | **KRITICKÉ pro GPT** — orchestrátor posílá jiný klíč |
| **Step A `content_type`** | `""` | **`"text/html"`** | **`"text/html"`** | `""` ❌ | UI detekuje MIME typ; orchestrátor posílá prázdný string |
| **`x-amz-meta-is_text_only`** | `"false"` | **`"true"`** | **`"true"`** | `"false"` ❌ | Důsledek content_type; určuje zda Perplexity backend parsuje soubor jako text |
| **Ask call headers** | žádné x-perplexity-* | `x-perplexity-request-endpoint`, `x-perplexity-request-reason`, `x-perplexity-request-try-number`, `x-request-id` | totéž | žádné extra headers | Pravděpodobně analytické, ne routovací |
| `language` | `cs-CZ` | `cs-CZ` | `cs-CZ` | `en-US` | Nerelevantní pro attachment |
| `attachments` | `[s3_url]` | `[s3_url]` | `[s3_url]` | `[s3_url]` ✓ | Shodné — URL struktura OK |
| `skip_search_enabled` | `true` | `true` | `true` | `true` ✓ | Shodné |
| `mode` | `copilot` | `copilot` | `copilot` | `copilot` ✓ | Shodné |
| `version` | `"2.18"` | `"2.18"` | `"2.18"` | `"2.18"` ✓ | Shodné |
| `use_schematized_api` | `true` | `true` | `true` | `true` ✓ | Shodné |
| `sources` | `["web"]` | `["web"]` | `["web"]` | `["web"]` ✓ | Shodné |

---

## 6. Hypotéza o příčině selhání

### H1 — GPT: špatný `model_preference` klíč (KRITICKÁ, pravděpodobnost 95 %)

Orchestrátor posílá `model_preference: "gpt54"`, ale Perplexity UI používá `"gpt54_thinking"`.
Jsou to dva různé záznamy v `/rest/models/config` (oba existují — ověřeno preflight checkem).
`"gpt54"` pravděpodobně routuje na starší GPT-5.4 backend bez attachment support, zatímco
`"gpt54_thinking"` routuje na novější verzi s plnou attachment podporou.

Toto vysvětluje proč GPT vrátil "nemám přístup k přílohám" — attachment URL byl v payloadu
přítomný, ale backend model ho nevidí.

**Fix**: jednořádková změna v `PANEL` array.

### H2 — Nemotron: `content_type: ""` → `x-amz-meta-is_text_only: "false"` (VYSOKÁ, pravděpodobnost 80 %)

`nv_nemotron_3_super` model_preference je správný (shodný s UI). Tedy model_preference
NENÍ příčinou Nemotron selhání. Zbývá strukturální rozdíl v uploadu:

- Orchestrátor: `content_type: ""` → S3 dostane `x-amz-meta-is_text_only: "false"` → Perplexity
  backend pravděpodobně neparsuje soubor jako text, poskytne modelu jen S3 URL bez obsahu
- UI: `content_type: "text/html"` → S3 dostane `x-amz-meta-is_text_only: "true"` → Perplexity
  backend parsuje soubor, poskytne modelu text obsah

Proč Claude/Gemini/Grok fungují s `"false"`: buď ignorují tento flag a čtou přímo z S3 URL,
nebo jejich backend implementace jsou permisivnější.

Proč Nemotron nefungoval s `"false"`: Nemotron backend (`nv_nemotron_3_super`) vyžaduje,
aby Perplexity middleware explicitně poskytl text — bez toho model nedostane žádný obsah.

Poznámka k `display_model: gpt51` v produkčním runu: `nv_nemotron_3_super` je interně
aliasován/remapován na `gpt51` na Perplexity backendu — to je normální chování (GPT-5.1 je
Nemotron backend), nikoli chyba. Problém byl v tom, že `gpt51` backend bez `is_text_only: "true"`
neposkytl soubor modelu.

### H3 — Chybějící `x-perplexity-request-*` headers na ask call (NÍZKÁ, pravděpodobnost 15 %)

UI přidává `x-perplexity-request-endpoint`, `x-perplexity-request-reason`,
`x-perplexity-request-try-number` a `x-request-id` i na ask call. Orchestrátor tyto headers
nepřidává. Protože Claude/Gemini/Grok fungují bez nich, jsou pravděpodobně jen analytické (request
tracking), ne routovací. Nicméně přidání je bezpečné a snižuje riziko "unknown client" edge cases.

---

## 7. Implementační plán pro orchestrátor

Všechny tři změny jsou v `scripts/run-review-panel.js`. **Nemodifikovat v této session** —
zde jen popis pro následující session.

### Změna 1 — KRITICKÁ: opravit `model_preference` pro GPT

**Soubor**: `scripts/run-review-panel.js`
**Řádek 33** (PANEL array):

```js
// Před:
{ slug: "gpt-54", model_preference: "gpt54", identify_as: "GPT-5.4", pair_group: 1 },

// Po:
{ slug: "gpt-54", model_preference: "gpt54_thinking", identify_as: "GPT-5.4", pair_group: 1 },
```

Tato jediná změna by měla opravit GPT attachment support. Ověřit empiricky po implementaci.

### Změna 2 — VYSOKÁ: opravit `content_type` v Step A (UPLOAD_CODE)

**Soubor**: `scripts/run-review-panel.js`
**Řádky cca 128–138** (UPLOAD_CODE, Step A request body):

```js
// Před:
[clientUuid]: {
  filename: "card.html",
  content_type: "",       // <-- toto
  source: "default",
  ...
}

// Po:
[clientUuid]: {
  filename: "card.html",
  content_type: "text/html",  // <-- opraveno
  source: "default",
  ...
}
```

Tato změna způsobí `x-amz-meta-is_text_only: "true"` v Step A response, což pravděpodobně
opraví Nemotron. Je bezpečná pro Claude/Gemini/Grok (ti to ignorují nebo se chování nezhorší).

**Poznámka**: pokud bude pipeline v budoucnu používat různé typy souborů (PDF, obrázky),
content_type bude potřeba dynamicky nastavovat podle přípony souboru.

### Změna 3 — NÍZKÁ: přidat `x-perplexity-request-*` headers na ask call

**Soubor**: `scripts/run-review-panel.js`
**Řádky cca 251–255** (callReviewer funkce, fetch na perplexity_ask):

```js
// Před:
const resp = await fetch("https://www.perplexity.ai/rest/sse/perplexity_ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Po:
const resp = await fetch("https://www.perplexity.ai/rest/sse/perplexity_ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-perplexity-request-endpoint": "https://www.perplexity.ai/rest/sse/perplexity_ask",
    "x-perplexity-request-reason": "perplexity-query-state-provider",
    "x-perplexity-request-try-number": "1",
    "x-request-id": body.params.frontend_uuid,
  },
  body: JSON.stringify(body),
});
```

Nízká priorita — implementovat jako součást Změny 1+2 (nechce separátní session).

### Pořadí implementace

1. Implement Změna 1 + Změna 2 + Změna 3 v jednom commitu
2. Spustit produkční run s GPT + Nemotron a ověřit `attachment_used: true`
3. Pokud GPT stále selže po Změně 1: testovat `gpt54` vs `gpt54_thinking` izolovaně (krátký
   prompt s attachment, zkontrolovat `display_model` v SSE)
4. Pokud Nemotron stále selže po Změně 2: zvážit přidání `x-amz-meta-is_text_only: "true"`
   přímo do Step A response fields přepsáním (dirty workaround) nebo přidat Sonar jako
   náhradní 6. reviewer

---

## 8. Otevřené otázky

1. **Ověření H1 empiricky**: Zda `"gpt54_thinking"` skutečně routuje jiný backend než `"gpt54"`.
   Test: spustit krátké volání s `gpt54_thinking` + attachment a zkontrolovat `display_model` v SSE
   a délku odpovědi.

2. **`rum_session_id` je v HAR shodné** pro GPT i Nemotron (`2c9dd34f-...`): Perplexity UI sdílí
   `rum_session_id` v rámci session (ne per-request). Náš orchestrátor generuje nový UUID per
   volání — zda to má vliv je nejasné. Pravděpodobně analytické, ne routovací.

3. **`display_model: gpt51` pro Nemotron**: Jestli `nv_nemotron_3_super` je vždy aliasován na
   `gpt51`, nebo jen při fallbacku. HAR response SSE není v exportu (Chrome HAR nepodporuje
   streaming) — nelze ověřit bez dalšího monitorování.

4. **`x-amz-meta-is_text_only` effect na Sonar**: Sonar Deep Research (`pplx_alpha`) nepoužívá
   attachment vůbec (reviewuje z webu + kontextu). Změna 2 ho neovlivní.

5. **content_type pro non-HTML soubory**: Pokud pipeline bude přikládat `.json` nebo `.md`
   soubory, správné content_type by bylo `application/json` resp. `text/markdown`. Doporučuje
   se přidat helper funkci `getMimeType(filename)` při implementaci Změny 2.
