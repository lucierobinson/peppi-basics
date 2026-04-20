# DIFF-SUMMARY — F2 Writer v2.0.4-rc → v2.0.5

**Vygenerováno:** 2026-04-20, konec Session #6 (Fáze FIX).
**Vstup:** `peppi-basics-v2-writer-prompt-F2-v2_0_4-rc.md` (1553 řádků)
**Výstup:** `peppi-basics-v2-writer-prompt-F2-v2_0_5.md` (1628 řádků, +75)
**Zdroj změn:** Pilot 2 croissant findings (3 P2) + D-R20 design principle formalizace.

---

## Shrnutí

| # | Změna | Severity | Cascade | Řádky diff |
|---|---|---|---|---|
| 1 | G3 enum align (Finding 1) | PATCH blocker | 1 lokace | ~8 |
| 2 | H1 `prep` rozšíření o tepelnou transformaci (Finding 2, Option B) | ENHANCEMENT | 4 lokace | ~10 |
| 3 | H16 nová — Supply-type ingredient policy (Finding 3) | PATCH + policy | 5 lokací | ~55 |
| 4 | D-R20 design principle preamble (gate enums ⊇ output enums) | DOCUMENTATION | 1 lokace | ~3 |
| 5 | writer_version literal bump 2.0.4 → 2.0.5 | COSMETIC | 7 výskytů | 7 |
| 6 | Changelog v2.0.5 header | METADATA | 1 lokace | ~7 |

**Celkem:** ~90 řádků změn v 9 logických lokacích, +75 net řádků v dokumentu (kvůli rozšířením zejména u H16).

---

## Change 1 — G3 enum align (Finding 1)

**Lokace:** ř. 929–949 (PRE-GENERATION GATE, G3 spec)
**Typ:** Enum union (4 hodnoty → 7 hodnot)

### Před (v2.0.4-rc ř. 930)

```
G3. H10 routing — FailureMode shape integrity.
Každý záznam v `ResearchBrief.failure_tracking.common_failures[]` MUSÍ mít non-null
`when_detectable` field s validní hodnotou (`"during_process"` | `"immediately_after"`
| `"after_cooling"` | `"next_day"`). Pokud kterýkoli FailureMode chybí `when_detectable`
nebo má nevaliditní hodnotu → gate fail.
```

### Po (v2.0.5 ř. 938–949)

```
G3. H10 routing — FailureMode shape integrity (v2.0.5 enum align).
Každý záznam v `ResearchBrief.failure_tracking.common_failures[]` MUSÍ mít non-null
`when_detectable` field s validní hodnotou z enumu:

{"during_process" | "immediately_after" | "during_baking_transition"
 | "after_cooling" | "after_filling" | "during_storage" | "next_day"}

Tento enum je superset `TroubleshootRow.when` output enumu (v2.0.5 D-R20 design
principle) — obsahuje všechny output hodnoty plus `"during_process"` (routována mimo
`TroubleshootRow.when` do `what_if_box` dle H10) plus `"next_day"` (legacy input
hodnota mapovaná v routingu na `after_cooling` nebo `during_storage` dle kontextu).

Pokud kterýkoli FailureMode chybí `when_detectable` nebo má hodnotu mimo tento enum
→ gate fail.
```

### Proč

F1 v2.2.1 emituje hodnoty validní pro `TroubleshootRow.when` output schema (ř. 660):
`{during_baking_transition, immediately_after, after_cooling, after_filling, during_storage}`.
G3 enum byl přísnější podmnožinou (4/5 output hodnot), takže odmítal validní F1 emity.
Pilot 2 croissant toto odhalil — 3 ze 7 failure modes měly hodnoty mimo G3 enum, gate
hard-stopnul (waiver aplikován pro pokračování pilotu).

### Compatibility

Beze změny pro H10 routing (`during_process` → what_if_box VÝLUČNĚ) i pro `TroubleshootRow.when`
enum. Žádná cascade do post-delivery checků #9, #10 ani do DATA FLOW tabulky — ty už pracovaly
s output enumem.

---

## Change 2 — H1 `prep` rozšíření o tepelnou transformaci (Finding 2, Option B)

**Lokace:** 4 cascade targety:
- RecipeStep interface comment (ř. 623–625)
- H1 definice (ř. 969)
- Post-delivery check #3 (ř. 1587)
- Tabulka chyb #14 (ř. 1569)

**Typ:** Semantic widening existujícího enum valueu (žádná schema change)

### Před (v2.0.4-rc H1)

