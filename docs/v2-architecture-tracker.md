# Peppi Basics v2.0 — Architecture Tracker

> **Single source of truth.** Vše důležité z recenzí, konverzací, rozhodnutí.
> Žije v repu: `docs/v2-architecture-tracker.md`
> Aktualizuje se průběžně — každá konverzace, každý review, každé rozhodnutí.

**Poslední update:** 2026-04-17
**Stav:** F1 v2.2.0 + F2 v2.0.2 → Pilot choux 2026-04-17 ✅ (F1 13/14 H-gates, F2 12/13 H-gates) → D54 formalizován → DALŠÍ: F1 v2.2.1 patche (P1–P5) + F3 Auditor prompt

---

## 1. ROZHODNUTÍ (definitivní)

### Architektura

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D1 | Monolitický prompt v1.9 se nahrazuje multi-fázovým chainem | 5/5 recenzentů v1.9: checklist overload je kořenový problém | v1.9 triage | 2026-04-16 |
| D2 | 5-fázový chain (F0–F4) + deterministický validator (F5) se subagenty | Orchestrator-Workers + Prompt Chaining + Evaluator-Optimizer | Anthropic docs + 7 recenzentů v2.0 | 2026-04-16 |
| D3 | Fáze 0 (Context Hydration) je součástí v2.0 od začátku | Každá karta = zdroj pro budoucí karty, musí se indexovat od první | Gemini review | 2026-04-16 |
| D6 | Orchestrátor = Claude Code se subagenty | LangGraph/PydanticAI/CrewAI mimo scope (solo developer). Code nativně podporuje subagenty | Grok review | 2026-04-16 |
| D10 | Schema validation gate v orchestrátoru (Zod per fáze) | 0 tokenů, eliminuje celou třídu chyb. 6/10 audit bodů deterministicky. Zod = přirozený fit pro Next.js/TS stack | Sonnet/P + GPT + Nemotron + Sonnet/D (4/7) | 2026-04-16 |
| D14 | Fáze 4 generuje JSON/AST, HTML renderuje deterministický template | Eliminuje celou třídu formátovacích chyb. Formatter nesmí být mini-monolit | GPT + Sonnet/P (Legal/Medical pattern) | 2026-04-16 |
| D15 | Fáze 5 = deterministický validator (HTML schema, povinné bloky, manifest, max délky) — bez LLM | Post-format sanity check. 0 tokenů | GPT + Nemotron | 2026-04-16 |
| D11 | Stateful checkpointing — každá fáze zapisuje output do Neon DB | Při selhání neztrácíš předchozí fáze. Produkční standard | Sonnet/P + GPT | 2026-04-16 |
| D12 | Hallucination detection gate mezi F1→F2 (deterministický, 0 tokenů) | Mora parametry musí být citované (číslo + URL), ne volný text | Sonnet/P | 2026-04-16 |

### Auditor (Fáze 3)

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D5 | Evaluator-Optimizer loop, max 2 iterace | Single pass = blind spot. +30–60% tokenů, ospravedlnitelné pro food safety | 7/7 recenzentů | 2026-04-16 |
| D18 | Exit condition: hierarchická (hard exit / soft exit / escalation) | Hard: all gates pass. Soft: ≤2 non-critical → output + warnings. Escalation: AUDIT_FAIL → manual review + diff report | Sonnet/P + GPT + ChatGPT | 2026-04-16 |
| D19 | Auditor musí citovat konkrétní pravidlo pro každou změnu | Anti-scope-creep, anti-hallucination | Sonnet/D | 2026-04-16 |
| D20 | Writer dostane token budget jako parametr od orchestrátoru | Prevence token limit creep. Orchestrátor kalkuluje available tokens | Sonnet/D | 2026-04-16 |

### RAG

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D4 | RAG přes pgvector v Neon | 606 terms + karty v DB. GraphRAG overkill, plain files nestačí. pgvector free v Neon | Gemini + konverzace | 2026-04-16 |

### Sister cards

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D16 | Canonical fragments s `card_family_id`, `variant_id`, verzí a hash | Writer referencuje shared bloky, nepřepisuje. Auditor: byte-for-byte check across cards | GPT + Sonnet/P + Sonnet/D | 2026-04-16 |

### Content & review workflow

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D13 | Template slot-filling pro strukturované bloky (2A, Mora box, tabulky) | Volný text jen kde nutný (1B věda, 3B senzorický profil). Eliminuje ~60% Auditor práce | GPT + Sonnet/P | 2026-04-16 |
| D17 | Research Brief schema validation jako povinný gate | Mora params, GS zdroj, teploty s URL = povinná pole | GPT + Sonnet/P | 2026-04-16 |
| D23 | Staré karty (v1.5–v1.9) se do RAG NEINDEXUJÍ. Přegenerují se pod v2.0 | Prevence kontaminace RAG + eval srovnání | Konverzace | 2026-04-16 |
| D24 | Pořadí pilotů: choux → ladyfinger → makronky FR+IT (sister card pilot) | Od nejjednoduššího k nejtěžšímu | Konverzace | 2026-04-16 |
| D25 | Žádná karta nevstoupí do RAG bez Robinson review manifestu + Comet review | Human-in-the-loop. P/A/E systém beze změny | Konverzace | 2026-04-16 |
| D28 | Comet review = součást workflow, ne blocker. Fallback = ruční sběr přes admin UI | Perplexity limit: 8/10 recenzí prošlo, 2 ne | Konverzace | 2026-04-16 |

