---
session: 5
phase: "2b → 3/4/6/7 (varianta C doporučena)"
recommended_variant: "C"
recommended_command: "jdi C croissant"
handoff_files:
  - docs/basics-v2/handovers/current.md
  - docs/basics-v2/prompts/F2-writer/current.md
handoff_notes: |
  Varianta C (pilot na croissant) potřebuje dva soubory výše. 
  Pokud uživatel zvolí Variantu A (P2/P3) nebo B (cold-read), stačí stejné dva soubory.
  Pokud by budoucí pilot potřeboval F1 Researcher current nebo F0 Hydrator current,
  přidat je do handoff_files v dalším handoveru (session #6+).
---

# F2 v2.0.4 — Kompletní handover pro Session #5

**Jeden soubor. Všechno uvnitř. Robinson uploaduje JEN tento soubor + rc baseline prompt.**

**Vytvořeno:** 2026-04-20, konec Session #4 (Fáze 2b kompletní).
**Pro:** Session #5 — Fáze 3 (P2 pre-delivery rozšíření) + Fáze 4 (P3 drobnosti) NEBO Fáze 6 (cold-read review rc).

---

## START OF SESSION CHECKLIST (prvních 5 minut)

1. Přečti tento soubor celý.
2. Potvrď, že rc baseline prompt `peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md` je uploadovaný (1552 řádků).
3. Zeptej se Robinsona, kterou fází začít (Fáze 3 P2 / Fáze 4 P3 / Fáze 6 cold-read). Doporučení níže v Části 5.

**Nic jiného neuploadovat. Všechno potřebné je v tomto dokumentu.**

**⚠️ BASELINE:** Session #5 pracuje proti **v2.0.4-rc** (1552 řádků), ne beta.

---

# ČÁST 1 — PROJEKTOVÝ KONTEXT

## Co je Peppi Basics v2.0

Multi-agent chain pro generování strukturovaných studijních karet z cukrářství pro Josefinu (Robinsonova dcera, 20, cukrářka s fine-dining zkušeností). Chain: F0 Hydrator → F1 Researcher → F2 Writer → Auditor (F3, zatím neexistuje) → F4 Formatter.

**F2 Writer** bere `ResearchBrief` (JSON z F1) a produkuje `WriterDraft` (JSON strukturovaný podle schema v promptu). Výstup F2 pak F4 renderuje do HTML karty.

## Kontext této práce

Dokončeny **Fáze 2a** (Session #3, 5 P1 patchů) a **Fáze 2b** (Session #4, 5 P1 patchů). Všechny P1 patche Session #1 triage aplikované.

**Session #4 output:** v2.0.4-rc (1418 → 1552 řádků, +134).
**Session #5 volba:**
- Fáze 3 (P2 pre-delivery rozšíření — nové checky, konsolidace na 18 max)
- Fáze 4 (P3 drobnosti — 8 clarification položek)
- Fáze 6 (cold-read review rc — nový external AI panel)

## Pravidla pro Robinson-Claude interakci

- Robinson je **fotografický producent** (NIKDY ne fotograf, podnikatel, OSVČ).
- Čeština jako primární jazyk, anglicky jen kód a schema.
- Minimalismus formátování (ne bullet points pokud nejsou nutné).
- Robinson řeší produkci, ne proces — "ukaž výsledek, nech si proces pro sebe".
- Diskuze před produkcí, deliverables přes `present_files`.
- Cascade consistency: každá změna → review všech dependent sections.
- Verification-first: ověř v souboru, ne blind trust recenzentů.
- Robinson nechce shromažďovat soubory — **všechno v jednom, pokud možné**.

---

# ČÁST 2 — D-DECISIONS (neměnit bez re-open)

## Session-level rozhodnutí

### Session #1 (nezměněno)

- **D-R1:** Scope COMPLETE (Fáze 0–7 bez token diet).
- **D-R2:** P0.1 Varianta A (`assembly` jako exempt step_type) — APLIKOVÁNO.
- **D-R3:** Fáze 0.5 review pass proběhl.
- **D-R4:** Token diet (Fáze 5) AŽ po Fázi 6 validaci.
- **D-R5:** Madeleines bucket (a) review až ve Fázi 7.
- **D-R6:** Pre-delivery cíl 18 checků (konsolidace v Fázi 3). **RELEVANTNÍ PRO SESSION #5** — aktuálně 14 post-delivery + 4 gate = 18 již dosaženo, ale konsolidace v rámci P2 může počet změnit.
- **D-R7:** H15 absolutní precedence nad SOFT preferencemi.
- **D-R8:** Halucinace log interní, ne feedback recenzentům.
- **D-R9:** Constitution v1.1 × H15 check proběhl, cross-ref doporučen — APLIKOVÁNO.
- **D-R10:** Žádné další cold-read review v2.0.4 **před Fází 6**. Fáze 6 cold-read review rc je nyní povolená.
- **D-R11:** Všechno v Opus, Code nedelegovat pro prompt engineering.

### Session #2 (nezměněno)

- **D-R12:** Fáze 1 P0 blockery splněny.
- **D-R13:** Composite krok 2 semantický rozpor — RESOLVED Session #3 (Alt A, `prep` step_type).
- **D-R14:** Žádné post-Fáze-1 cold-read review (D-R10 remains).

### Session #3 (nezměněno)

- **D-R15:** P1.2 Alt A applied — `prep` step_type zaveden, KISS ≤ 5 step_types splněno. `transition` a `visual` NEZAVÁDĚNY.
- **D-R16:** P1.7 decision table hodnoty = initial proposal, kalibrovat po Fázi 7.
- **D-R17:** H15 × Constitution cross-ref aplikován v H15 closing line. Reverse cross-ref (Constitution → H15) deferred na separate maintenance session.

### Session #4 (nová)

- **D-R18:** **Gate a post-delivery checks komplementární, ne alternativní.** H1/H4/H10/S8 zdvojeny do obou fází (gate = vstupní existence check, post-delivery = výstupní compliance check). Rationale: fail-fast před token spend + clean error attribution (F1 bug vs. Writer bug). Aplikováno v P1.8.
- **D-R19:** **`line_card_lite` je fixed range 8–10 ve v2.0.4**, non-scaling, nevázané na budget_profile. Kalibrace rozsahu (případné vázání na budget_profile, composite bonus) deferred po Fázi 7 pilot datech (3+ karet: madeleines + croissant + choux data set). Rationale: line-card = profesní mise-en-place, škálování podle budget_profile by smíchalo pedagogickou hloubku s exekučním souhrnem. Aplikováno v P1.3.

## Architecture tracker D-decisions (D55–D60)

**Status:** Beze změny od Session #3. Committnout do `docs/v2-architecture-tracker.md` kdykoli, nezávisle na Session #5.

---

# ČÁST 3 — HALUCINACE LOG (reject na viděnou)

**Session #4 status:** Žádný relapse, žádná nová položka.

Entry 1: Nem P2 — "48°C typo v madeleines 1B" → REJECTED (Session #2).
Entry 2: Perplexity/Sonnet A4 — "S1–S12 a M1–M5 chybí v promptu" → REJECTED (Session #2).

**Pravidlo:** Pokud v Session #5 znovu vyskočí tyto nálezy, odmítnout s odkazem sem.

---

# ČÁST 4 — TRIAGE SPEC (P2 + P3 pro Session #5)

## P2 — Pre-delivery rozšíření (Fáze 3)

Nové checky z Session #1 triage:

- **P2.1 Canonical pattern adherence** — ověř, že 3C vs what_if_box split drží perspektivu (post-faktum vs. real-time) per M4.
- **P2.2 H3 per-odstavec štítky** — už v check #2, ale rozšířit o enum validation. Případná konsolidace s #2.
- **P2.3 RecipeStep.why quality** — ověř, že `why` field splňuje S1 (mechanické/senzorické, ne chemické, ≤ 12 slov pro 3A).
- **P2.4 Length caps** — ověř, že žádný prose field překračuje length guidelines z sekce DÉLKOVÁ VODÍTKA.
- **P2.5 Composite ordering (conditional)** — pokud `is_composite`, ověř, že kroky v 3A jsou tagnuté `component_name` konzistentně.
- **P2.6 H7 alignment (conditional)** — pokud `section_0` existuje, ověř, že glossary 3B obsahuje termíny z `section_0.criteria_layers`.

**Cíl Fáze 3:** **18 checků max** (konsolidace). Aktuálně 14 post-delivery + 4 gate = 18 (již splněno). P2 checky přidávat **ne** jako nové řádky, ale konsolidovat do stávajících (např. P2.1 → rozšíření check #10, P2.2 → rozšíření check #2, P2.3 → rozšíření check #3 nebo #10).

**Decision point pro Robinson:** P2.5 composite ordering — samostatný check #15 nebo rozšíření check #4? P2.6 H7 alignment — samostatný check nebo rozšíření check #7?

## P3 — Drobnosti (Fáze 4)

1. `not_needed` v 2B — rozsah definice (co patří a co ne).
2. S3 red-flag absolutní jazyk check — rozšíření o automated regex pro "vždy", "nikdy", "musí se".
3. S2 KitchenAid fallback check — ověř, že každá `rychlost N` má senzorický fallback.
4. H7 conditional na section_0 existenci — explicitně deklarovat, že H7 platí jen když rubric !== null.
5. `home_safety_note` → section_2e mapping — doplnit do DATA FLOW tabulky.
6. `max_3a_steps` count specifikace — clarify zda počítá exempt steps (preheat, tasting, assembly, prep).
7. `writer_reasoning` 6 → 8 vět — rozšíření slotu pro větší transparence rozhodnutí.
8. Pre-delivery pass/fail criteria per check — definovat per check, kdy je OK vs. ISSUE vs. CRITICAL ISSUE.

## Fáze 6 — Cold-read review rc (alternativa k P2/P3)

Odeslat v2.0.4-rc prompt 6 AI reviewerům (Perplexity+Sonnet, ChatGPT, Gemini, Nemotron, Grok exclu dle D49, plus jeden nový). Sbírat feedback na:

- Zdali P1 patche jsou konzistentně aplikované.
- Zdali gate checks (G1–G4) pokrývají realistické failure modes.
- Zdali `line_card_lite` rozsah 8–10 je pro composite příliš těsný.
- Zdali S13 tabulka je pedagogicky správně.

**Pokud Robinson chce rychle Fázi 7 (madeleines karta), doporučení = přeskočit Fázi 3/4 a jít přímo na cold-read → Fáze 7.** Empirický test z madeleines odhalí víc než teoretické rozšíření checklist.

---

# ČÁST 5 — SESSION #5 EXECUTION PLAN (3 varianty)

## Varianta A: Fáze 3 P2 + Fáze 4 P3 (~3h) — "dokončit teoretickou práci"

**Order:**
1. P2 konsolidace do stávajících checků (~1.5h)
2. P3 drobnosti (~1h)
3. Deliverables: v2.0.4-final, DIFF-SUMMARY, HANDOVER session #6 (~30 min)

**Pro:** Dokončí Session #1 triage kompletně. Prompt je "done" před empirickým testem.
**Proti:** Bez pilot dat hrozí over-engineering.

## Varianta B: Fáze 6 cold-read review (~2h) — "validovat rc"

**Order:**
1. Připravit review prompt pro 6 AI reviewerů (~30 min)
2. Collect feedback (mimo tuto session, async)
3. Triage Session #6 (new session)

**Pro:** Objektivní validace před Fázi 7.
**Proti:** Session #5 sama neprodukuje nic finálního, jen setup.

## Varianta C: Skip to Fáze 7 — madeleines karta (~4h) — DOPORUČENO

**Order:**
1. Pre-flight check rc prompt je funkční (~15 min)
2. Pilot 2 na **croissant** (flat, `product_is_composite: false`, FCI Sessions 7+5) — v Robinsonově original plánu (z Session #3 top-of-mind).
3. NEBO pilot na madeleines (bucket a review dle D-R5).
4. Pilot verdikt (SHIPS / SHIPS WITH PATCHES / RETURN TO DRAFT).
5. P2/P3 triage retroaktivně po empirickém testu.

**Pro:** Empirická data vyjasní, které P2/P3 checky jsou nutné, které over-engineering. Shoda s Robinsonovou prioritou (z memories: "next session should begin with Pilot 2 on croissant").
**Proti:** Teoretická práce Fáze 3/4 zůstane otevřená.

**Doporučení:** Varianta C. Madeleines nebo croissant pilot validuje rc, pak cílený P2/P3 podle výsledku.

## Co NEDĚLAT v Session #5

- NEdelegovat Code (D-R11).
- NEpřidávat `transition` nebo `visual` step_types (D-R15 final).
- NEvracet se k P0 ani P1 patchům (všechny aplikované).
- NEkalibrovat P1.7 decision table ani P1.3 line-card rozsah (D-R16, D-R19 deferred).
- NEptát se Robinsona "co preferuješ" u rozhodnutých položek (D-R1 až D-R19).
- NEdělat token diet (D-R4 deferred po Fázi 6).

## Context budgeting

- Load handoveru + rc baseline: ~32k
- Varianta A: ~100k celkem (pohodlně)
- Varianta B: ~40k (minimal)
- Varianta C: ~150k (tight, ale splnitelný)

## Escalation points (ptat se Robinsona)

1. **Kterou variantu (A/B/C)?** Doporučení C.
2. **Pokud C: pilot na croissant (z top-of-mind) nebo madeleines (D-R5)?**
3. **Pokud A: P2.5 composite ordering — nový check nebo rozšíření #4? P2.6 H7 alignment — nový nebo rozšíření #7?**

---

# ČÁST 6 — ČÍM KONČIT SESSION #5

Na konci Session #5 musí existovat jediný soubor `HANDOVER-F2-v2_0_4-session6.md` (stejný formát jako tento), obsahující:

1. Updated stav (co je hotové z Fáze 3/4/6/7 dle zvolené varianty).
2. Pozice v plánu.
3. Aktualizovaný triage.
4. Aktualizované D-decisions (pokud byla nová, D-R20+).
5. Plán pro Session #6.

**Princip:** Robinson nedrží 7 souborů. Jeden handover → další session.

Dále v Session #5 vygenerovat (dle varianty):
- Varianta A: `peppi-basics-v2-writer-prompt-F2-v2_0_4-final.md` + `DIFF-SUMMARY-v2_0_4-rc-to-final.md`
- Varianta B: `REVIEW-PROMPT-v2_0_4-rc.md` + instrukce pro posílání 6 reviewerům
- Varianta C: `pilot-verdict-{croissant|madeleines}-v2_0_4-rc.md` + `WriterDraft-{produkt}-v2_0_4-rc.json`

---

# ČÁST 7 — BASELINE PROMPT STATE

Všechny ř. XXX reference v tomto dokumentu se vztahují k **`peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md` (1552 řádků)**.

**⚠️ LINE NUMBER SHIFT od beta → rc:** +134 řádků.

**Klíčové lokace v rc (ověřit greppem v Session #5):**

| Ř. rc | Co tam je | Session #5 relevance |
|---|---|---|
| 3–14 | v2.0.4-rc changelog | Reference pro nové changelog entry |
| 315–355 | BudgetProfile defaults, HARD MINIMUMS, decision table | D-R16 kalibrace deferred |
| 369 | Generation order (s `line_card_lite`) | P1.3 done ✓ |
| 412–428 | section_0 WriterDraft + AUDIENCE/LANE komentář | P1.5 done ✓ |
| 549–562 | block_7 + AUDIENCE/LANE komentář | P1.5 done ✓ |
| 575–583 | WriterDraft.line_card_lite | P1.3 done ✓ |
| 585–589 | WriterDraft.pre_delivery_report komentář (dvoufázový) | P1.8 done ✓ |
| 857–877 | F2RefusedError + F2GateFailureError interfaces | P1.8 done ✓ |
| 880–912 | DATA FLOW: ResearchBrief → WriterDraft routing sekce | P1.10 done ✓ |
| 915–949 | PRE-GENERATION GATE sekce (G1–G4) | P1.8 done ✓ |
| 951 | `### HARD` header začíná | — |
| 987, 1044, 1046 | H10, S8, S9 cross-refs na DATA FLOW | P1.10 done ✓ |
| 1054 | `### SOFT` header | — |
| 1080–1088 | S13 Epistemic language + tabulka | P1.4 done ✓ |
| 1091 | `### PROCESS` header | — |
| 1499 | `## PRE-DELIVERY REPORT (v2.0.4, P1.8) — dvoufázový` | P1.8 done ✓ |
| 1503 | FÁZE 1 GATE REPORT header | P1.8 done ✓ |
| 1505 | FÁZE 2 POST-DELIVERY REPORT header (14 checků) | P1.8 done ✓ |
| 1509 | `### POST-DELIVERY REPORT (14 kontrol, v2.0.4)` | — |
| 1511–1524 | Post-delivery checks #1–#14 | P1.8 cross-refs + P1.3 check #14 done ✓ |

---

# ČÁST 8 — CONSTITUTION v1.1 × H15 CROSS-REFS (status: Session #3, nezměněno)

**Session #3 applied:** H15 closing line obsahuje cross-ref na Constitution v1.1 §2.2 (D54).

**Deferred (NE Session #5):** Reverse cross-ref v Constitution §2.2 → H15 (D-R17). Úkol pro separate Constitution maintenance session.

---

# ČÁST 9 — SESSION #4 CHANGELOG (co Session #4 dodelala)

## Fáze 2b kompletní (5 P1 patchů)

**Delta:** v2.0.4-beta (1418 řádků) → v2.0.4-rc (1552 řádků, +134).

| Patch | Target | Cascade | Status |
|---|---|---|---|
| P1.10 | DATA FLOW routing table + cross-refs H10/S8/S9 | 3 | ✓ |
| P1.8 | PRE-GENERATION GATE + F2GateFailureError + split report | 5 (gate sekce, error shape, report split, cross-refs #3/#4/#8/#9, WriterDraft komentář) | ✓ |
| P1.3 | line_card_lite + check #14 + generation order | 3 | ✓ |
| P1.4 | S13 Epistemic language + tabulka | 1 | ✓ |
| P1.5 | section_0 + block_7 AUDIENCE/LANE komentáře | 2 | ✓ |
| Meta | Version bump 2.0.4-beta → 2.0.4-rc + rc changelog + 14 kontrol header | — | ✓ |

**Session #4 flag pro Session #5:** žádné otevřené rozpory. v2.0.4-rc je clean baseline. Všechny cross-refs ověřené greppem (G1 viability, G2 preview, G3 routing, G4 coverage konzistentní napříč).

## Nové D-decisions (Session #4)

- D-R18: Gate + post-delivery komplementární (zdvojeno H1/H4/H10/S8).
- D-R19: line_card_lite fixed 8–10, kalibrace po Fázi 7.

---

# KONEC HANDOVER DOKUMENTU

**Robinson, prosím:**

1. Otevři novou konverzaci.
2. Uploadni **jen dva soubory:**
   - Tento handover (`HANDOVER-F2-v2_0_4-session5.md`)
   - RC baseline prompt (`peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md`)
3. Napiš "jdi" + volbu varianty (A = P2/P3, B = cold-read, C = pilot).

**Doporučení:** Varianta C s croissantem (flat, `product_is_composite: false`, FCI Sessions 7+5 primary) — shoda s tvým původním plánem ze Session #3 top-of-mind.
