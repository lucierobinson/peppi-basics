# REVIEW A — Madeleines tech karta (Peppi Basics v2.0, pilot #3)

**Žádám tvou přísnou recenzi této tech karty.** Karta je výstupem nového 2fázového AI pipelinu (F1 Researcher → F2 Writer) s manuálním HTML renderem. Je to **první karta po přechodu z monolithic v1.x promptu na chain architekturu v2.0**.

Cílový uživatel karty: **Josefina Robinson (20 let, pastry chef v tréninku, domácí kuchyně Mora VTPS 545 BX + KitchenAid, cíl Le Cordon Bleu London do 2 let, ADHD/OCD tendence — potřebuje strukturu, vizuální hierarchii, krátké bloky, jasné kroky)**.

Karta má **čtyři účely zároveň**, oddělené vizuální hierarchií ne samostatnými dokumenty:
1. **Studijní materiál** — věda, varianty, historie, mýty (čte před prvním pokusem)
2. **Pracovní karta u linky** — kroky s gramážemi, checkpointy, PROČ komentáře
3. **Diagnostický nástroj** — troubleshooting, senzorický profil, pasti
4. **Tréninkový plán** — opakování, A/B testy, prerekvizity, cíle

## Přílohy

1. **`madeleines-tech-karta-sonnet.html`** — primární objekt recenze
2. **`01-research-brief.json`** — F1 Researcher výstup (vstup Writeru)
3. **`02a-writer-draft-sonnet.json`** — F2 Writer výstup (co šlo do renderu)
4. **`peppi-basics-v2-writer-prompt-F2-v2_0_3.md`** — F2 prompt (kontrakt Writeru)

## Kontext pilotu

Produkt: **madeleines** (klasické francouzské, curricular level Basic, Režim B — adaptovaný).

**Klíčová rozhodnutí Researcheru (F1)** — reviewer by měl posoudit, zda jsou obhájitelná:
- **Golden Standard = FCI Session 9 (Jacques Torres 2009), ne CIA B&P (2013)** — T2 vs. T2 override kvůli `target_style: "Klasické francouzské (tradiční)"`. FCI používá melted butter + repos metodu (autentická), CIA používá creaming bez repos (amerikanizovaná). Jinak by platilo Constitution §3.1: "T2 vs T2 → novější edice + domain authority".
- **`ratio_framework: null`** — madeleines nemají veřejně dostupný T1 rubric (ani SkillsUSA, ani CAP Pâtissier konkrétně). Karta NESMÍ zobrazovat baker's percent jako T1-sourced.
- **`mora_545.verified: false`** — žádný URL nespojuje Mora 545 + madeleines. Adaptace 205 °C → 200 °C horkovzduch je odhad, ne ověřená hodnota. Karta to MUSÍ flagovat.
- **`t1_availability: "partial"`** — `institutional_rubric` v section_0 "Co hodnotíme" je adaptací CAP Pâtissier RC1.2 + FCI Evaluating Your Success, NE přímou citací T1.

**Nové v2.0.3 features** (tato karta je první, která je má):
- **Section 0 "Co hodnotíme"** před blokem 1 — 5 vrstev kritérií úspěchu (vizuální, strukturální, senzorická, technická, procesní)
- **Block_7 rozšířený** — prerequisites s hard/soft strength, attempt focus, training_targets (max 2)
- **What-if box** oddělený od 3C troubleshooting — 3C = post-faktum diagnóza, what-if = prevence v reálném čase
- **Home substitutions** sekce v 2B
- **Falsely simple warning** banner za cover

---

## Pravidla pro VŠECHNY experty

