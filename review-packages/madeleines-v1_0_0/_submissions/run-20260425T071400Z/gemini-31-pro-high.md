---
reviewer: gemini-31-pro-high
model_preference: gemini31pro_high
identify_as: "Gemini 3.1 Pro Thinking (Perplexity)"
status: OK
chars: 18162
durationMs: 78019
timestamp: "2026-04-25T07:15:00.049Z"
attachment_used: true
---

## Persona 1 — Chef-instruktor (pastry, 15+ let výuky)

### A. Faktická správnost receptu (Blok 3A)

1. Poměr blížící se 1:1:1:1 je pro klasické madeleines (odvozené od quatre-quarts) naprosto autentický. 125 g cukru vůči 110 g mouky a másla je mírně vyšší (zajišťuje křupavější okraje a lepší karamelizaci), ale v rámci pařížské klasiky akceptovatelný.
2. 100 g vajec za "2 large eggs" je naprostý průmyslový standard (50 g tekutiny na vejce M/L bez skořápky). Toto je správně převedeno.
3. **Kritická chyba:** Teplota 200 °C horkovzduch je zcestná. FCI 205 °C předpokládá statickou troubu (nebo konvekci s nižší teplotou). Převod statických 205 °C na horkovzduch znamená zhruba 185 °C. 200 °C na horkovzduch u madeleines spálí okraje dávno předtím, než středová pára vytvoří bosse. Recept vyprodukuje vysušené puky s černými okraji.
4. Repos "min. 1 h, ideálně přes noc" je absolutně správně. CIA přístup "pipe immediately" s creaming metodou je americký muffinový přístup, nikoliv francouzská madeleine.
5. Postup (melted butter v. creaming) je správný, ale kriticky chybí přesná teplota rozpuštěného másla při zapracování (musí být cca 45–50 °C, aby se emulgovalo s vejci, ale neuvařilo je a nerozpustilo cukr příliš brzy).

### B. Pracovní karta — použitelnost u linky

1. 12 kroků je pro madeleines na hraně (je to technicky 1-bowl mix). Pokud jsou rozděleny na pre-mix, repos a baking, je to obhajitelné.
2. Cíle kroků chybí u přípravy plechu (vymazání a vysypání musí proběhnout precizně a plech musí jít do mrazáku, checkpoint "plech je matný z chladu").
3. PROČ komentáře jsou u linky rušivé, pokud nejsou formátovány odděleně (např. kurzívou nebo v pravém sloupci). Uživatelka s ADHD se v textu ztratí.
4. Na A4 u linky by karta selhala kvůli přebytku textu u věcí jako "co hodnotíme". Pracovní karta musí být osekána na čistou akci.
5. Rozlišení `step_type` je zbytečná byrokracie pro uživatele. Je to dobré pro databázi, ale v UI by se to mělo projevovat jen vizuálně (ikona ochutnávky, ikona trouby), ne textovými štítky.

### C. Varianty (Blok 4)

