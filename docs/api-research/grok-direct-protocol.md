---
research: grok-direct-protocol
date_capture: 2026-04-26
capture_method: chrome-devtools-har-export
status: protocol-documented
---

# Grok Direct (grok.com) — Upload & Ask Protocol

## 1. Souhrn

HAR capture z 2026-04-26 (`capture-grok-direct.har`, 3.9 MB, 68 requestů) zachytil kompletní
flow při použití Grok přímo na grok.com. Protokol je **nejjednodušší ze všech čtyř platforem**:
jednokrokový JSON upload s base64-kódovaným souborem, žádný S3, žádné presign, žádný resumable
upload. Ask call je čistý REST JSON, response je NDJSON (newline-delimited JSON).

**Klíčová constraint pro orchestrátor:** Free tier vyžaduje `"modeId": "fast"` v ask callu.
Ostatní modely (`think`, plný Grok 3 bez fast) vyžadují placený účet. Orchestrátor musí posílat
vždy `modeId: "fast"`, dokud Robinson nepřejde na placený tier.

**Model:** `grok-3` (fast variant) — potvrzeno v response body. `"isThinking": false`.

**Poznámka:** První capture 2026-04-26 selhal (HTTP 403 na `/new`) kvůli dočasnému server-side
problému Groku (přetížení nebo model dočasně nedostupný). Druhý pokus v nové session proběhl
bez problémů.

---

## 2. Auth mechanism

Nejjednodušší ze všech platforem:

- **Session cookies** — xAI/Grok session cookie (standardní browser session)
- **Žádný CSRF token** — pouze `Referer: https://grok.com/` header
- **Žádný API klíč** v headers

---

## 3. Upload sequence (jednokrokový JSON upload)

Grok nepoužívá S3 ani resumable upload. Soubor se enkóduje jako base64 a posílá přímo v JSON těle.

### Krok 1 (jediný) — JSON upload s base64 obsahem

```
POST https://grok.com/rest/app-chat/upload-file
Content-Type: application/json
```

**Request body:**
```json
{
  "fileName": "card.html",
  "fileMimeType": "text/html",
  "content": "<base64_encoded_file_content>"
}
```

**Response (200):**
```json
{
  "fileMetadataId": "<uuid>",
  "fileMimeType": "text/html",
  "fileName": "card.html",
  "fileUri": "users/<user_id>/<uuid>/content",
  "parsedFileUri": "",
  "createTime": "2026-04-26T08:22:26.067908Z",
  "fileSource": "SELF_UPLOAD_FILE_SOURCE"
}
```

**Pole pro orchestrátor:** `fileMetadataId` (UUID) → použit v ask callu jako `fileAttachments[0]`.

**Base64 enkódování:** `Buffer.from(fileBuffer).toString('base64')` (Node.js).

---

## 4. Ask call structure

```
POST https://grok.com/rest/app-chat/conversations/new
Content-Type: application/json
Referer: https://grok.com/
```

**Request body:**
```json
{
  "temporary": false,
  "message": "<prompt_text>",
  "fileAttachments": ["<fileMetadataId>"],
  "imageAttachments": [],
  "disableSearch": false,
  "enableImageGeneration": true,
  "returnImageBytes": false,
  "returnRawGrokInXaiRequest": false,
  "enableImageStreaming": true,
  "imageGenerationCount": 2,
  "forceConcise": false,
  "enableSideBySide": true,
  "sendFinalMetadata": true,
  "disableTextFollowUps": false,
  "responseMetadata": {},
  "disableMemory": false,
  "forceSideBySide": false,
  "isAsyncChat": false,
  "disableSelfHarmShortCircuit": false,
  "collectionIds": [],
  "connectors": [],
  "deviceEnvInfo": {
    "darkModeEnabled": true,
    "devicePixelRatio": 2,
    "screenWidth": 1680,
    "screenHeight": 1050,
    "viewportWidth": 897,
    "viewportHeight": 873
  },
  "modeId": "fast"
}
```

**KRITICKÉ pole:** `"modeId": "fast"` — povinné pro free tier. Jiné hodnoty (`"think"`,
bez `modeId`, nebo jiné varianty) vyžadují placený účet a vrátí chybu.

