---
research: perplexity-attachment-upload-protocol
date_capture: 2026-04-25
capture_method: chrome-devtools-har-export
status: protocol-documented
predecessor: 2026-04-24-network-capture-chrome-mcp
---

# Perplexity Attachment Upload Protocol

## 1. Souhrn

HAR capture z 2026-04-25 zachytil kompletní 4-krokový upload protokol při přiložení souboru
`butter_audit_report.md` (29 060 B) v Perplexity UI. Všechny URL jsou nyní známé a implementace
v orchestrátoru může začít.

**Klíčová korekce oproti původní hypotéze:** Neexistují oddělené kroky "presign" a "register" —
oba jsou sloučeny do jediného callu `batch_create_upload_urls`. Celkový počet kroků je tedy 4,
ne 5 jak se předpokládalo.

**Auth:** Žádný x-csrf-token není potřeba. Autentizace je výhradně přes session cookies
(Perplexity side) a AWS policy/signature v S3 multipart formu (S3 side).

---

## 2. Step A — batch_create_upload_urls (presign + register v jednom)

- **URL:** `POST https://www.perplexity.ai/rest/uploads/batch_create_upload_urls?version=2.18&source=default`
- **Method:** `POST`
- **Request headers (relevantní):**
  - `content-type: application/json`
  - `x-app-apiclient: default`
  - `x-app-apiversion: 2.18`
  - `x-perplexity-request-endpoint: https://www.perplexity.ai/rest/uploads/batch_create_upload_urls?version=2.18&source=default`
  - `x-perplexity-request-reason: ask-input-inner-home`
  - `x-perplexity-request-try-number: 1`
  - No `x-csrf-token` — cookie auth only
- **Request body:**
  ```json
  {
    "files": {
      "<client-generated-uuid>": {
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
  - Key in `files` dict = any UUID generated client-side (not reused later — Perplexity assigns its own `file_uuid`)
  - `content_type`: empty string `""` — Perplexity detects type server-side
  - `file_size`: byte count of the file to upload
- **Response (200):**
  ```json
  {
    "results": {
      "<same-client-uuid>": {
        "s3_bucket_url": "https://ppl-ai-file-upload.s3.amazonaws.com/",
        "s3_object_url": "https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/<file_uuid>/<filename>",
        "fields": {
          "acl": "private",
          "Content-Type": "",
          "tagging": "<Tagging>...</Tagging>",
          "x-amz-meta-is_text_only": "false",
          "key": "web/direct-files/attachments/<user_id>/<file_uuid>/<filename>",
          "AWSAccessKeyId": "<aws-key>",
          "x-amz-security-token": "<aws-session-token>",
          "policy": "<base64-encoded-policy>",
          "signature": "<base64-signature>"
        },
        "rate_limited": false,
        "file_uuid": "<perplexity-assigned-uuid>",
        "error": null
      }
    }
  }
  ```
- **Pole pro orchestrator:**
  - `s3_bucket_url` → POST target for Step B
  - `fields` → all form fields for Step B multipart body
  - `s3_object_url` → used as `params.attachments[0]` in Step E ask call
  - `file_uuid` → sent to Step D subscribe

---

## 3. Step B — S3 multipart form POST

- **URL:** `https://ppl-ai-file-upload.s3.amazonaws.com/` (= `s3_bucket_url` from Step A)
- **Method:** `POST` (NOT PUT — this is AWS S3 presigned POST, not presigned PUT)
- **Request headers:**
  - `content-type: multipart/form-data; boundary=<boundary>`
  - No Perplexity auth headers — S3 authenticated via policy/signature in form fields
