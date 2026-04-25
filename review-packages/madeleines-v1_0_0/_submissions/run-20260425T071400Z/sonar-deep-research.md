---
reviewer: sonar-deep-research
model_preference: sonar_deep_research
identify_as: "Sonar Deep Research"
status: OK
chars: 36670
durationMs: 115421
timestamp: "2026-04-25T07:14:16.577Z"
attachment_used: false
note: "Model explicitly stated it has no access to HTML or JSON files; reviewed from research brief + prompt context only"
---

## Persona 1 — Chef‑instruktor

### A. Faktická správnost receptu (Blok 3A)

**0. Limitace**

Nemám přístup k samotné HTML kartě ani JSONům, takže hodnotím poměry, teploty a volby metody podle briefu, ne podle přesného znění kroků.

1. **Gramáže a poměr 1 : 1 máslo : mouka**

- 1 : 1 máslo : mouka je pro klasické francouzské madeleines naprosto obhajitelný poměr – existuje řada seriózních „tradičních" receptů, které jsou buď velmi blízko 1 : 1 (např. 114 g másla / 104 g mouky), nebo jen mírně víc mouky (např. cca 90–100 g másla / 100–110 g mouky).[1][2][3]
- Jiná klasická škola (např. Dorie Greenspan) má 6 lžic másla na cca 2/3 hrnku mouky, což je opět prakticky 1 : 1 v gramech.[2]
- FCI čísla z briefu (110 g mouka / 110 g máslo) jsou tedy v rámci „klasického francouzského" spektra; poměr nezpůsobí neautentický profil, jen o něco bohatší a jemnější drobenku.  

**Verdikt:** autentické, maximálně lehce „luxusní"; problém nevidím (NÍZKÁ).

2. **100 g za „2 large eggs"**

- Standardní „large egg" v amerických a britských zdrojích má bez skořápky cca 50 g (57 g se skořápkou, 50 g obsah).[4][5][6]
- Odhad 2 × 50 g = 100 g je učebnicový převod; používá ho spousta pekařských konverzních tabulek.  

**Verdikt:** 100 g je rozumný a konzistentní odhad (NÍZKÁ).

3. **Teplota 200 °C vs. 205 °C**

- Mnoho seriózních receptů pro madeleines peče na 200–210 °C, často s tím, že těsto jde do plně předehřáté trouby a někdy se teplota po vsazení sníží.[7][8][1]
- Mora VTPS 545 BX je multifunkční horkovzdušná trouba s regulací 50–300 °C, takže 200 °C horkovzduch je v bezpečném, absolutně standardním rozsahu pro malé těsto ve formě.[9]
- Rozdíl 205 °C vs. 200 °C je v domácí troubě menší než typická odchylka termostatu. Pokud karta jasně říká, že je to *adaptace* z FCI a že Mora není ověřená, je to plně obhajitelné.  

**Verdikt:** 200 °C horkovzduch je bezpečné a realistické; důležitější je explicitně označená adaptace (STŘEDNÍ jen pokud flag není dost viditelný, jinak NÍZKÁ).

4. **Repos „min. 1 h, ideálně přes noc"**

- Hodně autorit doporučuje dlouhý odpočinek: Dorie Greenspan min. 3 h, ideálně přes noc, jiné francouzské zdroje 2–24 h, některé přímo říkají, že klíč k hrbu je „těsto přes noc v lednici".[10][11][12][13][2][7]
- Existují i rychlé recepty bez repos nebo s 30–60 min, ale ty obvykle explicitně přiznávají kompromis (snadnost vs. ideální hrb a chuť).[14][15]

**Verdikt:** minimum 1 h + preferovaně přes noc je konzervativní, „instruktorský" kompromis – pro výukovou kartu dobré (NÍZKÁ).

5. **Postup 3A vs. „LCB styl"**

Popis: suché + vejce + máslo → repos → plnit studené → péct 7–8 min.

- Většina „klasických francouzských" metod jde přes foaming vajec s cukrem, následné vmíchání suchých složek a nakonec přidání rozpuštěného másla, a pak chlazení těsta.[13][1][2][7]
- Péct studené těsto v žhavé troubě kolem 200 °C pro vytvoření teplotního šoku a hrbu je přesně to, co popisují moderní francouzské profesionální zdroje.[11][10][13]

**Verdikt:** pokud ve 3A opravdu máš:  
- jasné šlehání vajec + cukr,  
- jemné vmíchání suchých,  
- přidání rozpuštěného másla bez přemíchání,  
- chlazení těsta,  
- pečení z chladu ve správně předehřáté troubě,  

pak to je zcela konzistentní s tím, jak by to učil LCB instruktor na úrovni Basic (NÍZKÁ).

***

### B. Pracovní karta — použitelnost u linky

Bez HTML vidím jen architekturu, ne konkrétní text, takže posuzuju principy.

1. **12 kroků**

- 10–14 kroků na jednoduchý produkt (mise, těsto, forma, pečení, cooling, úklid) je pro výukovou kartu velmi v normě.  
- Riziko je spíš v délce textu uvnitř kroku; pokud jsou kroky jednověté + krátký „proč" řádek, 12 je OK; pokud jsou to odstavce, bude to moc.  

2. **Cíl a checkpoint**

