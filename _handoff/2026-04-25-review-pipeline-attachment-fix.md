---
session: handover-attachment-fix
date_handover: 2026-04-25
phase: cesta-1-s3-upload-implementation
predecessor_session: 2026-04-24-review-panel-pilot-and-diagnostic
status: ready-for-orchestrator-implementation
priority: P1
---

# Handover: Oprava review pipeline — S3 upload pro přílohy

## 1. Problém k vyřešení

Orchestrátor (`scripts/run-review-panel.js`) vkládá celý obsah `card.html` (~67 kB) přímo
do `query_str` — celkové tělo požadavku tak dosahuje ~83 kB. Perplexity copilot endpoint
sdílí tokenový budget mezi vstupem a výstupem, takže při velkém vstupu zbývá málo prostoru
pro výstup. Výsledek: Claude, GPT a Grok přestávají generovat výstup přibližně po 8,7 kB
(odpovídá cca 3 ze 6 person), zatímco Gemini, Nemotron a Sonar s menším výstupním nárokem
dokončí všechny. Manuální workflow Robinsona v Perplexity UI problém nemá, protože UI
nahraje `card.html` do S3 samostatně a v těle požadavku předá jen URL přílohy — `query_str`
pak obsahuje pouze reviewer-prompt (~16 kB) a výstupní budget zůstane plný. Cílem je
replikovat tento upload protokol v orchestrátoru.

---

## 2. Co už víme (z network capture 2026-04-24)

- **Endpoint sdílený se současným orchestrátorem:** `POST /rest/sse/perplexity_ask`
- **Tři přípravné kroky před ask-callem — URL blokovány Chrome MCP** (auth tokeny v query
  stringu):
  - **Krok A — presign request:** URL neznámá; vrací presigned S3 URL + `upload_uuid`
  - **Krok B — PUT na S3 presigned URL:** přímý blob upload souboru (bez Perplexity auth headeru)
  - **Krok C — POST na file register endpoint:** URL neznámá; odesílá `filename`,
    `content_type`, `file_size`, `upload_uuid`; vrací `processed_uuid`
  - **Krok D — POST na `/rest/sse/attachment_processing/subscribe`** s `processed_uuid`;
    čekat na SSE event processing-done

- **Tělo ask-callu (karta jako příloha, zjištěno z capture):**