```
step_type: "prep" — tvarování polotovaru / chlazení / odpočinek / odvážení BEZ
vstupní nové gramáže. Polotovar už existuje z předchozího kroku; prep s ním pracuje.
Prep vs. standard: pokud krok začíná NOVOU gramáží, je to standard.
Prep vs. assembly: prep = 1 polotovar (tvarování), assembly = 2+ polotovary dohromady.
```

### Po (v2.0.5 H1)

```
step_type: "prep" (v2.0.4, rozšířen v2.0.5) — tvarování polotovaru / chlazení /
odpočinek / odvážení / TEPELNÁ TRANSFORMACE POLOTOVARU BEZ vstupní nové gramáže
(např. "peč 190 °C 18–20 min" použitý na již vytvarované croissanty). Polotovar už
existuje z předchozího kroku; prep s ním pracuje — tvaruje, chladí, odpočívá, nebo
ho teplotně transformuje.

Prep vs. standard: pokud krok začíná NOVOU gramáží, je to standard.
Prep vs. preheat: preheat = příprava trouby PŘED pečením (žádný polotovar zapojen).
    Prep s tepelnou transformací = pečení/vaření/zapékání polotovaru samotného.
Prep vs. assembly: prep = 1 polotovar, assembly = 2+ polotovary dohromady.

Pozorování kalibrace (Pilot 2): U laminovaných těst je `prep` sémanticky dominantní
step_type (ne `standard`) — to je charakteristika kategorie produktu, ne bug.
```

### Proč

Pilot 2 croissant měl krok 17 ("peč 190 °C 18–20 min") bez přirozeného step_type:
- `standard` = porušuje H1 (chybí gramáž)
- `preheat` = sémanticky nesprávné (preheat = trouba, ne polotovar)
- `prep` = nejbližší, použito jako workaround

Option B (rozšíření definice `prep`) zvoleno před Option A (nový enum value `bake`),
protože má menší cascade (4 lokace) a žádné schema změny. Nevýhoda: `prep` je nyní
sémanticky širší (5 poddruhů), ale disambiguation hranice jsou jasné (prep vs. preheat
přidáno explicitně).

### Compatibility

Backward compatible — všechny existující `prep` použití (tvarování / odpočinek) zůstávají
validní. Nové použití (tepelná transformace) je additive.

---

## Change 3 — H16 nová HARD invariant (Supply-type ingredient policy, Finding 3)

**Lokace:** 5 cascade targetů:
- Nová H16 sekce (po H15, ~50 řádků)
- Post-delivery check #4 (rozšíření o H16)
- Post-delivery check #5 (rozšíření o H16 ManifestRow)
- Tabulka chyb nová #16
- Changelog header

**Typ:** Nová HARD invariant + cross-ref tabulka standardních rozsahů

### Přehled H16

Policy pro ingredience zmíněné v 3A/method_summary, které F1 nezahrnul do
`golden_standard.ingredients[]` s vlastní gramáží. Typicky: egg wash, mouka na
posypání, máslo na plech, sůl do vody, cukr na dózování.

**Režim B/C (aktivní policy):**
1. Writer přidá supply do `section_2a.ingredients` s Writer-derived gramáží.
2. Výchozí rozsahy dle standardní profesionální praxe (tabulka v H16).
3. ManifestRow s `confidence: "adaptováno"`, `value_type: "numeric"`,
   `source: "writer_supply_derivation"`, rationale citující H16 tabulku.
4. Normální H4 2A↔3A audit aplikován na rozšířenou 2A.

**Režim A (NEAKTIVNÍ):** M1 escalation flag, žádná tichá adaptace.

**Tabulka standardních rozsahů v H16:**
- Egg wash (vejce+mléko 1:1): 40–60 g/plech
- Egg wash (jen vejce): 25–40 g/plech
- Mouka na posypání: 10–30 g
- Máslo na vymazání: 5–15 g
- Sůl do vařicí vody: 8–12 g/L
- Cukr na dózování: 5–15 g/plech

### Proč

Pilot 2 croissant odhalil mezeru v F1-F2 contractu. F1 brief obsahoval egg wash v
method_summary ale ne v ingredients[]. Writer musel adaptovat ad-hoc (přidat `vejce (egg wash) 50 g`
a `mléko (egg wash) 15 g` do 2A + manifest). Bez policy by každá Basics karta s supply
ingrediencemi měla nahodilé řešení → konsistence napříč kartami by byla slabá.