### Pedagogický rámec (ze 9-recenzní profesní rešerše)

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D32 | **5-tier hierarchie zdrojů** (ne podle autorské slávy, ale podle institucionálního účelu) | GS = výsledek triangulace, NE jediná autorská kniha. Chef-autoři jen jako kontrast | Sonnet (Perplexity) + GPT 2 (Perplexity) + triangulace | 2026-04-16 |
| D33 | **Taxonomie Basic/Intermediate/Superior** podle LCB kurikula | Josefína se připravuje na LCB/Ducasse — taxonomie musí odpovídat reálnému kurikulu | Všech 9 recenzí konverguje | 2026-04-16 |
| D34 | Každá karta má **curricular_level** + **prerequisites** | Entremet nelze před mousse, mousse nelze před anglaise. Pořadí = pedagogická logika | Nemotron 2 + Sonnet + Grok | 2026-04-16 |
| D35 | Blok 3B rozšířit: **tasting jako integrální součást procesu**, ne bonus | École Ducasse workshop = demo + technical implementation + **tasting** | GPT 2 (Perplexity) | 2026-04-16 |
| D36 | **Institucionální rámec** v Research Brief (textbook_positioning + ratio_framework + institutional_rubric) | Učebnice nejsou GS, ale kalibrace/validace. GS je autorská triangulace | Konverzace (moje analýza po 6 recenzích) | 2026-04-16 |
| D37 | **Hodnoticí rubric 4+1 vrstev**: vizuální / strukturální / senzorická / technická + procesní (MEP, clean as you go, time) | Profesionální hodnocení je procesové, ne chuťové | Sonnet + GPT 2 + ChatGPT + Grok | 2026-04-16 |
| D38 | **Hodnotící kritéria PŘED postupem** v kartě ("hodnotící optika od začátku") | Student ve škole ví, co se hodnotí, dřív než začne. Doma musí být stejně | ChatGPT + Gemini 2 (silent watching) | 2026-04-16 |
| D39 | **Failure tracking** v kartě jako explicitní sekce | Diagnostika chyb > recept. Profesionální vzdělávání učí kontrolu variability | ChatGPT + Sonnet | 2026-04-16 |
| D40 | **Home adaptation: realistický strop 80-90% Basic** doma | Showpieces, velkovýroba, klimatizovaná laminace = pro školu. F1 musí home_constraints flagovat | Grok + Sonnet | 2026-04-16 |
| D41 | **Research-library jako lokální infrastruktura** v Peppi repu (21 souborů, 3286 řádků) | F1 má lokální přístup k 9 školám, 5 frameworkům, borrowable knihám (CIA B&P, Gisslen, McGee), 9 PubMed paperům, King Arthur receptům. Web search šetří budget. | Code Fáze 1-11 | 2026-04-16 |
| D42 | **CIA B&P 3rd Edition lokálně v plném rozsahu** (legální zděděná kopie) | 1139 stran s text layer. Technique Index s přesnými stránkami (craquelin p.145, pâte à choux p.240, macarons p.372-375, crème pâtissière p.417, meringue p.475-478 atd.). F1 sáhne nejdřív sem pro Basic produkty. PDF v .gitignore, content map v git. | Code commit d62596f | 2026-04-16 |

### F1 v2.2.0 triage (7-recenzní panel, průměr 8.8/10)

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D43 | **Token budget F1:** default 8K (z 6K), cap 10K pro režim C/Superior | Brief s institutional_framework + failure_tracking + tasting_protocol nestačí v 6K. Per curricular_level: Basic 6K, Intermediate 8K, Superior 10K. | 5.5/7 recenzentů (TIER 1) | 2026-04-17 |
| D44 | **H12: Gramáže bez veřejně ověřitelného zdroje = nevalidní brief (hard fail)** | Reakce na halucinované školní poměry typu "LCB učí 1:1:1:2 choux" bez atribuce. Buď URL/ISBN+stránka, nebo `null` + důvod. Poctivé `null` > halucinace. | 4/7 + ChatGPT-S eskalace na hard fail | 2026-04-17 |
| D45 | **H13: Povinná konverze do metrického systému (oz/cups/°F → g/ml/°C)** | CIA B&P je US kniha. Bez konverze F1 dodá `amount_g: 0` s "1 cup flour" ve specifikaci → H3 porušen. Python tool k dispozici pro přepočty. | Gemini-P + Gemini-S | 2026-04-17 |
| D46 | **EDGE CASE POLICY: 4 scénáře** (T5-only, doma nemožné, T2 vs T2 rozpor, partial library coverage) | F1 musí umět rozhodnout sám, bez eskalace. Každý scénář má explicitní postup + záznam do `researcher_notes`. | 4/7 recenzentů | 2026-04-17 |
| D47 | **Prerequisites: přidat `strength: "hard" | "soft"` + rationale + "nejkratší Basic path"** | String[] je příliš plochý — Intermediate mousse vyžaduje hard anglaise + soft šlehání smetany, F2 to rozlišuje v Bloku 7. Preference: kratší sekvence hard prerekvizit. | 3/7 recenzentů (Nemotron návrh) | 2026-04-17 |
| D48 | **when_detectable enum: +after_filling, +during_storage, +during_baking_transition** | Stávající 3 hodnoty (during_process, immediately_after, after_cooling) nepokrývají realitu: propady při pečení (baking_transition), migrace vlhkosti po naplnění (after_filling), kondenzace ve skladování (during_storage). | 3/7 recenzentů | 2026-04-17 |
| D49 | **Grok vyřazen z recenzních panelů** | Rubber stamp — 9.5/10 bez kritických nálezů, unikátní přínos = kosmetický bug (researcher_version komentář). 0 přidané hodnoty vs ostatní. Pro F3 Auditor panel: 5 recenzentů (ppl-Sonnet, ppl-ChatGPT, ChatGPT-S, Gemini-S, ppl-Nemotron). | Triage analýza | 2026-04-17 |

