# Waiver Declaration — Pilot 2 Croissant, F2 v2.0.4-rc

**Kontext:** Pilot 2 (croissant) běžel proti F2 v2.0.4-rc (1553 řádků) s F1 ResearchBrief v2.2.1. PRE-GENERATION GATE G3 (FailureMode shape integrity) selhal kvůli enum mismatchi. Abychom získali empirická data ze zbytku pipeline, byl aplikován waiver.

**Toto NENÍ návrh řešení enumu.** Je to ohraničená simulace, aby pilot mohl pokračovat. Rozhodnutí o enum patří do Session #6 triage.

---

## Fail detail

**Gate G3 enum (prompt řádek 930):**
```
{"during_process" | "immediately_after" | "after_cooling" | "next_day"}
```

**F1 v2.2.1 actual emit (croissant brief, failure_tracking.common_failures[]):**
| # | F1 when_detectable value | V G3 enum? |
|---|---|---|
| 1 | `during_process` | ✓ |
| 2 | `immediately_after` | ✓ |
| 3 | `during_baking_transition` | ✗ |
| 4 | `during_baking_transition` | ✗ |
| 5 | `immediately_after` | ✓ |
| 6 | `during_storage` | ✗ |
| 7 | `during_process` | ✓ |

3 ze 7 failure modes mají hodnoty mimo G3 enum → bukva promptu = `F2GateFailureError`, hard-stop.

---

## Key insight

**TroubleshootRow.when enum (prompt řádek 660) OBSAHUJE všechny F1 hodnoty:**
```
"during_baking_transition" | "immediately_after" | "after_cooling" | "after_filling" | "during_storage"
```

Takže F1 není bugnuté — emituje hodnoty validní pro výstupní typ `TroubleshootRow.when`. **Gate G3 enum je neúplný vůči TroubleshootRow enumu.** Gate kontroluje menší podmnožinu, než jakou výstupní schema přijme.

Toto je protokolová nekonzistence, ne data quality issue.

---

## Waiver mapping (applied pro pilot 2)

Žádný skutečný mapping neproveden — hodnoty `during_baking_transition` a `during_storage` byly **ponechány beze změny** a propadly přímo do `TroubleshootRow.when` v section_3c, kde jsou validní.

**Waiverem je tedy bypass G3 kontroly, ne transformace hodnot.** Writer se choval, jako by G3 prošel, a pokračoval v normální generaci WriterDraftu.

Důsledky:
- WriterDraft.block_3.section_3c obsahuje 5 TroubleshootRow, z nichž 2 mají `when: "during_baking_transition"` a 1 má `when: "during_storage"` — všechny validní pro output schema.
- 2 failure modes s `when_detectable: "during_process"` šly správně do what_if_box (H10 routing).
- Post-delivery check #9 (FailureMode count) pasuje: 7 in, 7 placed.

---

## Proč to stále znamená non-SHIPS verdict

Waiver dovolil pilot pokračovat, ale **neruší fakt, že gate G3 fail se v produkční pipeline stane**. Jakmile F1 pošle croissant brief do F2 v2.0.4-rc bez waiveru, Writer hard-stopne a žádný WriterDraft nevznikne. Fix je nutný před deployem.

Verdict pilotu musí tedy minimálně být **SHIPS WITH PATCHES** (G3 fix je nepovinný pro funkční pilot, ale povinný pro produkční release).

---

## Doporučený fix (pro Session #6 triage, ne pro tento pilot)

Výběr z opcí:

**Option A — G3 enum align s TroubleshootRow enumem:**
```typescript
failed_gate: "H1_viability" | "H4_preview" | "H10_routing" | "S8_coverage"
// G3 internally validates FailureMode.when_detectable against:
{"during_process" | "immediately_after" | "during_baking_transition"
 | "after_cooling" | "after_filling" | "during_storage" | "next_day"}
```
Nejmenší zásah. Jen update enum ve F2 promptu gate section (ř. 930). Žádná cascade do H10, DATA FLOW, checku #10.

**Option B — G3 existence-only check:**
```
G3 testuje jen, že KAŽDÝ FailureMode má non-null when_detectable field.
Nevaliduje hodnotu. Validace hodnoty se přesouvá do výstupního schema (TroubleshootRow.when).
```
Více restrukturalizace, ale čistší odpovědnost (gate = shape, schema = hodnoty).

**Option C — F1 protokol enforcement:**
F1 v2.2.2 bude validovat svůj `when_detectable` emit proti stejnému enumu jako F2 G3. Pokud F1 emituje mimo enum, F1 sám hodnotí jako `F1ProtocolViolation` → F2 dostane error_type a vrací F2RefusedError (H14).

Triage Session #6 rozhodne, která opce. Základní doporučení: **A** (nejrychlejší, backward-compatible).

---

## Ověření, že waiver byl aplikován *jen* na G3

Ostatní gate checks byly ověřeny bez waiveru:

- **G1 (H1 viability):** 7 ingrediencí v `golden_standard.ingredients`, všechny s `amount_g > 0`. PASS.
- **G2 (H4 preview):** `product_is_composite: false`, `ingredients[]` má 7 záznamů. PASS.
- **G4 (S8 coverage):** `tasting_protocol[]` má 4 checkpoints, všechny s `process_stage`, `what_to_check`, `sensory_cue`. PASS.

Waiver je ohraničený výhradně na G3 enum porovnání.

---

*Připraveno: 2026-04-20, konec Pilot 2 session.*
