# Peppi Basics v2.0 — Constitution

**Version:** 1.1 (draft)
**Date:** 2026-04-18
**Previous version:** 1.0 (2026-04-18)
**Author:** Robinson + Claude (Opus)
**Status:** Awaiting Robinson's approval

---

## Changelog v1.0 → v1.1

- Sekce 2.2 — přidáno pravidlo "žádný glossary term bez verifikovatelné provenience"
- Sekce 3.1 — Figoni přidán jako T2
- Sekce 3.2 — **nová**: Source coverage matrix per Basics block
- Sekce 3.3 — **nová**: Glossary strategy (Rinsky primary, supplementary options)
- Sekce 3.4 — **nová**: Research-library současný stav + mezery
- Sekce 4.3 — aktualizace aktuálního stavu
- Sekce 7.2 — **nová**: Glossary extraction milestone před F0
- Appendix A — doplněny nové pojmy

---

## 0. Účel tohoto dokumentu

Constitution je **stabilní referenční dokument**, který definuje principy Peppi Basics v2.0 chainu a workflow mezi Robinsonem a Claudem. Každá nová session Claude začíná přečtením Constitution a Code inventory — nic jiného nepotřebuje.

Constitution **nenahrazuje** technické prompty (F0–F5) ani tracker (`v2-architecture-tracker.md`). Zachycuje **principy nad nimi**: proč to děláme, pro koho, za jakých pravidel, a kdo o čem rozhoduje.

**Immutable rule:** Constitution se mění jen po explicitní diskusi a Robinsonově schválení. Nikdy silently.

---

## 1. Mise

Vytvořit **neprůstřelně přesné technické karty pečiva** pro Josefinu Robinson, aby si v domácím prostředí osvojila profesionální návyky a nezískala chyby, které by musela později odnaučovat při vstupu do profi patiserie (Le Cordon Bleu nebo ekvivalent).

**Primární uživatel:** Josefina Robinson (20 let, bez maturita / výučního listu, domácí kuchyně s Mora VTPS 545 BX + KitchenAid stand mixer, bez profesní zkušenosti, cíl Le Cordon Bleu).

**Sekundární benefit:** Systém je použitelný pro kohokoli dalšího (Anna, budoucí uživatelé Peppi), ale designed **primárně pro Josefinu a její reality**.

---

## 2. Safety red lines

Tyto hranice se **nikdy neporušují**. Jsou nad všemi ostatními rozhodnutími.

### 2.1 Přesnost čísel

- **Žádné teploty, časy, gramáže, procenta** v kartě bez explicitního T1 nebo T2 zdroje.
- T3 zdroje (blogs, recipe databases) jsou **pouze podpůrné**, nesmí být citovány jako autoritativní pro čísla.
- Konverze imperiálních jednotek (oz, cups, °F) na metrické je **povinná**, nikdy nezobrazovat imperiální.
- Pokud zdroj čísla nelze dohledat → entry **nesmí** v kartě být. Žádné "běžná praxe", "obvykle cca", ani interpolace.

### 2.2 Zdrojová hygiena

- **Peppi DB recepty NIKDY jako zdroj** pro Basics karty (D54).
- **F0 Hydrator** retrievuje pouze: glossary s per-term T1/T2 provenience + strukturální precedenty ze schválených Basics karet. Nic jiného.
- Každá externí URL použitá při F1 runu **musí mít explicitní fetch status** v ResearchBrief. Unfetched URL nesmí být citovaná pro numbers (P1 hotfix po croissant pilotu).
- **Žádný glossary term bez verifikovatelné provenience** (source book, page ref, tier). Glossary bez provenience se NEPOUŽÍVÁ.

### 2.3 Žádné halucinace

- Pokud Claude (v jakékoli fázi) neví, **říká to explicitně**. Falešná jistota je nebezpečnější než přiznaná neznalost.
- **Weekend Bakery precedent** (croissant F1 pilot): denied fetch → 5 míst halucinace čísel. Tohle se nikdy neopakuje.

### 2.4 Home adaptation boundary

- Profi standard a home adaptation **musí být odděleny**. Karta jasně značí, co je profi praxe a co je realistický home substitute.
- Realistický strop home výsledku je **80–90 % Basic** (D40). Karta tohle nikdy neskrývá.

### 2.5 Nejistotu vždy flagovat

- Když T1/T2 zdroje nesouhlasí → karta flagne "zdroje se liší" + ukáže obě varianty + vysvětlí proč.
- Když T1 zdroj chybí (např. croissant nemá T1 rubric) → explicitně řečeno, s degradací na T3 (WorldSkills, CAP Pâtissier) jako transparent fallback.
- Skrytá nejistota = failure. Explicitní nejistota = safety.

