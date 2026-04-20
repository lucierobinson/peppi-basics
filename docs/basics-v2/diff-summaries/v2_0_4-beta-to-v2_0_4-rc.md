# DIFF SUMMARY — F2 Writer v2.0.4-beta → v2.0.4-rc

**Session #4 (Fáze 2b) output.** 5 P1 patchů aplikováno. Line count: 1418 → 1552 (+134).

---

## Přehled změn

| # | Patch | Typ | Lokace | Řádků |
|---|---|---|---|---|
| 1 | P1.10 | Nová sekce + cross-refs | Před `## INVARIANTY` (ř. 880) + H10, S8, S9 | +33 |
| 2 | P1.8 | Strukturální změna + nový error type + split reportu | `### PRE-GENERATION GATE` (ř. 915), `F2GateFailureError` (ř. 865), PRE-DELIVERY REPORT split (ř. 1499) | +70 |
| 3 | P1.3 | Nový required field + check #14 | `WriterDraft.line_card_lite` (ř. 575), check #14 (ř. 1524), generation order (ř. 369) | +18 |
| 4 | P1.4 | Nový SOFT invariant + tabulka | S13 po S12 (ř. 1080) | +9 |
| 5 | P1.5 | Komentářová clarification (bez schema change) | section_0 (ř. 414), block_7 (ř. 550) | +14 |
| — | Changelog + meta | Version bump, rc changelog | Hlavička (ř. 3–14) | +10 |

---

## P1.10 — DATA FLOW routing table

**Co přibylo:** Nová top-level sekce `## DATA FLOW: ResearchBrief → WriterDraft routing (v2.0.4, P1.10)` před `## INVARIANTY`. Obsahuje:

- 20-řádkovou mapovací tabulku (F1 field → WriterDraft slot → invariant), pokrývající flat + composite ingredience, tasting_protocol, FailureMode routing (during_process vs. post-faktum), institutional_rubric, textbook_positioning, Mora 545, variants, home_constraints, a adapted_parameters.
- Pravidlo precedence při mapovacím konfliktu (HARD > SOFT > defaults).
- Pravidlo chybějících dat (povinné field → GATE fail; volitelný → omitted_sections).

**Cross-refs přidané do:**
- H10 (ř. 987): "Routing specifikace: DATA FLOW tabulka řádky 5 a 6."
- S8 (ř. 1044): "Routing specifikace: DATA FLOW tabulka řádek 4."
- S9 (ř. 1046): "Routing specifikace: DATA FLOW tabulka řádek 15."

**Rationale:** Autoritativní single-source-of-truth pro routing rozhodnutí. Prerequisite pro P1.8 gate checks.

---

## P1.8 — PRE-GENERATION GATE (structural)

**Co přibylo:**

### A. Nová sekce `### PRE-GENERATION GATE` v `## INVARIANTY` (před `### HARD`)

4 gate checks (binární existence/shape vstupních dat):

| Gate | Ověřuje | Fail behavior |
|---|---|---|
| **G1. H1_viability** | `golden_standard.ingredients` nebo `components[]` s non-null `amount_g` | F2GateFailureError |
| **G2. H4_preview** | Pro composite: každý `components[i].ingredients` neprázdný | F2GateFailureError |
| **G3. H10_routing** | Každý `FailureMode.when_detectable` má validní hodnotu | F2GateFailureError |
| **G4. S8_coverage** | Pokud `tasting_protocol !== null`, má `checkpoints[]` aspoň 1 záznam | F2GateFailureError |

### B. Nový error shape `F2GateFailureError`

```typescript
interface F2GateFailureError {
  writer_version: string;
  error_type: "f2_gate_failure";
  failed_gate: "H1_viability" | "H4_preview" | "H10_routing" | "S8_coverage";
  reason: string;
  input_diagnostic: object;
}
```

### C. PRE-DELIVERY REPORT rozdělen na 2 fáze