- **Form fields (order matters for S3 policy compliance):**
  1. `acl` = `"private"` (from Step A `fields.acl`)
  2. `Content-Type` = `""` (from Step A `fields["Content-Type"]`)
  3. `tagging` = `"<Tagging>...</Tagging>"` (from Step A `fields.tagging`)
  4. `x-amz-meta-is_text_only` = `"false"` (from Step A `fields["x-amz-meta-is_text_only"]`)
  5. `key` = `"web/direct-files/attachments/..."` (from Step A `fields.key`)
  6. `AWSAccessKeyId` = `"..."` (from Step A `fields.AWSAccessKeyId`)
  7. `x-amz-security-token` = `"..."` (from Step A `fields["x-amz-security-token"]`)
  8. `policy` = `"..."` (from Step A `fields.policy`)
  9. `signature` = `"..."` (from Step A `fields.signature`)
  10. `file` = binary file content (the actual card.html blob)
- **Response status:** 204 No Content (empty body)
- **Node.js implementation note:** Use `FormData` from `node-fetch` or native `fetch` + `FormData`.
  The `file` field must be appended last after all policy fields.

---

## 4. Step C — neexistuje

Původní hypotéza počítala se samostatným "file register" endpointem. HAR capture žádný takový
endpoint neodhalil. `batch_create_upload_urls` (Step A) kombinuje presign i registraci do jednoho
callu.

---

## 5. Step D — Subscribe

- **URL:** `POST https://www.perplexity.ai/rest/sse/attachment_processing/subscribe`
- **Method:** `POST`
- **Request body:**
  ```json
  {
    "file_uuids": ["<file_uuid-from-step-a>"]
  }
  ```
- **Response:** SSE stream, two events:
  ```
  event: message
  data: {"file_uuid": "<uuid>", "success": true, "s3_url": "<s3_object_url>", "final_sse_message": false}

  event: end_of_stream
  data: {}
  ```
- **Poznámka:** `s3_url` v response = totéž jako `s3_object_url` z Step A. Subscribe slouží jako
  potvrzení že Perplexity backend soubor zpracoval — orchestrátor musí počkat na `end_of_stream`
  před odesláním ask callu.

---

## 6. Step E — Ask call (verifikace oproti production-panel-spec.md)

Zachycené tělo ask callu s přílohou:

```json
{
  "query_str": "shrň tento dokument a odešli",
  "params": {
    "attachments": ["https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/<user_id>/<file_uuid>/<filename>"],
    "language": "cs-CZ",
    "timezone": "Europe/Prague",
    "search_focus": "internet",
    "sources": ["web"],
    "frontend_uuid": "<random-uuid>",
    "mode": "copilot",
    "model_preference": "claude46sonnetthinking",
    "is_related_query": false,
    "is_sponsored": false,
    "frontend_context_uuid": "<random-uuid>",
    "prompt_source": "user",
    "query_source": "home",
    "is_incognito": false,
    "time_from_first_type": 849.6,
    "local_search_enabled": false,
    "use_schematized_api": true,
    "send_back_text_in_streaming_api": false,
    "supported_block_use_cases": ["answer_modes", "media_items", "knowledge_cards", "..."],
    "client_coordinates": null,
    "mentions": [],
    "dsl_query": "shrň tento dokument a odešli",
    "skip_search_enabled": true,
    "is_nav_suggestions_disabled": false,
    "source": "default",
    "always_search_override": false,
    "override_no_search": false,
    "should_ask_for_mcp_tool_confirmation": true,
    "browser_agent_allow_once_from_toggle": false,
    "force_enable_browser_agent": false,
    "supported_features": ["browser_agent_permission_banner_v1.1"],
    "extended_context": false,
    "version": "2.18",
    "rum_session_id": "<random-uuid>"
  }
}
```

**Srovnání s production-panel-spec.md:**

| Pole | Spec (původní) | Zachyceno | Stav |
|---|---|---|---|
| `search_focus` | `"writing"` | `"internet"` | ✅ Spec opravena 2026-04-25 |
| `skip_search_enabled` | chybělo | `true` | ✅ Zdokumentováno |
| `model_preference` (Claude) | `"claude46sonnet"` | `"claude46sonnetthinking"` | ✅ Spec opravena |
| `use_schematized_api` | `true` | `true` | ✓ Sedí |
| `mode` | `"copilot"` | `"copilot"` | ✓ Sedí |
| `version` | chybělo | `"2.18"` | ✅ Doplnit |
| `dsl_query` | chybělo | stejné jako `query_str` | ✅ Doplnit |
| `attachments` | chybělo | `[s3_object_url]` | ✅ Klíčové nové pole |
| `send_back_text_in_streaming_api` | chybělo | `false` | Doplnit |
| `rum_session_id` | chybělo | random UUID | Doplnit |
| `sources` | chybělo | `["web"]` | Doplnit |
| `language` | `"en-US"` | `"cs-CZ"` | Nastavit per user locale |
| `frontend_uuid` | ✓ | ✓ | Sedí |
| `frontend_context_uuid` | ✓ | ✓ | Sedí |