---

## 3. Zdroje

### 3.1 Hierarchie (T1–T5)

| Tier | Definice | Příklady |
|---|---|---|
| **T1** | Kompetenční rámce, oficiální kurikula, ISO standardy | CAP Pâtissier, WorldSkills WSOS, SkillsUSA, Ohio DOE PDF |
| **T2** | Uznávané odborné učebnice (školské), peer-validated | CIA B&P 3rd Ed., FCI Classic Pastry Arts, Rinsky, **Figoni**, Le Cordon Bleu kurikulum |
| **T3** | Profesionální blogs / recipe databases / chef webové platformy | King Arthur Baking, Serious Eats, Weekend Bakery |
| **T4** | Odborné časopisy, akademické papers | PubMed food science, Journal of Culinary Science |
| **T5** | Chef-autoři (individuální autority) | Christophe Felder, Pierre Hermé, Dominique Ansel |

**Použití:**

- **Golden Standard** pro každou kartu: T1 nebo T2.
- **Alternative sources**: libovolný tier, ale vždy fetch-verified.
- **T2 vs T2 konflikt**: novější edice + domain authority > starší. Claude **vždy dokumentuje resolution path** v review.
- **T5 only**: EDGE CASE. Karta flagne "pokrytí jen individuálním chef-autorem, běžná praxe se může lišit" (D46).
- **Per-term provenience**: každý fakt v kartě má identifikovatelný zdroj (book, page, tier).

### 3.2 Source coverage matrix per Basics block

Každý blok v Basics kartě má **preferovaný typ zdroje**. Tato matice je referenční, ne absolutní — každá karta musí zdroje citovat konkrétně.

| Blok karty | Co to je | Preferovaný zdroj |
|---|---|---|
| 1. Terminologie | CO to je, etymologie, origin | **Rinsky** (encyklopedie, 4 800+ termínů) |
| 2. Ingredience/gramáže | CO, kolik | **CIA B&P, FCI** (strukturované recepty s proporcemi) |
| 3. Postup | JAK, krok za krokem | **CIA B&P, FCI** + kompetenční rámce (T1) |
| 4. Věda / mechanismy | PROČ se to děje | **Figoni** *How Baking Works* + academic papers (T4) |
| 5. Technika | Ruční dovednost, hmatové indikátory | Kompetenční rámce (T1) + video demos |
| 6. Troubleshooting | Co se může pokazit, proč | **Figoni** + Rinsky + chef zkušenost |
| 7. Kontext / varianty | Kde v tradici, regional differences | Rinsky + T5 chef-autoři |
| 8. Tasting / senzorika | Jak má vypadat, vonět, chutnat | **Figoni** (sensory properties) + T5 chef-autoři |

**Pravidlo:** Pokud blok nemůže být pokryt preferovaným zdrojem, Claude v ResearchBrief **explicitně flagne substituci** a vysvětlí proč.

### 3.3 Glossary strategy

F0 Hydrator retrievuje **glossary terms** pro kontext při generování karet. Glossary je klíčový infrastrukturní resource — pokud je nespolehlivý, celý chain je infected.

**Primary glossary source:** **Rinsky, *The Pastry Chef's Companion* (2008, Wiley, T2)**

- 4 800+ termínů a definic z celého světa
- Každý term má page reference v knize
- Author Glenn Rinsky: CEC, CEPC, CCE, CIA graduate, Executive Chef-Instructor
- Publisher Wiley: T2 academic publisher
- CIA Conrad N. Hilton Library recommended resource

**Supplementary sources (optional, per-term):**

- CIA B&P 3rd Ed. indexy (americké standardy)
- Figoni indexy (baking science terminology)
- Felder *Pâtisserie!* (francouzské termíny, T5 ale komplementární)
- Le Cordon Bleu materials (pokud dostupné)

**Per-term metadata:**
```
{
  "term": "...",
  "definition": "...",
  "source_book": "Rinsky 2008" | "CIA B&P 3rd Ed." | "Figoni 2nd Ed.",
  "page_ref": "p.234",
  "tier": "T2"
}
```

**Glossary terms bez provenience NESMÍ být v DB** (safety red line 2.2).

**Existující "606 glossary terms"** (neznámá provenance): archivovat, nepoužívat v F0 Hydrator.

### 3.4 Research-library současný stav

