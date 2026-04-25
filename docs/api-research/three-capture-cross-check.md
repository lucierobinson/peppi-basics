---
research: three-capture-cross-check
date: 2026-04-25
purpose: resolve-discrepancies-before-orchestrator-fix
captures_compared:
  - claude-sonnet-original-2026-04-25  # butter_audit_report.md, 29060 B
  - claude-sonnet-fourth-2026-04-25    # card.html, 73530 B — tento dokument
  - gpt54-thinking-2026-04-25          # card.html, 73530 B
  - nemotron-2026-04-25                # card.html, 73530 B
note: "Čtvrtý capture (Claude + card.html) přidán v téže session, protože Step E headers chyběly v původním Claude protocol doc."
---

# Cross-check tří captures — verifikace před implementací

## 1. Field-by-field srovnání

| Field / Header | Step | Claude (původní, .md) | Claude (čtvrtý, .html) | GPT-5.4 (.html) | Nemotron (.html) | Konzistentní? |
|---|---|---|---|---|---|---|
| `content_type` (req) | A | `""` | `"text/html"` | `"text/html"` | `"text/html"` | **NE** — závisí na souboru, ne na modelu |
| `Content-Type` (resp fields) | A | `""` | `"text/html"` | `"text/html"` | `"text/html"` | **NE** — závisí na souboru |
| `x-amz-meta-is_text_only` (resp fields) | A | `"false"` | `"true"` | `"true"` | `"true"` | **NE** — důsledek content_type |
| `x-app-apiclient` | A headers | `"default"` | `"default"` | `"default"` | `"default"` | ✅ ANO |
| `x-app-apiversion` | A headers | `"2.18"` | `"2.18"` | `"2.18"` | `"2.18"` | ✅ ANO |
| `x-perplexity-request-reason` | A headers | `"ask-input-inner-home"` | `"ask-input-inner-home"` | `"ask-input-inner-home"` | `"ask-input-inner-home"` | ✅ ANO |
| `x-perplexity-request-endpoint` | E headers | `[chybí v doc]` | `"…/perplexity_ask"` | `"…/perplexity_ask"` | `"…/perplexity_ask"` | ✅ ANO (UI vždy posílá) |
| `x-perplexity-request-reason` | E headers | `[chybí v doc]` | `"perplexity-query-state-provider"` | `"perplexity-query-state-provider"` | `"perplexity-query-state-provider"` | ✅ ANO |
| `x-perplexity-request-try-number` | E headers | `[chybí v doc]` | `"1"` | `"1"` | `"1"` | ✅ ANO |
| `x-request-id` | E headers | `[chybí v doc]` | `<frontend_uuid>` | `<frontend_uuid>` | `<frontend_uuid>` | ✅ ANO (= `params.frontend_uuid`) |
| `model_preference` | E body | `"claude46sonnetthinking"` | `"claude46sonnetthinking"` | `"gpt54_thinking"` | `"nv_nemotron_3_super"` | N/A — per-model by definition |
| `attachments` | E body | `[S3_URL]` | `[S3_URL]` | `[S3_URL]` | `[S3_URL]` | ✅ ANO |
| `skip_search_enabled` | E body | `true` | `true` | `true` | `true` | ✅ ANO |
| `mode` | E body | `"copilot"` | `"copilot"` | `"copilot"` | `"copilot"` | ✅ ANO |
| `version` | E body | `"2.18"` | `"2.18"` | `"2.18"` | `"2.18"` | ✅ ANO |
| `use_schematized_api` | E body | `true` | `true` | `true` | `true` | ✅ ANO |

---

## 2. Závěr per field

### `content_type` v Step A request — **C) DOKUMENTAČNÍ CHYBA**

Původní protocol doc dokumentoval `content_type: ""` s komentářem *„Perplexity detects type
server-side"*. Toto bylo **chybné zobecnění** — hodnota `""` vznikla proto, že původní capture
použil soubor `butter_audit_report.md`, u nějž Perplexity UI nenastavuje MIME typ. Pro `card.html`
UI posílá `"text/html"`.

Správné pravidlo: **UI odesílá MIME typ odpovídající příponě souboru**. Pro `.html` → `"text/html"`,
pro `.md` → `""` (nebo `"text/markdown"`, ale UI posílá prázdný string). Orchestrátor musí
posílat `"text/html"` pro `card.html`.

Klasifikace: **A) UNIFORMNÍ** pro daný typ souboru — všechny tři modely (Claude/GPT/Nemotron)
dostaly stejný `content_type: "text/html"` při uploadování `.html` souboru. Není to per-model.

### `x-amz-meta-is_text_only` v Step A response — **A) UNIFORMNÍ (odvozeno)**