**Paralelní F1 side fix:** F1 v2.2.2 spec memo (vydáno v Session #6, `F1-v2_2_2-spec-memo.md`)
navrhuje přidat `role: "main" | "supply"` field do `golden_standard.ingredients[]` s povinnou
audit kontrolou, že každá method_summary ingredience má odpovídající položku. Po F1 v2.2.2
deployi bude H16 fungovat jako backward-compat fallback (Writer adaptuje jen pokud F1 nepošle).

### Compatibility

Backward compatible — neexistující F1 field `role` je volitelný, H16 pracuje s tím co F1 dodá.
Žádná schema change v ManifestRow (existující `source: string` field přijme `"writer_supply_derivation"`).

---

## Change 4 — D-R20 design principle preamble

**Lokace:** 1 lokace — PRE-GENERATION GATE sekce preamble (po "Princip:" odstavci, před "Vztah k DATA FLOW")

**Typ:** Design principle formalizace (preventivní dokumentace)

### Přidaný text

```
**Design principle (v2.0.5, D-R20):** Gate enumy MUSÍ být supersety odpovídajících output
schema enumů. Gate role = chránit před invalid/chybějícími vstupními daty, NE filtrovat
data, která jsou validní pro výstup. Pokud gate enum ⊊ output enum, F1 může emitovat
hodnoty validní pro output schema, které gate nesprávně odmítne (bug třída objevená u G3
v Pilot 2 croissant, v2.0.5 resolvovaná). Při přidávání nových gate checků nebo rozšiřování
output schema enumů VŽDY ověřit, že gate enum obsahuje všechny hodnoty output enumu +
případné dodatečné vstupní hodnoty.
```

### Proč

Change 1 (G3 fix) je bod opravy. D-R20 je **prevence stejné třídy chyb** u G1, G2, G4 a
budoucích gate checků. Bez formalizace by se pattern opakoval. Žádná cascade — jen dokumentační
preamble.

---

## Change 5 — writer_version literal bump

**Lokace:** 7 výskytů napříč dokumentem (všechny `"2.0.4"` string literals ve schema komentářích,
F2GateFailureError template, F2RefusedError template, kanonický example).

**Typ:** Cosmetic (verze metadata).

```bash
sed -i 's/"2\.0\.4"/"2.0.5"/g' peppi-basics-v2-writer-prompt-F2-v2_0_5.md
```

Neovlivňuje žádnou invariant logiku. WriterDraft emity z v2.0.5 budou mít `meta.writer_version: "2.0.5"`,
F3 Auditor použije tuto hodnotu pro verze tracking.

---

## Change 6 — Changelog header v2.0.5

**Lokace:** Header ř. 9–16 (před původním v2.0.4-rc changelog blokem)

**Typ:** Metadata (5 entries: F1–F5 = 3 findings + D-R20 + F1 v2.2.2 memo reference)

---

## Co NEBYLO změněno (vědomě)

- **ManifestRow interface schema** — `value_type` pole zmíněno v H5 textu i novém H16,
  ale není v `interface ManifestRow` definici (ř. 756–763). Pre-existing gap z v2.0.4,
  **neřeší v2.0.5**. Writer může `value_type` vložit do `note` fieldu jako workaround
  nebo orchestrátor přidá schema field v dalším release. Zaznamenáno do
  HANDOVER-F2-v2_0_6-session7.md jako pending task.
- **H10 routing pravidlo** — `during_process` → what_if_box VÝLUČNĚ beze změny. Change 1
  (G3 enum align) jen validuje víc F1 vstupů, nemění jak je router mapuje.
- **Budget profiles** — `max_3a_steps` kalibrace pro prep-heavy kategorie (laminovaná těsta)
  deferred dle D-R16.
- **Line_card_lite range** — 8–10 stringů kalibrace deferred dle D-R19.
- **F1 v2.2.2 implementation** — jen spec memo, samotný F1 prompt není v scope F2 v2.0.5.
- **Variant numbers F1 dodávky** — F1 roadmap pro variants[] s per-variant numerics,
  mimo F2 v2.0.5 scope.

---

## Ready-for-deploy verdict

**v2.0.5 vyřeší všechny 3 findings z Pilot 2 croissant:**
- Finding 1 (G3 enum mismatch) — **FIXED** (Change 1).
- Finding 2 (H1 step_type pro pečení) — **FIXED** via Option B (Change 2).
- Finding 3 (egg wash / F1-F2 ingredient contract) — **FIXED** F2 side (Change 3),
  F1 side pending memo.

**Re-testování v Pilot 2 croissant (cold re-run bez waiveru):**
- G3 by měl projít bez waiveru (croissant FailureMode hodnoty v novém enumu jsou všechny validní).
- Egg wash automaticky adaptovaný dle H16 s manifestem (stejný výstup jako pilotní
  WriterDraft, ale protokolově čistý).
- Pečící krok má `step_type: "prep"` sémanticky validní.

**Doporučení pro Session #7:** Pilot 3 (madeleines) s v2.0.5 jako fresh produkční validace,
nebo cold-read externí review na finální v2.0.5 text.