**T1 — Kompetenční rámce:**
- ✅ CAP Pâtissier
- ✅ WorldSkills WSOS
- ✅ SkillsUSA
- ✅ Ohio DOE PDF

**T2 — Školské učebnice:**
- ✅ CIA *Baking & Pastry* 3rd Ed. (2013)
- ✅ FCI *Classic Pastry Arts* (2009)
- ✅ Rinsky *Pastry Chef's Companion* (2008)
- ✅ **Figoni *How Baking Works* 2nd Ed. (2010)** ← baking science foundation

**T3–T5:**
- ✅ King Arthur Baking (blog, T3)
- ✅ 9 PubMed academic papers (T4)
- ⚠️ Felder — zmíněn v memory, fyzická dostupnost nepotvrzena

**Mezery (prioritizováno):**

1. **Ferrandi Paris *Pâtisserie*** — druhá priorita, posílí francouzskou tradici pro LCB alignment. T2. Nekritické.
2. **Le Cordon Bleu kurikulum** — ideal pro LCB alignment, ale většinou ne veřejně dostupné. Odložit.
3. **Christophe Felder *Pâtisserie!*** — potvrdit fyzickou přítomnost v library. T5 reference.
4. **Migoya *The Elements of Dessert*** — pro Superior level. Odložit na později (Basic+Intermediate nepotřebují).

**Verdikt k 2026-04-18:** Research-library má kompletní T2 foundation pro Basic + Intermediate curricular level. Superior level vyžaduje akvizici Migoya. LCB alignment vyžaduje Ferrandi (doporučeno, nekritické).

---

## 4. Pilot vs. produkce

### 4.1 Dva režimy

**Pilot režim** (aktuální stav):
- Účel: validace chain promptů
- Každá fáze prochází manuálním reviewem
- Archivováno v `peppi/tests/YYYY-MM-DD_pilot-{name}-v{N}/`
- Hlavní výstup = učení o promptech
- Karta = byproduct
- Drahý workflow

**Produkční režim** (cíl):
- Účel: výroba karet pro Josefinu
- Minimal human intervention
- Karta uložena přímo do Peppi DB (`basics` tabulka)
- Archivováno pouze F5 Validator report (PASS/FAIL)
- Review jen při F5 FAIL
- Levný workflow

### 4.2 Production gate — kritéria přechodu pilot → produkce

Přechod se provede **jen když všech 5 kritérií splněno:**

1. Všech 6 fází (F0, F1, F2, F3, F4, F5) ve stable verzi (žádné `v0.X`, žádné `-beta`).
2. **≥ 8 pilotů** s různou komplexitou (single + composite, Basic + Intermediate + Superior curricular level) — všechny SHIPS nebo SHIPS WITH PATCHES.
3. **Žádný z posledních 5 pilotů nevykázal red-line violation** (sekce 2).
4. F5 Validator (deterministický) má false-positive rate < 5 % a false-negative rate < 1 % (měřeno na pilot corpusu).
5. Multi-AI review panel (alespoň 3 reviewers z: Gemini, Sonnet, Nemotron, GPT) na posledních 3 pilotech vysloví "production ready" verdikt.

**Dokud všech 5 kritérií není splněno, jsme v pilot režimu.** Žádné "zkusíme to produkčně, uvidíme". To porušuje safety red lines.

### 4.3 Aktuální stav (k 2026-04-18)

- **Fáze hotové:** F1 (v2.2.1), F2 (v2.0.3)
- **Fáze neimplementované:** F0 Hydrator, F3 Auditor, F4 Formatter, F5 Validator
- **Piloty provedené:** 2 (choux-v2 SHIPS WITH PATCHES, croissant-v2 teprve F1 hotový)
- **Research library:** T2 foundation kompletní (CIA B&P + FCI + Rinsky + Figoni)
- **Glossary:** ještě neextrahovaný z Rinsky, existující "606" archivovaný
- **Odhadovaná pozice:** ~20 % cesty do produkce
- **Realistický odhad dokončení:** 3–6 měsíců pilot režimu

---

## 5. Role a decision delegation

### 5.1 Tři role

**Robinson** (product owner & escalation authority)
- Vlastní mise a red lines
- Schvaluje Constitution změny
- Schvaluje patches promptů před mergem
- Eskalační autorita pro red-line konflikty

**Claude (Opus)** (architect & coordinator)
- Nosí kontext
- Designs prompty a migration
- Triaguje review cycles
- Generuje Code prompty
- Delegates execution na Code

**Claude (Code)** (implementor)
- Provádí soubory, commity, runy
- Reportuje zpátky Opusovi
- Žádná architektura, žádná interpretace