### F2 v2.0.2 synchronizace s F1 v2.2.0

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D50 | **Section_0 "Co hodnotíme" jako první blok karty (D38 implementace)** | Hodnotící optika PŘED postupem. Konzumuje `institutional_rubric.criteria` (4-5 vrstev: visual/structural/sensory/technical/process). H11: pokud rubric existuje, všechny vrstvy MUSÍ být v section_0. | F2 v2.0.2 patch | 2026-04-17 |
| D51 | **3C konzumuje FailureMode[] přímo, NE zploštěný string[]** | F1 v2.2.0 produkuje strukturované FailureMode s diagnosis + prevention + when_detectable + target_for_training. 3C má nové pole `when`. FailureMode s `during_process` → what_if_box (M4: reálný čas ≠ post-faktum), ostatní → 3C. | F2 v2.0.2 H10 | 2026-04-17 |
| D52 | **Block_7 rozšíření: prerequisites (hard/soft labels), estimated_mastery_hours, unlocks, training_targets (max 2)** | Blok 7 byl minimální (4 pole). Teď obsahuje kompletní pedagogický kontext z textbook_positioning + top 2 failure modes s target_for_training jako explicitní cvičební cíle. | F2 v2.0.2 H12, H13 | 2026-04-17 |
| D53 | **Tasting_protocol integrace do 3A + what_if_box (S8)** | Každý TastingCheckpoint MUSÍ najít domov: `RecipeStep.tasting_note` (inline), nový `step_type: "tasting"` (samostatný checkpoint), nebo what_if_box (pokud má what_if_wrong). Žádný tasting tiše nevypadne. | F2 v2.0.2 S8 | 2026-04-17 |

### Pilot 2026-04-17 — pipeline invarianty

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D54 | **Peppi DB isolation in Basics pipeline.** Peppi DB (89 user-collected, unvalidated recipes) MUST NEVER be used as a source for any Basics card — not as Golden Standard, not as reference, not as validation target. F0 Hydrator (when implemented) may retrieve ONLY: (1) glossary terms (606 culinary terms), (2) structural precedents from approved, published Basics cards. Three defense layers required and verified: (1) `peppi_context: null` passed as explicit input to F1 and F2, (2) F1 H1 invariant: prompt enforces no Peppi DB citations, (3) post-F1 grep check: scan ResearchBrief output for Peppi recipe URLs/IDs before F2 handover. Enforcement in F1 v2.2.1 prompt patch (scheduled). | 89 uživatelských receptů = nevalidované sbírky bez pedagogické autority. Kontaminace Basics pipeline = corrupted educational integrity, neopravitelná retrospektivně. Všechny tři vrstvy ověřeny pilotem 2026-04-17 (grep check clean, `peppi_context: null` maintained throughout F1 and F2). | Pilot 2026-04-17 (choux au craquelin) — pilot-summary.md sekce "D54 Invariant Candidate" | 2026-04-17 |

### F2 v2.0.3 + composite produkty

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D55 | **TODO F1 v2.2.2+: bake params per component v `GoldenStandardComponent.recipe_gs`.** Gap detekován 2026-04-17: `GoldenStandardComponent.recipe_gs` neobsahuje `bake_temp_c` ani `bake_mode` — ty jsou pouze na top-level `golden_standard`. Pro composites s různými teplotami pečení per component (napoleon, millefeuille) to nestačí. Non-blocking pro croissant pilot (flat product) a choux+craquelin pilot (stejná teplota pro oba components). Aktivuje se pouze při composites s různými bake params. | Detekováno při patch surface analýze F2 v2.0.3 — F1 schema gap, ne F2 bug. Choux au craquelin test case: choux shell i craquelin disk pečou společně na 170 °C, takže gap se tam neprojevil. | Patch surface analýza F2 v2.0.3 (2026-04-17) | 2026-04-17 |
| D56 | **TODO recipe-card skill: multi-component card rendering pro composite products.** Blocker pro composite pilot (choux au craquelin). F2 v2.0.3 emituje `WriterDraft.section_2a.components[]` a `section_3a[].component_name` — card template musí renderovat více ingredient tables a více method sekcí s component headers. NOT a blocker pro croissant pilot (flat product, `is_composite: false`). | F2 v2.0.3 changelog explicitně: "Blocker lifted for flat products; composite pilot gated on recipe-card skill update." | F2 v2.0.3 patch (2026-04-17) | 2026-04-17 |