- **Buď přísný.** Hledám chyby, ne komplimenty. Josefina se z diplomatických formulací nic nenaučí.
- **Konkrétní > obecné.** „V kroku 5 je špatně X, protože zdroj Y říká Z" > „recept by mohl být přesnější".
- **Pokud něco správně funguje**, řekni to JEDNOU větou a věnuj se tomu, co nefunguje.
- **Pokud si experti protiřečí**, je to OK — cenná informace.
- **Pokud nevíš nebo si nejsi jistý, ŘEKNI TO.** „Nejsem si jistý, ale..." je cennější než sebevědomá chyba.
- **Pokud máš web search, OVĚŘUJ.** Zejména gramáže, teploty, přiřazení zdrojů, historické tvrzení.
- **Nebuď diplomatický.** Pokud je něco špatně, řekni to přímo.

---

# PERSONA 1 — Chef-instruktor (pastry, 15+ let výuky)

Hodnotíš kartu jako instruktor na úrovni Le Cordon Bleu. Tvoje otázky:

### A. Faktická správnost receptu (Blok 3A)

1. Jsou gramáže správné? FCI uvádí 125g cukr / 110g mouka / 3g prášek / 1g sůl / 5g kůra / 100g vejce / 110g máslo. Je poměr 1:1 máslo:mouka autentický pro klasické francouzské madeleines?
2. Je 100g odhad za „2 large eggs" (FCI uvádí kusy bez gramáže) rozumný? (2 × 50g bez skořápky.)
3. Je teplota 200 °C (adaptace z FCI 205 °C) bezpečná pro domácí troubu? Nebo by bylo lepší FCI 205 °C zachovat?
4. Je délka repos „min. 1 h, ideálně přes noc" v pořádku? CIA říká „pipe immediately", jiné zdroje říkají přes noc — je výběr minima obhájitelný?
5. Je postup v 3A (suché + vejce + máslo → repos → plnit ze chladu → péct 7–8 min) konzistentní s tím, jak by instruktor LCB učil madeleines?

### B. Pracovní karta — použitelnost u linky

1. Je 12 kroků přiměřených? Není to moc nebo málo?
2. Má každý krok jasný cíl a checkpoint?
3. Jsou PROČ komentáře užitečné, nebo rušivé?
4. Fungovala by tato karta vytištěná na A4 u linky?
5. Je rozlišení step_type (standard / tasting / preheat) přidané hodnotou, nebo zbytečná komplikace?

### C. Varianty (Blok 4)

1. Jsou 4 varianty (citronová, beurre noisette, mini, čokoládová) relevantní pro Josefinu na úrovni Basic?
2. Je varianta beurre noisette přesně popsaná (140–150 °C, ořechová vůně)?
3. Chybí důležitá varianta (např. miel/honey, pistácie, matcha)?
4. Je decision_layer u každé varianty jasný (kdy a proč ji zvolit)?

### D. Věda (Blok 1B)

1. Je vysvětlení teplotního šoku (repos + horká trouba) správné?
2. Je Maillardova reakce správně aplikována na madeleines (redukující cukry + proteiny, T > 140 °C)?
3. Jsou vědecké štítky (`[robustní empirické pravidlo]`, `[mechanismus — konsenzus]`) adekvátně použité? Nebo někde přehnané / podhodnocené?
4. Je něco zjednodušeno do bodu, kdy to je zavádějící?

### E. Troubleshooting + what-if (3C a 3D)

1. Jsou symptomy správně přiřazeny k příčinám a prevencím?
2. Je rozdělení 3C (post-faktum) vs. 3E what-if (prevence v reálném čase) smysluplné, nebo matoucí?
3. Chybí důležitý problém, který se u madeleines běžně vyskytuje?

### F. Top 3 problémy

Kdybys mohl opravit jen tři věci na kartě (ne na promptu), co by to bylo? Seřaď od nejkritičtějšího.

---

# PERSONA 2 — Food scientist (pastry chemistry, PhD-level znalost)

Hodnotíš kartu z hlediska vědecké přesnosti. Máš přístup k McGee, Figoni, food science literatuře.

### A. Science in Blok 1B — mechanismy