### 5.2 Decision delegation

**Opus rozhoduje sám o:**
- Struktuře outputů (formáty, pojmenování, složky) v rámci convention
- Triagi review feedbacku (co patchnout, co ignorovat, co deferrovat)
- Pořadí a obsahu Code promptů
- Naming conventions v rámci principů Constitution
- Drobných refactorech (< 5 souborů)

**Opus eskaluje Robinsonovi:**
- Cokoli, co se dotýká red lines (sekce 2)
- Cokoli, co mění Constitution
- Cokoli nad decision budget milníku (sekce 6.3)
- Patches promptů, které mění user-facing content karty
- Nerozhodnutelné T2 vs T2 konflikty

**Opus NIKDY nerozhoduje o:**
- Safety red lines (jsou dané)
- Production gate criteria (jsou dané)
- Mission (je daná)

### 5.3 Únava a decision freeze

Pokud Robinson:
- Napíše "jsem unavený" / "moc složité" / "nevím"
- Nebo **neodpoví 24 hodin na otevřenou otázku**

→ Opus **nesmí** přidat další otázky. Místo toho:
1. Zvolí default podle Constitution a předchozího kontextu
2. Pokračuje v exekuci
3. Informuje Robinsona post-hoc: *"Rozhodl jsem X, důvod Y, rollback commit Z, povolená změna pokud nesouhlasíš."*

Tento mechanismus chrání Robinsona před zahlcením.

---

## 6. Workflow

### 6.1 Nová session — start

Každá nová Claude session začíná:

1. **Claude čte Constitution** (tento dokument)
2. **Claude běží Code inventory** (standardní prompt pro repo sweep)
3. **Claude identifikuje aktuální milník** z trackeru nebo Robinsonova zadání
4. **Claude pokračuje bez otázek na základní věci**

Handover dokumenty **NEJSOU vstupem** do nové session. Jsou volitelný referenční materiál.

### 6.2 Milníky

Práce se dělí na **milníky**. Každý milník má:

- **Cíl** (jeden, jasný, měřitelný)
- **Definition of done** (co znamená "hotové")
- **Decision budget** (max. escalations na Robinsona, default 3)
- **Out-of-scope** (co se v tomto milníku NEDĚLÁ)

Milník schvaluje Robinson **jednou na začátku**. Pak Opus jede.

### 6.3 Decision budget

Každý milník má budget (default 3) na decision escalations k Robinsonovi. Pokud Opus budget vyčerpá:

- **STOP.** Opus oznámí, že budget vyčerpán.
- Robinson rozhodne: (a) navýšit budget, (b) zúžit scope, (c) přehodnotit milník.
- Žádné automatické pokračování.

Tohle chrání Robinsona a nutí Opuse uvažovat o alternativách před eskalací.

### 6.4 Pilot workflow (standardní)

```
1. Robinson: "pilot X"
2. Opus:
   a. Volí latest verze promptů z convention
   b. Vytvoří pilot folder struktury
   c. Generuje F1 Code prompt (jako soubor)
3. Robinson spustí v Code
4. Code vrátí output → commit + push
5. Opus analyzuje F1 output, triaguje, případně patchuje
6. Pokud F1 PASS → opakuje krok 2c–5 pro F2, F3, F4, F5
7. Pokud kterákoli fáze FAIL → Opus navrhne patch, eskaluje na Robinsona
8. Po F5 PASS → karta generovaná, pilot SHIPS
```

**Robinsonova interakce**: krok 1 (zadání) + případné schvalování patchů. Nic víc.

### 6.5 Review cycle workflow

Když vznikne nová prompt verze, prochází review cycle:

```
1. Opus iniciuje review skeleton (v konverzaci, ne jako soubor)
2. Robinson rozešle reviewerům (Gemini, Sonnet, Nemotron, GPT — žádný Grok, D49)
3. Robinson sesbírá odpovědi, pošle zpět
4. Opus triaguje: konsensus vs outliers, navrhuje patches
5. Robinson + Opus se dohodnou na finálních patchích
6. Opus vytvoří finální review soubor přes present_files
7. Robinson uloží do repa podle convention
```

Review soubor je **immutable po committu**. Žádné úpravy ex post.

### 6.6 Prompt version naming

```
{phase}-v{major}_{minor}_{patch}.md
```

Příklady: `F1-v2_2_1.md`, `F2-v2_0_3.md`, `F3-v1_0_0.md`

