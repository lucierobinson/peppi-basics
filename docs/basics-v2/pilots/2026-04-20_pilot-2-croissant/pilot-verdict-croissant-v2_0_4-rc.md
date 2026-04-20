# Pilot Verdict — Croissant, F2 v2.0.4-rc

**Pilot:** 2 (croissant, flat product, FCI+CIA B&P)
**Baseline:** F2 v2.0.4-rc (1553 řádků)
**F1 input:** ResearchBrief v2.2.1, generated 2026-04-18
**Session:** #5, 2026-04-20

---

## Verdict

**SHIPS WITH PATCHES**

Pilot odhalil 3 patch-level issues v F2 v2.0.4-rc. WriterDraft byl úspěšně vygenerován (s waiverem G3), je strukturálně validní a obsahově konzistentní. Patche jsou všechny **nízko-středně invazivní**, žádný nevyžaduje přepracování architektury v2.0.

Prompt **není ready pro blind produkční deploy**, ale je ready pro **Session #6 P2/P3 triage** s konkrétními target changes. Token diet (Fáze 5) je stále deferred dle D-R4.

---

## Finding summary

| # | Severity | Target | Cascade | Session #6 effort |
|---|---|---|---|---|
| 1 | **PATCH** | G3 gate enum | 1 location | 15 min |
| 2 | **ENHANCEMENT** | H1 step_type enum | 3–5 cascade | 1 h |
| 3 | **PATCH** | F1-F2 ingredient contract | F1 protocol | 30 min (F2 side) |

---

## Finding 1 — Gate G3 enum mismatch

**Severity:** PATCH (blocker pro deploy, ale ohraničený v jedné sekci promptu)
**Location:** F2 prompt ř. 930 (PRE-GENERATION GATE, G3 spec)

**Problem.** G3 enum pro `FailureMode.when_detectable` je podmnožinou výstupního `TroubleshootRow.when` enumu (ř. 660). F1 v2.2.1 emituje hodnoty validní pro výstup, ale gate je odmítne jako invalid shape.

- G3 accepts: `during_process`, `immediately_after`, `after_cooling`, `next_day`
- TroubleshootRow.when accepts: `during_baking_transition`, `immediately_after`, `after_cooling`, `after_filling`, `during_storage`
- F1 emituje pro croissant: `during_process` (2×), `immediately_after` (2×), `during_baking_transition` (2×), `during_storage` (1×)

Šest ze sedmi failure modes je kompatibilních s alespoň jedním enumem. Tři jsou mimo G3 enum ale v TroubleshootRow enumu.

**Proč to nebylo zachyceno dřív:** Pilot 1 (choux au craquelin) pravděpodobně náhodou nepoužil tyto hodnoty, protože F1 pro choux emituje `immediately_after` pro většinu failure modes. Croissant s `during_baking_transition` je první produkt, který enum napíná.

**Fix recommendation:** Option A — align G3 enum s TroubleshootRow enumem (+ `during_process` samostatně pro what_if routing). Nejmenší zásah, backward-compatible.

