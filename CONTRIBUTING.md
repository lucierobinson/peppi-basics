# Contributing — Peppi Basics Review Pipeline

Tento dokument popisuje, jak spustit review session pro novou verzi karty.

---

## Přehled workflow

```
Step 1 (Claude Code)  → karta vygenerována, zabalena do review-packages/
Step 2 (Robinson)     → /peppi-panel <slug> v Comet → 7 tabů odpáleno
Step 3 (Comet)        → reviews sesbírány, 7 GitHub Issues vytvořeno
Step 4 (Claude.ai)    → triage, patch prompt pro další verzi
```

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

Poté Claude Code oznámí Robinsonovi: **"Balíček připraven. V Comet napiš: `/peppi-panel croissant-v2_0_5`"**

---

## Step 2 — Spuštění review panelu (Robinson v Comet, ~30 sekund)

1. Otevři Comet
2. Do search bar napiš:
   ```
   /peppi-panel croissant-v2_0_5
   ```
3. Stiskni Enter
4. Comet otevře 7 reviewerských tabů a spustí je

**Robinson jde dělat něco jiného — 15–30 minut.**

---

## Step 3 — Collector (Comet Assistant automaticky)

Master shortcut `/peppi-panel` po dokončení všech 7 reviews:

1. Extrahuje text mezi `---REVIEW-SUBMISSION-START---` a `---REVIEW-SUBMISSION-END---`
2. Pro každého reviewera vytvoří GitHub Issue v `lucierobinson/peppi-basics`:
   - Title: `[Review] <product>-v<version> — <reviewer-name>`
   - Body: submission s metadaty (Reviewer, Date, Product, Version, Verdict)
   - Labels: `review-submission`, `product:<product>`, `verdict:<verdict>`
3. Pošle desktop notifikaci: *"Peppi Panel complete — N/7 reviews in"*

Robinson dostane notifikaci + GitHub mail.

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

## Panel reviewerů (finální, nezpochybňovat)

| # | Reviewer | Typ | Shortcut |
|---|----------|-----|----------|
| 1 | Gemini 3.1 Pro Thinking + Deep Research | Perplexity tab | `/peppi-review-gemini-perp` |
| 2 | Gemini 3.1 Pro | gemini.google.com direct | `/peppi-review-gemini-direct` |
| 3 | Claude Sonnet 4.6 | Perplexity tab | `/peppi-review-sonnet-perp` |
| 4 | GPT-5.4 | Perplexity tab | `/peppi-review-gpt-perp` |
| 5 | Nemotron 3 Super | Perplexity tab | `/peppi-review-nemotron-perp` |
| 6 | Sonar Deep Research | Perplexity tab | `/peppi-review-sonar-dr-perp` |
| 7 | Grok | grok.com direct | `/peppi-review-grok-direct` |

Všechny 7 shortcuts + master shortcut nainstaluj podle návodu v [`comet/README.md`](comet/README.md).

---

## Ruční review (fallback)

Pokud master shortcut nefunguje, spusť každý shortcut ručně nebo paste reviewer prompt přímo do daného AI tabu. Extrahuj output mezi markery a vlož ho do GitHub Issue ručně s tímto formátem v titulu:

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