### Ekonomika

| # | Rozhodnutí | Důvod | Zdroj | Datum |
|---|---|---|---|---|
| D29 | Zero additional cost — veškerá LLM práce v rámci Max $100/mo | Code subagenty + claude.ai sdílejí Max limit. Admin UI = jen zobrazení + sběr dat, žádné API cally | Anthropic docs | 2026-04-16 |
| D30 | Opravy a triage v Code nebo claude.ai, ne v admin UI | Admin UI triggeruje "otevřít v Code", ne vlastní API cally | Konverzace | 2026-04-16 |
| D31 | Plánovat "Basics den" vs "coding den" — nekombinovat v jednom 5h okně | 1 karta (~165K tokenů) + review + opravy ≈ jedno 5h okno. Zbývající tokeny z 9:00 se uvolní ve 14:00 | Konverzace | 2026-04-16 |

---

## 2. OTEVŘENÉ OTÁZKY

### Model routing

| # | Otázka | Kontext | Status |
|---|---|---|---|
| Q1 | Writer: Opus vs Sonnet? | Sonnet/P: A/B test, Sonnet může stačit s dobrými příklady | A/B test na pilotech |
| Q21 | Auditor: Opus vs Sonnet (red-teaming)? | 2/7 pro Sonnet (ChatGPT, Sonnet/D). 4/7 implicitně Opus | A/B test na pilotech |

### RAG design

| # | Otázka | Kontext | Status |
|---|---|---|---|
| Q6 | Embedding model | BGE-M3 (free, dense+sparse) vs text-embedding-3-small (OpenAI, levné) vs HF Inference API. Zero-cost constraint (D29)! | K rozhodnutí |
| Q7 | Chunk strategy | Parent-child: child = blok (1A, 1B...) ~200–400 tok, parent = celá karta. Terms = atomické | K designu |
| Q18 | pgvector index typ | HNSW (GPT: lepší speed/recall) | Pravděpodobně HNSW |
| Q23 | Neon free tier pgvector limity | Connection pool + vector ops. Ověřit | Před pilotem |
| Q26 | Embedding versioning při změně modelu | Re-embed celé DB. Ops procedura | K designu |

### Architektura

| # | Otázka | Kontext | Status |
|---|---|---|---|
| Q15 | Token limit pro Research Brief → Writer | Cap ~8K tokenů? Orchestrátor komprimuje | K designu |
| Q16 | Template slot design — které bloky slot, které volný text? | Slot: 2A, Mora box, tabulky, manifest. Volný text: 1B, 3B, PROČ | K designu |
| Q19 | Template engine | Nunjucks (JS/Next.js fit) | K rozhodnutí |
| Q30 | Comet reliability + fallback v admin UI | 8/10 prošlo, 2 ne. Ruční sběr jako fallback | K designu admin UI |

### Odloženo na v2.1+

| # | Co | Proč později |
|---|---|---|
| Q13 | Late-binding retrieval (RAG po Research) | Zvyšuje komplexitu orchestrátoru |
| Q22 | RARR pattern (Auditor s web search) | Drahé per-claim, opt-in pro komplexní karty |
| Q24 | Planner fáze (1.5) | Statický template stačí pro uniformních 7 bloků |
| Q25 | Normalizer fáze (2.5) | Template constraints řeší příčinu |
| Q27 | False confidence spot-check | Light RARR |
| — | DSPy optimalizace | Potřebuje 20+ karet jako eval set |

---

## 3. REVIEW TRACKER

### 3A. Review v1.9 — DOKONČENO (8 recenzí)

| Recenzent | Typ | Status |
|---|---|---|
| gemini-A | A (prompt) | ✅ |
| grok-A | A (prompt) | ✅ |
| ppl-gpt-A | A (prompt) | ✅ |
| ppl-nemotron-A | A (prompt) | ✅ |
| ppl-sonnet-A | A (prompt) | ✅ |
| grok-B | B (karta IT makronky) | ✅ |
| gemini-B | B (karta) | ✅ |
| ppl-gpt-B | B (karta) | ✅ |
| ppl-nemotron-B | B | ❌ (Perplexity limit) |
| ppl-sonnet-B | B | ❌ (Perplexity limit) |

**Top nálezy — viz sekce 6 (Eval data).**

### 3B. Review v2.0 návrhu — DOKONČENO (7 recenzí)

| Recenzent | Klíčový příspěvek |
|---|---|
| Gemini 3 Flash | Fáze 0, sister card parallelization |
| Grok | Benchmark routing, shared brief, Claude Code argument |
| Nemotron/P | Error recovery, auditor exits, RAG konfigurace, Instructor |
| Sonnet/P | Schema gates, checkpoint, BGE-M3, parent-child, Legal/Medical template, hallucination gate |
| GPT/P | "Pravidla do kontraktů", F4 split JSON+template, F5 validator, Research Brief bottleneck, canonical fragments, HNSW |
| Sonnet/D | Auditor red-teaming, scope creep, URL check, token budget, RARR, Zod, per-fáze fallback |
| ChatGPT/D | Planner 1.5, Normalizer 2.5, Auditor na Sonnet, false confidence, embedding drift |

### 3C. Review F1 Researcher v2.1.2 — DOKONČENO (7 recenzí, ∅ 8.8/10)