**Detail patch (pro Session #6):**
```diff
- Pokud kterýkoli FailureMode chybí `when_detectable` nebo má nevaliditní hodnotu → gate fail.
+ Pokud kterýkoli FailureMode chybí `when_detectable` nebo má hodnotu mimo:
+ {"during_process" | "immediately_after" | "during_baking_transition"
+  | "after_cooling" | "after_filling" | "during_storage" | "next_day"}
+ → gate fail.
```

Waiver detail viz WAIVER-declaration-croissant-v2_0_4-rc.md.

---

## Finding 2 — H1 step_type enum nepokrývá pečení

**Severity:** ENHANCEMENT (konceptuální; fungující workaround existuje)
**Location:** F2 prompt ř. 616–640 (RecipeStep interface), ř. 953–965 (H1)

**Problem.** Současný H1 exempt enum: `standard` | `tasting` | `preheat` | `assembly` | `prep`. Pro kroky typu "peč X min na Y °C" (tepelná transformace existujícího polotovaru bez přidání nové ingredience) neexistuje přesný step_type:

- `standard` porušuje H1 (chybí gramáž).
- `preheat` je sémanticky nesprávné (preheat = příprava trouby před pečením, ne pečení samotné).
- `prep` je nejbližší dostupný (workaround pro tento pilot — step 17 "peč 190 °C 18–20 min" má step_type: prep), ale prep je dle definice "tvarování polotovaru / chlazení / odpočinek" — pečení tam nepatří sémanticky.

V croissant karta použila `prep` pro 5 kroků: 3 válení/obrátky (semanticky správně prep), 1 finální vyválení + řezy (prep), a 1 pečení (sémanticky neodpovídá). Distribuce step_types ve výsledku: 2 standard, 3 tasting, 12 prep, 1 preheat.

**Pozorování pro Fázi 7 kalibraci:** U laminovaných těst je `prep` dominantní, ne `standard`. To není bug, je to charakteristika kategorie produktu — budget_profile `max_3a_steps` by mohl tuto distribuci zohlednit.

**Fix recommendation (3 opce):**

**A.** Přidat `step_type: "bake"` (nejčistší, ale cascade do H1 textu, DATA FLOW, post-delivery check #3).
**B.** Rozšířit definici `prep` o "tepelnou transformaci bez přidání ingredience" (minimum zásah, méně sémanticky čisté).
**C.** Ponechat pečení jako `standard` s výjimkou v H1 pro kroky s `temperature_c + duration_minutes` bez gramáže (specifické, ale řeší jen pečení).

Session #6 triage rozhodne. Tento finding nepovažuji za blocker (workaround funguje), ale vyžaduje review.

---

## Finding 3 — H4 vs. F1 brief shape (egg wash problem)

**Severity:** PATCH (protokolová mezera mezi F1 a F2)
**Location:** F1 ResearchBrief schema (`golden_standard.ingredients`), F2 H4 invariant (ř. 973–980)

**Problem.** F1 brief pro croissant obsahuje v `golden_standard.method_summary` zmínku "2× potřít vejcem" (egg wash), ale `golden_standard.ingredients[]` egg wash neobsahuje jako samostatnou položku. F2 H4 vyžaduje, aby všechny ingredience v 3A byly v 2A.

Writer řešil ručně — přidal `vejce (egg wash) 50 g` a `mléko (egg wash) 15 g` do 2A a manifestoval adaptaci (manifest row s confidence: "adaptováno", Writer-derived gramáže).

**Workaround funguje, ale je hack.** Podle constitution §2.2 (D54) všechny numerické hodnoty mají mít source provenance — egg wash gramáže v pilotu jsou "standardní profesionální praxe" (50 g = 1 L vejce, 15 g = 1 lžíce mléka), což je tenká provenance.

**Hlubší issue:** Existuje kategorie "supply" ingrediencí (egg wash, mouka na posypání, máslo na plech, sůl do vody) — ingredience potřebné pro finální produkt, ale nepatřící mezi hlavní receptové položky. F1 ResearchBrief aktuálně nemá explicit policy pro tyto supplies.

**Fix recommendation:**

**A.** F1 v2.2.2+ bude povinně dodávat VŠECHNY ingredience zmíněné v `method_summary` jako samostatné položky v `ingredients[]` (s rolí "supply" pokud patří do této kategorie).

**B.** F2 v2.0.5 bude mít explicit policy pro supply-type ingredience: Writer smí přidat do 2A s ManifestRow a Writer-derived gramážemi, pokud F1 method_summary je explicitně zmiňuje.

**C.** Ponechat stav (každý Writer bude řešit ad-hoc jako tento pilot). Nedoporučeno — konsistence napříč kartami bude nahodilá.

**Primární doporučení: A** (fix na F1 straně, odstraňuje need pro F2 adaptaci). Sekundárně B (fallback kdyby F1 change byla dlouhá).

---

## Pozitivní signály z pilotu

Ne všechno je patch. Pilot potvrdil, že velké části v2.0.4-rc fungují:

- **P1.3 line_card_lite (10 stringů):** Formát `N. **gramáž** — signál` funguje. Josefina může tisknout jako 1A4 reference u sporáku. Count 10 je na horní hranici 8–10 rozsahu, ale pro 2denní proces adekvátní.
- **P1.5 section_0 rubric:** 5 criteria_layers z F1 rubrics se bez problémů mapují. AUDIENCE/LANE optika (TEACHER/EXAMINER) je v kartě viditelně odlišná od 3A instrukcí.
- **P1.8 pre-generation gate:** Gate koncept funkční (G3 by hard-stopnul v produkci bez waiveru — přesně ta role, kterou má mít).
- **P1.9 H5 ManifestRows (režim B):** 8 manifest rows pokrývá všechny Writer adaptace (5 Mora/teplota/máslo, 1 kategoriální hard_limits, 2 egg wash Writer-derived). Regime B flow je čistý.
- **P1.4 S13 epistemic language:** 1B odstavce mají štítky `[robustní empirické pravidlo]` a `[mechanismus — konsenzus]` odpovídající confidence. Žádné absolutní "vždy" / "nikdy".
- **P1.6 H15 variant prose:** 2 ze 3 variant mají base knowledge numerics (~40 g bistro, ~8×12 cm pain au chocolat). `variant_numbers_from_base_knowledge: true` flag + check #13 s per-variant rationale správně set.
- **P1.10 DATA FLOW routing:** Všechna F1 pole našla svůj slot (institutional_rubric → section_0, tasting_protocol → 3A inline + tasting steps, failure_tracking → 3C/what_if routing per H10, home_constraints → 2B/2E).

---

## Post-delivery report summary (v draftu)

14 checků, výsledek:
- **13 OK**
- **1 ISSUE** (check #13 — variant number provenance, H15): correct behavior — variant_numbers_from_base_knowledge flag + rationale. Není to violation, je to transparentní signál.

Žádný CRITICAL ISSUE. Draft je auditovatelný F3 Auditorem (až vznikne).

---

## Doporučení pro Session #6

**Priorita:**

1. **Finding 1 (G3 enum) — Option A** — 15 min patch, deploy-blocker fix.
2. **Finding 3 (egg wash) — Option A nebo B** — F1 v2.2.2 side je delší ale čistější, F2 v2.0.5 side rychlejší.
3. **Finding 2 (H1 step_type) — deferred nebo Option B** — není blocker, workaround stabilní.

**Původní Session #1 triage (P2/P3) z handoveru:**

- **P2.1–P2.6** (Fáze 3 rozšíření): **odložit**. Pilot prokázal, že empirické patche jsou hodnotnější než teoretická rozšíření. Nejdřív opravit 3 findings, pak teprve zvažovat P2.
- **P3.1–P3.8** (Fáze 4 drobnosti): **lze paralelně s fixy**. Některé P3 položky (např. P3.2 S3 regex, P3.6 max_3a_steps count) mohou zpřesnit findings. P3.7 (writer_reasoning 6→8 vět) by umožnil Writerovi vysvětlit H4/egg wash adaptaci lépe.

**Fáze 6 (cold-read review):** **deferovat do po-fix stavu v2.0.5**. Cold-read na rc s 3 známými findings = ztráta reviewer kapacity. Po fixu má smysl.

**Pilot 3:** Doporučení — **madeleines** (bucket (a) review dle D-R5). F1 brief už existuje (uploadnuté do této session omylem). Rychlá validace po v2.0.5 fixu.

---

## Co bylo NEuděláno (vědomě)

- **Audit check #1 (F1 input integrity, H14):** F1 brief nemá `error_type: "protocol_violation"` → H14 nepoužita. Check OK ale netestovaná hloubka.
- **Audit check #6 (Režimová poctivost):** Režim B deklarován, adaptace v manifestu. Neověřoval jsem, že žádná adaptace není skrytá mimo manifest — to je F3 Auditor job.
- **Audit check #10 (FailureMode content fidelity):** Povrchní kontrola — text failure modes byl přenesen bez ztrátové parafrázy, ale detailní sémantický diff nebyl proveden.
- **Writer model consistency:** `meta.writer_model: "claude-opus-4-7"` — pilot běžel v Claude Opus 4.7 (single-pass). A/B test Opus vs. Sonnet per promptu byl deferován (D-R4 area).

---

## Context budget post-mortem

Handover předpokládal ~150k pro Variantu C. Skutečnost: pilot spotřeboval ~60k na F1 brief load + audit + 3 findings. Zbytek je tento verdict + deliverables. Varianta C byla v budgetu (estimation handoveru byla konzervativní).

---

*Připraveno: 2026-04-20, konec Session #5 Pilot 2 croissant.*
