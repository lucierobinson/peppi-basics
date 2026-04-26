---
research: kimi-perplexity-protocol
date_capture: 2026-04-26
capture_method: chrome-devtools-har-export
status: protocol-documented
---

# Kimi via Perplexity — Upload & Ask Protocol

## 1. Souhrn

HAR capture z 2026-04-26 (`capture-kimi-perplexity.har`, 22 MB, 266 requestů) potvrdil, že
Kimi používá **identický 4-krokový upload protokol** jako Claude, GPT a Nemotron na Perplexity.
Jediný rozdíl oproti existujícímu protokolu je hodnota `model_preference`.
Capture obsahuje všechny 4 kroky čistě: batch_create_upload_urls → S3 POST → subscribe → perplexity_ask.

---

## 2. Auth mechanism

Identické s existujícím Perplexity protokolem — pouze session cookies. Žádný CSRF token.

- Cookie auth (Perplexity session cookie)
- AWS S3 autorizace přes policy/signature v Step B form fields
- Žádný `x-csrf-token`

---

## 3. Upload sequence (identická s Perplexity protokolem)

Stejné 4 kroky jako v `perplexity-upload-protocol.md`. Bez odchylek:

| Krok | Endpoint | Status |
|---|---|---|
| A | `POST /rest/uploads/batch_create_upload_urls?version=2.18&source=default` | 200 |
| B | `POST https://ppl-ai-file-upload.s3.amazonaws.com/` | 204 |
| C | (neexistuje) | — |
| D | `POST /rest/sse/attachment_processing/subscribe` | 200 |

Capture potvrdil `content_type: "text/html"` pro `.html` soubory (konzistentní s O1 fixem z D60).

---

## 4. Ask call structure

**URL:** `POST https://www.perplexity.ai/rest/sse/perplexity_ask`

**Diff oproti Claude/GPT:** pouze pole `model_preference`.

```json
{
  "query_str": "<reviewer-prompt>",
  "params": {
    "model_preference": "kimik26thinking",
    "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/<file_uuid>/<filename>"],
    "language": "cs-CZ",
    "skip_search_enabled": true,
    "extended_context": false,
    "mode": "copilot",
    "version": "2.18",
    "frontend_uuid": "<random-uuid>",
    "frontend_context_uuid": "<random-uuid>",
    "dsl_query": "<reviewer-prompt>",
    "sources": ["web"],
    "search_focus": "internet"
  }
}
```

**Klíčové pole:** `model_preference: "kimik26thinking"` (identifikátor zachycen z live UI).

---

## 5. Response format

Identický SSE stream jako u ostatních Perplexity modelů. Žádné odchylky v streamovacím formátu.

---

## 6. Diff against Perplexity protocol

| Pole | Kimi | Existující protokol (Claude) | Stav |
|---|---|---|---|
| `model_preference` | `"kimik26thinking"` | `"claude46sonnetthinking"` | ✅ Pouze toto pole se mění |
| Upload protokol | identický | identický | ✓ |
| Headers | identické | identické | ✓ |
| Auth | identická | identická | ✓ |
| Response format | SSE | SSE | ✓ |

---

## 7. Implementation notes for orchestrator

Kimi vyžaduje **nulové změny** v upload logice. Stačí přidat `"kimik26thinking"` do
`MODEL_PREFERENCE_MAP` v orchestrátoru:

```typescript
const MODEL_PREFERENCE_MAP = {
  // existing
  "claude-sonnet-46": "claude46sonnetthinking",
  "gpt-54": "gpt54_thinking",
  "gemini-31-pro-high": "gemini31pro_high",
  "grok": "grok41nonreasoning",
  "nemotron": "nv_nemotron_3_super",
  // new
  "kimi": "kimik26thinking",
};
```

Stejný upload flow (Steps A→B→D), stejný ask call, stejný SSE parser.

---

## 8. Open questions

- **Kimi response quality:** Nezachycena — capture byl proveden jen pro protokol, ne pro eval.
- **`extended_context: false`:** Zachyceno jako `false`. Zda existuje thinking toggle specifický
  pro Kimi není ze zachyceného trafficu jasné.
- **Attachment support:** Potvrzeno přes capture (`attachments` pole přítomno v ask callu),
  ale skutečné čtení přílohy Kimim nebylo verifikováno produkčním testem.