**Nová pole která nebyla v spec:** `sources`, `is_related_query`, `is_sponsored`,
`prompt_source`, `query_source`, `is_incognito`, `time_from_first_type`,
`local_search_enabled`, `send_back_text_in_streaming_api`, `supported_block_use_cases`,
`client_coordinates`, `mentions`, `is_nav_suggestions_disabled`, `always_search_override`,
`override_no_search`, `should_ask_for_mcp_tool_confirmation`,
`browser_agent_allow_once_from_toggle`, `force_enable_browser_agent`,
`supported_features`, `extended_context`, `rum_session_id`.

**Doporučení pro orchestrator:** Přidat jen pole nutná pro funkčnost. Zbytečné behaviorální
flagy (`is_sponsored`, `local_search_enabled` atd.) lze vynechat — testovat a přidat pokud
chybí. Klíčové povinné: `attachments`, `skip_search_enabled`, `version`, `dsl_query`, `sources`.

---

## 7. Implementační poznámky pro orchestrátor

- **HTTP klient:** Node.js native `fetch` + `FormData` stačí pro vše (Node 18+). `undici` není
  potřeba.
- **Auth:** Session cookies se předávají přes `Cookie` header — orchestrátor musí mít přístup
  k aktivní Perplexity session cookie stejně jako dnes (pro `/rest/sse/perplexity_ask`).
- **Step A custom headers:** Přidat `x-app-apiclient: default`, `x-app-apiversion: 2.18`,
  `x-perplexity-request-reason: ask-input-inner-home` — mohou být potřeba pro serverovou
  validaci requestu.
- **Step B form field order:** Pořadí polí v multipart těle musí odpovídat AWS policy
  (acl → Content-Type → tagging → x-amz-meta-is_text_only → key → AWSAccessKeyId →
  x-amz-security-token → policy → signature → file). File musí být poslední.
- **Step D timeout:** Doporučeno 30 s. Při `success: false` nebo timeoutu → throw error, retry
  celý upload od Step A.
- **Step A expiry:** Policy má expiration (`eyJleHBpcmF0aW9uIjogIjIwMjYtMDQtMjVUMDY6MjI...`
  dekóduje na `"expiration": "2026-04-25T06:27:36Z"` — cca 5 minut od vytvoření). Upload
  (Steps B + D) musí proběhnout do 5 minut od Step A.
- **Paralelismus:** Každý z 6 reviewerů může sdílet jeden upload (jeden `file_uuid` / jeden
  `s3_object_url`) — upload stačí provést jednou před všemi 6 ask-cally.

---

## 8. Otevřené otázky

- **`content_type: ""`:** Perplexity posílá prázdný string i pro `.md` soubor. Pro `.html`
  by možná bylo správnější `text/html` — testovat zda server přijme nebo odmítne.
- **`x-amz-meta-is_text_only: "false"`:** Pro čisté HTML/MD soubory by mohlo být `"true"`.
  Hodnota pochází z Step A response — orchestrátor ji kopíruje jak přijde.
- **`supported_block_use_cases`:** Velký seznam feature flags. Neznámo zda jejich vynechání
  způsobí jiné chování (např. chybějící `answer_modes` může ovlivnit formát odpovědi).
  Doporučeno: zkopírovat seznam celý z capture.
- **`language: "cs-CZ"` vs `"en-US"`:** Capture byl v českém Chromu. Pro reviewer-prompt
  v angličtině by `"en-US"` mohlo být vhodnější — testovat.
