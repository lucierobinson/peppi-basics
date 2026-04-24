# Contributing — Peppi Basics Review Pipeline

Tento dokument popisuje, jak spustit review session pro novou verzi karty.

---

## Přehled workflow

```
Step 1 (Claude Code)  → karta vygenerována, zabalena do review-packages/
Step 2 (Claude Code)  → pre-flight check (login + /rest/models/config) → 6 REST reviewerů paralelně
Step 3 (Robinson)     → copy-paste prompt do gemini.google.com → 7. reviewer (Gemini direct)
Step 4 (Claude Code)  → vytvoří 6 GitHub Issues automaticky; Robinson přidá 7. ručně
Step 5 (Claude.ai)    → triage, patch prompt pro další verzi
```

> **Primární path:** REST API (`POST /rest/sse/perplexity_ask`). Viz
> [`docs/api-research/production-panel-spec.md`](docs/api-research/production-panel-spec.md).
>
> **Fallback:** Pokud REST API selže — Comet Skills z `comet/shortcuts-v2/`.
> Viz [`comet/README.md`](comet/README.md) a GitHub Issue #1.

---

## Step 1 — Generování karty (Claude Code session)

Claude Code provede F0→F4 chain pro nový produkt. Po dokončení:

```bash
# Claude Code spustí automaticky:
./scripts/create-review-package.sh <product-slug> <version>
# Např.:
./scripts/create-review-package.sh croissant v2_0_5
```

Skript vytvoří `review-packages/croissant-v2_0_5/` na základě `_template/`, commitne a pushne.

Poté Claude Code oznámí Robinsonovi: **"Balíček připraven. V Comet napiš: `peppi-panel croissant-v2_0_5`"**

---

## Step 2 — Spuštění review panelu (Claude Code, ~40 s)

Claude Code automaticky:
1. Provede pre-flight check: login + `/rest/models/config` verifikace identifierů
2. Spustí 6 REST reviewerů paralelně (`Promise.all`)
3. Počká na dokončení všech streamů (dominuje Sonar DR, ~40 s)
4. Vytvoří 6 GitHub Issues automaticky

Poté oznámí Robinsonovi: **"6/7 hotovo. Spusť Gemini direct: [prompt]"**

---

## Step 3 — Sbírání výsledků

**6 REST reviewerů:** GitHub Issues vytvoří Claude Code automaticky.

**7. reviewer (Gemini direct):** Robinson ručně:
1. Zkopíruje prompt z Claude Code výstupu → vloží do gemini.google.com
2. Zkopíruje odpověď (mezi `---REVIEW-SUBMISSION-START---` a `---REVIEW-SUBMISSION-END---`)
3. Vytvoří Issue v `lucierobinson/peppi-basics`:
   - Title: `[Review] <product>-v<version> — Gemini 3.1 Pro (direct)`
   - Body: zkopírovaný submission text
   - Labels: `review-submission`

---

## Step 4 — Triage (Claude.ai session)

Robinson otevře novou Claude.ai session a řekne: **"hotovi"** (nebo "triage croissant-v2_0_5").

Claude:
1. Načte přes GitHub API všechny otevřené Issues s labelem `review-submission` pro daný slug
2. Provede triage:
   - **Tier 1** (unanimous = 7/7): okamžitě do patch promptu
   - **Tier 2** (majorita = 4–6/7): diskuse s Robinsonem, pak patch
   - **Tier 3** (outlier = 1–3/7): zaznamená, ale neblokuje
3. Navrhne patch prompt pro příští verzi F2/F3/F4

---

## Panel reviewerů (finální, D57, nezpochybňovat)

| # | Reviewer | Path | Identifier |
|---|----------|------|------------|
| 1 | Claude Sonnet 4.6 | REST (automatický) | `claude46sonnet` |
| 2 | GPT-5.4 | REST (automatický) | `gpt54` |
| 3 | Gemini 3.1 Pro Thinking | REST (automatický) | `gemini31pro_high` |
| 4 | Nemotron 3 Super | REST (automatický) | `nv_nemotron_3_super` |
| 5 | Sonar Deep Research | REST (automatický) | `pplx_alpha` |
| 6 | Grok 4.1 | REST (automatický) | `grok` |
| 7 | Gemini 3.1 Pro | gemini.google.com (ruční) | — |

> ⚠️ **Nepoužívej `claude2`** — routes na Grok 4.1, ne na Claude (bug zjištěn 2026-04-24).
> Správný identifier pro Claude Sonnet 4.6 je `claude46sonnet`.

**Fallback (pokud REST API selže):** Comet Skills z `comet/shortcuts-v2/` — návod v [`comet/README.md`](comet/README.md).

---

## Ruční review (fallback — pokud REST API selže)

Pokud REST API nefunguje (viz `comet/README.md`), spusť každý Comet skill ručně
nebo paste reviewer prompt přímo do daného AI tabu. Extrahuj output mezi markery
a vlož ho do GitHub Issue ručně s tímto formátem v titulu:

```
[Review] <product>-v<version> — <Reviewer Name>
```

---

## Přidání nového produktu

1. Claude Code spustí F0→F4 chain pro nový produkt
2. Přidá label do `.github/labels.yml`: `product:<new-product>`
3. Spustí: `gh label create "product:<new-product>" --color c5def5 --repo lucierobinson/peppi-basics`
4. Spustí: `./scripts/create-review-package.sh <new-product> v1_0_0`
5. Zbytek je standardní workflow

---

## Verzování

Verze mají formát `v<major>_<minor>_<patch>` (podtržítka místo teček kvůli slug-safe použití v názvech složek a GitHub Labels).

Příklady: `v2_0_5`, `v1_0_0`, `v3_1_2`