1. Je mechanismus bosse (teplotní šok) popsán přesně? Existuje alternativní vysvětlení, které karta ignoruje?
2. Je „máslo se uvolní jako pára → výbušnější nárůst" správně? Jakou roli má evaporace másla vs. expanze páry z vody?
3. Je role prášku do pečiva (CO2, dvojčinný) správně popsaná v kontextu madeleines?
4. Jsou claim confidence labels (`robustní empirické pravidlo`, `mechanismus — konsenzus`, `tradovaná heuristika`) adekvátně přiřazené?

### B. Ingredient roles (Blok 2A)

1. Je tvrzení „máslo nesolené 82 %" relevantní pro výsledek? Nebo by 80 % vs. 82 % udělalo měřitelný rozdíl?
2. Je „mouka hladká T450–T550" adekvátní, nebo specifický protein content by byl lepší guideline?
3. Je vliv citrusové kůry na chuť podložený (esenciální oleje, T < 50 °C jinak se spalují)?

### C. Manifest — zdrojová transparentnost

1. Podívej se na zdrojový manifest (dole pod glossary). Jsou zdroje u každého adaptovaného čísla dohledatelné a relevantní?
2. Je Figoni citace *How Baking Works 3rd ed. (2010)* pro teplotní šok legitimní, nebo mechanism uvedený v kartě není v té knize?
3. Je FCI ISBN 9781584798033 správný?
4. Je adaptace 205 °C → 200 °C transparentně dokumentována?

### D. Top 3 problémy

3 nejkritičtější chyby/zjednodušení/nepřesnosti z vědeckého hlediska.

---

# PERSONA 3 — Josefina (cílová uživatelka)

Čteš tuhle kartu jako 20letá Josefina, která se chystá péct madeleines poprvé. ADHD, potřebuješ strukturu, krátké bloky, jasné kroky. Máš Mora 545, KitchenAid, kuchyňskou váhu, madeleine plech 12-dutin.

### A. Srozumitelnost

1. Je blok 1 (co to je a proč) přiměřeně dlouhý? Nebo tě to zahltí před prvním pokusem?
2. Je section 0 "Co hodnotíme" užitečná před pečením? Pomůže ti vědět, na co se zaměřit?
3. Je TL;DR na začátku bloku 1 a bloku 2 dostatečný, abys pochopila základ?
4. Jsou tooltipy na odborných termínech (bosse, repos, beurre noisette atd.) užitečné?

### B. Pracovní karta v kuchyni

1. Čteš kroky v reálném čase (hmota v misce, ruce vlhké). Jsou gramáže viditelné dost rychle?
2. Je jasné, kdy přejít na další krok (checkpoint signály)?
3. Je strach z repos (min 1h) jasně vysvětlený? Víš, proč nesmíš zkrátit?
4. Je Mora flag (adaptace, doporučeno ověřit teploměrem) dostatečně viditelný? Víš, co dělat, když nemáš teploměr?

### C. Co chybí, co je zbytečné

1. Co ti při pečení chybí a v kartě to není?
2. Co je v kartě a nepotřebuješ to?
3. Fungovala by pracovní karta vytištěná na A4 u linky, nebo by potřebovala i hlavní telefon na blízku pro další info?

### D. Tréninkový protokol (Blok 7)

1. Je odhad „4 hodiny + 3–5 pokusů" realistický?
2. Jsou attempt_1 / attempt_3 / attempt_5 cíle motivující, nebo příliš abstraktní?
3. Pomohl by ti blok 7 reálně se zlepšit, nebo je to jen papír?

### E. Top 3 problémy

3 věci na kartě, které tě jako uživatelka nejvíc rozčilují nebo matou.

---

# PERSONA 4 — Robinson (redaktor + prompt compliance)

Jsi Robinson — producent karty. Znáš F2 v2.0.3 prompt, Constitution v1.1, pilot conditions C1–C4. Hodnotíš, zda Writer dodržel kontrakt.

### A. C1–C4 compliance (F1 review conditions)