**Minimální nutná pole pro orchestrátor:**
```json
{
  "message": "<prompt_text>",
  "fileAttachments": ["<fileMetadataId>"],
  "modeId": "fast",
  "temporary": false,
  "disableSearch": false
}
```
Ostatní pole jsou UI behavioral flags — testovat zda jsou povinná, pravděpodobně volitelná.

---

## 5. Response format

**NDJSON** (newline-delimited JSON) — každý chunk je samostatný JSON objekt na nové řádce.

Příklady zachycených chunků:

```json
{"result":{"conversation":{"conversationId":"<uuid>","title":"New conversation",...}}}
{"result":{"response":{"userResponse":{"responseId":"<uuid>","message":"<prompt>","model":"grok-3","isThinking":false,...},...}}}
```

Streaming response obsahuje:
- Inicializaci konverzace (conversationId)
- User message echo (responseId, model confirmace)
- Postupné chunky s textem odpovědi (Grok 3 fast)

**Model v response:** `"model": "grok-3"`, `"isThinking": false` — potvrzuje fast non-thinking variantu.

---

## 6. Diff against Perplexity protocol

| Aspekt | Grok direct | Perplexity |
|---|---|---|
| Upload | JSON + base64, 1 krok | S3 multipart, 3 kroky (A+B+D) |
| Ask URL | `/rest/app-chat/conversations/new` | `/rest/sse/perplexity_ask` |
| Model selector | `"modeId": "fast"` | `"model_preference": "grok41nonreasoning"` |
| Auth | cookies only | cookies only |
| Response format | NDJSON | SSE text/event-stream |
| CSRF | žádný | žádný |
| File reference | UUID z upload response | S3 URL z Step A |

---

## 7. Implementation notes for orchestrator

**Nový helper potřeba:** `grokDirectAsk(prompt, fileBuffer, fileName, session)`

Kroky:
```
1. base64 = Buffer.from(fileBuffer).toString('base64')
2. POST /rest/app-chat/upload-file → { fileMetadataId }
3. POST /rest/app-chat/conversations/new → NDJSON stream
```

**NDJSON parser:**
```typescript
// Response je newline-delimited JSON — split by '\n', JSON.parse každý neprázdný řádek
const chunks = responseText.split('\n').filter(Boolean).map(line => JSON.parse(line));
```

**modeId constraint:** Hardcoded `"modeId": "fast"` pro free tier. Pokud Robinson přejde
na placený tier, testovat `"modeId": "think"` pro reasoning variantu.

**Base64 size limit:** Pro velké soubory (>1 MB) zatím netestováno — Grok může mít limit
na JSON body size. `card.html` (3059 bytes) prošel bez problémů.

**Cookies:** Stejné cookie-based session jako Perplexity — orchestrátor potřebuje Grok session.

---

## 8. Open questions

- **`modeId` hodnoty:** Zachyceno `"fast"`. Platné hodnoty pro paid tier: pravděpodobně
  `"think"` (Grok 3 Thinking), `"default"` nebo bez `modeId` (standard Grok 3). Netestováno.
- **File size limit pro base64 upload:** Neznámý. Přímý JSON upload může mít omezení
  na body size (obvykle 10–50 MB). Velké soubory mohou vyžadovat chunked upload.
- **Subsequent messages:** Capture zachytil jen první zprávu (`/conversations/new`).
  Endpoint pro pokračování konverzace (`/conversations/<id>/responses/new` nebo podobný)
  nezachycen — ale pro panel (single prompt) není potřeba.
- **`disableSearch: false`:** V capture ponecháno jako `false` (Grok prohledává web).
  Pro reviewer prompt zvážit `disableSearch: true` pro konzistentní chování.
- **`enableSideBySide: true`:** Neznámá sémantika — pravděpodobně UI feature.
  Bezpečné ponechat `false` v orchestrátoru.
- **First capture 403:** Nezjistilo se zda 403 byl způsoben konkrétním modelem nebo
  dočasným výpadkem. Doporučeno: retry logic při 403 (exponential backoff, max 3 pokusy).