- **FÁZE 1 GATE REPORT** (před generací, 4 gate checks, nezapisuje se do `pre_delivery_report`)
- **FÁZE 2 POST-DELIVERY REPORT** (po generaci, 14 checks — stávajících 13 + nový #14 pro P1.3)

### D. Cross-refs v post-delivery checks

- Check #3 doplněn `(HARD protějšek G1)` + "Pokud G1 prošel, ale zde ISSUE → Writer nezapsal gramáže, které F1 dodal"
- Check #4 doplněn `(HARD protějšek G2)`
- Check #8 doplněn `(SOFT protějšek G4)` + "Pokud G4 prošel, ale zde ISSUE → Writer neumístil checkpointy"
- Check #9 doplněn `(HARD protějšek G3)`

**Rationale:** D-R18 — gate a post-delivery jsou komplementární (gate = "dodal F1 data?", HARD = "zapsal Writer data správně?"). Fail-fast před token spend, clean error attribution (upstream vs. Writer bug).

---

## P1.3 — line_card_lite

**Schema change:** Nový required field ve `WriterDraft`:

```typescript
line_card_lite: string[];  // 8-10 stringů (HARD range, D-R19), max 1 A4
                           // gramáže + checkpoint signály, bez pedagogického vysvětlení
                           // Formát: "N. **gramáž** — akce/signál"
```

**Komentář specifikuje:**
- Fixed range 8–10 (non-scaling, nevázané na budget_profile).
- Exekuční perspektiva — ne teacher, ne student, **operator view**.
- Composite: konsoliduje komponenty, strop 10 zůstává.
- Kalibrace deferred po Fázi 7 (D-R19).

**Generation order update** (ř. 369): `... → manifest → **line_card_lite (v2.0.4)** → pre_delivery_report → omitted_sections`

**Nový pre-delivery check #14:** Existence, count 8–10 HARD, formát (gramáž nebo checkpoint signál), zákaz pedagogických vysvětlení. Count mimo rozsah = CRITICAL ISSUE.

**Rationale:** D-R19 — profesní mise-en-place dokument pro Josefinu u sporáku. Rozsah daný A4 a krátkodobou pamětí, ne budget profilem.

---

## P1.4 — S13 Epistemic language contract

**Co přibylo:** Nový SOFT invariant S13 po S12 (ř. 1080).

Tabulka mapování zdrojové jistoty na povolené formulace:

| Kategorie | Povolené formulace |
|---|---|
| Robustní | "standardně", "doporučené", "osvědčený postup" |
| Konsensus | "většina receptů", "běžně se uvádí", "typicky" |
| Aktivní výzkum | "podle dostupných dat", "některé zdroje uvádějí", "pozorováno v" |
| Zjednodušený pedagogický model | "pedagogicky zjednodušeno", "v první aproximaci", "pro účely této karty" |

**Cross-ref:** S13 pozitivně předepisuje povolené kategorie tam, kde S3 negativně zakazuje falešné jistoty.

**Rationale:** Řešení 6–7/13 konvergence z madeleines triage — bezdůvodné zobecnění ("vždy", "nikdy") v pedagogickém kontextu je porušení invariantu.

---

## P1.5 — Audience/lane clarification

**Co přibylo:** Semantic clarification v komentářích schema (žádná schema change).

### Section_0 komentář (ř. 414)

```
AUDIENCE/LANE (v2.0.4, P1.5):
  Perspektiva: TEACHER/EXAMINER optika ("podle čeho poznám dobrý výsledek jako hodnotitel").
  NE student optika ("jak mám vařit"). Formulace kritérií jsou observační ("zlatavá kůrčička",
  "dutý zvuk při poklepu"), NE instrukční ("pec na 180 °C"). Instrukce patří do 3A.
  section_0 předběžně nastavuje OČEKÁVÁNÍ VÝSLEDKU; 3A definuje CESTU k němu.
```

### Block_7 komentář (ř. 550)

```
AUDIENCE/LANE (v2.0.4, P1.5):
  Perspektiva: TRAINING/REPETITION optika ("co opakovat, dokud to nezvládnu"),
  NE first-attempt optika ("jak to zvládnu napoprvé"). First-attempt cesta je v 3A + what_if_box + 3C.
  Block_7 předpokládá, že student UŽ recept JEDNOU udělal a chce ho zvládnout NA JISTOTU (mastery path).
  training_targets = cíle OPAKOVANÉHO cvičení (2–3 pokusy × týden), ne checklist prvního pokusu.
  estimated_mastery_hours = suma hodin k dosažení spolehlivého výsledku, ne doba přípravy jedné dávky.
```

**Rationale:** Řešení 6/13 konvergence z madeleines triage — obě sekce mají rozpoznatelnou audience lane, aby Writer neplnil section_0 instrukcemi ani block_7 first-attempt checklistem.

---

## Verification status

✓ Version 2.0.4-rc konzistentně.
✓ Gate checks G1–G4 použity konzistentně (INVARIANTY, F2GateFailureError enum, post-delivery cross-refs).
✓ POST-DELIVERY REPORT header "14 kontrol" na ř. 1509, check numbering 1–14 sekvenční.
✓ Komentář u `pre_delivery_report` ve WriterDraft sjednocen s hlavičkou reportu.
✓ Generation order obsahuje `line_card_lite` před `pre_delivery_report`.
✓ Changelog v2.0.4-rc obsahuje všech 5 P1 patchů.
✓ Historické zmínky "12 kontrol" zachované jen v historických changelozích (alpha, v2.0.3) — správně.
✓ Cross-refs v H10, S8, S9 → DATA FLOW tabulka.
✓ S13 po S12, před PROCESS sekcí.
✓ Self-ref check #13 (odkazuje na sebe jako na lokaci rationale pro Option B) zachován.

---

## Nové D-decisions v Session #4

- **D-R18:** Gate checks a post-delivery checks jsou komplementární, ne alternativní. H1/H4/H10/S8 zdvojeny do obou fází s rozdílnou sémantikou (gate = vstupní existence, post = výstupní compliance).
- **D-R19:** `line_card_lite` je fixed range 8–10 ve v2.0.4. Kalibrace deferred po Fázi 7 pilot datech (3+ karet: madeleines + croissant + choux data set).

---

## Co v Session #4 NEBYLO řešeno (pro Session #5)

- Fáze 3 (P2 pre-delivery rozšíření — konsolidace na 18 checků max)
- Fáze 4 (P3 drobnosti — 8 položek)
- Fáze 5 (token diet, D-R4 zachovává deferral po Fázi 6)
- Fáze 6 (cold-read review rc, D-R10)
- Fáze 7 (madeleines karta — empirická kalibrace D-R16, D-R19)
- Constitution §2.2 reverse cross-ref (D-R17, separate maintenance session)
