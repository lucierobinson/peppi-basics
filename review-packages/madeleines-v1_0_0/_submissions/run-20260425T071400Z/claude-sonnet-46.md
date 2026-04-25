---
reviewer: claude-sonnet-46
model_preference: claude46sonnetthinking
identify_as: "Claude Sonnet 4.6 (Thinking)"
status: OK
chars: 14849
durationMs: 344377
timestamp: "2026-04-25T07:18:15.748Z"
attachment_used: true
---

Níže je přísná recenze. Žádný diplomatický úvod.

***
## Persona 1 — Chef-instruktor (pastry, 15+ let výuky)
### A. Faktická správnost receptu (Blok 3A)
**A1. Jsou gramáže správné?**

NYT archive z roku 2009 publikuje FCI/Torres recept jako: 4½ oz cukru (= 127,6 g) a 3¾ oz mouky (= 106,3 g). Karta uvádí 125 g cukru a 110 g mouky a tvrdí „gramáže převzaty přímo z FCI." To jsou dvě nesrovnalosti:[1]

- Cukr: 127,6 g vs. 125 g → rozdíl 2,1%. V rámci zaokrouhlení pro metrické vydání přijatelný.
- Mouka: 106,3 g vs. 110 g → rozdíl 3,5%. Při prohlášení „1:1 máslo:mouka" je citovaný poměr 110:110 = 1,000, ale reálný FCI poměr by byl 110:106 = 1,038. Karta zaokrouhlila 106 g na 110 g a tím upravila vlastní klíčový ratio claim.

| Severity | Hodnocení |
|---|---|
| STŘEDNÍ | Karta tvrdí „převzato přímo z FCI", ale mouka je o ~4 g navýšena. Poměr 1:1 je proto technicky vlastní normalizací, ne FCI číslem. Musí být buď opravena gramáž nebo musí být ratio označen jako „normalizováno na 1:1". |

Poměr máslo:mouka 1:1 je nicméně autentický pro klasické francouzské madeleines — konzistentní s FCI filosofií a potvrzený napříč francouzskou literaturou. Tato normalizace není zákeřná, ale musí být označena.

**A2. 100 g za 2 large eggs** — Rozumné. EU třída L = 63–73 g celé vejce, ~50–60 g bez skořápky. Karta správně označuje „odhad 2 × 50 g" a doporučuje vážit. OK.

**A3. 200 °C jako domácí adaptace z FCI 205 °C** — Bezpečné a obhájitelné. Domácí trouby mají odchylku ±10–15 °C, takže 200 °C na displeji bývá reálně 185–195 °C; 205 °C by mohlo být riskantní. Karta správně flaguje Mora 545 verified=false a doporučuje teploměr. Technicky správné rozhodnutí.

**A4. Repos min. 1 h** — Obhájitelné. FCI Session 9 používá minimum 1 h + overnight preference. CIA „pipe immediately" (bez repos) je opravdu jiný produkt bez bosse. Výběr minima je tedy konzistentní s GS. Korektní.

**A5. Postup 3A** — 12 kroků (suché → vejce → máslo → repos → fill from cold → bake 7–8 min) je konzistentní s FCI melted-butter přístupem a odpovídá tomu, jak by LCB instruktor madeleines učil. Postup je správný.

***
### B. Pracovní karta — použitelnost u linky
**B1. 12 kroků** — Přiměřené. Pro Basic úroveň je 12 kroků na hraně (makronky mívají 14–16), ale madeleines jsou technicky jednoduší. Akceptovatelné.

**B2. Checkpoint signály** — Každý krok má senzorický checkpoint (barva, konzistence, teplota). To je silná stránka karty — Josefina ví, kdy přejít dál. ✓

**B3. PROČ komentáře** — Užitečné a stručné. Nejsou rušivé, protože jsou vizuálně odděleny (`PROČ:` prefix). ✓

