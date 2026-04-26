---
research: gemini-thinking-perplexity-protocol
date_capture: 2026-04-26
capture_method: chrome-devtools-har-export
status: protocol-documented
---

# Gemini "thinking" via Perplexity — Upload & Ask Protocol

## 1. Souhrn

HAR capture z 2026-04-26 (`capture-gemini-thinking-perplexity.har`, 1.1 MB, 29 requestů)
zachytil Gemini přes Perplexity UI. Čistý capture (29 requestů vs 266 u Kimi — pravděpodobně
zachycen v existující session bez reloadu stránky). Model identifikátor je `gemini31pro_high`
— **identický s modelem již používaným v produkčním orchestrátoru** (D60). Žádná odlišná
"thinking" varianta s explicitním identifikátorem nebyla v Perplexity UI nalezena.

**Klíčové zjištění:** Perplexity buď nemá samostatný thinking toggle pro Gemini, nebo
`gemini31pro_high` je thinking varianta (odpovídá Gemini 2.5 Pro, jehož thinking je vždy zapnuté).

---

## 2. Auth mechanism

Identické s existujícím Perplexity protokolem.

---

## 3. Upload sequence

Identická 4-kroková sekvence, čistě zachycena:

| Krok | Endpoint | Status |
|---|---|---|
| A | `POST /rest/uploads/batch_create_upload_urls?version=2.18&source=default` | 200 |
| B | `POST https://ppl-ai-file-upload.s3.amazonaws.com/` | 204 |
| D | `POST /rest/sse/attachment_processing/subscribe` | 200 |
| E | `POST /rest/sse/perplexity_ask` | 200 |

Upload parametry: `filename: "card.html"`, `content_type: "text/html"`, `file_size: 3059`.

---

## 4. Ask call structure

```json
{
  "query_str": "Shrň první odstavec",
  "params": {
    "model_preference": "gemini31pro_high",
    "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/<file_uuid>/card.html"],
    "skip_search_enabled": true,
    "extended_context": false,
    "mode": "copilot",
    "version": "2.18",
    "language": "cs-CZ"
  }
}
```

`extended_context: false` — žádný thinking-specifický flag v ask call těle nezachycen.

---

## 5. Response format

SSE stream, identický s ostatními Perplexity modely.

---

## 6. Diff against Perplexity protocol

| Pole | Gemini/Perplexity | Existující produkce | Stav |
|---|---|---|---|
| `model_preference` | `"gemini31pro_high"` | `"gemini31pro_high"` | ✅ Totožné — model již v produkci |
| `extended_context` | `false` | nezachyceno dříve | Potvrdit zda thinking toggle existuje |
| Upload | identický | identický | ✓ |

**Závěr:** Tento capture neodhalil žádný nový model identifikátor oproti produkci.
`gemini31pro_high` je pravděpodobně Gemini 2.5 Pro s thinking vždy aktivním (on by default).

---

## 7. Implementation notes for orchestrator

Žádné změny potřeba — `gemini31pro_high` je již v produkci a funguje (D60, re-run 2026-04-25).
Pokud by Perplexity přidalo oddělený "Gemini thinking" identifikátor, bude vypadat podobně
jako `gemini31pro_high_thinking` — stačí přidat do `MODEL_PREFERENCE_MAP`.

---

## 8. Open questions

- **Thinking toggle existence:** Perplexity UI nenabídlo explicitní thinking variantu Gemini
  odlišnou od `gemini31pro_high`. Možnosti: (a) thinking je vždy on pro `gemini31pro_high`,
  (b) toggle existuje ale nebyl v UI viditelný, (c) Perplexity nezveřejňuje thinking jako
  separátní model. Pro produkci je to irelevantní — `gemini31pro_high` funguje.
- **`extended_context` field:** Zachyceno jako `false`. Zda `true` aktivuje thinking nebo
  jiné chování není ze single capture jasné.
