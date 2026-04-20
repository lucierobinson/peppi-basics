---
session: 6
phase: "fix-findings → v2.0.5"
recommended_variant: "FIX"
recommended_command: "jdi FIX"
handoff_files:
  - docs/basics-v2/prompts/F2-writer/current.md
  - docs/basics-v2/pilots/2026-04-20_pilot-2-croissant/pilot-verdict-croissant-v2_0_4-rc.md
  - docs/basics-v2/pilots/2026-04-20_pilot-2-croissant/WAIVER-declaration-croissant-v2_0_4-rc.md
  - docs/basics-v2/pilots/2026-04-20_pilot-2-croissant/WriterDraft-croissant-v2_0_4-rc.json
handoff_notes: |
  Varianta FIX = oprava 3 findings z Pilot 2 croissant → v2.0.5.
  Pokud bude chtít Robinson dělat Pilot 3 (madeleines) před fixy, použij variant PILOT3 a potřebuješ madeleines F1 brief (uploaded v Session #5 omylem — Code ať ho najde v repu, cesta pravděpodobně ~/Desktop/1Peppulka/peppi/tests/2026-04-NN_pilot-madeleines*/).
  Pokud bude chtít rovnou cold-read review, použij variant COLDREAD a stačí rc baseline prompt + pilot-verdict.
---

# F2 v2.0.4 → v2.0.5 — Handover pro Session #6

**Jeden soubor. Všechno uvnitř. Robinson uploaduje JEN tento soubor + rc baseline prompt + 3 pilot deliverables (pokud dostupné v repu).**

**Vytvořeno:** 2026-04-20, konec Session #5 (Pilot 2 croissant s verdict SHIPS WITH PATCHES).
**Pro:** Session #6 — oprava 3 findings a vydání v2.0.5.

---

## START OF SESSION CHECKLIST (prvních 5 minut)

1. Přečti tento soubor celý.
2. Potvrď, že jsou uploadované:
   - `HANDOVER-F2-v2_0_5-session6.md` (tento soubor)
   - `peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md` (1553 řádků, baseline)
   - `pilot-verdict-croissant-v2_0_4-rc.md` (3 findings + doporučení)
   - `WAIVER-declaration-croissant-v2_0_4-rc.md` (G3 kontext)
   - volitelně `WriterDraft-croissant-v2_0_4-rc.json` (pro audit reference)
3. Zeptej se Robinsona: **FIX (v2.0.5) / PILOT3 (madeleines) / COLDREAD**. Doporučení: **FIX**.

**Nic jiného neuploadovat. Všechno potřebné je v tomto dokumentu + pilot deliverables.**

---

# ČÁST 1 — STATUS K 2026-04-20

## Co je hotové (Session #1–#5)

- **Session #1–#2:** P0 blockery (4), Fáze 1 prep, triage spec.
- **Session #3 (Fáze 2a):** 5 P1 patchů (P1.1, P1.2, P1.6, P1.7, P1.9). v2.0.4-beta.
- **Session #4 (Fáze 2b):** 5 P1 patchů (P1.3, P1.4, P1.5, P1.8, P1.10). v2.0.4-rc (1553 řádků).
- **Session #5 (Pilot 2 croissant):** SHIPS WITH PATCHES verdict. 3 findings pro v2.0.5.

## Aktuální baseline

- **Prompt:** v2.0.4-rc, 1553 řádků, `docs/basics-v2/prompts/F2-writer/current.md`.
- **Status:** Funkční pro generaci WriterDraftu (ověřeno pilotem), ale 3 findings blokují produkční deploy.

## Pilot 2 croissant — detailní status

- WriterDraft vygenerován úspěšně (s waiverem G3).
- 14 post-delivery checků: 13 OK, 1 ISSUE (check #13 H15 — správné chování, variant_numbers_from_base_knowledge flag set).
- Strukturálně validní JSON, 9 ingrediencí v 2A, 18 kroků v 3A, 10 line_card_lite, 8 manifest rows.

---

# ČÁST 2 — 3 FINDINGS (z pilot verdict)

## Finding 1 — Gate G3 enum mismatch ⚠️ DEPLOY BLOCKER

**Target:** F2 prompt ř. 930 (PRE-GENERATION GATE, G3 spec).

**Problem:** G3 enum `{"during_process" | "immediately_after" | "after_cooling" | "next_day"}` je podmnožinou `TroubleshootRow.when` enumu `{"during_baking_transition" | "immediately_after" | "after_cooling" | "after_filling" | "during_storage"}`. F1 v2.2.1 emituje validní hodnoty pro výstup, gate je odmítá jako invalid.

**Fix (Option A, doporučeno):** Rozšířit G3 enum na unii obou enumů:
```
{"during_process" | "immediately_after" | "during_baking_transition"
 | "after_cooling" | "after_filling" | "during_storage" | "next_day"}
```

**Cascade:** 1 location (ř. 930). Žádný další text promptu neříká, že `during_process` je jediná "during" hodnota. H10 routing ř. 1012 explicitně jmenuje jen `"during_process"` → what_if_box, což je **správně** a nemění se.

**Effort:** 15 min.

## Finding 2 — H1 step_type enum nepokrývá pečení

**Target:** F2 prompt ř. 616–640 (RecipeStep interface), ř. 953–965 (H1).

**Problem:** Pro kroky "peč X min na Y °C" neexistuje přesný step_type. Workaround v pilotu: `prep` (sémanticky nesprávné, ale funkční).

**Fix options:**
- **A:** Přidat `step_type: "bake"` (nejčistší, ale cascade 3–5 locations).
- **B:** Rozšířit definici `prep` o "tepelnou transformaci" (minimum zásah).
- **C:** Výjimka v H1 pro kroky s `temperature_c + duration_minutes` bez gramáže.

**Cascade (A):** enum def, type comment, H1 text, post-delivery check #3, pravděpodobně DATA FLOW.

**Effort:** 1 h (Option A), 20 min (Option B).

**Severity:** Enhancement, ne blocker. Deferrable do v2.0.6 pokud chceš rychlý v2.0.5.

## Finding 3 — F1-F2 ingredient contract (egg wash problem)

**Target:** F1 ResearchBrief schema NEBO F2 H4 policy.

**Problem:** F1 brief pro croissant zmiňuje egg wash v `method_summary`, ale ne v `ingredients[]`. H4 vyžaduje 2A ↔ 3A konzistenci. Writer musel adaptovat (přidat do 2A + manifest s Writer-derived gramážemi).

**Fix options:**
- **A (F1 side):** F1 v2.2.2+ bude povinně dodávat VŠECHNY ingredience z method_summary jako položky v ingredients[] s role="supply".
- **B (F2 side):** F2 v2.0.5 bude mít explicit policy pro supply-type ingredience s Writer-derived gramážemi + povinný ManifestRow.
- **C:** Status quo. Nedoporučeno (konsistence napříč kartami bude nahodilá).

**Primární: A** (fix na F1 side odstraňuje need pro F2 adaptaci). Sekundárně B (fallback pro backward compat).

**Effort:** 30 min (F2 side policy), 1 h (F1 side spec — mimo tento handover scope).

---

# ČÁST 3 — D-DECISIONS (aktualizované)

## Session #1–#4 D-R1 až D-R19

Beze změny od Session #5. Viz HANDOVER-F2-v2_0_4-session5.md ČÁST 2.

## Session #5 (nové D-decisions)

- **D-R20:** **Gate enums MUSÍ být supersety odpovídajících output schema enumů.** Gate existuje aby chránil před invalid data, ne aby filtroval validní data. Objevené u G3; platí analogicky pro budoucí gate checks. Formalizovat v Session #6 jako design principle v PRE-GENERATION GATE sekci.
- **D-R21:** **Supply-type ingredience (egg wash, mouka na posypání) mají explicit routing pravidlo.** Bez něj je H4 2A↔3A audit nahodilý. Session #6 rozhodne o implementaci (F1 side vs. F2 policy).
- **D-R22:** **Pilot datum formát pro test složky = YYYY-MM-DD_pilot-N-PRODUCT.** Croissant pilot 2 = `2026-04-20_pilot-2-croissant/`. Sjednocuje se Peppi test files konvencí. (Drobnost, ale bude ušetřeno času při hledání dalších pilotů.)

---

# ČÁST 4 — EXECUTION PLAN (3 varianty)

## Varianta FIX — oprava 3 findings → v2.0.5 (~2–3 h) — DOPORUČENO

**Order:**
1. Finding 1 G3 enum (Option A) — 15 min
2. Finding 3 egg wash policy (Option B — F2 side policy pro rychlost) — 30 min
3. Finding 2 H1 step_type — **deferred do v2.0.6**, nebo rychlá Option B (20 min) pokud chce Robinson v2.0.5 komplet
4. Version bump 2.0.4-rc → 2.0.5, changelog — 15 min
5. DIFF-SUMMARY-v2_0_4-rc-to-v2_0_5.md — 30 min
6. Handover session #7 — 15 min

**Pro:** Deploy-blocker fix, produkční release v2.0.5.
**Proti:** Žádný.

## Varianta PILOT3 — madeleines pilot před fixy (~3 h)

**Pozor:** Robinson uploadoval do Session #5 omylem madeleines F1 brief místo croissantu (z pilot složky kolem 18.–19. 4.). Brief existuje a je funkční, ale je potřeba ho najít.

**Order:**
1. Code ať najde madeleines brief (pravděpodobně `~/Desktop/1Peppulka/peppi/tests/2026-04-NN_pilot-madeleines*/`).
2. Pilot 3 na madeleines (bucket a review dle D-R5) s v2.0.4-rc baseline (s G3 waiverem pokud bude potřeba).
3. Další findings pravděpodobně confirm pattern z croissantu.

**Pro:** Víc empirických dat před fixy.
**Proti:** Fixy budou stejně nutné. Madeleines se navíc jako bucket (a) kandidát liší od croissantu v struktuře (cookies, ne viennoiserie) — pattern findings nemusí přenositelný.

## Varianta COLDREAD — externí AI review (~2 h setup + async)

**Order:**
1. Připravit review prompt pro 6 AI reviewerů s v2.0.4-rc + pilot verdict.
2. Sbírat feedback async.
3. Triage Session #7.

**Pro:** Objektivní validace.
**Proti:** Review rc bez fixů = ztráta reviewer kapacity (G3 a egg wash by jinak flagli všichni). Doporučení: odložit na po-v2.0.5.

## Doporučení

**FIX** (Option A G3 + Option B egg wash, H1 defer). Cíl Session #6 = v2.0.5 release.

## Co NEDĚLAT v Session #6

- NEdelegovat Code pro prompt engineering (D-R11 stále platí).
- NEměnit architekturu v2.0 (žádné velké refaktory).
- NEměnit core WriterDraft schema (finding 3 řeší policy, ne type change).
- NEvracet se k P0/P1 patchům z Session #1–#4 (všechny aplikované).
- NEdělat cold-read ani Fázi 5 token diet (deferred).

---

# ČÁST 5 — ČÍM KONČIT SESSION #6

Na konci Session #6 musí existovat jediný soubor `HANDOVER-F2-v2_0_5-session7.md` (stejný formát jako tento), obsahující:

1. Updated stav (co je hotové z fixes).
2. Aktualizované D-decisions (pokud vznikla D-R23+).
3. Plán pro Session #7 (typicky: Pilot 3 madeleines s v2.0.5 nebo cold-read review).

Dále v Session #6 vygenerovat (dle varianty):

**Varianta FIX:**
- `peppi-basics-v2-writer-prompt-F2-v2_0_5.md` (aktualizovaný prompt)
- `DIFF-SUMMARY-v2_0_4-rc-to-v2_0_5.md`

**Varianta PILOT3:**
- `pilot-verdict-madeleines-v2_0_4-rc.md`
- `WriterDraft-madeleines-v2_0_4-rc.json`

**Varianta COLDREAD:**
- `REVIEW-PROMPT-v2_0_4-rc.md`
- Instrukce pro Robinson ohledně distribuce 6 reviewerům.

---

# ČÁST 6 — CONTEXT BUDGETING

Session #5 odhad byl 150k pro pilot, skutečnost ~90k (včetně findings + verdict + handover).

Pro Session #6:
- **Varianta FIX:** ~50k (rc prompt + 3 findings + cílené edity)
- **Varianta PILOT3:** ~90k (stejně jako Pilot 2)
- **Varianta COLDREAD:** ~30k (minimal)

Všechny v pohodovém budgetu.

---

# ČÁST 7 — WRITER MODEL STATE

Pilot 2 běžel v **Claude Opus 4.7** (single-pass generace). Sonnet A/B test deferován dle D-R4 area (po Fázi 6).

Pro Session #6 FIX prompt engineering — Opus (D-R11).

---

# ČÁST 8 — POZOROVÁNÍ PRO BUDOUCÍ KALIBRACI

**Nepovažováno za findings, jen data pro Fázi 7:**

1. **Step_type distribuce u laminovaných těst:** 2 standard, 3 tasting, 12 prep, 1 preheat. `prep` je dominantní, ne `standard`. Budget_profile `max_3a_steps` by mohl být vázaný na kategorii produktu, ne jen globálně (D-R16 kalibrace už deferred).

2. **line_card_lite pro 2denní procesy:** 10 stringů je na horní hranici 8–10. Pro 3denní procesy (brioche?) by mohl být potřeba vyšší strop. D-R19 kalibrace po více pilotech.

3. **Manifest row count u režimu B:** 8 rows pro croissant (složitý home adaptation scenario). Pro režim A (source-locked) bude minimum, pro režim C (autorský) maximum. Pozorování pro budoucí guidance.

4. **Variants bez F1 variants[] dat:** Writer musel base knowledge pro 2 ze 3 variant. F1 v2.2.2+ by měl dodávat `variants[]` minimálně jako sister_card_candidates+ (s per-variant numerics pokud v GS source existují). Finding vhodný pro F1 roadmap, ne pro F2 v2.0.5.

---

# KONEC HANDOVER DOKUMENTU

**Robinson, prosím:**

1. Otevři novou konverzaci.
2. Uploadni:
   - Tento handover (`HANDOVER-F2-v2_0_5-session6.md`)
   - RC baseline prompt (`peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md`)
   - Pilot verdict (`pilot-verdict-croissant-v2_0_4-rc.md`)
   - Waiver declaration (`WAIVER-declaration-croissant-v2_0_4-rc.md`)
   - Volitelně WriterDraft JSON pro audit reference
3. Napiš `jdi FIX` (nebo `jdi PILOT3` / `jdi COLDREAD` podle rozhodnutí).

**Doporučení: `jdi FIX`** — Pilot 2 odhalil 3 konkrétní patche, oprava je přímá cesta k v2.0.5 produkčnímu release.