**B4. Tisknutelná A4 karta u linky** — **KRITICKÝ problém.** Karta je HTML. Při tisku na A4 by musela projít browser print dialog a výsledek bude chaotický (tabulky se rozlomí, sidebar se ztratí). Neexistuje žádný `line_card_lite` — zkrácená tisknutelná verze. Pro Josefinu s ADHD pečící u linky to znamená: buď telefon nebo tablet na pracovní ploše, nebo tisk nevhodný. Choux a makronky karty z předchozích pilotů tuto sekci měly — tato NE.

| Severity | Hodnocení |
|---|---|
| KRITICKÁ | Absence printable line card je zásadní pro deklarovaný use case „pracovní karta u linky". |

**B5. step_type (standard/tasting/preheat)** — Přidaná hodnota: `preheat` krok je jasně odlišný, `tasting` kroky jsou vizuálně označeny. Nezatěžuje Josefinu nadbytečnou taxonomií. ✓

***
### C. Varianty (Blok 4)
**C1. Relevance 4 variant pro Basic** — Citronová a mini jsou vhodné. Beurre noisette a čokoládová jsou označeny jako „až po zvládnutí základu 3×" — správné řazení obtížnosti.

**C2. Beurre noisette teplota 140–150 °C** — **CHYBA.** Standardní kulináření definuje beurre noisette jako moment, kdy mléčné pevné látky začínají hnědnout Maillardovou reakcí — to se děje typicky při 150–165 °C. Při 140 °C je máslo ještě ve fázi clarifié (voda se odpařila, ale Maillard nezačal). Výsledek při 140–150 °C: blonde butter s minimálním noisette charakterem, ne skutečné beurre noisette.

| Severity | Hodnocení |
|---|---|
| STŘEDNÍ | Josefina stáhne máslo příliš brzy → plochá chuť. Opravit na 150–165 °C, vizuální cue: „mléčné částice zlatohnědé, vůně oříšků, ne smetany." |

**C3. Chybějící varianta** — Varianta s medem (miel) chybí. Commercy tradiční recept (historicky autentický původ madeleines) zahrnuje med jako součást sladidla. Je to jednoduchá záměna (25 g cukru → 25 g medu), relevantní pro Josefinu na Basic úrovni a historicky obhájitelná. Pistachio/matcha jsou pokročilejší — jejich absence je správná. Ale honey/miel je notable gap.

**C4. decision_layer** — Jasný u každé varianty. ✓

***
### D. Věda (Blok 1B)
**D1. Teplotní šok** — Mechanismus je kvalitativně správně popsán (cold edges set first → center forced up). Ale viz Persona 2 pro vědeckou nepřesnost v popisu role másla.

**D2. Maillardova reakce** — Správně aplikována: redukující cukry + aminokyseliny, T > 140 °C. Zmínka o tinned steel vs. silikon jako vodivostní faktor je přesná a pedagogicky cenná. ✓

**D3. Vědecké štítky** — `[robustní empirické pravidlo]` pro bosse mechanismus je konzervativní ale správné (chybí přímá peer-reviewed studie specificky pro madeleines). `[mechanismus — konsenzus]` pro Maillarda je správné. Odpovídající.

**D4. Zavádějící zjednodušení** — Viz Persona 2, bod A2: „máslo se uvolní jako pára" je mechanisticky nepřesné.

***
### E. Troubleshooting + what-if
**E1. Příčiny a prevence** — 6 FM v tabulce 3C je dobře párováno s příčinami a prevencemi. Prevence jsou konkrétní a použitelné. ✓

**E2. Rozdělení 3C vs. 3E** — Smysluplné. 3C = post-pečení diagnostika, 3E = intervence v reálném čase. Josefina pochopí, kdy použít co.