Hodnota je plně deterministicky odvozena ze `content_type` requestu:
- `content_type: ""` → `x-amz-meta-is_text_only: "false"`
- `content_type: "text/html"` → `x-amz-meta-is_text_only: "true"`

Orchestrátor toto pole nekontroluje a neposílá — přebírá z Step A response a předá do Step B
form fields. Pokud orchestrátor opraví `content_type: ""` na `"text/html"`, `is_text_only`
se automaticky stane `"true"`. Žádná separátní orchestrátorová změna není nutná.

Klasifikace: **A) UNIFORMNÍ** — závisí na `content_type`, nikoli na modelu.

### `x-perplexity-request-*` headers v Step E ask call — **C) DOKUMENTAČNÍ CHYBA**

Původní Claude protocol doc dokumentoval Step E pouze jako params JSON body, bez request headers.
Čtvrtý capture ukázal, že Claude ask call **také posílá** stejné `x-perplexity-request-*` headers
jako GPT a Nemotron. Jsou tedy uniformní UI chování, ne per-model rozdíl.

Hodnoty jsou shodné pro všechny tři modely:
- `x-perplexity-request-endpoint: https://www.perplexity.ai/rest/sse/perplexity_ask`
- `x-perplexity-request-reason: perplexity-query-state-provider`
- `x-perplexity-request-try-number: 1`
- `x-request-id: <frontend_uuid>` (= totéž UUID co `params.frontend_uuid`)

Klasifikace: **A) UNIFORMNÍ** — přidat do orchestrátoru pro všechny modely.

### `model_preference` pro GPT — **C) DOKUMENTAČNÍ CHYBA v production-panel-spec.md**

Orchestrátor používá `"gpt54"`, UI používá `"gpt54_thinking"`. Robinson potvrdil, že v Perplexity
UI zapnul Thinking mode ručně — `"gpt54_thinking"` je tedy model preference pro GPT-5.4
s aktivním Thinking mode.

`"gpt54"` (bez thinking) a `"gpt54_thinking"` (s thinking) jsou dva různé záznamy v
`/rest/models/config`. `"gpt54"` pravděpodobně routuje na backend bez attachment support.
`"gpt54_thinking"` má attachment support (potvrzeno capture).

Klasifikace: **C) DOKUMENTAČNÍ CHYBA v production-panel-spec.md** — spec nikdy neověřil
zda `"gpt54"` funguje s přílohami. Opravit na `"gpt54_thinking"`.

---

## 3. Doporučené opravy v dokumentaci

### `perplexity-upload-protocol.md` — 3 opravy

**Oprava 3.1 — Step A request body, řádek ~44:**
```
// Před (chybné):
"content_type": "",
// Komentář: empty string "" — Perplexity detects type server-side

// Po (správné):
"content_type": "text/html",
// Komentář: MIME type podle přípony souboru; "" jen pro .md soubory kde UI MIME typ nenastavuje
```

**Oprava 3.2 — Step A response fields, řádek ~67:**
```
// Před (chybné):
"x-amz-meta-is_text_only": "false",

// Po (správné):
"x-amz-meta-is_text_only": "true",
// Komentář: "true" když content_type = "text/html"; "false" pouze při content_type = ""
```

**Oprava 3.3 — Step B form fields list, řádek ~100:**
```
// Před:
2. `Content-Type` = `""` (from Step A `fields["Content-Type"]`)
4. `x-amz-meta-is_text_only` = `"false"` (from Step A `fields["x-amz-meta-is_text_only"]`)

// Po:
2. `Content-Type` = `"text/html"` (from Step A `fields["Content-Type"]`)
4. `x-amz-meta-is_text_only` = `"true"` (from Step A `fields["x-amz-meta-is_text_only"]`)
// Komentář: orchestrátor kopíruje hodnoty jak přijdou — pokud Step A request posílá správný MIME typ,
// Step B form fields budou automaticky správné.
```

**Oprava 3.4 — přidat do Step E sekci Request headers:**

Přidat nový blok za params JSON body v sekci „Step E":

```
**Request headers (Step E ask call):**
- `content-type: application/json`
- `x-perplexity-request-endpoint: https://www.perplexity.ai/rest/sse/perplexity_ask`
- `x-perplexity-request-reason: perplexity-query-state-provider`
- `x-perplexity-request-try-number: 1`
- `x-request-id: <frontend_uuid>` (= totéž UUID co params.frontend_uuid)

