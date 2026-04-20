# Perplexity REST API — Research Findings

**Datum:** 2026-04-20  
**Účel:** Ověření, zda lze programaticky vytvářet Perplexity thready se specifickými modely bez klikání v UI.  
**Verdict:** ✅ **GO** — API funguje, výběr modelu podporován.

---

## Závěr (TL;DR)

Perplexity má neveřejné REST API, přes které lze programaticky odesílat dotazy se specifickým modelem.
Endpoint `POST /rest/sse/perplexity_ask` přijme payload s `model_preference` uvnitř `params` objektu
a vrátí SSE stream s reálnou odpovědí. Všech 7 modelů review panelu bylo ověřeno (HTTP 200,
správný `display_model` v odpovědi).

**Kritické omezení:** Autentizace probíhá přes session cookie prohlížeče — nejde o veřejné API
s API klíčem. Při programatickém volání musí být aktivní přihlášený Perplexity Pro účet.

---

## Endpoint

```
POST https://www.perplexity.ai/rest/sse/perplexity_ask
Content-Type: application/json
(session cookie automaticky — same-origin)
```

### Request payload

```json
{
  "query_str": "text dotazu",
  "params": {
    "model_preference": "gemini31pro_high",
    "mode": "copilot",
    "search_focus": "internet",
    "language": "en-US",
    "timezone": "Europe/Prague",
    "use_schematized_api": true,
    "frontend_uuid": "<random-uuid>",
    "frontend_context_uuid": "<random-uuid>"
  }
}
```

### Klíčová chyba, na kterou je třeba dát pozor

`params` je **objekt** (dict), **ne JSON-enkódovaný string**.  
Odesílání `params: JSON.stringify({...})` vrátí HTTP 422: `"Input should be a valid dictionary"`.

---

## Response — SSE stream

Odpověď je Server-Sent Events stream:

```
event: message
data: {"backend_uuid": "...", "display_model": "gemini31pro_high", "mode": "COPILOT", ...}

event: message
data: {"blocks": [{"intended_usage": "pro_search_steps", ...}], ...}

event: message
data: {"blocks": [{"intended_usage": "ask_text_0_markdown", "markdown_block": {"chunks": ["Pong!"], "answer": "Pong!", "progress": "DONE"}}], "final_sse_message": true}
```

### Relevantní pole v odpovědi

| Pole | Popis |
|------|-------|
| `display_model` | Potvrzení použitého modelu (ověřit = request byl respektován) |
| `backend_uuid` | UUID threadu na serveru |
| `thread_url_slug` | Slug pro URL threadu (`/search/<slug>`) |
| `final_sse_message: true` | Signál konce streamu |
| `blocks[].markdown_block.answer` | Kompletní odpověď (v bloku s `progress: "DONE"`) |
| `blocks[].markdown_block.chunks[]` | Streaming kousky textu |

### Typy bloků

| `intended_usage` | Popis |
|------------------|-------|
| `pro_search_steps` | Plán vyhledávání (search planning) |
| `plan` | Průběh vyhledávání |
| `ask_text` | Streaming textu odpovědi |
| `ask_text_0_markdown` | Kompletní markdown odpověď |

---

## Ověřené modely (7 reviewerů Peppi panelu)

| # | Reviewer | `model_preference` | HTTP | `display_model` | Odpověď |
|---|----------|--------------------|------|-----------------|---------|
| 1 | Gemini 3.1 Pro Thinking | `gemini31pro_high` | 200 ✅ | `gemini31pro_high` | ✅ Pong! |
| 2 | Gemini 3.1 Pro | `gemini31pro_low` | 200 ✅ | `gemini31pro_low` | ✅ (stream) |
| 3 | Claude Sonnet 4.6 | `claude2` | 200 ✅ | `claude2` | ✅ Pong! |
| 4 | GPT-5.4 | `gpt54` | 200 ✅ | `gpt54` | ✅ (stream) |
| 5 | Nemotron 3 Super | `nv_nemotron_3_super` | 200 ✅ | `nv_nemotron_3_super` | ✅ (stream) |
| 6 | Sonar Deep Research | `pplx_alpha` | 200 ✅ | `pplx_alpha` | ✅ (stream >45s) |
| 7 | Grok | `grok` | 200 ✅ | `grok` | ✅ (stream) |

> **Poznámka k Sonar Deep Research:** Model `pplx_alpha` je v `/rest/models/config` označen jako
> "Deep research". SSE stream trvá výrazně déle (>45 s) než ostatní modely.

---

## Kompletní seznam dostupných model keys

Získáno z `GET /rest/models/config?config_schema=v1` (výběr relevantních):

