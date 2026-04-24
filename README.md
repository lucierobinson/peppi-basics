# Peppi Basics

**Studijní HTML karty pro culinary education** — zaměřené na amatérské i aspirující profesionální pekaře, primárně Josefinu (20, pastry chef, fine dining zkušenosti).

Tento repozitář je součástí projektu Peppi. Produkční Next.js aplikace žije v [`lucierobinson/peppi`](https://github.com/lucierobinson/peppi) — ten je privátní. Peppi Basics je **veřejný**, protože studijní materiál je sdílitelný a review automation vyžaduje veřejný repo pro GitHub connector.

---

## Co je Peppi Basics

Peppi Basics generuje detailní „tech karty" pro pečicí techniky a produkty. Každá karta je samostatný HTML dokument s:

- Vědeckým základem (chemie, fyzika) konkrétní techniky
- Zlatým standardem receptu ozdrojovaného z profesionálních knih
- Mise en place, časovou osou, teplotními checkpointy
- Troubleshooting maticí (co se pokazilo → proč → jak opravit)
- Variantami atribuovanými ke konkrétním zdrojům (Michalak, Lebovitz, ATK, …)
- „Pravidly a mýty" sekcí
- Tréninkový protokol pro progresivní A/B testování

Karty jsou primárně pro Josefinu — používá je při přípravě na soutěže, při tréninku v Mora, a pro vlastní vzdělávání.

---

## Pipeline F0–F4

Každá karta vzniká v multi-stage AI pipeline:

```
F0 Hydrator    → načte zdrojové informace z T1/T2 knih, ověří metadata
F1 Researcher  → sestaví ResearchBrief (golden standard recept, věda, troubleshooting)
F2 Writer      → napíše Writer Draft (strukturovaný JSON + narativní bloky)
F3 Auditor     → audituje konzistenci, citace, rubric compliance
F4 Formatter   → vygeneruje finální HTML kartu
```

Aktuální verze promptů jsou v `prompts/`. Archivní verze v `prompts/archive/`.

---

## Review workflow

Každá nová verze karty prochází **7-člennou AI review panelem**.
Viz [CONTRIBUTING.md](CONTRIBUTING.md) pro detailní návod a
[docs/api-research/production-panel-spec.md](docs/api-research/production-panel-spec.md)
pro technický popis REST API pipeline.

Stručně:
1. Claude Code vygeneruje kartu a zabalí ji do `review-packages/<product>-v<version>/`
2. Claude Code spustí 6 REST reviewerů paralelně přes `POST /rest/sse/perplexity_ask`
3. Robinson copy-pastuje prompt do gemini.google.com pro 7. reviewera (Gemini direct)
4. Claude Code vytvoří GitHub Issues s výsledky, Claude v nové session ztriaguje

**Review panel (7 reviewerů, finální — D57):**

| # | Reviewer | Path |
|---|----------|------|
| 1 | Claude Sonnet 4.6 | REST (`claude46sonnet`) |
| 2 | GPT-5.4 | REST (`gpt54`) |
| 3 | Gemini 3.1 Pro Thinking | REST (`gemini31pro_high`) |
| 4 | Nemotron 3 Super | REST (`nv_nemotron_3_super`) |
| 5 | Sonar Deep Research | REST (`pplx_alpha`) |
| 6 | Grok 4.1 | REST (`grok`) |
| 7 | Gemini 3.1 Pro | gemini.google.com (copy-paste) |

**Fallback:** Pokud REST API selže, použij Comet Skills z `comet/shortcuts-v2/`.
Viz `comet/README.md` a GitHub Issue #1.

---

## Peppi Basics pravidla

Tato pravidla jsou non-negotiable a vycházejí z architecture tracker D-decisions.

### Pravidlo D54 — Peppi DB recepty NESMÍ být zdrojem pro Basics karty

Recepty v produkční Peppi databázi (89 receptů k 2026-04-20) jsou Josefininy osobní recepty z praxe. **Nesmí být nikdy použity** jako zlatý standard ani jako ověřovací zdroj pro Basics karty — jde o jiný účel (provoz restaurace vs. edukace). Contamination risk: karta by pak „ověřovala" recept Josefininou vlastní praxí, nikoliv nezávislým zdrojem.

### Zdrojová hierarchie

**T1 zdroje** — nejvyšší autorita, ověřené akademické/institucionální:
- *On Food and Cooking* (McGee)
- *The Food Lab* (López-Alt)
- *Modernist Cuisine* (Myhrvold)
- *Baking Science & Technology* (Pyler & Gorton)

**T2 zdroje** — profesionální culinary knihy, každá s přidělenou rolí:

| Zdroj | Role | Poznámka |
|-------|------|----------|
| CIA Baking & Pastry 3rd ed. (2013) | `recipe` — GS kandidát | Primární T2 pro craquelin |
| FCI Classic Pastry Arts (2009) | `recipe` — GS kandidát | Institucionální baseline |
| Rinsky Pastry Chef's Companion (2008) | `reference` — NIKDY GS | Glosář, flavor matrix, troubleshooting |

**T3–T5 zdroje** — viz architecture tracker D-decisions pro kompletní hierarchii.

---

## Struktura repozitáře

```
peppi-basics/
├── prompts/           # F0-F4 prompt verze (zdroj pravdy)
├── cards/             # finální HTML karty po produkci
├── review-packages/   # review session packaged (1 složka = 1 session)
│   └── _template/     # šablona pro novou review session
├── docs/              # trackers, handovers, architecture decisions
├── comet/             # Comet Shortcuts texty (k nakopírování do Comet UI)
├── scripts/           # helper skripty pro Claude Code sessions
└── .github/           # issue templates, labels
```

---

## Vztah k `peppi` repu

`peppi` (privátní) = produkční Next.js aplikace pro správu Josefiných receptů.  
`peppi-basics` (tento repo, veřejný) = edukační doména — studijní karty, pipeline, review automation.

Karty z tohoto repa budou v budoucnu integrovány do Peppi aplikace jako čtecí sekce, ale architektura a pipeline žijí zde.