Potvrzeno pro Claude, GPT-5.4, Nemotron — uniformní UI chování.
Původní protocol doc tato headers nezdokumentoval.
```

**Oprava 3.5 — Otevřené otázky, řádek ~249:**
```
// Před:
- **`content_type: ""`:** Perplexity posílá prázdný string i pro `.md` soubor. Pro `.html`
  by možná bylo správnější `text/html` — testovat zda server přijme nebo odmítne.

// Smazat — otázka zodpovězena čtvrtým capture: text/html je správná hodnota pro .html soubory.
```

### `perplexity-attachment-routing-diff.md` — 1 oprava

**Oprava 3.6 — Sekce 6, Hypotéza H3, řádek ~233:**
```
// Před:
### H3 — Chybějící `x-perplexity-request-*` headers na ask call (NÍZKÁ, pravděpodobnost 15 %)

// Po:
### H3 — ~~Chybějící `x-perplexity-request-*` headers na ask call~~  VYŘAZENO

// Důvod: čtvrtý capture (Claude, 2026-04-25) potvrdil, že Claude ask call posílá
// stejné x-perplexity-request-* headers jako GPT a Nemotron. Jde o uniformní UI chování,
// ne per-model rozdíl. Absence těchto headers v orchestrátoru platí pro VŠECHNY modely
// stejně — tedy nemůže vysvětlovat selhání specificky u GPT/Nemotron.
// Stále doporučeno přidat do orchestrátoru (viz sekce 7, Změna 3).
```

---

## 4. Doporučené změny v orchestrátoru (`scripts/run-review-panel.js`)

Všechny změny jsou uniformní (platí pro všechny modely). **Neimplementovat v této session.**

### Změna O1 — KRITICKÁ: `content_type` v UPLOAD_CODE (řádek cca 133)

```js
// Před:
content_type: "",

// Po:
content_type: "text/html",
```

Tato jediná změna způsobí `x-amz-meta-is_text_only: "true"` v Step A response, což opraví
Nemotron attachment access. Bezpečná pro Claude/Gemini/Grok.

### Změna O2 — KRITICKÁ: `model_preference` pro GPT v PANEL array (řádek 33)

```js
// Před:
{ slug: "gpt-54", model_preference: "gpt54", ... },

// Po:
{ slug: "gpt-54", model_preference: "gpt54_thinking", ... },
```

### Změna O3 — NÍZKÁ: přidat `x-perplexity-request-*` headers v `callReviewer` (řádky cca 251–255)

```js
// Před:
headers: { "Content-Type": "application/json" },

// Po:
headers: {
  "Content-Type": "application/json",
  "x-perplexity-request-endpoint": "https://www.perplexity.ai/rest/sse/perplexity_ask",
  "x-perplexity-request-reason": "perplexity-query-state-provider",
  "x-perplexity-request-try-number": "1",
  "x-request-id": body.params.frontend_uuid,
},
```

### Priorita

1. **O2** (model_preference GPT) — jednoznačná příčina GPT selhání, 1 řádek
2. **O1** (content_type) — pravděpodobná příčina Nemotron selhání, 1 řádek
3. **O3** (request headers) — uniformizace s UI chováním, nízká priorita ale triviální

Doporučeno: O1 + O2 + O3 v jednom commitu, pak produkční test.

---

## 5. Otevřené otázky

Všechna původní D) (nerozhodnutelná) pole byla vyřešena čtvrtým capture. Zbývá jediná otázka:

**OQ1 — Ověření po implementaci**

Zda `"gpt54_thinking"` + `content_type: "text/html"` skutečně opraví GPT i Nemotron.
Vyřeší se empiricky po implementaci Změn O1+O2+O3 a spuštění produkčního runu.
Předpokládaný výsledek: GPT i Nemotron vrátí `attachment_used: true` a plnou recenzi.

**OQ2 — `rum_session_id` sdílené v rámci session**

V GPT/Nemotron HAR byl `rum_session_id` shodný pro oba modely (`2c9dd34f-...`). Čtvrtý Claude
capture má jiné UUID. Perplexity UI pravděpodobně sdílí `rum_session_id` v rámci browser session
(ne per-request). Náš orchestrátor generuje nové UUID per call — pravděpodobně analytická hodnota,
neovlivňuje routování. Nízké riziko, nevyžaduje akci.

**OQ3 — `content_type` pro jiné typy souborů**

Pokud pipeline přikládá `.json` nebo `.md` soubory, bude potřeba helper:
```js
function getMimeType(filename) {
  if (filename.endsWith('.html')) return 'text/html';
  if (filename.endsWith('.json')) return 'application/json';
  if (filename.endsWith('.md'))   return '';  // UI sends empty string for .md
  return '';
}
```
Aktivuje se jen pokud pipeline začne přikládat jiné typy souborů než card.html.