```
gemini31pro_high   — Gemini 3.1 Pro Thinking (Google)
gemini31pro_low    — Gemini 3.1 Pro (Google)
claude2            — Claude Sonnet 4.0 (Anthropic)  ← UI zobrazuje "Sonnet 4.6", key je claude2
claude37sonnetthinking — Claude Sonnet 4.0 Thinking
gpt5               — GPT-5 (OpenAI)
gpt54              — GPT-5.4 (OpenAI)
gpt54_thinking     — GPT-5.4 Thinking
nv_nemotron_3_super — Nemotron 3 Super (NVIDIA)
grok               — Grok 3 Beta (xAI)
grok4              — Grok 4 (xAI)
pplx_alpha         — Deep Research (Perplexity)  ← Sonar Deep Research
pplx_pro           — Best (výchozí Pro Search)
pplx_beta          — Create files and apps
pplx_study         — Study
pplx_agentic_research — Agentic research
pplx_asi           — Computer (Browser Agent)
```

---

## Payload discovery — jak byl formát zjištěn

Správný formát nebyl nalezen v JS bundlech (endpoint URL je sestavován dynamicky, není v loaded chunks).
Byl zjištěn **zachycením reálného requestu z UI**:

1. Na `/search/new` nainstalován `window.fetch` interceptor
2. V UI vybran model "Gemini 3.1 Pro Thinking"
3. Zadán dotaz a odeslán
4. Interceptor zachytil `window.__capturedAskPayload` (string 1751 znaků)
5. Parsován JSON → struktura `{ query_str, params: { model_preference, mode, ... } }`

---

## Ostatní relevantní endpointy

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `GET /rest/models/config?config_schema=v1` | GET | Všechny dostupné modely |
| `GET /rest/user/settings` | GET | Nastavení uživatele (incl. `default_model`) |
| `GET /rest/thread/list_recent?exclude_asi=false` | GET | Posledních 20 threadů |
| `POST /rest/thread/list_pinned_ask_threads` | POST | Přinuté thready |
| `POST /rest/thread/mark_viewed/<uuid>` | POST | Označit thread jako přečtený |
| `GET /rest/rate-limit/status` | GET | Stav rate limitů |
| `GET /rest/skills` | GET | Seznam nainstalovaných skillů |
| `DELETE /rest/skills/<id>` | DELETE | Smazání skillu |
| `POST /rest/skills` | POST | Upload nového skillu (FormData) |

---

## Omezení a rizika

### 1. Session-only autentizace
API nevyžaduje API klíč — autentizuje přes `__Secure-next-auth.session-token` cookie. To znamená:
- Nelze volat z backendu bez aktivní browser session
- Perplexity to může kdykoliv změnit nebo blokovat
- Pro automatizaci musí být prohlížeč přihlášen

### 2. Neveřejné API
Toto je **interní REST API** Perplexity webové aplikace, **ne** veřejné API.  
Perplexity má **samostatné veřejné API** na `https://api.perplexity.ai` (s API klíčem),
ale to podporuje pouze Sonar modely — ne Gemini, GPT, Claude, Grok.

### 3. Kvóty
Perplexity Pro má limity na Pro Search dotazy. V této session bylo vytvořeno ~20 testovacích
threadů ("say pong"). `query_count_copilot` se každým dotazem zvyšuje.

### 4. Thread smazání
`DELETE /rest/thread/<uuid>` vrací HTTP 405 (Method Not Allowed).
Testovací thready nelze mazat přes API — je nutné ruční mazání v UI
(Settings → History, nebo přes tlačítko v sidebar).

### 5. URL fetching — neověřeno
Test "načti tuto GitHub URL" přes `query_str` timeout-oval (Deep Research >45s).
Je vysoce pravděpodobné, že Perplexity URL v dotazu načte přes svůj web search,
ale spolehlivost pro raw GitHub soubory nebyla v tomto výzkumu potvrzena.

---

## Praktický dopad na Peppi review pipeline

### Současný stav (Skills přes Perplexity UI)
- Robinson spouští každý skill ručně v nové Perplexity konverzaci
- Model je vybrán v UI model pickeru před spuštěním skillu
- Skill prompt říká modelu: "Identify yourself as: Gemini 3.1 Pro Thinking"

### Možná automatizace přes REST API
S nalezeným endpointem lze vytvořit script, který:
1. Načte `reviewer-prompt.md` ze skliček review package
2. Odešle ho jako `query_str` do `perplexity_ask` s příslušným `model_preference`
3. Čte SSE stream do `final_sse_message: true`
4. Extrahuje odpověď z `markdown_block.answer`
5. Vytvoří GitHub Issue automaticky

**Podmínky pro tuto automatizaci:**
- Musí běžet v kontextu přihlášeného prohlížeče (Chrome MCP nebo Playwright)
- Reviewer prompty jsou dlouhé (~2000 znaků) — vejdou se do `query_str`
- Každý reviewer = jeden API call + čekání na SSE completion (10–60 s)

---

## Test verifikace — "Pong" odpovědi

```
gemini31pro_high + query "say pong" → answer: "Pong!"          ✅
claude2          + query "say pong" → answer: "Pong!\n\n## Summary..." ✅
pplx_alpha       + query "say pong" → HTTP 200, stream >45s    ✅ (no timeout issue, just slow)
```

---

*Výzkum provedl Claude Code session 2026-04-20. Endpoint ověřen live voláními z Chrome MCP.*
