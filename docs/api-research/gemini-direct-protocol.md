---
research: gemini-direct-protocol
date_capture: 2026-04-26
capture_method: chrome-devtools-har-export
status: protocol-documented
---

# Gemini Direct (gemini.google.com) — Upload & Ask Protocol

## 1. Souhrn

HAR capture z 2026-04-26 (`capture-gemini-direct.har`, 20 MB, 80 requestů) zachytil kompletní
flow při použití Gemini přímo na gemini.google.com. Architektura je **zcela odlišná** od
Perplexity — používá Google's interní `BardChatUi` API se dvěma klíčovými endpointy:
`push.clients6.google.com/upload` (Google Resumable Upload) a
`BardFrontendService/StreamGenerate` (streaming response). Žádný S3, žádný SSE text/event-stream.

Model identifikátor není přímo viditelný v HAR (zakódován v opaque session tokenu). Z response
jsou viditelné nástroje (`data_analysis_tool`) typické pro Gemini 2.5 Pro.

---

## 2. Auth mechanism

- **Session cookies** — Google auth (standardní Google session, žádný API klíč)
- **`X-Same-Domain: 1`** header — povinný anti-CSRF header pro všechny write requesty
- **`at=` CSRF token** — přítomen v těle batchexecute volání i StreamGenerate
  (formát: `AJrheLWOxfBpIu1a1WdTKI1VYLh_:1777190975233`)
  Zdroj: embedded v HTML stránce při načtení gemini.google.com
- **`f.sid`** — session ID z URL (`f.sid=2378320110591144719`)

Žádný Bearer token, žádný API klíč v headers. Čistě cookie + CSRF.

---

## 3. Upload sequence (Google Resumable Upload)

Dvoustupňový upload přes Google's vlastní Scotty upload infrastrukturu.

### Krok 1 — Upload initiation

```
POST https://push.clients6.google.com/upload/
```

**Headers:**
```
x-goog-upload-protocol: resumable
x-goog-upload-command: start
x-goog-upload-header-content-length: <file_size_bytes>
content-type: application/x-www-form-urlencoded;charset=UTF-8
```

**Body:** `File name: <filename>` (plain text, 20 bytes)

**Response (200):**
```
x-goog-upload-url: https://push.clients6.google.com/upload/?upload_id=<upload_id>&upload_protocol=resumable
x-goog-upload-status: active
x-goog-upload-chunk-granularity: 262144
x-guploader-uploadid: <upload_id>
```

### Krok 2 — File upload (raw bytes)

```
POST https://push.clients6.google.com/upload/?upload_id=<upload_id>&upload_protocol=resumable
```

**Body:** raw binary souboru (3059 bytes pro card.html)

**Response (200):**
```
x-goog-upload-status: final
```

**Response body (plain text):**
```
/contrib_service/ttl_1d/<token>
```

→ Tento path je **file reference** pro StreamGenerate volání.
  Formát: `/contrib_service/ttl_1d/<google-internal-token>`

### Mapování upload_id → contrib_service path

Upload response body přímo obsahuje `/contrib_service/ttl_1d/...` path.
Orchestrátor musí přečíst response body kroku 2 a použít ho v StreamGenerate.

---

## 4. Ask call structure (StreamGenerate)

```
POST https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate
  ?bl=boq_assistant-bard-web-server_<build_date>
  &f.sid=<session_id>
  &hl=cs
  &_reqid=<random_int>
  &rt=c
```

**Headers:**
```
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-Same-Domain: 1
Referer: https://gemini.google.com/
```

**Body** (`f.req` URL-encoded JSON + `at=` CSRF):
```
f.req=<url_encoded_json>&at=<csrf_token>&
```

**`f.req` decoded struktura:**
```json
[
  null,
  "[[\"<prompt_text>\",0,null,[[[\"/contrib_service/ttl_1d/<token>\",16,null,\"text/html\"],\"<filename>\",null,null,null,null,null,null,[0]]],null,null,0],[\"<lang_code>\"],[\"<session_state_1>\",\"<session_state_2>\",\"<session_state_3>\",null,...],\"!<opaque_session_blob>\"]"
]
```

**Klíčová pole:**
- `<prompt_text>` — text promptu (URL-decoded: `Shrň první odstavec`)
- `/contrib_service/ttl_1d/<token>` — file reference z upload kroku 2
- `16` — pravděpodobně content type enum (text/html)
- `text/html` — MIME type souboru
- `<filename>` — `card.html`
- `[0]` — role/typ přílohy (0 = user-uploaded file)
- `[\"cs\"]` — language (BCP-47 code, `cs` = Czech)
- `!<opaque_blob>` — session token s modelem a state (neparsovatelný bez klíče)

---

## 5. Response format

**Content-Type:** `application/json; charset=utf-8` (ne SSE!)
**Content-Encoding:** gzip
**Size:** 656 KB (pro krátký prompt + card.html)

**Formát:** chunked streaming JSON, každý chunk na nové řádce, odd format Google's BardFrontendService:

