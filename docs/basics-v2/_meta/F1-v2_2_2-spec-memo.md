# F1 Researcher v2.2.2 — Spec Memo: Supply Ingredient Role Field

**Status:** PENDING SPEC (ne implementace)
**Vydáno:** 2026-04-20 Session #6 F2 v2.0.5 release
**Pro:** Budoucí F1 line session (separátní work stream od F2).
**Zdroj:** Pilot 2 croissant (2026-04-20) Finding 3 — egg wash v `method_summary` bez odpovídající položky v `ingredients[]`.
**Relates to:** F2 v2.0.5 H16 (Supply-type ingredient policy) — F2 side backward-compat fallback.

---

## Problem statement

F1 v2.2.1 ResearchBrief schema:

```typescript
interface GoldenStandard {
  ingredients: IngredientRow[] | null;  // hlavní receptové položky
  method_summary: string;               // prózový popis metody
  // ...
}

interface IngredientRow {
  name_cz: string;
  name_orig: string | null;
  amount_g: number | null;
  note: string | null;
  // ...
}
```

**Žádný field `role`** — F1 dodává jen "hlavní" ingredience, implicitně. Supply ingredience
(egg wash, mouka na posypání, máslo na plech, sůl do vody) jsou:

1. Zmíněné v `method_summary` prose,
2. Implicitně vyžadované kroky v method,
3. **NE explicitně v `ingredients[]`** s vlastní gramáží.

Writer F2 musí adaptovat ad-hoc (v2.0.5 H16 policy) — derivuje gramáže ze standardní
profesionální praxe, manifestuje každou adaptaci.

**Konsekvence bez F1 fixu:** Každá Basics karta s supply ingrediencemi má Writer adaptaci.
Konsistence napříč kartami je dobrá (H16 tabulka standardizuje rozsahy), ale F2 side work
je redundantní — F1 má zdroje (GS recepty, textbooks), aby supply dodal sám.

---

## Proposed change

### 1. Přidat `role` field do `IngredientRow`

```typescript
interface IngredientRow {
  name_cz: string;
  name_orig: string | null;
  amount_g: number | null;
  role: "main" | "supply";  // v2.2.2 NOVÝ POVINNÝ FIELD
  note: string | null;
  // ...
}
```

**Semantika:**
- `"main"` — hlavní receptová položka (výchozí, backward-compat pro v2.2.1 consumers).
- `"supply"` — doplňková ingredience nezbytná pro finální produkt, ale ne součást hlavní
  receptury (egg wash, mouka na posypání, máslo na plech, sůl do vody, cukr na dózování).

### 2. Audit F1 — povinná přítomnost v `ingredients[]`

F1 v2.2.2 MUSÍ zahrnout do `ingredients[]` **každou** ingredienci zmíněnou v `method_summary`
nebo ve zdrojových receptech (GS, alternative_sources). Kontrola:

```
Pro každou ingredienci I zmíněnou v method_summary nebo ve zdrojovém receptu:
  IF I JE hlavní receptová položka:
    ingredients[].push({name_cz: I, role: "main", amount_g: <source value>, ...})
  ELIF I JE doplněk (egg wash, plech mazání, atd.):
    ingredients[].push({name_cz: I, role: "supply", amount_g: <source value OR standard professional range>, ...})
  ELIF I je variantní nebo tasting-only:
    ingredients[].push s `note` označující variantní status, role: "main"
```

Pokud F1 detekuje supply ingredienci zmíněnou v method_summary, ale zdrojový recept nemá
vlastní gramáž, F1 může použít standardní profesionální rozsahy (stejné jako F2 H16 tabulka):

| Supply | Standard range | Reference |
|---|---|---|
| Egg wash (vejce+mléko 1:1) | 40–60 g/plech | CIA B&P, Rinsky |
| Egg wash (jen vejce) | 25–40 g/plech | FCI Pastry |
| Mouka na posypání | 10–30 g | obecná praxe |
| Máslo na vymazání | 5–15 g | obecná praxe |
| Sůl do vařicí vody | 8–12 g/L | obecná praxe |
| Cukr na dózování | 5–15 g/plech | obecná praxe |

F1 může tyto hodnoty cítit přímo z GS receptu (pokud zdroj uvádí), nebo derivovat ze
standardní praxe s `note: "standard professional practice, derived by F1 v2.2.2"`.

### 3. Backward compatibility

- **F1 v2.2.1 bez `role` fieldu:** F2 v2.0.5 čte `role` jako optional (`role?: "main" | "supply"`).
  Pokud `role === undefined`, F2 předpokládá `"main"` (backward-compat default).
- **F2 v2.0.5 H16 policy:** Zůstává aktivní jako **fallback** — Writer adaptuje supply jen
  pokud F1 nedodal. Po F1 v2.2.2 stabilním deployi bude většina Writer supply adaptací
  eliminována (H16 použito jen pro edge cases, které F1 minul).

### 4. Testing

- **F1 unit test:** Pro každý known GS recept (croissant, makronky, brioche, tarte tatin, atd.)
  ověřit, že všechny ingredience z method_summary (parsed via keyword search "egg wash", "mouka na posypání", "máslo na plech") mají odpovídající položku v `ingredients[]` s `role: "supply"`.
- **F1-F2 integration test:** Re-run Pilot 2 croissant s F1 v2.2.2 → WriterDraft NESMÍ
  mít Writer-derived supply ManifestRow (F1 dodá gramáže).

---

## Effort estimate

- **F1 spec detailing:** 30 min (rozšíření ResearchBrief schema, konkrétní enum pravidla).
- **F1 prompt rewrite:** 1 h (sekce o ingredients audit, supply keyword detection).
- **F1 testing:** 1 h (re-run existujících pilotů, compare `ingredients[]` before/after).
- **Celkem:** ~2.5 h ve samostatné F1-focused session.

---

## Out of scope pro tento memo

- **F0 Hydrator změny** — supply kategorie se týká jen zdrojových receptů, ne Peppi Context.
- **F3 Auditor pravidla** — Auditor bude checkovat `role` field přítomnost až po F1 v2.2.2
  deployi, není akutní.
- **Peppi DB schema** — user recipes v Peppi DB nemají supply kategorii, protože nejsou zdrojem
  pro Basics cards (D54 isolation).

---

## Rozhodnutí na Robinsonovi (v budoucí F1 session)

1. **Schedule:** Kdy F1 v2.2.2 session? Možné okamžitě po v2.0.5 deployi, nebo odložit po
   Pilotu 3/4 pro víc empirických dat na supply patterns.
2. **Role enum:** Stačí `main | supply`, nebo přidat `variant | tasting` pro kompletní taxonomii?
   Doporučení: začít s `main | supply` (minimální scope), další hodnoty až pokud vyvolá potřebu.
3. **F1 audit implementace:** Hard-fail (F1ProtocolViolation pokud method_summary ingredience
   chybí v ingredients[]) vs. soft-warn (F1 note field s "potential supply gap detected")?
   Doporučení: začít soft-warn, eskalovat na hard-fail po pár pilotech stabilního chování.

---

*Tento memo je input pro samostatnou F1 line session, ne úkol pro aktuální F2 Session #6. Po
F1 v2.2.2 deployi F2 v2.0.5 H16 zůstává platný jako backward-compat fallback.*