**E3. Chybějící problém** — Chybí failure mode: **madeleines se lepí k formě po silikonu** (karta zmiňuje silikon jen jednou v 2B jako alternativu, ale troubleshooting se věnuje pouze tinned steel). Druhý chybějící failure mode: **nerovnoměrná bosse** (jeden konec výšší než druhý) — způsobeno nerovnoměrným plněním nebo špatnou pozicí v troubě. To v 3C ani 3E není.

***
### F. Top 3 problémy (pro fix před Josefininou prací)
1. **[KRITICKÁ] Absence printable line card** — Karta jako HTML je nepoužitelná u linky bez zařízení. Musí existovat 1-stránková tisknutelná verze s gramážemi, kroky a checklistem.
2. **[STŘEDNÍ] Beurre noisette teplota 140–150 °C je příliš nízká** — Opravit na 150–165 °C s vizuálním cue „zlatohnědé mléčné částice, oříšková vůně."
3. **[STŘEDNÍ] Mouka 110 g vs. FCI ~106 g** — Buď opravit na 106 g (přesnější FCI konverze) nebo explicitně označit jako „normalizováno na 1:1 pro jednoduchost." Claim „převzato přímo z FCI" je bez tohoto vysvětlení nepřesný.

***
## Persona 2 — Food scientist (pastry chemistry, PhD-level)
### A. Mechanismus bosse (Blok 1B)
**A1. Je popis teplotního šoku přesný?**

Karta říká: *„máslo, které v chladu ztuhlo a rovnoměrně se distribuovalo, se při pečení najednou uvolní jako pára — výsledkem je výbušnější nárůst."*

Toto je mechanisticky nepřesné. Butter (82% tuk) obsahuje ~16–18% vody. Při pečení se vodní frakce másla odpařuje a přispívá k leaveningu — ale máslo samo se „neuvolní jako pára." Tuk v másle se roztaví (~30–35 °C), ale nevaporuje při teplotách pečení (~200 °C). Říci, že „máslo se uvolní jako pára" sugeruje, že butyrový tuk sublimuje nebo vaporuje, což je chemicky nesprávné.

Primární mechanismus bosse je:
1. Teplotní gradient: okraje formy (kovové, horké) → rychlé zatuhnutí proteinů a škrobu → „wall" effect
2. Hydratovaný střed (studený) → tlak nahoru (jediná cesta)
3. Steam z vodní frakce vajec a másla → doplňkový efekt
4. CO₂ z baking powder → doplňkový kypřicí efekt

Karta slučuje body 3 a 4 do jediné nepřesné formulace. Figoni (HBW, ch. 5) popisuje steam leavening v kontextu puff pastry, ne madeleines. Přiřazení Figoni jako zdroj pro „steam z másla = bosse" je proto pravděpodobně inference, ne přímá citace.

| Severity | Hodnocení |
|---|---|
| STŘEDNÍ | Josefina bude mít nesprávný mentální model mechanismu. Pro Basic není fatální — praktický výsledek stejný. Ale pokud se z toho bude učit, odnesí si chybu do LCB. |

**A2. Alternativní vysvětlení ignorované kartou:**
Karta ignoruje roli **krystalizovaného tuku** v repos: při chlazení butter recrystallizuje do β'-formy, která tvoří rigidní tukovou síť. Ta při náhlém zahřátí kolabuje rychleji a lokálněji v okrajích formy (v kontaktu s kovem) než ve středu (izolováno těstíčkem). Toto je další fyzikální mechanismus bosse, vedle steam/CO2.

**A3. Prášek do pečiva a bosse:**
Karta říká: *„Prášek do pečiva doplňuje kypření dvěma vlnami (kontakt s vlhkostí + zahřátí) a spolu s pářením se másla stabilizuje výslednou bosse."* — Dvojčinný baking powder je správně popsán (dvě vlny CO₂). Ale „stabilizuje bosse spolu s pářením se másla" opakuje stejnou chybu. CO₂ z baking powder contributes to lift, ale bosse jako morfologický výsledek (hrbolek na špičce) je primárně teplotní šok + forma. Pokud by bosse vznikla jen z CO₂, nevznikala by konzistentně v konkrétním centrálním místě — vznikala by náhodně po povrchu.