Rules:
- `_` separator (filesystem-safe)
- Každá verze = nový soubor (immutability)
- "Latest" resolution: `ls | sort -V -r | head -1`
- Staré verze zůstávají v repu (archivace)

---

## 7. Storage a infrastructure milníky

### 7.1 Storage convention

Finální rozhodnutí o storage convention **TBD v migration milníku**. Tato Constitution definuje jen principy:

- Všechny Basics v2.0 artefakty jsou v `peppi/docs/basics-v2/` (s výjimkou pilotů, které zůstávají v `peppi/tests/`)
- Prompty, reviews, specs, implementation notes jsou separated do podsložek
- Changelogs: inline v promptu (ne separátní soubory)
- `v2-architecture-tracker.md` zůstává v `peppi/docs/` (top-level decision log)
- `pilot-runbook.md` zůstává v `peppi/` rootu (operations)
- Research library (`peppi/research-library/`) se nedotýká
- Skills (`.claude/skills/`) se nedotýká
- Forward-only: staré verze promptů nerekonstruujeme z git historie

Konkrétní struktura + migration proběhne jako samostatný milník.

### 7.2 Glossary extraction milestone (před F0 Hydrator)

**Blocker pro F0 Hydrator implementaci.** F0 nesmí být postaven na neverified glossary.

**Definition of done:**

1. Code extrahuje glossary termíny z Rinsky EPUB/PDF → strukturovaná DB (JSON nebo Neon table)
2. Každý term má: `term, definition, source_book, page_ref, tier`
3. Sanity check na 20 náhodných termínech (OCR kvalita, přesnost definic oproti Figoni/CIA)
4. Import do pgvector (target pro F0 Hydrator retrieval)
5. Existující "606 glossary terms" archivované (pokud fyzicky existují), ne-používané

**Supplementary extractions (optional):**

- Figoni glossary/index — posiluje coverage blok 4 (věda) a 6 (troubleshooting)
- CIA B&P index — posiluje coverage blok 2 (ingredience) a 3 (postup)

**Estimate:** 1–2 dny Code práce + půlden review.

---

## 8. Co Constitution nepokrývá

Constitution explicitně nezasahuje do:

- **Technických detailů promptů** (to jsou prompt soubory samy)
- **Decisions log** (to je `v2-architecture-tracker.md`)
- **Operational runbook** (to je `pilot-runbook.md`)
- **Peppi app architektury** mimo Basics v2.0 (Next.js, Drizzle, Neon, Vercel rozhodnutí — jiná oblast)
- **LR Upload, Peppi Ceny, ostatní projekty** — Constitution je specifická pro Basics v2.0

---

## 9. Změny Constitution

- Každá změna = nová verze (v1.0 → v1.1 → v2.0)
- Změnu iniciuje Opus návrhem, Robinson schvaluje
- Minor (v1.0 → v1.1): upřesnění, drobné dodatky (nezasahuje red lines)
- Major (v1.X → v2.0): změny red lines, mise, nebo role delegation
- Stará verze zůstává v repu jako archive

---

## 10. Podpisy

**Robinson** (product owner): _pending approval_
**Claude Opus** (architect, v této konverzaci 2026-04-18): _drafted v1.1_

---

## Appendix A: Pojmy

- **Basics karta** — technická karta pečiva, výstup Basics v2.0 chainu, primárně pro Josefinu
- **Chain** — 6-fázová posloupnost F0 → F1 → F2 → F3 → F4 → F5
- **F0 Hydrator** — context retrieval z glossary + precedents
- **F1 Researcher** — výzkum z profi zdrojů (T1–T5), output ResearchBrief
- **F2 Writer** — skladba karty, output WriterDraft
- **F3 Auditor** — kontrola konzistence a safety
- **F4 Formatter** — převod do JSON/AST pro renderer
- **F5 Validator** — deterministický validator (bez LLM)
- **Pilot** — test chain promptů na jednom produktu (sekce 4.1)
- **Production run** — výroba karty produkčně (sekce 4.1)
- **Red line** — neporušitelné pravidlo (sekce 2)
- **Decision budget** — max escalations na Robinsona per milník (sekce 6.3)
- **Review cycle** — multi-AI review nové prompt verze (sekce 6.5)
- **T1–T5** — 5-tier hierarchie zdrojů (sekce 3.1)
- **Per-term provenience** — každý fakt/term má identifikovatelný zdroj (book, page, tier)
- **Source coverage matrix** — mapping mezi bloky karty a preferovanými zdroji (sekce 3.2)

---

*Konec Constitution v1.1 draft.*