```json
{
  "query_str": "<jen reviewer-prompt, ~16 kB>",
  "params": {
    "model_preference": "claude46sonnetthinking",
    "mode": "copilot",
    "attachments": ["<s3_url_z_kroku_b>"],
    "dsl_query": "<stejné jako query_str>",
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

- **Model pro Claude:** `claude46sonnetthinking` (Thinking variant) — ne `claude46sonnet`
- **Skutečný přepínač "bez web search":** `skip_search_enabled: true` — ne `search_focus: "writing"`
  (UI používá `search_focus: "internet"` a přesto nedostane web search výsledky)

---

## 3. Co potřebujeme zjistit (blocker)

> **VYŘEŠENO 2026-04-25** — viz `docs/api-research/perplexity-upload-protocol.md`

Tři URL, které capture z 2026-04-24 nezískal, protože Chrome MCP zablokoval requesty
s auth tokeny v query stringu:

1. **Presign endpoint (Krok A)** — URL + tvar request body + tvar response (presigned URL + upload UUID)
2. **File register endpoint (Krok C)** — URL + tvar request body (filename, content_type, file_size, upload_uuid) + tvar response (processed_uuid)
3. **Přesné request/response bodies obou** — potřebujeme je pro implementaci

**Doporučený postup pro druhý capture:**

**Varianta 1 — Chrome DevTools (preferovaná):**
1. Otevřít Perplexity v Chrome
2. Otevřít DevTools → záložka Network **před** spuštěním workflow (ne přes Chrome MCP — přes
   nativní DevTools, aby Chrome MCP neblokoval URL s tokeny)
3. Robinson manuálně provede workflow s uploadem přílohy (jiný model, jiný soubor je v pořádku —
   cílem je jen spustit upload kroky)
4. Po dokončení: Code přečte síťové requesty z DevTools (přes Chrome MCP DOM inspekci nebo
   export HAR)

**Varianta 2 — desktop proxy (fallback, pokud DevTools nestačí):**
- Nastavit `mitmproxy` nebo `Charles Proxy` jako systémový proxy
- Robinson spustí manuální workflow s Perplexity v prohlížeči
- mitmproxy zachytí veškerý HTTPS provoz včetně URL s auth tokeny
- Code přečte zachycené requesty z mitmproxy logu

> Pokud druhý capture selže dvakrát (DevTools + proxy), přejít na **Cestu 3** (viz sekce 5).

---

## 4. Plán implementace

> Primární zdroj URL a těl requestů: `docs/api-research/perplexity-upload-protocol.md`

Pořadí kroků:

1. **Přidat helper `uploadCardToS3(cardPath)`** do orchestrátoru (nebo jako samostatný modul):
   - Krok A: POST na presign endpoint → získat `s3_url` + `upload_uuid`
   - Krok B: PUT blob `card.html` na `s3_url`
   - Krok C: POST na file register endpoint s metadaty → získat `processed_uuid`
   - Krok D: POST na `/rest/sse/attachment_processing/subscribe` a čekat na SSE
     processing-done event
   - Vrátit `{ s3_url, processed_uuid }`

2. **Přidat `waitForProcessing(processed_uuid)`** — subscribe na SSE a resolve při
   processing-done eventu (timeout 30 s, throw při překročení)

3. **Upravit `buildAskBody(reviewer, packageSlug)`:**
   - Číst pouze `reviewer-prompt.md`, ne `card.html`
   - Nastavit `query_str` a `params.dsl_query` na obsah reviewer-promptu
   - Nastavit `params.attachments: [s3_url]` ze step 1
   - Doplnit nové parametry: `skip_search_enabled`, `version: "2.18"`, `dsl_query`
   - Aktualizovat `model_preference` mapping pro Claude: `claude46sonnetthinking`
   - Změnit `search_focus`: `"writing"` → `"internet"`

4. **Aktualizovat `PANEL` config** v scriptu — 6 reviewerů s novými identifikátory a metadaty

5. **Smoke test na `example-v0_1_0`:**
   - Nejdřív 1 reviewer (Claude), ověřit plný output
   - Pak full 6 reviewerů, ověřit 6/6 kompletní

6. **Re-run madeleines pilot** — očekávaný výsledek: 6/6 plných recenzí

7. **Commit + push + zavřít handover**

---

## 5. Fallback path (pokud Cesta 1 narazí na blocker)

**Cesta 3 — split-call architektura** (zdokumentovaný fallback, D58):

- Každý reviewer volán dvakrát se dvěma podmnožinami person (1–3, pak 4–6)
- 12 queries místo 6, walltime ~5–6 minut místo ~2:46
- Plný 16,8 kB reviewer-prompt bez zkrácení — card.html inline jako dnes
- Výstup na call: 3 persony × ~2,5 kB ≈ 8 kB → vejde se do současného budgetu
- Výstupy z obou callů se spojí do jednoho souboru per reviewer

**Trigger podmínka:** Pokud druhý network capture (DevTools + proxy) nezíská upload URL
ani po dvou pokusech, implementovat Cestu 3 místo Cesty 1.

---

## 6. Soubory v aktuálním stavu

| Soubor | Stav | Poznámka |
|---|---|---|
| `scripts/run-review-panel.js` | ✅ committed, funkční | Inline-only orchestrátor — neupravovat do dalšího capture |
| `scripts/run-review-mvp.js` | ✅ committed | Historický MVP — nesahat |
| `review-packages/madeleines-v1_0_0/` | ✅ committed | card.html + reviewer-prompt.md, bez rubric.md |
| `review-packages/madeleines-v1_0_0/_submissions/run-20260424T213504Z/` | ⚠️ **NECOMMITTED** | Částečné výsledky pilotu — diagnostický run, čeká na opravu |
| `review-packages/example-v0_1_0/` | ✅ committed | Reference package s rubric.md (smoke testy) |
| `docs/api-research/perplexity-rest-api-findings.md` | ✅ committed | Historické API research notes |
| `docs/api-research/production-panel-spec.md` | ✅ updated 2026-04-25 | Opraveny `search_focus`, `claude46sonnetthinking`, přidán attachment workflow |
| `docs/v2-architecture-tracker.md` | ✅ updated 2026-04-25 | D58 přidán |
| `_handoff/2026-04-25-review-pipeline-attachment-fix.md` | ✅ this file | |

---

## 7. Počáteční prompt pro další session

```
You have Chrome MCP available. Code has internet access via Chrome MCP.

All user-facing output, summaries, status reports, and explanations must be in Czech.
Code, comments, and variable names stay in English.

## Context

Read these files first:
1. ~/Desktop/1Peppulka/peppi-basics/_handoff/2026-04-25-review-pipeline-attachment-fix.md
2. ~/Desktop/1Peppulka/peppi-basics/docs/api-research/production-panel-spec.md
3. ~/Desktop/1Peppulka/peppi-basics/docs/v2-architecture-tracker.md (sections D57–D58)

The handover doc explains where the previous session stopped and what needs to happen
next. Read it carefully before any actions.

## Task

Execute the next step from the handover doc — the second network capture to reveal upload
URLs that Chrome MCP blocked during the 2026-04-24 capture. Coordinate with Robinson for
the manual workflow step. Do not start orchestrator implementation until upload URLs are
confirmed.
```