- **C1** — je GS explicitně prezentován jako FCI (T2) a NE jako CIA B&P? Nebylo by rovnocenné zvolit CIA B&P s frencification adaptací?
- **C2** — je Mora 545 `verified: false` flag v kartě výrazný? Je `technology_box.type: "generic_oven"` transparentní?
- **C3** — neobjevuje se v kartě žádný baker's percent prezentovaný jako T1-sourced?
- **C4** — je `institutional_rubric` v section_0 prezentovaný jako "na základě CAP + FCI", NE jako přímá citace T1?

### B. F2 v2.0.3 invariants check

- **H1** — mají všechny `standard` step_type kroky gramáže na začátku? Jsou `preheat` a `tasting` správně exempt?
- **H2** — jsou teploty všude s režimem (200 °C horkovzduch, ne holé 200 °C)?
- **H3** — má každý odstavec 1B štítek z enumu na konci?
- **H4** — je 2A ↔ 3A konzistence dodržena (všechny ingredience z 2A jsou v 3A a naopak)?
- **H5** — má každé adaptované číslo ManifestRow s provenance?
- **H10** — je FailureMode fidelity dodržena (7 FM v briefu → 6 v 3C + 1 during_process v what-if)?
- **H11** — má section_0 všech 5 vrstev z rubric?
- **H12** — mají prerequisites hard/soft labels?
- **H13** — max 2 training_targets?
- **S8** — jsou všechny 4 tasting checkpointy z briefu umístěné v kartě?
- **S9** — jsou home_substitutions z briefu renderované?
- **S10** — je falsely_simple_warning v kartě viditelně zobrazen?

### C. Constitution v1.1 red lines

- **§2.1 přesnost čísel** — má každá teplota, čas, gramáž zdroj? Žádné „běžná praxe"?
- **§2.2 zdrojová hygiena** — žádná Peppi DB, žádná unfetched URL prezentovaná jako verified?
- **§2.3 žádné halucinace** — pokud Writer něco nevěděl, řekl to?
- **§2.4 home adaptation boundary** — je profi vs. home jasně oddělené?
- **§2.5 explicit uncertainty** — jsou všechny nejistoty (Mora 545, ratio_framework null, t1 partial) transparentně flagované?

### D. Top 3 prompt compliance chyby

3 nejvážnější odchylky F2 v2.0.3 kontraktu od Writer výstupu.

---

# PERSONA 5 — Prompt engineer (meta-analytik)

Posuzuješ kartu jako důkaz toho, co F2 v2.0.3 prompt umí a neumí. Nepředstaveš kartu — představeš **prompt**. Karta je vstup pro tvoji diagnostiku.

### A. Kde F2 prompt funguje dobře

Jmenuj 3 konkrétní místa, kde karta ukazuje, že prompt přesně dodává to, co žádá.

### B. Kde F2 prompt nefunguje

Jmenuj 3–5 míst, kde karta ukazuje odchylku od promptu. Pro každé:
- Co prompt žádá (cituj řádek)
- Co Writer udělal místo toho
- Proč to Writer udělal (tvoje hypotéza)

### C. Kde F2 prompt mlčí a Writer musel improvizovat

Jmenuj 3–5 míst, kde karta obsahuje obsah, **který prompt nespecifikoval** (nebo specifikoval příliš volně). Pro každé:
- Co karta obsahuje
- Co prompt o tom říká (nebo nic)
- Jestli je improvizace OK nebo problematická

### D. Systémové gaps — co v F2 v2.0.3 chybí

1. **Line card lite** — tisknutelná zkratka pracovní karty. Existuje v předchozích kartách (choux, makronky), NE v této madeleines kartě. Je to gap v promptu? Měl by F2 v2.0.4 line_card_lite kontrakt přidat?
2. **SVG diagramy** — předchozí karty mají SVG (teplotní křivka, proces timeline). Tato NE. Měl by F2 SVG zahrnovat, nebo je to responsibilita F4 Formatteru?
3. **Sesterské karty** — madeleines nemají, ale prompt to řeší `enable_sister_cards` flag. Je mechanismus správně navržen, nebo by v budoucnu selhal?
4. **Cover design** — obal karty je daný template, ne promptem. Měl by prompt definovat cover strukturu, nebo je to OK jako render responsibility?
5. **Section_0 umístění** — karta má section_0 za TOC. Prompt o umístění nic neříká. Měl by?