- Z briefu plyne, že máš checkpointy i tasting kroky – to je didakticky super, ale jen pokud jsou **typově odlišitelné** (bold signály „pokračuj, když…").  
- Kritická chyba by byla, kdyby checkpoint byl schovaný v druhé větě dlouhého odstavce – pro Josefinu v reálném provozu nečitelná.  

3. **Komentáře PROČ**

- Didakticky výborné, ale **u linky** musí být vizuálně sekundární (kratší font, šedá, kurzíva) a striktně jednověté.  
- Pokud jsou PROČ komentáře na stejné hierarchické úrovni jako instruktivní věty, budou Josefinu přetěžovat – to by byla STŘEDNÍ chyba designu.

4. **A4 u linky**

- Struktura „blok 3A čistě kroky, ostatní bloky jinde" je rozumná – pokud 3A opravdu obsahuje *jen to, co potřebuješ s moukou na ruce* (gramáže, kroky, checkpointy) a žádnou esej.  
- Pokud se na A4 dostane i půl vědy, manifest, dlouhé intro, kartu by v praxi nikdo nevytiskl.  

5. **step_type (standard / tasting / preheat)**

- Z didaktického pohledu přidaná hodnota (učí studentku myslet ve vrstvách: akce vs. senzorika), **pod podmínkou**, že:  
  - je to barevně / ikonou rozlišené,  
  - není to další řádek textu, který prodlužuje každý krok.  
- Pokud je „step_type" jen textový tag na začátku řádku bez vizuálního kódování, je to spíš noise (STŘEDNÍ zbytečná komplexita).

***

### C. Varianty (Blok 4)

1. **Relevance 4 variant**

- Citronová a beurre noisette jsou pro level Basic přesně ty dvě, které dávají smysl – mění chuť, ale ne strukturu.[3][16]
- Mini verze je v podstatě jen změna formy a času pečení, to je dobrá tréninková varianta pro kontrolu tepla.  
- Čokoládová varianta je na Basic už trochu na hraně (kakao ubírá vodu, mění strukturu, může maskovat nedopečení; ideální je, když karta explicitně upozorní na odlišné riziko vysušení).  

2. **Beurre noisette popis**

- Bod, kdy je máslo „oříškově vonící" a světle hnědé, obvykle odpovídá teplotě kolem 140–150 °C; běžné francouzské recepty to tak popisují a spojují s tmavnutím mléčných tuhých částic.[17][13]
- Rozsah 140–150 °C + senzorický popis (barva, vůně) je tedy adekvátní; samotné číslo ale nic neřeší, klíčový je popis vizuálních signálů.  

3. **Chybějící varianta**

- Z hlediska „klasické francouzské" historie je výrazná medová/honey varianta (madeleines au miel), kde malé množství medu podporuje barvu a chuť.[15][18][3]
- Pistácie, matcha, apod. jsou už moderní aromatické derivace; pro Josefinu na Basic bych je maximálně zmínil v jedné poznámce, ale ne jako plnohodnotné varianty.  

4. **Decision layer**

- U každé varianty by mělo být jednou větou: **„Použij, když…"** (např. *beurre noisette = víc oříškového aroma, lehce tmavší barva, vhodné když chceš výraznější chuť*).  
- Pokud decision layer je jen seznam parametrů bez „kdy a proč", nebude to pro Josefinu akčně použitelné – to by byla STŘEDNÍ vada.

***

### D. Věda (Blok 1B)

1. **Teplotní šok**

- Vysvětlení „repos + studené těsto + žhavá trouba → velký teplotní gradient → rychlý nárůst páry a CO₂ pod zpevňující se krustou → hrb" je v souladu s tím, co uvádí seriózní technické blogy o madeleines.[12][10][13]
- Alternativní vysvětlení by spíš zdůraznilo roli *odpočinutého lepku* a plného nasycení škrobů vodou, což umožní těstu udržet tlak páry aniž by prasklo; pokud to v kartě chybí, je to zjednodušení.  

2. **„Máslo se uvolní jako pára"**

- Většinu páry v troubě poskytuje voda z vajec a mléčných složek, ne tuková složka másla; máselný tuk se při pečení hlavně taví, část se může mírně odpařit, ale klíčový je **obsah vody v másle** (cca 16–18% u evropského 82% másla).[19][20]
- Správnější formulace je: *„Voda v másle a vejcích se mění v páru, která roztahuje strukturu; vyšší obsah másla zvyšuje celkovou vlhkost a přispívá k expanzi páry."*  

3. **Role prášku do pečiva**

- Dvojčinný prášek uvolňuje CO₂ dvakrát – částečně už při hydrataci těsta, a zbytek při zahřátí na cca 60–75 °C.[21][22][23]
- V madeleines je kritické, že druhá fáze probíhá právě během teplotního šoku – hrb je výsledkem kombinace *páry* a *CO₂* v těstu, zatímco povrch už částečně zpevňuje.  
- Pokud karta tohle redukuje na „prášek pomáhá vytvořit hrb", je to vědecky pravda, ale mělké; pokud máš popis dvou fází a teplotního okna, je to velmi dobré.

4. **Claim confidence labels**

- „Teplotní šok → hrb" je **robustní empirické pravidlo** – potvrzují ho desítky nezávislých zdrojů, ale detailní mechanické modely jsou spíš heuristické.[24][10][12][13]
- Maillardova reakce jako „redukující cukry + aminokyseliny při T typicky nad 140 °C" je standardní konsenzus.[25][26][27][28]
- „Repos min. X hodin" je spíš **tradovaná heuristika** s empirickou oporou (různé zdroje uvádějí 1–24 h, ale mechanismus – hydratace, relaxace lepku, redistribuce prášku – je racionální, i když kvantitativně málo změřený).[2][10][12][14]

**Kde je to potenciálně zavádějící (STŘEDNÍ):**

- pokud text přehání roli **odpařování tuku** a podhodnocuje roli **vody a hydratace škrobů**,  
- pokud je teplotní šok prezentovaný jako *jediný* faktor hrbu (ignoruje podíl dávkování prášku, hustoty těsta, plnosti formy).

***

### E. Troubleshooting + what‑if (3C a 3E)

Bez karty můžu jen posoudit logiku rozdělení:

1. **Správnost přiřazení symptomů**

- Typické problémy u madeleines:  
  - bez hrbu / ploché,  
  - hrb jedna strana,  
  - tukový film, mastné dno,  
  - suché / drobivé,  
  - přilepené k formě,  
  - moc tmavé okraje, světlý střed.  
- Pokud jsou tyto symptomy spojeny s klasickými příčinami (nedostatečný repos, příliš nízký/ vysoký baking powder, přemíchání, špatně předehřátá trouba, podmáslená forma), bude to sedět s literaturou.[7][10][13]
- Kritická chyba by byla třeba tvrdit, že plochý povrch je hlavně „málo naplněná forma", a ne kombinace teploty, repos a leaveningu.

2. **Rozdělení 3C vs. 3E**

- Osobně to dává smysl:  
  - 3C = po pečení, diagnostika „co se stalo".  
  - what‑if = checklist v reálném čase: *„trvá předehřev? těsto je opravdu studené? forma je mastná, ne utopená v másle?"*  
- Podmínka: v UI je what‑if jasně vizuálně jiná sekce; jinak hrozí, že Josefina nepozná, že 3E má číst **před** problémem, ne po něm.  

3. **Chybějící problémy**

Typické chyby, které bych očekával v 3C a 3E:

- **Příliš výrazné „křidélko"/límec** – moc tekuté těsto, přemazaná forma, příliš plná forma.  
- **Zubaté hrany / díry v drobence** – přemíchání, příliš vysoký prášek, starý prášek.  
- **Zaseklé ve formě** – forma není vytřená jen tenkou vrstvou tuku a mouky, ale mastná louže.  

Pokud některý z těchto symptomů úplně chybí, je to STŘEDNÍ vada (diagnostika nebude kompletní).

***

### F. Top 3 problémy (chef‑instruktor)

S ohledem na to, co *můžu* posoudit bez karty:

| # | Problém | Severity | Poznámka |
|---|---------|----------|---------|
| 1 | Potenciálně zavádějící formulace o tom, že „máslo se uvolní jako pára" místo přesného popisu role vody | STŘEDNÍ | Věcně špatná intuice pro studenty, opravitelné jednou větou. |
| 2 | Riziko, že PROČ komentáře a step_type zahlcují pracovní kartu, pokud nejsou vizuálně jasně sekundární | STŘEDNÍ | Didakticky super, ale může zničit použitelnost u linky. |
| 3 | Chybějící explicitní „honey" varianta jako historicky velmi typická, při současné přítomnosti více „moderních" variant | NÍZKÁ | Nezhoršuje výsledek, ale mírně oslabuje „klasické francouzské" vyznění. |

***

## Persona 2 — Food scientist

### A. Science v Bloku 1B — mechanismy

1. **Mechanismus teplotního šoku**

- Mechanismus „studené těsto + žhavá trouba → velký teplotní gradient → prudká tvorba páry a expanze plynu → hrb" je v souladu s fyzikou těsta i se seriózními rozbory madeleines.[10][12][13]
- Důležité doplnění, které tam musí být, aby to bylo vědecky poctivé:  
  - Repos umožní plnou hydrataci škrobů a relaxaci lepku.  
  - Dvojčinný prášek uvolňuje druhou vlnu CO₂ právě při zahřátí středu těsta.[22][29][21]

2. **„Máslo jako pára" vs. voda**

- Tuk se při pečení hlavně taví; hlavní nositel páry je **voda** v másle a vejcích.  
- Evropské máslo má standardně 82% tuku, tedy cca 18% vody, zatímco vejce mají ~74% vody.[20][4][19]
- Správné vědecké vysvětlení by mělo explicitně mluvit o vodě v ingrediencích, ne o „páře z másla" jako by šlo o odpařování tuku.  

3. **Dvojčinný prášek v kontextu madeleines**

- Double‑acting baking powder: první reakce při hydrataci (část CO₂), druhá při zahřátí mezi cca 60–75 °C (většina zbývajícího plynu).[23][21][22]
- V madeleines je kritické, že druhá fáze probíhá právě během teplotního šoku – hrb je výsledkem kombinace *páry* a *CO₂* v těstu, zatímco povrch už částečně zpevňuje.  
- Pokud karta tohle redukuje na „prášek pomáhá vytvořit hrb", je to vědecky pravda, ale mělké; pokud máš popis dvou fází a teplotního okna, je to velmi dobré.

4. **Labely confidence**

- Teplotní šok + hrb: robustní empirické pravidlo podpořené mnoha praktickými testy; mechanisticky částečně vysvětlené, ale ne úplně kvantifikované.[12][13][10]
- Maillardova reakce: „redukující cukry + aminokyseliny při T typicky 140–165 °C" je textbook konsenzus.[26][28][25]
- Repos doby (1 h vs. 12 h): to by mělo být označeno spíš jako „tradovaná heuristika s empirickou oporou", protože studie přesně na madeleines jsou vzácné; existují jen obecné poznatky o hydrataci a relaxaci těsta.[14][12]

**Vědecky nejcitlivější místo (STŘEDNÍ):** jakmile text začne tvrdit kauzální vztahy typu „konkrétně 60 min repos dělá X % rozdílu", bez dat, měl by být označen jako heuristika, ne jako konsenzuální mechanismus.

***

### B. Ingredient roles (Blok 2A)

1. **„Máslo nesolené 82%" – relevantnost**

- EU standard pro „evropské" máslo je minimálně 82% tuku; běžné „americké" 80% má o něco víc vody.[19][20]
- Rozdíl 80% vs. 82–84% v takto malém těstě udělá měřitelný rozdíl v vodnatosti (víc páry, lehce jiná drobenka), ale je to druhého řádu – důležitější je konzistence v rámci série testů.  
- Na kartě je to relevantní hlavně jako **signál**: „testováno s 82%, pokud použiješ 80%, čekej mírně vyšší hydrataci."  

2. **„Mouka hladká T450–T550" vs. protein**

- Typické universální mouky mají 10–12% proteinu; to je přesně rozmezí, ve kterém se většina madeleine receptů pohybuje.[30][31][32][33][34]
- Pro Josefinu je T450–T550 (hladká mouka na pečení) dobrý praktický guideline; explicitní protein % by bylo přesnější, ale zároveň hůř použitelné v běžném českém retailu.  

3. **Citrusová kůra – esenciální oleje**

- Citrusová kůra je bohatá na esenciální oleje (hlavně limonen) lokalizované ve flavedu; třením kůry se cukrem uvolňuje olej do cukru, což zvyšuje aromatickou extrakci.[35][36][37][38]
- Esenciální oleje jsou termolabilní a vysoce volatilní; dlouhá expozice vysokým teplotám a vzduchu aroma výrazně redukuje.[39][40]
- Tvrzení, že „nad 50 °C se spálí" je přestřelené; přesnější je říct, že *dlouhá expozice vysokým teplotám a vzduchu* aroma výrazně redukuje.  

***

### C. Manifest — zdrojová transparentnost

1. **Dohledatelnost zdrojů**

- FCI *The Fundamental Techniques of Classic Pastry Arts* s ISBN 9781584798033 existuje a je jasně identifikovatelný jako primární T2 zdroj.[41][42]
- CIA *Baking and Pastry* (3rd ed., 2014) má jiné ISBN (9781118805442); pokud karta jasně odděluje tyto knihy, je to plus.[43][44]
- Bez manifestu v ruce nemůžu ověřit, zda je každé číslo skutečně propojené se zdrojem; posoudit můžu jen to, že použitá bibliografie dává smysl.

2. **Figoni citace pro teplotní šok**

- *How Baking Works, 3rd ed. 2010* existuje s ISBN 9780470392676 jako standardní učebnice pekařské vědy.[45][46][47][48]
- Nemám přístup k plnému textu, abych ověřil, zda konkrétní vysvětlení „teplotního šoku u madeleines" tam skutečně je; v knize je spíš obecná fyzika páry, leaveningu, škrobů.  
- Pokud karta cituje Figoni pro obecné vysvětlení role páry a chemického kypření, je to legitimní; pokud by tvrdila, že Figoni přímo popisuje madeleines hrb tímto způsobem, nevím to potvrdit (nejistota).  

3. **FCI ISBN**

- ISBN 9781584798033 pro *The Fundamental Techniques of Classic Pastry Arts* je správně přiřazené FCI publikaci.[42][41]

4. **Adaptace 205 → 200 °C**

- Adaptace teploty by měla být v manifestu označena jako „derived" s explicitním zápisem: *„205 °C konveční → 200 °C horkovzduch (Mora 545 neověřeno, doporučeno ověřit teploměrem)"*.  
- Bez manifestu v ruce nemůžu ověřit, zda se to tam skutečně píše; architektonicky je to ale správný postup.

***

### D. Top 3 vědecké problémy

| # | Problém | Severity | Poznámka |
|---|---------|----------|---------|
| 1 | Přisuzování expanze „páře z másla" místo přesné role vody (vajíčka + voda v másle) | STŘEDNÍ | Vede k špatné mentální mapě; pro studentku je důležité chápat vodu jako primární zdroj páry. |
| 2 | Potenciální přestřelení jistoty u doby repos (min. 1 h vs. přes noc) bez jasného označení jako heuristika | STŘEDNÍ | V datech není tvrdý práh; mělo by být explicitně označeno jako „empirické pravidlo". |
| 3 | Tvrzení o „spálení" citrusových olejů nad 50 °C, pokud tam takové zjednodušení je | NÍZKÁ | Koncept správný (volatilita, degradace), konkrétní číslo ale není podložené. |

***

## Persona 3 — Josefina (cílová uživatelka)

Bez HTML nevidím typografii ani konkrétní délky, takže hodnotím, jestli architektura odpovídá tvému popisu a tvému profilu (ADHD, potřeba struktury).

### A. Srozumitelnost

1. **Délka bloku 1 („co to je a proč")**

- Pro tebe je kritické, aby blok 1 měl: obálku s TL;DR, 3–5 krátkých odstavců max, a jasně zvýrazněné „co je madeleine" a „co je boss / hrb".  
- Pokud blok 1 sklouzává k eseji s historií, literárními odkazy (Proust) a sekundárními detaily, je to zahlcující – to by pro tebe byla STŘEDNÍ chyba.  

2. **Section 0 „Co hodnotíme"**

- Vhodné, pokud je to jednorázový vizuální „target": 5 řádků typu *„Tvar: výrazný hrb…"*, *„Drobenka: jemná, bez velkých děr…"* apod.  
- Pokud je to velký textový blok, který musíš číst celý, než vůbec začneš, tak je to overload.  

3. **TL;DR v bloku 1 a 2**

- Ideální: tři odrážky typu „Co NUTNĚ vědět před prvním pokusem" (např. *„Těsto musí odpočívat aspoň 1 h v lednici."*, *„Trouba musí být opravdu předehřátá."*).  
- Pokud TL;DR existuje, ale obsahuje 8–10 bodů, už to přestává být „too long; didn't read".  

4. **Tooltipy na termíny**

- Pro tebe jsou klíčové: *repos, bosse, beurre noisette, thermal shock*.  
- Tooltipy jsou super, pokud stačí najet myší / klepnout a dostaneš jednovětné vysvětlení; jestli jsou to mini‑eseje, budeš je ignorovat.

***

### B. Pracovní karta v kuchyni

1. **Viditelnost gramáží**

- Ideál: každá ingredience v kroku začíná číslem ve formátu „110 g mouka" na začátku řádku; nepotřebuješ lovit čísla uvnitř textu.  
- Pokud jsou gramáže jen v surovinovém seznamu nahoře, ne u kroků, znamená to pro tebe pořád dokola skákat očima nahoru a dolů – to je STŘEDNÍ problém použitelnosti.

2. **Kdy přejít na další krok**

- Jasné checkpointy jsou typicky věty typu „pokračuj dál, až když hmota je …" (pásky, barva, struktura).  
- Pokud jsou checkpointy v kartě, ale nejsou typograficky odlišené (stejný styl jako věty s akcí), budeš je v provozu přeskakovat.  

3. **Strach z repos**

- Správně: karta ti jednou větou vysvětlí, že zkrácení repos → ploché, méně chutné madeleines, a dá ti konkrétní minimální hodnotu, se kterou „to ještě projde" (např. *„1 h je minimum, pod to nechoď."*).[49][14]
- Pokud jen říká „ideálně přes noc" bez jasného minima, budeš mít tendenci to zkrátit a nedokážeš odhadnout, co riskuješ.

4. **Mora flag**

- Protože Mora 545 není „verified", flag musí být:  
  - vizuálně výrazný (kus banneru v technology box),  
  - obsahovat doporučení „pokud nemáš teploměr, sleduj tohle: barvu, dobu, případný test druhé várky".  
- Když ti jen řekne „doporučeno ověřit teploměrem" a nenechá tě bez teploměru úplně ve vzduchu, je to STŘEDNÍ chyba.

***

### C. Co chybí / přebývá

1. **Co ti bude chybět nejspíš**

- Jedna **extrémně zhuštěná** verze kroků („line card lite"), kterou si můžeš dát přímo k troubě: jen kroky + gramáže + teploty + časy, žádné vědecké poznámky.  
- Jeden „baseline plán pečení" pro první pokus: *„Napoprvé udělej batch A přesně takto, žádné varianty."*  

2. **Co je navíc**

- Jakákoli detailní historie, rozsáhlý manifest, dlouhé citace zdrojů na samotné pracovní kartě – to tě uprostřed pečení nezajímá.  
- Pokud jsou training targets nebo složitější diagnostické matice přímo v bloku, který máš u linky, je to spíš rušivý materiál (to patří na zadní stranu / do digitální verze).

3. **A4 vs. telefon**

- Realisticky: A4 s čistým 3A blokem by stačila; jakmile se tam tlačí i sekce 0, část vědy, troubleshooting a manifest, budeš potřebovat i telefon.  
- Pro tebe by bylo ideální, kdyby prompt uměl generovat **dvě verze**: studijní a pracovní.

***

### D. Tréninkový protokol (Blok 7)

1. **„4 hodiny + 3–5 pokusů"**

- 3–5 pokusů madeleines ve formě 12 ks je realistické v rozsahu 4 hodin (při dobré organizaci, část času je chladnutí a repos).  
- Pokud karta nepočítá s časem na mytí formy, chladnutí a opětovné předehřátí, bude reálný čas spíš 5–6 h.

2. **Attempts cíle**

- Pro tebe musí být cíle **konkrétní a vizuální**:  
  - attempt 1: „jakýkoli hrb"  
  - attempt 3: „rovnoměrné hrby, žádné extrémně vystouplé"  
  - attempt 5: „hrb + rovnoměrná barva + stejný objem ve většině jamek".  
- Pokud jsou cíle formulované abstraktně („zlepšení senzoriky"), nebudou motivující.

3. **Pomáhá ti blok 7?**

- Pomůže, pokud:  
  - obsahuje konkrétní A/B testy (např. *„Attempt 2: stejný recept, jiný čas repos"*),  
  - a je realisticky krátký.  
- Pokud je to spíš check‑list buzzwordů („hard/soft skills, self‑assessment matrix") bez konkrétních plánů, budeš to ignorovat.

***

### E. Top 3 věci, které by tě nejspíš štvaly

Z odhadu tvého profilu a architektury:

| # | Problém | Severity | Proč by tě štval |
|---|---------|----------|------------------|
| 1 | Příliš mnoho textu před tím, než se dostaneš k surovinám a krokům | STŘEDNÍ | Máš tendenci scrollovat a ztratit fokus; potřebuješ rychle vidět, co máš dělat. |
| 2 | Chybějící extra zhuštěná „line card" jen s kroky a gramážemi | STŘEDNÍ | Nutí tě skenovat celou kartu uprostřed práce s těstem. |
| 3 | Příliš „akademické" cíle v tréninkovém bloku bez konkrétních vizuálních úkolů | NÍZKÁ | Nepomůže ti to rozhodnout, co máš zkusit v další várce. |

***

## Persona 4 — Robinson (redaktor + prompt compliance)

Bez HTML a JSONů nemůžu udělat skutečný invariant‑by‑invariant audit, takže u mnoha bodů řeknu jen, *co by mělo platit*, ne *zda platí*.

### A. C1–C4 compliance

- **C1 (GS = FCI, ne CIA)**  
  - FCI kniha s ISBN 9781584798033 existuje a je jasně identifikovatelná jako zdroj pro klasickou francouzskou cukrařinu.[41][42]
  - CIA *Baking and Pastry* 3rd ed. je jiná kniha s jiným ISBN.[44][43]
  - Nemám manifest ani text karty, takže nemůžu ověřit, jestli Writer někde neprezentuje CIA čísla jako GS; podle briefu ale volba FCI jako GS dává smysl a je defenzibilní.  

- **C2 (Mora 545 verified: false + generic_oven)**  
  - Na webu existují pouze obecné product pages a manuály pro MORA VTPS 545 BX, žádný seriózní madeleine‑specifický zdroj.[50][51][52][9]
  - Tvrzení „verified: false" je tedy přesné – tady by se spíš auditovalo, jestli to je vizuálně dost viditelné.  

- **C3 (žádné baker's percent jako T1)**  
  - Nemůžu ověřit obsah karty. Architektonicky souhlasím, že ratio_framework: null + zákaz zobrazovat BP jako T1 je nutný, dokud neexistuje oficiální rubric.  

- **C4 (institutional_rubric jako adaptace CAP + FCI)**  
  - Opět – bez textu section_0 jen konstatuju, že taková formulace je správná; audit, zda se v kartě někde netváří jako přímá citace, není možný.

***

### B. F2 v2.0.3 invariants

Všechny body H1–H13, S8–S10 jsou přímo závislé na konkrétním rendru. Bez HTML ani JSON je nemůžu fakticky odškrtnout; můžu jen říct, kde jsou typická selhání:

- **H1 – gramáže na začátku standard step**  
  - Typický fail: Writer přesune gramáže do závorky na konec věty.  
- **H2 – teplota + režim**  
  - Typický fail: někde se objeví „200 °C" bez „horkovzduch".  
- **H3 – labely v 1B**  
  - Typický fail: poslední věta odstavce nemá štítek, nebo má špatný enum.  
- **H4 – 2A ↔ 3A konzistence**  
  - Typický fail: kůra nebo sůl jsou v 2A, ale v 3A se „zapomenou".  
- **H5 – ManifestRow pro každé adaptované číslo**  
  - Typický fail: doby repos a teploty se objeví v textu, ale nejsou v manifestu.  
- **H10–H13, S8–S10**  
  - Tady je velké riziko, že Writer některý z bodů z briefu „sežvýkal" jen částečně (např. tasting checkpoint se objeví, ale ne ve správné sekci).  

Bez dat nemá smysl předstírat, že to opravdu kontroluju; spíš říkám, kde bych explicitně testoval v další iteraci pipeliny.

***

### C. Constitution v1.1 red lines

- **§2.1 přesnost čísel** – z popisu manifestu máš správně nastavený mechanismus; kritické je, aby **ani jedno číslo** v textu nebylo „jen tak" bez vazby v manifestu. Nemůžu ověřit.  
- **§2.2 hygiena zdrojů** – ve webu jsem nenašel žádnou „Peppi DB", takže minimálně Writer nemohl tvrdit, že „podle Peppi" něco je ověřené.[53][54]
- **§2.3 žádné halucinace** – bez porovnání JSON ↔ karta se to nedá zkontrolovat.  
- **§2.4 home adaptation boundary** – architektonicky máš home substitutions v 2B a professional GS v manifestu; audit by byl nad tím, jestli Writer někde neprezentuje home hack jako „rovnocenný GS".  
- **§2.5 explicit uncertainty** – Mora 545, ratio_framework, t1 partial by měly být zřetelně flagované; jejich existence v briefu je plus, ale nevím, jak to dopadlo v rendru.

***

### D. Top 3 prompt‑compliance chyby (hypoteticky nejrizikovější)

Nemůžu říct, že *se staly*, ale tohle jsou **místa, kde bych je čekal**:

| # | Potenciální chyba | Severity |
|---|--------------------|----------|
| 1 | Chybějící nebo slabě viditelný „Mora 545 unverified" flag (C2, §2.5) | KRITICKÁ (pro Josefinu je trouba faktické riziko) |
| 2 | Neúplná 2A ↔ 3A konzistence (H4) – některá ingredience v seznamu, ale ne v postupu | STŘEDNÍ |
| 3 | Teploty bez uvedeného režimu (H2) v některém z kroků | STŘEDNÍ |

***

## Persona 5 — Prompt engineer (meta)

### A. Kde F2 prompt funguje dobře (z toho, co víme)

Opírám se o architekturu, ne o konkrétní text karty:

1. **Oddělení funkcí sekcí**  
   - Máš Section 0 (rubric), Blok 1 (věda), Blok 2 (ingredience, substituce), Blok 3 (postup, troubleshooting, what‑if), Blok 7 (trénink). To dobře odpovídá multi‑účelovému kontraktu (studium vs. práce vs. diagnostika vs. trénink).  

2. **Explicitní značení uncertainty (Mora, ratio_framework, t1 partial)**  
   - Prompt nutí Researcher/Writer říkat „nevím", což je velký plus – to je vidět na `ratio_framework: null`, `mora_545.verified: false`, `t1_availability: "partial"`.  

3. **Failure mode → troubleshooting mapování**  
   - V briefu máš definované FM v `failure_tracking` a v promptu invariant H10; to je dobrý most mezi F1 a F2.

***

### B. Kde F2 prompt nefunguje (pravděpodobné odchylky)

Bez textu karty vyberu 3–5 velmi typických „LLM vs. kontrakt" selhání:

1. **Přetékající PROČ komentáře**

- Prompt (dle popisu) chtěl krátké, jasné PROČ komentáře jako poznámky u kroků.  
- LLM má tendenci vysvětlovat „příliš hezky" → dlouhé odstavce, analogie, re‑framing téhož.  
- Hypotéza: Writer generuje PROČ příliš verbose, protože prompt dostatečně netlačí na *max. 1 větu* a neomezuje tokeny.

2. **Labely v 1B**

- Prompt: „každý odstavec ve vědě má mít label z enumu na konci".  
- LLM často zapomíná na mechanické tagy, pokud nejsou vynucené formálním JSON schématem.  
- Hypotéza: H3 není dostatečně rigidně vynuceno (chce to validaci na schema úrovni, ne jen instrukci v textu).

3. **Teplota + režim**

- Prompt: „vždy uvádět teplotu s režimem".  
- LLM typicky generuje „200 °C" a musí se *vědomě* přinutit dopsat „horkovzduch".  
- Hypotéza: prompt to má jako textové pravidlo, ne jako formální pattern (např. regex na validaci), proto se odchylky objevují.

4. **Line card lite**

- V předchozích kartách existovala line card, tady není → prompt to buď nevyžaduje, nebo to nechává na F4.  
- Výsledek: pro Josefinu chybí nejpraktikovanější artefakt.

5. **SVG diagramy**

- Podobný problém – prompt to explicitně nechce, takže LLM to ignoruje a spoléhá na F4; realita je, že bez striktního kontraktu se SVG často nikdy neudělají.

***

### C. Kde prompt mlčí a Writer improvizuje

1. **Konkrétní formulace vědeckých vysvětlení**

- Prompt říká „vysvětli mechanismus", ale už ne, *jak hluboko* máš jít (např. Maillard vs. detailní intermediáty).  
- Writer patrně improvizuje hloubku; někde bude příliš povrchní, jinde zbytečně hluboký.

2. **Výběr konkrétních variant (Blok 4)**

- Prompt má zřejmě jen „vygeneruj několik variant", ale ne seznam závazných (citron, miel, noisette, mini, choco…).  
- Výsledek: Writer vzal beurre noisette, mini, choco atd.; to je kvalitní, ale není jasné, jestli je to konzistentní napříč kartami.

3. **Struktura tréninkového protokolu**

- Prompt definuje attempts, training_targets, prerequisites, ale ne detaily (např. jak definovat cíle vizuálně).  
- Writer tak musí vymýšlet obsah více z vlastních „intuic" než z pevného kontraktu – kvalita bude kolísat.

4. **Tón vysvětlování (mluvit k Josefině vs. k instruktorovi)**

- Pokud prompt nemá jasný jazykový profil (kolik odborné terminologie vs. plain language), Writer improvizuje, někdy příliš akademicky.

***

### D. Systémové gaps F2 v2.0.3

1. **Line card lite**

- To je očividný gap v kontraktu – pokud ji dřívější pipeline produkovala jiným způsobem a F2 ji teď neobsahuje, měla by být doplněna jako **povinný výstup** (pro Josefinu kritická).  

2. **SVG diagramy**

- Pokud F4 Formatter neumí generovat obsah (ne jen prezentovat), je iluzorní očekávat, že se SVG objeví bez explicitního požadavku v F2.  
- Řešení: F2 generuje strukturovaný popis diagramu (data + anotace), F4 „jen" vykreslí.

3. **Sesterské karty**

- `enable_sister_cards` jako flag je dobrý design, ale je třeba definovat:  
  - kdy se to má zapnout,  
  - co se dědí a co se liší (např. „sponge family" vs. „pâte à choux family").  
- Jinak je risk, že se mechanismus nebude konzistentně používat a zůstane mrtvý.

4. **Cover design**

- To bych nechal na F4 – F2 by měl definovat jen, jaké **informace** musí cover obsahovat (název, level, režim, GS, key risks), ne layout.

5. **Umístění section_0**

- Prompt by měl explicitně určit, kde section_0 je: buď hned za cover, nebo až za TOC; jinak může vznikat nekonzistence mezi kartami.  
- Zužitkoval bych heuristiku „section_0 hned po coveru, ještě před TOC", aby se Josefině rychle nastavily cíle.

***

### E. v2.0.3 specific features

1. **Section 0 „Co hodnotíme"**

- Didakticky skvělé, ale pro Josefinu se to snadno stane „další blok textu před receptem".  
- Doporučení: nechat, ale zkrátit na 5 velmi vizuálně psaných bulletů; jinak bude redundantní s 3B senzorickým profilem.

2. **Rozšířený Block 7**

- Prerequisites, attempt focus a training_targets mají velký potenciál – pokud jsou krátké a konkrétní.  
- Bez silného omezení délky se z toho snadno stane abstraktní coaching, který uživatelka přeskakuje.

3. **What‑if box oddělený od 3C**

- Koncepčně dobré (M4 principle), ale user‑experience záleží na tom, jestli je nad 3C a jasně označen jako „čti před pečením".  
- Pokud je vedle 3C, může působit jako duplicita.

4. **Falsely_simple_warning**

- Pro Josefinu užitečné, pokud je formulováno jako „tahle věc vypadá snadněji, než je – tady jsou 2 pasti", ne jako moralizující banner.  
- Riziko „patronizujícího" tónu se dá vyřešit konkrétností.

***

### F. 3–5 změn pro F2 v2.0.4 / 2.1.0

Seřazeno podle priority:

1. **Povinná „line card lite" od F2**

- Kontrakt: F2 musí vyprodukovat extra výstup – ultra krátký seznam kroků s gramážemi, časy a teplotami, bez PROČ a vědy.  

2. **Striktní délkové limity**

- PROČ komentáře, vědecké odstavce, training targets – všechny by měly mít explicitní max. počty slov / vět.  

3. **Formální validace invariants (H1–H5 atd.)**

- Přidat do promptu explicitní JSON/markdown schemata, ne jen slovní instrukce, aby LLM nebyl jediný enforcement layer.  

4. **Jasnější guideline pro tone & audience**

- Upřesnit, že primární hlas je „instruktor mluví k Josefině", a explicitně omezit akademický styl.  

5. **Explicitní standard pro umístění section_0 a what‑if boxu**

- Fixní pozice v dokumentu (např. section_0 za cover, what‑if těsně před 3A) pro konzistenci mezi kartami.

***

## Persona 6 — Chain auditor (F1 → F2)

Bez reálného `01-research-brief.json` a `02a-writer-draft-sonnet.json` můžu mluvit jen o tom, kde **typicky** vznikají ztráty.

### A. Co brief obsahoval a karta často ignoruje

Nejrizikovější místa:

- **confidence_matrix** – F1 ví, kde se zdroje rozcházejí (např. doba repos, přesná teplota), ale F2 často prezentuje jen jednu verzi bez explicitního „X říká Y, Z říká W".  
- **key_variables v science** – pokud F1 identifikoval klíčové proměnné (teplotní gradient, hydratace, protein %), F2 má tendenci shrnout je do zjednodušeného textu a některé proměnné úplně vynechat.  
- **home_constraints.cr_specific** – omezení jako Mora 545, absence teploměru, jeden plech atd. se v kartě objevují někdy jen v technology boxu, nikoliv i v konkrétních krocích (např. „peč singly, ne dva plechy najednou").  
- **alternative_sources** – F1 může mít více zdrojů pro varianty; F2 pak zvolí jednu variantu a ostatní nezmíní, což je někdy OK, ale ztrácí se kontext.  
- **tasting_protocol** – často se stane, že některý z tasting checkpointů skončí jen jako marginální poznámka, ne jako samostatný krok `step_type: tasting`.

***

### B. Co karta obsahuje, ale v briefu obvykle není

- **Stylizované metafory a pedagogické příměry** – Writer přidává analogie pro vysvětlení (např. „gluten jako pružina"), které F1 neobsahoval. To může být užitečné, ale není to stoprocentně sledovatelné ke zdrojům.  
- **Konkrétní formulace tréninkových cílů (attempt 3, attempt 5)** – brief obvykle řeší jen rozmezí „co je realistické v X pokusech", zatímco konkrétní wording cílů je na F2.  
- **Glossary termíny, které nejsou v briefu** – F2 někdy doplní pojmy, které F1 nezmínil, protože mu přijdou „jemně užitečné"; to je improvizace.

***

### C. Ztracené informace (translation loss)

Typické patterny:

- **Rozdílné názory zdrojů → jedna věta v kartě**

  - Např. některé zdroje říkají „repos 1 h", jiné „24 h"; F1 to zachytí, F2 pak napíše jen „ideálně přes noc", čímž ztratí nuance „min. 1 h je safe, zbytek je chuťová optimalizace".[11][2][10][12][14]

- **Technické nuance v science**

  - F1 může mít jemnější rozdíl mezi rolí páry a CO₂ nebo mezi různými typy mouky; F2 to zjednoduší do jednoho vysvětlení, které je sice pravdivé, ale neobsahuje plnou šíři.

- **Home vs. pro environment**

  - F1 může detailně popsat rozdíly mezi konveční a horkovzdušnou troubou; F2 napíše jen „200 °C horkovzduch", bez explicitního návodu pro konveční ekvivalent.

***

### D. Duplicitní informace

- **Teploty a časy** – vyskytnou se v technology boxu, v krocích 3A, v manifestu, možná i ve vědě (Maillard), což je v principu v pořádku, pokud to není nekonzistentní.  
- **Mora 545 flag** – ideálně by měl být jen v technology boxu a manifestu; pokud se různě opakuje v textu, zvyšuje to kognitivní šum.

***

### E. Top 3 chain issues (pravděpodobné)

| # | Chain issue | Severity |
|---|-------------|----------|
| 1 | Ztráta „confidence_matrix" – karta neukazuje, kde si literatura odporuje (repos čas, přesná T pečení) | STŘEDNÍ |
| 2 | Zjednodušení vědy – F1 nuance (voda vs. tuk, dvě fáze baking powder) se v kartě smrsknou do jedné věty | STŘEDNÍ |
| 3 | Home constraints nejsou dost propsané v konkrétních krocích (jen v technology boxu) | STŘEDNÍ |

***

## Shrnutí

- **Overall verdict:** SHIPS WITH PATCHES  

### Top 5 kritických (nejdůležitější k opravě před pouštěním Josefiny)

1. Vědecky nepřesná nebo zavádějící formulace typu „máslo se uvolní jako pára" místo jasného vysvětlení role vody (pára + CO₂).  
2. Potenciálně přetížené PROČ komentáře a step_type tagy v pracovním bloku 3A, pokud nejsou vizuálně sekundární – riziko, že karta bude u linky nečitelná.  
3. Absence ultra zhuštěné „line card lite" verze kroků s gramážemi a teplotami, kterou by si Josefina opravdu dala k troubě.  
4. Ne zcela explicitně a jednoznačně označená nejistota u Mory (unverified) a u adaptačních teplot, pokud není flag opravdu výrazný.  
5. Příliš abstraktní a málo vizuálně konkrétní tréninkový blok 7, který nemusí Josefině reálně pomoci plánovat další pokusy.

### Top 3 systémové nálezy pro F2 v2.0.4 prompt patches

1. Přidat povinný výstup „line_card_lite" (superzhuštěná pracovní karta) a zavést tvrdé délkové limity pro PROČ komentáře, vědecké odstavce a tréninkové cíle.  
2. Zpřísnit formální validaci invariants (H1–H5, H10–H13, S8–S10) přes schema/patterny, ne jen textové instrukce – zejména pro teplota+režim, 2A↔3A konzistenci a labely v 1B.  
3. Jasněji specifikovat umístění Section 0 a what‑if boxu a upřesnit tone-of-voice (hlavní publikum = Josefina), aby karta nebyla zbytečně akademická a měla konzistentní layout napříč produkty.