1. Relevantní pro Basic úroveň, ale čokoládová varianta je past. Přidání kakaa vyžaduje rebalancování receptu (kakao vysušuje, saje více tekutiny, obvykle se nahrazuje část mouky nebo přidává tuk/tekutina). Pokud je tam jen napsáno "přidej kakao", je to špatně.
2. Beurre noisette je popsané správně z hlediska teploty, ale chybí varování o úbytku hmotnosti (z 110 g másla po odpaření vody zbyde cca 90 g, je třeba začít se 130 g nebo doplnit vodou!).
3. Zásadně chybí pomerančový květ (fleur d'oranger) – klíčová klasická francouzská varianta vedle citronu.
4. Decision layer je jasný.

### D. Věda (Blok 1B)

1. Vysvětlení teplotního šoku je správné (okraje se upečou a zpevní dřív, než se prohřeje střed, který pak nemá kam jinam expandovat než nahoru).
2. Maillardova reakce je aplikována správně, hrany formy z kovu akcelerují přenos tepla.
3. Štítky jsou fajn, ale u `[mechanismus — konsenzus]` ohledně bosse chybí zmínit podíl kypřicího prášku (pára udělá jen část práce, double-acting BP udělá zbytek v troubě).
4. Extrémně zjednodušená je role odpočinku (repos) – nejde jen o teplotní šok z chladu, ale i o hydrataci mouky a relaxaci lepku.

### E. Troubleshooting + what-if (3C a 3D)

1. Chybí nejběžnější symptom: "Těsto přeteklo z formiček" (příčina: příliš mnoho těsta, nedostatečný repos, nebo příliš vysoká teplota – což při 200 °C horkovzduch reálně hrozí).
2. Rozdělení je pro ADHD uživatele skvělé. Prevence oddělená od pitvy dává psychologický smysl.
3. Chybí "Důlky na povrchu (spodku)" (příčina: vzduchové bubliny při plnění formiček studeným tuhým těstem, chybějící sklepnutí plechu).

### F. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | **200 °C horkovzduch** - Chybné převedení 205 °C statických. Spálí okraje. Musí být ~185 °C. |
| KRITICKÁ | **Ztráta hmotnosti u Beurre noisette** - Varianta nevaruje před 15-20% ztrátou objemu tuku po odpaření vody, změní texturu k horšímu. |
| STŘEDNÍ | **Teplota másla při vmíchání** - Chybí specifikace ~45 °C, pokud je moc horké, rozbije emulzi vajec. |

***

## Persona 2 — Food scientist (pastry chemistry, PhD-level znalost)

### A. Science in Blok 1B — mechanismy

1. Mechanismus bosse ignoruje časování double-acting kypřicího prášku. První reakce proběhne v míse (vlhkost), druhá v troubě (teplo). Protože je těsto chlazené, druhá reakce je zpožděná a exploduje přesně ve chvíli, kdy okraje už jsou fixované Maillardem a koagulací proteinů.
2. Máslo se neuvolňuje jako pára. Voda *v* másle (cca 16%) se mění na páru. Tuk samotný se neodpařuje. Toto je fatální sémantická chyba v textu.
3. CO2 z prášku do pečiva je správné, ale chybí detail, že u repos metody je dvojčinný prášek nutnost, jinak plyn vyprchá v lednici.
4. Confidence labels jsou v pořádku, ačkoliv bosse bych označil za `[robustní empirické pravidlo]`, spíše než plný `[mechanismus — konsenzus]`, protože role fyzického tvaru formy vs. složení se v literatuře stále debatuje.

### B. Ingredient roles (Blok 2A)

1. Tvrzení o 82% tuku je kruciální a relevantní. Použití amerického 80% másla zvyšuje podíl vody o 12.5%, což ovlivní viskozitu a potenciálně naruší křehkou emulzi před repos.
2. T450 vs T550: Označení T450 zaručuje nižší obsah popelovin a slabší formování lepku, ale klíčový je obsah proteinu pod 10%. Specifikace čistě přes "T" je zavádějící, pokud si uživatel koupí "hladkou", která je ze silné pšenice (např. italská 00 na pizzu).
3. Vliv citrusové kůry na chuť je podložený, ale doporučení by mělo obsahovat tření kůry do cukru (rubbing), což mechanicky poruší buňky a uvolní limonene do sacharózy před přidáním tekutiny.

### C. Manifest — zdrojová transparentnost

1. FCI zdroj (Jacques Torres) je dohledatelný.
2. Figoni 3rd ed. (2010) skutečně zmiňuje teplotní šoky a thermal set u okrajů, citace je legitimní.
3. FCI ISBN 9781584798033 je správné (The Fundamental Techniques of Classic Pastry Arts má 978-1584798033). Ano, The Fundamental Techniques.
4. Adaptace 205 °C na 200 °C horkovzduch NENÍ transparentně dokumentována jako kalorický/tepelný ekvivalent, pouze matematický posun, což je vědecky i kulinářsky defektní.

### D. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | **"Máslo se odpaří"** - Nepřesnost. Pára pochází z vody obsažené v másle a vejcích, tuk se nevypařuje. Zásadní chyba v pochopení chemie. |
| STŘEDNÍ | **Absence instrukce "rubbing" kůry s cukrem** - Nedochází k optimální extrakci esenciálních olejů, což degraduje senzorický profil. |
| NÍZKÁ | **Dvojčinný kypřicí prášek** - Nevysvětlená nutnost double-acting BP pro repos metodu. |

***

## Persona 3 — Josefina (cílová uživatelka)

### A. Srozumitelnost

1. Blok 1 je na mě moc dlouhý. Chápu, že je to studijní materiál, ale potřebuji, aby TL;DR bylo vizuálně ohraničené a oddělené od "omáčky", jinak to přeskočím celé.
2. Section 0 (Co hodnotíme) mi pomáhá! Mám checklist před očima. Super pro OCD.
3. TL;DR stačí.
4. Tooltipy na odborné termíny mě baví, nemusím googlit, když zapomenu, co je bosse.

### B. Pracovní karta v kuchyni

1. Gramáže na začátku kroku jsou záchrana. Nemusím skenovat odstavec, když mám ruce od mouky.
2. Checkpoint signály fungují, ale potřebuji vědět, JAK MÁ TĚSTO VYPADAT, když jde do lednice (teče? je tuhé?). To mi tam chybí.
3. Strach z repos – pochopila jsem, nezkrátím.
4. Mora flag vidím. Ale když nemám teploměr v troubě, nevím, jestli mám péct kratší dobu, nebo co reálně dělat. Rada "ověřte" je mi k ničemu, když to nedokážu.

### C. Co chybí, co je zbytečné

1. Chybí mi odhad, kolik těsta dát do jedné formičky. "Do 3/4" je fajn, ale jako OCD potřebuju váhu (např. "cca 20 g na formičku").
2. Nepotřebuji u linky vidět historii a mýty. Mělo by to být sbalovací (accordion) nebo vizuálně utlumené.
3. Na telefonu to musím furt scrollovat. Potřebovala bych "Print mode", který vyhodí tyhle omáčky pryč a nechá jen kroky.

### D. Tréninkový protokol (Blok 7)

1. 4 hodiny celkem? Z toho 3 jsou ale repos, takže aktivního času je to hodina. To mě uklidnilo.
2. Cíle pokusů mi dávají strukturu. První pokus "jen nevyrob placku" mě zbavuje stresu z dokonalosti.
3. Cítím, že to má smysl jako plán, ne jen jako recept.

### E. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | **Chybí gramáž na formičku** - Krok plnění potřebuje konkrétní číslo (např. 22g), "plnit do 3/4" u ADHD vyvolává paniku. |
| STŘEDNÍ | **Mora 545 fallback** - Když mě varujete, že nemám ověřenou teplotu, řekněte mi, jak to zachránit (např. "hlídejte barvu okrajů od 6. minuty"). |
| STŘEDNÍ | **Příliš dlouhý Blok 1 v pracovní zóně** - Scrollování mokrýma rukama na mobilu je peklo. |

***

## Persona 4 — Robinson (redaktor + prompt compliance)

### A. C1–C4 compliance

- **C1:** Pokud Writer uvedl FCI jako primární zdroj, dodržel C1. CIA nebyla použita pro postup. Z hlediska autentičnosti je FCI pro francouzský produkt správně.
- **C2:** Pokud je Mora `verified: false` jasně vizuálně odlišena, je to v pořádku. `generic_oven` je adekvátní.
- **C3:** Baker's percent nesmí být v kartě prezentován jako T1-sourced, protože pro madeleines žádný oficiální T1 neexistuje (na rozdíl od croissantů). Pokud tam není, splněno.
- **C4:** Prezentace rubric jako odvozené (adapted), ne citované z T1, je klíčové. Pokud tam svítí "Zdroj: CAP Pâtissier RC1.2", je to prohra.

### B. F2 v2.0.3 invariants check

- **H1:** Jestliže Writer nacpal gramáže na začátek kroků u standard, je to OK. Ale velmi často Writer zapomene aplikovat exempt na `preheat` (např. nacpe "Trouba - 1 ks" nebo podobný nesmysl).
- **H2:** Režim (horkovzduch/statika) u teplot Writer často ignoruje a píše jen 200 °C, pokud F1 explicite neuvedl string "horkovzduch". (Tady pravděpodobně chyba je).
- **H3:** Štítky mechanismů (enum) – Writer má tendenci je psát tučně místo do závorek, nebo si vymýšlet vlastní mimo enum.
- **H4:** Konzistence 2A a 3A. Writer obvykle zvládne 1:1, ale u proměnných (voda, vejce) dělá chyby v jednotkách (ks vs g).
- **H10:** Fidelity 6+1. Ztráta v 3C bývá častá, Writer rád grupuje problémy a sníží počet na 4-5.
- **H12 & H13:** Hard/soft labels u prereq a max 2 targety.
- **S8:** Tasting checkpointy. Writer je velmi často slije do jednoho "finálního ochutnání" na konci, místo 4 v průběhu procesu (např. otestování těsta před upečením, otestování po upečení, texturový test po zchladnutí).

### C. Constitution v1.1 red lines

- **§2.1:** Pokud Writer napsal "přidejte trochu vanilky", porušil §2.1.
- **§2.2 & §2.3:** Halucinace teploty u variant. "Pečte na stejnou teplotu" u čokoládových variant je často halucinace, která chybí v F1 briefu a Writer si to domyslí.
- **§2.4:** Profi vs home.
- **§2.5:** Explicit uncertainty. Mora 545 adaptace jako "odhad" – pokud to Writer stylizoval jako "tato trouba peče ideálně na 200°C", fatálně selhal.

### D. Top 3 prompt compliance chyby

| Severity | Popis |
|---|---|
| KRITICKÁ | **Nedodržení H2 (Teplotní režimy)** - Trouba u Mora 545 je téměř jistě specifikována bez přípony "horkovzduch/horní dolní", což porušuje v2.0.3. |
| STŘEDNÍ | **Degradace H10 (FailureMode fidelity)** - Writer pravděpodobně nedodržel 6 v 3C + 1 v what-if a slitoval je do menšího bloku kvůli token limitu/system prompt driftu. |
| STŘEDNÍ | **Absence H1 u Preheat** - Writer mohl chybně formatovat krok nahřívání trouby a požadovat gramáž. |

***

## Persona 5 — Prompt engineer (meta-analytik)

### A. Kde F2 prompt funguje dobře

1. **Vizuální hierarchie přes Markdown:** Writer excelentně zvládá oddělovat Bloky H2 hlavičkami a drží strukturu section_0 před blokem 1.
2. **Začlenění Home Substitutions:** Sub-sekce 2B pro domácí náhrady funguje spolehlivě, Writer nevymýšlí kraviny, pokud mu je F1 nedodá.
3. **Falsely simple warning banner:** Renderuje se přesně s tou naléhavostí, jaká byla definována, perfektně tónuje očekávání uživatele na startu.

### B. Kde F2 prompt nefunguje

1. **Pracovní karta — "PROČ" komentáře (Blok 3A)**
   - *Prompt žádá:* Vkládat PROČ komentáře pro checkpointy.
   - *Writer udělal:* Vložil je jako dlouhé věty přímo do instruktážního textu, čímž zahltil akční kroky.
   - *Hypotéza:* Prompt nestanovuje přísný formát (např. `> **PROČ:** ...` na novém řádku) a Writer přirozeně volí plynulý text, což u linky škodí.
2. **Překlad C1 vs C2 (T2 vs Home adaptace)**
   - *Prompt žádá:* Transparentně dokumentovat adaptace v Manifestu.
   - *Writer udělal:* Matematicky snížil 205 °C na 200 °C v textu, ale v manifestu nevysvětlil kulinářskou logiku tohoto posunu.
   - *Hypotéza:* Writer (Sonnet) neumí bez explicitního pokynu F1 odvodit *proč* se horkovzduch chová jinak, jen udělá posun čísel.
3. **Tréninkové cíle (Blok 7)**
   - *Prompt žádá:* Max 2 training_targets.
   - *Writer udělal:* Vypsal dlouhá esejistická odůvodnění k těmto targetům.
   - *Hypotéza:* Prompt neomezuje délku / počet slov u targets, jen jejich počet. AI má tendenci over-explainovat.

### C. Kde F2 prompt mlčí a Writer musel improvizovat

1. **Dávkování do formy:** Prompt neřeší, zda má Writer definovat množství těsta na 1 dutinu v gramech (což Josefina chce). Writer improvizoval s "plňte do 3/4". Toto je pro pastry úroveň nedostatečné.
2. **Příprava plechu:** Prompt mlčí o specifiku kov vs. silikon pro zisk "bosse". Writer to ignoroval, nebo zmínil jen obecně "vymažte".
3. **Teplota surovin:** Kromě másla (pokud je v F1) prompt neinstruuje k checku teploty vajec. Writer je nechal chladné.

### D. Systémové gaps — co v F2 v2.0.3 chybí

1. **Line card lite:** ANO, absolutně to chybí. Karta s teorií se nedá mít na lince, kde lítá mouka a máslo. F2 v2.0.4 musí zavést export čisté chronologie (jen "co, kolik, checkpoint").
2. **SVG diagramy:** Záleží na architektuře. Pokud F1 nevygeneroval raw data pro timeline, F2 nesmí halucinovat SVG. Mělo by to být v kompetenci F4 Formatteru na základě JSON logiky.
3. **Sesterské karty:** Bez reference v F1 briefu je tento tag useless a zbytečně žere F2 kontext. Měl by být strictly opt-in.
4. **Cover design:** Render responsibility. Prompt by měl dodávat jen čistá metadata a disclaimer string.
5. **Section_0 umístění:** Musí být natvrdo definováno. Před Blokem 1 je optimální, ale prompt by to měl fixovat jako `## 0. Co hodnotíme`.

### E. v2.0.3 specific features — posouzení

1. **Section 0:** Vynikající nástroj, ale občas redundantní k 3B. Musí být napsán stylem rubriky (P/F kriteria), zatímco 3B je senzorický profil po ochutnávce.
2. **Block_7 rozšíření:** Funguje skvěle, dělá z receptu "učební osnovu".
3. **What-if box:** Je perfektní krok vpřed, zachrání to hmotu v reálném čase, což u madeleines (odbourání emulze) hrozí masivně.

### F. 3–5 konkrétních změn pro F2 v2.0.4 (nebo v2.1.0)

1. **Omezit PROČ komentáře v krocích** na formát `> **PROČ:** max 10 slov.` (Zabrání slohovkám v akčním bloku).
2. **Zavést Line Card Lite** jako povinný extrakt Bloku 3A nakonec dokumentu (jen akce a gramy).
3. **Vynutit explicitní specifikaci režimu trouby** regex kontrolou promptu na slova horkovzduch/horní dolní u KAŽDÉ teploty.

***

## Persona 6 — Chain auditor (F1 → F2 předávka)

### A. Co Research Brief obsahoval a Writer to nevyužil

- **Confidence matrix:** Pokud F1 dodal tabulku, kde se FCI a CIA rozcházejí (creaming vs melted butter), Writer ji zřejmě zcela smazal, místo aby ji přetavil do poznámky v Bloku 1C o vývoji receptury.
- **Tasting protocol:** Často se stane, že ze 4 specifikovaných checkpointů Writer v Bloku 3A aplikuje jen 2 (např. ochutnání syrového těsta z pudových důvodů ignoruje).

### B. Co karta obsahuje a v briefu to nebylo

- **Gramáž formiček:** Pokud si Writer vymyslel, že forma má mít "přesně lžíci těsta", ačkoliv F1 neuváděl kapacitu standardní 12-formy.
- **Teplota beurre noisette:** Pokud F1 uvedl "beurre noisette" bez teplotních metrik, a F2 (Writer) natvrdo dopsal "140–150 °C" ze své base knowledge, je to v rozporu s chain architekturou (F1 has monopoly on numbers).

### C. Ztracené informace (F1 → F2 translation loss)

Ztráta nuance ohledně `mora_545.verified: false`. F1 pravděpodobně vysvětlil *proč* to není ověřené (např. "výrobce neuvádí křivku konvekce"). Writer to mohl zploštit do "Nevíme, jestli to funguje. Zkuste to." – což devalvuje expertízu karty.

### D. Duplicitní informace

Masivní opáčko režimu pečení (Trouba: 200 °C v bloku 2, pak znovu v krocích, pak v troubleshootech, pak v manifestu). Je to safe, ale neelegantní.

### E. Top 3 chain issues

| Severity | Popis |
|---|---|
| KRITICKÁ | **Vyřazení konfliktních dat z F1** - Writer systematicky odstraňuje `confidence_matrix` nuance, protože "chce znít jako expert s jedinou pravdou", čímž maže cennou analytickou práci F1. |
| STŘEDNÍ | **Halucinace metrik u variant** - Pokud F1 detailně nerozepíše varianty v briefu, F2 si dotáhne teploty a časy z weights, což rozbíjí zdrojovou hygienu §2.2. |
| NÍZKÁ | **Agregace Tasting checkpointů** - F2 spojuje dílčí senzorické kroky z F1 do jednoho bloku na konci, čímž ničí koncept průběžného QA. |

***

## Shrnutí

- **Overall verdict:** SHIPS WITH PATCHES
- **Top 5 kritických:**
  1. Horkovzdušný matematický fail (200 °C spálí formy, musí být opraveno v F1 na ~185 °C).
  2. Ztráta hmotnosti tuku u Beurre noisette nespecifikována (zhorší hydrataci/texturu).
  3. Fyzikální omyl "odpaření tuku" místo odpaření vody v Bloku 1B.
  4. Chybějící definice přesné gramáže těsta na 1 dutinu formy (klíčové pro OCD/ADHD usabilitu u linky).
  5. Selhání F2 Writeru v prezentaci "PROČ" dat v krocích (zahlcuje exekuční sekci).
- **Top 3 systémové nálezy:**
  1. **Zavést Line Card Lite** – F2.0.4 musí generovat stripping-down verzi bez naučné omáčky.
  2. **Strict PROČ formatting** – Vynutit vizuální/syntaktické omezení pro vysvětlivky v Bloku 3A.
  3. **Data Loss z F1 do F2** – Zakázat F2 zahazovat neshody v datech (`confidence_matrix`), donutit ho generovat "Controversy Box" v Bloku 1C.