***
### B. Ingredient roles (Blok 2A)
**B1. Máslo 82% tuk** — Správné. Rozdíl 80% vs. 82% vs. 84% (profi) je při 110 g aktivního tuku v receptu méně než 4 g tuku — pro madeleines zanedbatelné. ✓

**B2. Mouka hladká T450–T550** — Akceptovatelné pro Basic. Přesnější by byl protein content: 8–10% pro tender crumb. T550 polohrubá má mírně vyšší protein (~10,5%) a může dát o trochu tužší texturu, ale pro Josefinu v domácí kuchyni je to v toleranci. Card poznamenává „hladká preferovaná" — správné.

**B3. Citrusová kůra a „esenciální oleje, T < 50 °C jinak se spalují":**
Karta říká: *„horké máslo spálí citrusovou aroma"* a *„máslo nesmí být přes 50 °C."* Tento claim je v kartě přítomen jako praktická instrukce, ale **50 °C threshold není podložen v manifestu žádnou zdrojovou řadkou.** Limonene (hlavní terpén citrusové kůry) má bod varu 176 °C — nevaporuje při 50 °C. Co se děje při teplotách nad ~50 °C je *zrychlená volatilizace* (ne „spálení") a oxidace aromatických složek při delším kontaktu. Instrukce je v praxi správná (vychladlé máslo zachovává aroma lépe), ale mechanistické zdůvodnění je nepřesné a chybí zdroj.

| Severity | Hodnocení |
|---|---|
| NÍZKÁ | Praktický výsledek instrukce je správný, mechanismus je zjednodušen. §2.1 problém: chybí zdrojová řada pro 50 °C threshold. |

***
### C. Manifest — zdrojová transparentnost
**C1. FCI ISBN 9781584798033** — Potvrzeno správné. ✓[2]

**C2. Figoni citace pro teplotní šok** — Figoni *How Baking Works* (2010) je legitimní zdroj pro baking science. Karta ji cituje pro *bosse mechanismus* jako „robustní empirické pravidlo" — to je obhájitelné, pokud Figoni obecně pokrývá steam leavening a fat crystallization. Pro *madeleine bosse specificky* je pravděpodobnější, že bakinglikeachef.com je primárním zdrojem a Figoni je doplňkový. Přiřazení je rozumné, ale mohlo by být přesnější.[3]

**C3. Adaptace 205 → 200 °C** — Transparentně dokumentována v technology_box i v ManifestRow. ✓

**C4. Confidence matrix source conflicts** — Manifest zobrazuje confidence levels (převzato/adaptováno) ale **nezobrazuje kde se FCI a CIA rozcházejí** (repos vs. no repos, teplota pečení ~10 min CIA vs. 7–8 min FCI). Čtenář nevidí, proč bylo FCI vybráno a jaký je rozsah konfliktu. To není §2.2 violation, ale je to ztráta pedagogické hodnoty.

***
### D. Top 3 vědecké problémy
1. **[STŘEDNÍ] „Máslo se uvolní jako pára"** — Mechanisticky nepřesné. Tuk se neparuje. Přepsat jako: „voda obsažená v másle (16–18%) přispívá k tvorbě páry; zároveň krystalizovaný tuk v chladu tvoří rigidní síť, která se v kontaktu s horkou formou rychle roztaví — a to jen na okrajích, ne ve středu."
2. **[STŘEDNÍ] Beurre noisette 140–150 °C** — Chemicky dosáhne Maillardova reakce v mléčných pevných látkách až při ~150–165 °C. 140 °C je clarified territory.
3. **[NÍZKÁ] 50 °C threshold pro citrusová aroma** — V manifestu chybí zdrojová řada. Buď doplnit zdroj, nebo přepsat jako „vychladlé máslo ~40 °C" bez specifického threshold claim.

***
## Persona 3 — Josefina (cílová uživatelka)
### A. Srozumitelnost
**A1. Blok 1 délka** — Blok 1 je před prvním pokusem zbytečně dlouhý. Obsahuje historii Proustovy madeleines, rodinu petits fours moelleux, CAP Pâtissier kontext, 5 klíčových proměnných s rozsahy, a vědecký mechanismus. Jako čtenář s ADHD před prvním pokusem chci vědět: *co to je, co musím udělat, a co se pokazí*. Historický kontext a rodina produktů jsou v tuto chvíli noise.

| Severity | Hodnocení |
|---|---|
| STŘEDNÍ | Informace jsou správné, ale loading order není optimální pro ADHD. Blok 1 potřebuje jasné „PŘEČÍST PŘED PRVNÍM POKUSEM" vs. „PŘEČÍST JAKO STUDIJNÍ MATERIÁL" oddělení. |

**A2. Section 0 "Co hodnotíme"** — Velmi užitečné. Vědět před pečením, co hodnotit (bosse viditelná z profilu, křupavý okraj, vlhký střed), je pro ADHD user ideální orientace. Pomáhá nastavit fokus místo zahlcení.

**A3. TL;DR bloky** — Přítomné a funkční. „Klíč k úspěchu: studená hmota po minimálně 1 hodině odpočinku a horká trouba" je správně vyvěšené.

**A4. Tooltipy** — Bohužel nemohu z HTML ověřit, zda jsou tooltipy interaktivní nebo jen inline texty. Z obsahu jsou vysvětlivky pro bosse, repos, beurre noisette přítomné jako textové definice — to funguje pro PDF/print, ale pro plnohodnotný tooltip efekt by musel HTML mít JS.

***
### B. Pracovní karta v kuchyni
**B1. Gramáže viditelné** — Tabulka 2A je přehledná. V krocích 3A jsou gramáže na začátku každého kroku tučně (110 g mouky, 125 g cukru atd.). ✓

**B2. Checkpoint signály** — Přítomné a senzoricky konkrétní (lesklá hmota po másle, hmat přes sáček po repos). ✓

**B3. Repos strach** — Vysvětlení proč repos nelze zkrátit je opakované na 5 místech. Pro ADHD je to feature. Ale chybí vizuální timeline: „Čas na repos: nastavit časovač na 60 min, jít na jiný úkol, vrátit se." Bez explicitního „jdi a dělej něco jiného" instrukce může Josefina stát u lednice a čekat.

**B4. Mora flag** — Je přítomen v technology_box i v manifestu. Dostatečně viditelný. Instrukce „pokud nemáš teploměr → první dávka je vždy test" chybí jako fallback pro případ, že teploměr nemá. Technology box říká „doporučeno ověřit teploměrem" — ale co dělat, když nemá, není explicitně řečeno.

| Severity | Hodnocení |
|---|---|
| STŘEDNÍ | Chybí fallback instrukce pro případ bez teploměru. |

***
### C. Co chybí, co je zbytečné
**C1. Co chybí:**
- **Vizuální timeline** — Jednoduché schéma: [Příprava 20 min] → [Repos 1–8h] → [Pečení 15 min]. Pro ADHD plánování zásadní.
- **Pre-baking checklist na začátku receptu** — Checklist je v kroku 8 (těsně před pečením), ale pro Josefinu je užitečnější mít „ZKONTROLUJ PŘED ZAČÁTKEM" seznam na samém začátku 3A.
- **Printable line card** — Viz Persona 1 B4.

**C2. Co je zbytečné (nebo předčasné):**
- Historický kontext Proustovy madeleines (1 odstavec v Bloku 1) — pro pracovní kartu noise. Vhodné pro studijní modul, ne