```
)]}'

<hex_size>
[["wrb.fr",null,"<url_encoded_json_payload>"]]
<hex_size>
[["wrb.fr",null,"<url_encoded_json_payload>"]]
...
```

Příklady zachycených chunk payloadů:
- `[null,[null,"r_<response_id>"],{"18":"r_<response_id>","21":["<token>"],"44":false}]`
  → inicializace odpovědi, response ID
- `[null,["c_<conv_id>","r_<response_id>"],{"7":[null,["data_analysis_tool",[null,null,"Analýza",null,null,"Analyzuju data"],1,[9]],...]}]`
  → tool use (Gemini spouští data_analysis_tool)

**Konverzační IDs:**
- `c_3fc6e3f6ae29b61c` — conversation ID (použit v subsequent calls)
- `r_9f6f284955e4853c` — response ID

---

## 6. Background calls (NOT part of ask flow)

Tyto volání probíhají paralelně s ask flow — orchestrátor je nepotřebuje replikovat:

| rpcids | Co dělá |
|---|---|
| `ESY5D` | Session heartbeat (`bard_activity_enabled` check) |
| `L5adhe` | UI state (popup visibility, model badge management) |
| `qpEbW` | UI polling `[[[1,4],[6,6],[1,15]]]` — neznámá sémantika |
| `aPya6c` | Keep-alive (prázdné tělo) |
| `PCck7e` | Conversation ID registration po dokončení StreamGenerate |

---

## 7. Implementation notes for orchestrator

**Nový helper potřeba:** `geminiDirectAsk(prompt, fileBuffer, fileName, session)`

Kroky:
1. Načíst `at=` CSRF token z HTML stránky gemini.google.com (embedded v `<script>` tagu jako `SNlM0e`)
2. Načíst `f.sid` (z Google-provided JS nebo WIZ_global_data)
3. Upload — Step 1: POST `/upload/` s `x-goog-upload-command: start`
4. Upload — Step 2: POST `/upload/?upload_id=...` s raw bytes, přečíst response body → `contrib_service_path`
5. StreamGenerate — sestavit `f.req` s `contrib_service_path`, poslat POST
6. Parsovat chunked JSON response

**Extrakce `at=` tokenu:**
```
Regex: /"SNlM0e":"([^"]+)"/
```
Z HTML gemini.google.com při initial load.

**`bl` parametr** (build label v URL):
```
Regex: /"cfb2h":"(boq_assistant-bard-web-server_[^"]+)"/
```
Nebo pevně nastavit a aktualizovat dle potřeby — hodnota se mění s deployi.

**CORS/cookie požadavky:** Session cookies musí být odeslány. Orchestrátor musí mít
přístup k Google session cookies — stejně jako pro Perplexity.

**Response parsing:** Chunked JSON vyžaduje custom parser:
```
Přeskočit první řádek `)]}'`
Pro každý chunk: přečíst hex_size, přečíst data, JSON.parse(data)
Extrahovat text z příslušných wrb.fr payloadů
```

---

## 8. Open questions

- **Model identifikátor:** Není viditelný v HAR — zakódován v opaque session blob `!Y2ClY...`.
  Robinson by měl potvrdit který model vybral v UI pro přesnější dokumentaci.
  Z response jsou viditelné `data_analysis_tool` (→ pravděpodobně Gemini 2.5 Pro).
- **Interní model IDs:** L5adhe capture zachytil `disabled_new_model_badge_mode_ids`:
  `61530e79959ab139`, `5bf011840784117a`, `fbb127bbb056c959` — neznámá sémantika.
- **`at=` token lifetime:** Nezjištěno. Pravděpodobně platný po dobu session (hodiny).
  Orchestrátor by měl refreshovat při 401/403.
- **`f.sid` zdroj:** Pravděpodobně z `WIZ_global_data.FdrFJe` nebo podobného pole v HTML.
  Nutno ověřit při implementaci.
- **`bl` parametr stabilita:** Build label `boq_assistant-bard-web-server_20260422.13_p0`
  se mění s každým Gemini deploym. Orchestrátor ho musí číst dynamicky, ne hardcoded.
- **Thinking verification:** Zda byl thinking skutečně aktivní nezjistíme ze samotného
  HAR — model selection je v opaque blob. Verifikovat response kvalitou.
- **Grok direct:** Capture C selhal (Grok 403 při vytváření konverzace). Grok direct
  protokol zůstává nedokumentován — viz sekce níže.

---

## 9. Poznámka k Grok direct

Capture C (grok.com) nebyl dokončen. Grok vracel HTTP 403 na `/new` endpoint
(conversation creation) i přes úspěšný file upload (200) a platnou session.
Chybová zpráva UI: "Grok nedokázal dokončit odpověď. Zkuste to prosím později nebo
použijte jiný model." Diagnóza: server-side problém Groku (přetížení nebo model nedostupný),
nesouvisí s DevTools/cache nastavením. Rate-limit endpoint vracel 200.

Grok direct protokol bude vyžadovat separátní capture v jiné session.
Soubor `grok-direct-protocol.md` zatím nevznikne — viz Phase 2.