| Recenzent | Skóre | Kvalita | Unikátní přínos | Doporučení |
|---|---|---|---|---|
| ppl-Sonnet | 7.5 | **A** | Nejkritičtější, najde typové mismatchy (FailureMode vs string) | Ponechat vždy |
| ppl-ChatGPT thinking | 8 | **A** | Architektonické návrhy (sdílená TS definice, D12 dekompozice) | Ponechat vždy |
| ChatGPT standalone | 9 | **A-** | Confidence scoring, T2 vs T2 conflict, hard fail rule pro halucinace | Ponechat |
| Gemini standalone | 9.5 | **A-** | Python tool pro konverze, equipment.substitutable, URL nullability jako blocker | Ponechat |
| ppl-Nemotron | 9 | **B+** | Mapping tabulka ResearchBrief→WriterDraft, failure→training, "nejkratší Basic path" | Ponechat |
| ppl-Gemini thinking | 9 | **C+** | Metrická konverze H13, baker's percentage self-check | Volitelný |
| Grok | 9.5 | **D** | researcher_version bug (kosmetický) | **Vyřazen** — rubber stamp (D49) |

**Triage výsledek:** F1 v2.2.0 (16 změn: TIER 1 token budget + F2 konzumace + K1 FailureMode; TIER 2 H12 hard fail + library freshness + edge cases + T2 vs T2; TIER 3 Prerequisite hard/soft + when_detectable enum + CIA B&P check + equipment.substitutable + H13 metrika + mapping tabulka + failure→training + neg. příklady #12, #13).

**F2 v2.0.2 patch:** Synchronizace s novým F1 v2.2.0 kontraktem. Nový section_0 (D38), FailureMode[] v 3C, Block 7 rozšíření, hard_limits_box, falsely_simple_warning banner. 10 pre-delivery checks (z 5).

**Panel pro budoucí F3 Auditor review:** 5 recenzentů — ppl-Sonnet, ppl-ChatGPT, ChatGPT-S, Gemini-S, ppl-Nemotron. Grok vyřazen, ppl-Gemini volitelný.

---

## 4. ARCHITEKTURA v2.0 (finální)

```
ORCHESTRÁTOR (Claude Code, v rámci Max)
├── Zod schema validation na každém handoff
├── Stateful checkpoint po každé fázi → Neon DB
├── Token budget management
└── Error recovery per fáze

F0: Hydrator (Sonnet) → pgvector search → Peppi context
F1: Researcher (Sonnet) → web search → Research Brief (JSON)
    Gates: Zod schema, hallucination check, URL sanity
F2: Writer (Opus, token budget) → draft (JSON/MD, ne HTML)
    Gates: Zod schema, required bloky, ingredience match
F3: Auditor (Opus/Sonnet — A/B test, loop max 2×) → verified draft + diff
    Rules: cituj pravidlo pro každou změnu
    Exit: hard pass | soft pass + warnings | escalation
F4: Formatter (Sonnet) → JSON/AST + manifest
F5: Validator+Renderer (deterministický, 0 tokenů) → HTML karta
```

### Error recovery

| Fáze | L1: Retry | L2: Fallback | L3: Abort/degrade |
|---|---|---|---|
| F1 | Truncated context | Jiný model | **ABORT** (žádná karta > karta bez zdrojů) |
| F2 | Zjednodušený prompt | Opus→Sonnet | Partial draft + UNAUDITED |
| F3 | Log diff, eskaluj | F2 output + watermark | Manual review |
| F4 | Retry | — | Plain MD output |
| F5 | Vrať do F4 | — | Manual fix |

---

## 5. ADMIN REVIEW UI + WORKFLOW

```
Code vygeneruje kartu → DB (status: draft)
    ↓
Robinson: admin/basics/review
  ├── Manifest review (OK / opravit per řádek)
  ├── Review sběr:
  │     Comet (auto) NEBO ruční (kopírovat prompt → paste recenzi)
  │     [Hotovo, další nebude]
  └── Triage: "Otevřít v Code" → konverzační opravy
    ↓
[Schválit pro produkci]
  → publish + embedding + RAG index → Josefina vidí
```

**Zero-cost (D29):** Admin UI = jen zobrazení + sběr. LLM = Code/claude.ai (Max).

---

## 6. EVAL DATA Z v1.9 RECENZÍ

### Konkrétní chyby v starých kartách (baseline pro v2.0 srovnání)

| # | Chyba | Co v2.0 řeší |
|---|---|---|
| 1 | Disulfidové vazby — přestřelený mikro-mechanismus | Writer negativní příklad |
| 2 | 150°C jako jistota (je adaptace) | Auditor: adaptace vs fakt |
| 3 | Gramáže ne na začátku 3A kroků | Template slot: `gramáž — akce` |
| 4 | KA rychlosti bez senzorického fallbacku | Schema: extrapolace → required fallback |
| 5 | Štítky vypadnou po 3 odstavcích | Separátní Auditor |
| 6 | Obsah mezi Mora boxem a 3A | Deterministický template |
| 7 | 3A příliš ukecaná | Template max word count |
| 8 | What-if box nedostatečný | Writer template: 4 větve |

### Kanonické příklady (pro Writer prompt)

**3A krok — ŠPATNĚ:** `"Sirup na 105 °C → zapni... 37 g bílků"`
**3A krok — SPRÁVNĚ:** `"**100 g cukru + 25 g vody** — vař na **118 °C**."`

**Vědecký štítek — ŠPATNĚ:** `"teplo ze sirupu zesiluje S-S vazby → pevnější pěna"`
**Vědecký štítek — SPRÁVNĚ:** `"Horký sirup podporuje rychlejší agregaci proteinů [robustní empirické pravidlo]"`

---

## 7. IMPLEMENTAČNÍ PLÁN

### Fáze I: Core chain (bez admin UI, bez RAG)
1. [✅] Prompt F2 Writer v2.0.1 (627 řádků, 6 recenzí)
2. [✅] Prompt F1 Researcher v2.2.0 (1477 řádků, 7-recenzní triage ∅ 8.8/10)
3. [✅] Prompt F2 Writer v2.0.2 (1083 řádků, sync s F1 v2.2.0 kontraktem)
4. [ ] Prompt F3 Auditor ← DALŠÍ
5. [ ] Prompt F0 Hydrator
6. [ ] Prompt F4 Formatter
7. [ ] F5 Validator + Renderer (deterministický)
8. [ ] Zod schéma per fáze (ResearchBrief + WriterDraft priorita)
9. [ ] Orchestrátor script pro Code
10. [ ] Error recovery logic
11. [x] **Pilot: choux** (ruční v Code, ruční review — F1+F2 jen, bez F3/F4/F5) (2026-04-17)
12. [ ] Eval: v1.5 choux vs v2.0 choux

### Fáze II: RAG + embedding
7. [ ] pgvector extension + HNSW index
8. [ ] Embedding řešení (zero-cost!)
9. [ ] Drizzle schema (embeddings, card status, review notes)
10. [ ] F0 napojení na pgvector
11. [ ] **Pilot: ladyfinger** (s RAG — choux v indexu)

### Fáze III: Admin review UI
12. [ ] Admin stránka: karta + manifest + diff
13. [ ] Robinson review (OK/opravit per řádek)
14. [ ] Comet integrace + ruční fallback
15. [ ] "Hotovo" trigger + triage display
16. [ ] "Schválit pro produkci" → publish + embedding

### Fáze IV: Sister cards
17. [ ] Canonical fragments schema
18. [ ] Shared Block Registry
19. [ ] Writer locale flag + frozen blocks
20. [ ] **Pilot: makronky FR + IT**

### Fáze V: v2.1+ optimalizace
21. [ ] Late-binding retrieval
22. [ ] RARR (opt-in)
23. [ ] DSPy (až 20+ karet)
24. [ ] A/B testy routing

---

## 8. ZDROJE

---

## 10. PEDAGOGICKÝ RÁMEC (z 9-recenzní profesní rešerše)

> Tato sekce je **ground truth** pro F1 Researcher. Obsahuje triangulovanou kostru napříč 9 recenzemi (Nemotron, GPT, Gemini, Sonnet × Perplexity + Gemini, ChatGPT, Grok samostatně).

### 10A. Tier hierarchie zdrojů (D32)

| Tier | Typ zdroje | Účel | Příklady |
|---|---|---|---|
| **T1** | Kompetenční rámce (státní/akreditační) | Hodnoticí kritéria, kompetence | CAP Pâtissier, City & Guilds L3, Ohio DOE CTAG, SkillsUSA, CIA ProChef 1-3 |
| **T2** | Institucionální technické manuály | Ground truth pro proporce a techniku | CIA B&P, Gisslen Professional Baking, Suas Advanced B&P, Ferrandi French Pâtisserie, Friberg PPC, Bocuse Gastronomique, LCB Pastry School + Foundations |
| **T3** | Oficiální školní dokumenty | Kurikulum, sekvence, metodika | LCB programové PDF, Ducasse FPAE syllabus, Ducasse excellence checklists, ENSP training sheets, Valrhona Les Essentiels |
| **T4** | Food science | Vědecké mechanismy | McGee, Corriher (BakeWise), Figoni (How Baking Works), Barham, Myhrvold (advanced) |
| **T5** | Autorské reference | Kontrast, NE GS | Hermé, Ducasse, Grolet, Conticini, Saffitz + specializované (Greweling čokoláda, Migoya moderní dezerty) |

**Pravidlo:** GS (golden_standard) v Research Brief = výsledek triangulace T1+T2+T3. T5 jen jako `alternative_sources`, NIKDY jako GS.

### 10B. Taxonomie Basic/Intermediate/Superior (D33, D34)

**Basic** — Foundations (cca 6-9 měsíců doma při 6-10h/týden):
- Mise en place, hygiena, francouzská terminologie
- Těsta: pâte brisée, pâte sucrée, pâte sablée, pâte à choux, génoise
- Krémy: crème pâtissière, crème chantilly, crème d'amande
- Meringues: française
- Viennoiserie základy
- Výstupy: tarte au citron, éclairs, ovocné tartaletky, základní piškoty

**Intermediate** — Applications:
- Těsta: pâte feuilletée, pâte levée feuilletée (croissant), brioche
- Krémy: crème anglaise, bavaroise, mousseline, diplomate, crème au beurre
- Meringues: suisse, italienne, dacquoise
- Makarons
- Entremets stavba (Fraisier, Opéra)
- Temperování čokolády — základy
- Plated desserts

**Superior** — Integration:
- Pokročilá laminace
- Zrcadlové polevy (mirror glaze)
- Sugar work: pulled sugar, isomalt, showpieces
- Modelovací čokoláda, čokoládové skulptury
- Petit fours
- Složené entremets s inserts
- Restaurační plating, cost control
- Autorská tvorba, sezónní kolekce

**Realistický home strop (D40):** 80-90% Basic úrovně. Zbytek Basic + významná část Intermediate/Superior vyžaduje školu (klimatizovaná laminace, blast chiller pro entremets, velkoobjemová produkce, profi feedback).

### 10C. Pedagogické principy pro strukturu karty

**Konvergence napříč 9 recenzemi:**

1. **Model demo → praxe → evaluace** (všichni) — karta musí obsahovat všechny tři vrstvy
2. **Hodnotící optika od začátku** (D38) — hodnotící kritéria v kartě PŘED postupem, ne za ním
3. **Tasting jako integrální součást procesu** (D35) — ne bonus, ale průběžné kontrolní body
4. **Silent watching + poznámky** během dema — sensory cues (zvuk, vizuál, textura v čase), ne historie
5. **Repetice 3-6× minimum** pro svalovou paměť a stabilitu — blok 7 (tréninkový protokol) povinný pro Basic
6. **Failure tracking** (D39) — explicitní sekce v kartě, ne jen troubleshooting reactive
7. **Cílené selhání** jako pedagogická strategie — test hranic (moc studené máslo, málo vajec...)
8. **Process + product hodnocení** — oboje v kartě
9. **Clean as you go** jako zkouškové kritérium — explicitně v procesní vrstvě

### 10D. Hodnotící rubric — 4+1 vrstev (D37)

1. **Vizuální** — symetrie, barva, geometrie (prahy indikativně: ±5% výška, ±2mm velikost)
2. **Strukturální** — pórovitost, rovnoměrnost, stabilita
3. **Senzorická** — textura, chuť, balance (NE jen "dobré" — konkrétní deskriptory)
4. **Technická** — konzistence mezi kusy, reprodukovatelnost
5. **Procesní** — mise en place, clean as you go, time management, hygiena

**Veřejný konkrétní vzor:** Ohio DOE éclair rubric (Sonnet našel URL) — použít jako template pro Peppi karty.

### 10E. Home adaptation framework

| Aspekt | Školní režim | Domácí režim |
|---|---|---|
| Čas | 15-35h/týden | 6-10h/týden |
| Basic úroveň | 11 týdnů | 5-9 měsíců (konzervativní) až 9-12 měsíců (realistický) |
| Chef demo | Živý, 2.5-3h | Video + textbook + vlastní poznámky |
| Feedback | Chef real-time | Rubric + foto řezu + externí testeři (3-5 lidí) |
| Peer group | 15-20 spolužáků | Online komunity (r/pastry, r/AskCulinary) |
| Struktura týdne | Denně labs | 1 velký blok (3-4h) + 1-2 repetice + 1 review |

### 10F. ČR/EU specifika (home_constraints)

**Dodavatelé profi ingrediencí dostupní v ČR:**
- Sosa Ingredients (stabilizátory, NH pektin, metylcelulóza)
- MSK Specialist Ingredients
- Valrhona / Cacao Barry / Callebaut couverture
- Digitální teploměr, váha na 1g — nezbytné

**Specifické adaptace:**
- Supermarketové máslo má víc vody než profi (84% tuku) — nutná kalibrace receptur
- Makronky: odvlhčovač (ideál 40-50% RH), problematické v létě v ČR
- Laminování: máslo 15-16°C, pracovat ráno/večer/v zimě
- Temperování čokolády: 18-20°C okolní teplota
- Domácí náhrady: lávový kámen pro tepelnou setrvačnost, vyklizený mrazák s hlubokými podnosy (ne šoker)

### 10G. Kde F1 MUSÍ triangulovat (nejistoty z rešerše)

Následující údaje jsou napříč recenzemi **protichůdné nebo bez veřejného zdroje** — F1 je NESMÍ použít z promptu, MUSÍ je hledat v aktuálních zdrojích s minimálně 3-zdrojovou triangulací:

- Konkrétní školní gramáže (pâte à choux mělo 6 různých poměrů napříč recenzemi)
- Hermé vs LCB konkrétní srovnání (protichůdné mezi Gemini 1 a 2)
- Makaron pied přesné proporce (3 varianty: 1:2, 3mm, 1/3 výšky)
- Interní hodnotící rubriky škol (všechny recenze přiznaly — nejsou veřejné)

**Bezpečně dohledatelné (T1 rámce):**
- SkillsUSA pâte à choux formula (veřejný PDF)
- Ohio DOE éclair rubric (veřejný PDF)
- CIA ProChef Level 2 Study Guide (veřejný PDF)

### 10H. Research Brief rozšíření (D36)

Přidat do ResearchBrief pole `institutional_framework`:

```typescript
institutional_framework: {
  textbook_positioning: {
    cia_baking_pastry_chapter?: string;
    gisslen_chapter?: string;
    skillsusa_reference?: string;
    ohio_doe_rubric_url?: string;
    curricular_level: "Basic" | "Intermediate" | "Superior";
    prerequisites: string[];              // Názvy karet, které Josefina musí mít před touto
  };
  ratio_framework?: {
    source: string;                       // Veřejný zdroj (SkillsUSA...)
    ratios: Array<{ parameter: string; range: string; }>;
    gs_vs_framework: "within" | "slight_deviation" | "significant_deviation";
    deviation_note?: string;
  };
  institutional_rubric?: {
    source: string;                       // Ohio DOE / SkillsUSA / ProChef
    url: string;
    criteria: Array<{ category: string; requirements: string[]; }>;
  };
}
```

---

## 11. ZDROJE

### Z recenzí (mimo Anthropic)
- DSPy: Khattab et al., Stanford NLP (arxiv.org/abs/2310.03714)
- Instructor: python.useinstructor.com
- Self-Refine: arxiv.org/abs/2303.17651
- RARR: Gao et al., ACL 2023
- Legal/Medical: ZenML Anzen case study
- BGE-M3: huggingface.co/BAAI/bge-m3
- pgvector HNSW: access.crunchydata.com/documentation/pgvector

### Z profesní rešerše (T1 + T3 veřejné zdroje)
- Ducasse FPAE syllabus: abudhabi-ecoleducasse-studio.ae/wp-content/uploads/2024/07/ME1754-ED-FPAE-Program-Syllabus_v2.pdf
- CIA ProChef Level 2 Study Guide: ciaprochef.com/wp-content/uploads/2024/06/Pro-Chef-Certification-Program_Level2_Exam-Study-Guie.pdf
- Ohio DOE Baking & Pastry CTAG: education.ohio.gov/getattachment/Topics/Career-Tech/Career-Fields/Hospitality-and-Tourism/Baking-and-Pastry-Arts-CTAG-Performance-Assessment-WB-1.pdf.aspx
- SkillsUSA pâte à choux: skillsusa.org/wp-content/uploads/2024/02/2024_3-Pate-a-Choux.pdf
- LCB programový PDF: hospitality-on.com/sites/hon/files/2018-12/1.9.eng_le_cordon_bleu_all_programs.pdf
- ICE Career Catalog: ice.edu/sites/default/files/PDF/ICE%20CAREER%20CATALOG_2022%20(1).pdf
- CIA Library LibGuide: library.culinary.edu/bake/books
- ENSP training sheets: ecoleducasse.com/download_file/force/4701/1283

### Klíčové soubory
| Co | Kde |
|---|---|
| Peppi repo | `~/Desktop/1Peppulka/peppi` |
| Tracker | `docs/v2-architecture-tracker.md` |
| v1.9 prompt | uploads / recipe-card skill references |
| v2.0 návrh | `peppi-v2-architecture-proposal-and-review-prompt.md` |
| v2.0 review prompt v2 | `peppi-v2-architecture-proposal-and-review-prompt-v2.md` |
| v1.9 recenze | `public/review-pipeline/sessions/v1.9-audit/` |
| F2 Writer prompt v2.0.1 | uploads (hotový) |
| F1 Researcher draft v2.0.0 | uploads (čeká na upgrade z rešerše) |
| 9 recenzí profesní rešerše | v této konverzaci |
| Code research library prompt | `peppi-code-prompt-research-library-deep-search.md` (hotový, čeká na spuštění) |
| Existující karty | choux (~v1.5), ladyfinger (~v1.5), makronky FR (~v1.9), IT (~v1.9) |

---

## 9. KONVERZAČNÍ ZÁSOBNÍK

**Hlavní vlákno:** v2.0 implementace Fáze I — psaní promptů
**Hotové:**
- F2 Writer prompt v2.0.1 (627 řádků, 6 recenzí)
- F1 Researcher prompt v2.1.2 (1122 řádků)
- **F1 Researcher prompt v2.2.0 (1477 řádků)** — 7-recenzní triage, průměr 8.8/10, 16 změn (TIER 1+2+3), D43-D49
- **F2 Writer prompt v2.0.2 (1083 řádků)** — synchronizace s F1 v2.2.0 kontraktem, D50-D53
- 9-recenzní profesní rešerše (Nemotron/GPT/Gemini/Sonnet × Perplexity + Gemini/ChatGPT/Grok samostatně)
- **Research-library v peppi repo (21 souborů, 3286 řádků, commit 61b6585)** — 9 škol, 5 frameworků, 8 knih, 9 paperů, 13 YouTube, 9 King Arthur receptů, buy-list
- **CIA B&P 3rd Edition lokálně v plném rozsahu** (commit d62596f) — content map s technique indexem, PDF v .gitignore
- Tracker D32-D56 (pedagogický rámec + library infrastruktura + F1 v2.2.0 triage + F2 v2.0.2 sync + F1 v2.2.1 + F2 v2.0.3 composite)

**Další krok (priorita):**
1. **Commit F1 v2.2.0 + F2 v2.0.2 + tracker D43-D53** do peppi repa
2. **Pilot F1+F2 na choux** — ruční v Code, manuální review výstupu, porovnání s v1.5 choux kartou
3. **Po pilotu:** F3 Auditor prompt (s novým 5-recenzním panelem bez Groka, D49)

**5h okno:** "Basics den" vs "coding den" — nekombinovat (D31)