### E. v2.0.3 specific features — posouzení

1. **Section 0 "Co hodnotíme"** — pomáhá Josefině, nebo je to redundant s blokem 3B senzorický profil?
2. **Block_7 rozšíření** — prerequisites + attempts + training_targets. Funguje jako coherentní celek, nebo je to nepřehledné?
3. **What-if box oddělený od 3C** — M4 principle („what-if = reálný čas, 3C = post-faktum"). Funguje nebo matoucí?
4. **Falsely_simple_warning** — užitečné, nebo patronizující?

### F. 3–5 konkrétních změn pro F2 v2.0.4 (nebo v2.1.0)

Co bys změnil v promptu na základě této karty? Priorita od nejvyšší.

---

# PERSONA 6 — Chain auditor (F1 → F2 předávka)

**Nový typ recenze pro pilot #3.** Nedíváš se na kartu jako celek, ale na **předávku mezi F1 Researcherem a F2 Writerem**. Máš oba JSON + HTML výstup.

### A. Co Research Brief obsahoval a Writer to nevyužil

Projdi `01-research-brief.json` klíč po klíči. Co v briefu je a **v kartě chybí**?

Pozornost na:
- `confidence_matrix` — kde zdroje souhlasí / rozcházejí. Writer tohle použil?
- `key_variables` v `science` — Writer je rozvedl do 1C?
- `home_constraints.cr_specific` — Writer je umístil do 2E?
- Všechny `alternative_sources` — Writer je zmínil ve variantách nebo manifestu?
- `failure_tracking.falsely_simple_warning` — Writer ho zobrazil?
- `tasting_protocol` — všechny 4 checkpointy umístěné?

### B. Co karta obsahuje a v briefu to nebylo

Projdi kartu sekci po sekci. Co v kartě je a **v briefu nebyl základ**?

Pozornost na:
- Varianty v bloku 4 (beurre noisette, mini, čokoládová) — jsou v briefu, nebo si je Writer domyslel?
- Technologické pasti (3D) — jsou v briefu?
- Tréninkový protokol (7B attempts) — obsah je v briefu?
- Glossary termíny — pokrývají brief, nebo si Writer přidal vlastní?

### C. Ztracené informace (F1 → F2 translation loss)

Jsou místa, kde brief byl přesnější než karta? Nebo kde Writer stringently interpretoval brief a ztratil nuance?

### D. Duplicitní informace

Opakují se fakta na více místech v kartě způsobem, který je redundantní? (Např. "200 °C horkovzduch" se objevuje v technology_box, 3A kroku 6, manifestu. OK nebo moc?)

### E. Top 3 chain issues

3 nejvážnější F1→F2 nebo draft→karta ztráty/zkreslení/inflace.

---

# OUTPUT FORMAT

Pro každou personu 1–6 vytvoř sekci s nadpisem:
```
## Persona N — [název]
```

Uvnitř sekce odpovídej na všechny otázky (A, B, C, ...) strukturovaně. Tabulky pro závažnost:

| Severity | Popis |
|---|---|
| KRITICKÁ | Josefina se z toho naučí špatně, nebo riskuje selhání pokusu. Vyžaduje fix před Josefininou prací s kartou. |
| STŘEDNÍ | Není ideální, zhoršuje kvalitu, ale karta je použitelná. Fix v iteraci. |
| NÍZKÁ | Estetika, konzistence, nuance. Fix kdy je čas. |

Na konci celé recenze:

## Shrnutí

- **Overall verdict:** SHIPS / SHIPS WITH PATCHES / REDO
- **Top 5 kritických** (seřazené) — jeden řádek každý
- **Top 3 systémové nálezy** pro F2 v2.0.4 prompt patches

Žádný diplomatický úvod, žádná shrnující věta na úvod. Jdi rovnou do Persona 1.
