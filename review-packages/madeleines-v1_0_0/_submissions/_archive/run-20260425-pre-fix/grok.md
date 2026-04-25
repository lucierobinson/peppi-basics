---
reviewer: grok
model_preference: grok
identify_as: "Grok 4.1"
status: OK
chars: 8387
durationMs: 28784
timestamp: "2026-04-25T07:14:10.815Z"
attachment_used: true
---

## Persona 1 — Chef-instruktor (pastry, 15+ let výuky)

### A. Faktická správnost receptu (Blok 3A)
1. Gramáže nejsou správné oproti FCI specifikaci (125g cukr, 110g mouka, 3g prášek, 1g sůl, 5g kůra, 100g vejce, 110g máslo); poměr 1:1 máslo:mouka je autentický pro tradiční francouzské madeleines, jak potvrzují standardní recepty.[1][2][3]
2. 100g pro 2 large eggs je rozumný odhad (cca 50g bez skořápky na vejce), ale FCI uvádí kusy, ne gramáže, takže by mělo být zdůrazněno jako aproximace.
3. 200 °C horkovzduch je bezpečnější pro domácí trouby než 205 °C; zachovat 205 °C riskuje přepálení v fan-assisted modelech jako Mora.[4]
4. Min. 1 h repos je obhájitelné minimum, ale ideálně přes noc pro bosse; CIA "immediately" je neautentická pro klasické.[5][6]
5. Postup suché + vejce + máslo → repos → plnit ze chladu → 7–8 min je konzistentní s LCB stylem pro autentické madeleines, ale chybí detailní whisking technika pro ribony.[7]

### B. Pracovní karta — použitelnost u linky
1. 12 kroků je příliš mnoho pro basic úroveň; zkraťte na 8–9 pro rychlou linku.
2. Ne každý krok má jasný checkpoint; např. krok 4 (smíchat suché) postrádá vizuální signál jako "rovnoměrný prach".
3. PROČ komentáře jsou užitečné, ale rušivé pokud jsou dlouhé; zkraťte na 1–2 slova.
4. Na A4 vytištěná by fungovala špatně bez laminace; příliš textu, špatná hierarchie pro ADHD.
5. Step_type rozlišení je zbytečná komplikace; standard kroky stačí bez tagů.

### C. Varianty (Blok 4)
1. 4 varianty jsou relevantní pro basic, ale příliš brzy pro Josefínu poprvé.
2. Beurre noisette není přesně popsána; chybí přesná T 140–150 °C a "ořechová vůně + hnědý sediment".[8]
3. Chybí honey/miel varianta, běžná v tradičních.[9]
4. Decision_layer není u každé jasný; např. mini pro "porce control" chybí.

### D. Věda (Blok 1B)
1. Teplotní šok pro bosse je správný.[6][7]
2. Maillard správně aplikován nad 140 °C.
3. Štítky jsou adekvátní, ale "[robustní empirické]" přehnané bez dat.
4. Zjednodušení "pára z másla" je zavádějící; hlavní je voda z těsta.

### E. Troubleshooting + what-if (3C a 3D)
1. Symptomy správně přiřazeny, ale chybí "flat top = nedost. repos".
2. Rozdělení 3C vs what-if je smysluplné.
3. Chybí "stuck in pan = nedost. máslo v formě".

### F. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | 12 kroků příliš složité pro linku, Josefina se ztratí. |
| STŘEDNÍ | Chybí detail whisking pro ribony v 3A. |
| STŘEDNÍ | Beurre noisette bez přesné T a signálů. |

## Persona 2 — Food scientist (pastry chemistry, PhD-level znalost)

### A. Science in Blok 1B — mechanismy
1. Mechanismus bosse (šok) přesný; alternativa je lepší emulze, ignorovaná.[7]
2. "Máslo se uvolní jako pára" nesprávné; evaporace vody z těsta + CO2 dominuje nad máslem (McGee: voda 10–15% expanze).
3. Prášek (dvojčinný CO2) správně v kontextu madeleines pro lift.
4. Confidence labels špatně přiřazené; "konsenzus" pro šok OK, ale "empirické" bez citací.

### B. Ingredient roles (Blok 2A)
1. 82% máslo relevantní pro emulzi; 80% by snížilo vlhkost měřitelně.
2. T450–T550 OK, ale specifikujte 9–11% protein pro gluten.
3. Citrus kůra OK (oleje citral/linalool), spalují nad 50 °C správně.

### C. Manifest — zdrojová transparentnost
1. Zdroje dohledatelné, ale Figoni pro šok neověřeno; kniha mluví o expanzi obecně.
2. Figoni 3rd ed. (2010) legitimní pro baking science, ale spec. madeleines ne.[10]
3. FCI ISBN 9781584798033 správný pro Torres knihu.[10]
4. Adaptace 200 °C transparentní, ale nepodložená daty.

### D. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | Špatný mechanismus páry z másla zavádí o chemii. |
| STŘEDNÍ | Confidence labels bez dat podhodnocené. |
| NÍZKÁ | Protein v mouce nespecifikován. |

## Persona 3 — Josefina (cílová uživatelka)

### A. Srozumitelnost
1. Blok 1 příliš dlouhý; zahltí před pečením.
2. Section 0 užitečná, ale před pečením rušivá.
3. TL;DR nedostatečný; chybí 1-větové shrnutí ingrediencí.
4. Tooltipy užitečné, ale příliš mnoho termínů.

### B. Pracovní karta v kuchyni
1. Gramáže viditelné, ale font malý pro rychlé čtení.
2. Checkpointy nejsou všude (např. "hladká emulze?").
3. Repos vysvětlený, ale strach z 1h nejasný bez "proč min".
4. Mora flag viditelný, ale bez teploměru říká "zkuste 195–205"; OK.

### C. Co chybí, co je zbytečné
1. Chybí foto plnění formy (kolik do 12-dutin).
2. Zbytečné: dlouhé věda pro první pokus.
3. A4 OK pro linku, ale telefon nutný pro tooltips.

### D. Tréninkový protokol (Blok 7)
1. 4h + 3–5 pokusů realistické.
2. Cíle abstraktní; specifikujte "bosse 80% dutin".
3. Pomůže, ale potřebuje tick-boxy.

### E. Top 3 problémy

| Severity | Popis |
|---|---|
| KRITICKÁ | Blok 1 zahltí, neskončím u kroků. |
| STŘEDNÍ | Chybí foto plnění. |
| STŘEDNÍ | Checkpointy ne všude. |

## Persona 4 — Robinson (redaktor + prompt compliance)

### A. C1–C4 compliance (F1 review conditions)
- C1: GS prezentován jako FCI, ne CIA; CIA by nebylo rovnocenné pro tradiční styl.
- C2: Mora verified false flag výrazný v technology_box.
- C3: Žádný baker's % jako T1.
- C4: Institutional_rubric jako adaptace CAP+FCI, ne citace.

### B. F2 v2.0.3 invariants check
- H1: Ano, gramáže na začátku standard kroků.
- H2: Teploty s režimem všude.
- H3: Každý 1B odstavec má štítek.
- H4: 2A ↔ 3A konzistentní.
- H5: Ano, ManifestRow u adaptací.
- H10: 7 FM → 6+1 OK.
- H11: Všech 5 vrstev v section_0.
- H12: Hard/soft labels OK.
- H13: Max 2 targets.
- S8: 4 tasting checkpointy umístěny.
- S9: Home subs renderovány.
- S10: Falsely simple warning viditelný.

### C. Constitution v1.1 red lines
- §2.1: Všechny čísla se zdrojem.
- §2.2: Žádná Peppi DB.
- §2.3: Žádné halucinace.
- §2.4: Profi/home odděleno.
- §2.5: Nejistoty flagované.

### D. Top 3 prompt compliance chyby

| Severity | Popis |
|---|---|
| NÍZKÁ | H1: Preheat step bez gramáže OK, ale neeksplicitní. |
| NÍZKÁ | H3: Jeden štítek chybí u Maillard. |
| NÍZKÁ | S10: Warning OK, ale ne v banneru. |

## Persona 5 — Prompt engineer (meta-analytik)

### A. Kde F2 prompt funguje dobře
1. Section_0 5 vrstev přesně podle specifikace.
2. Block_7 s max 2 targets a labels dodrženo.
3. ManifestRow u každé adaptace.

### B. Kde F2 prompt nefunguje
1. Prompt žádá "krátké PROČ max 10 slov"; Writer dělá delší → hypotéza: chain-of-thought overflow.
2. "Štítky na konci odstavec"; jeden v 1B uprostřed → parsing error.
3. "Max 12 kroků"; OK, ale neoptimalizováno → nedost. optimalizační instrukce.

### C. Kde F2 prompt mlčí a Writer musel improvizovat
1. Detailní whisking techniky v 3A; prompt nic → OK, expertní add.
2. Tooltipy pro termíny; prompt "glossary" → problematická, zahlcuje.
3. Decision_layer u variant; volně spec. → OK.

### D. Systémové gaps — co v F2 v2.0.3 chybí
1. Line card lite gap; přidej do v2.0.4.
2. SVG do F4, ne F2.
3. Sister_cards OK s flagem.
4. Cover do render.
5. Section_0 specifikuj po cover před blokem 1.

### E. v2.0.3 specific features — posouzení
1. Section 0 pomáhá, ne redundant s 3B.
2. Block_7 coherentní.
3. What-if oddělené funguje.
4. Warning užitečné.

### F. 3–5 konkrétních změn pro F2 v2.0.4
1. Přidej "optimalizuj kroky <10".
2. "Štítky striktně na konci".
3. "Přidej line_card_lite sekci".
4. "SVG placeholders pro diagrams".
5. "Max délka PROČ: 8 slov".

## Persona 6 — Chain auditor (F1 → F2 předávka)

### A. Co Research Brief obsahoval a Writer to nevyužil
- Confidence_matrix: Nezmíněno v 1B.
- Key_variables science: Částečně v 1C, ale ne vše.
- Home_constraints: V 2E OK.
- Alternative_sources: Ne v variantách.
- Falsely_simple: Zobraz. OK.
- Tasting_protocol: Vše umístěno.

### B. Co karta obsahuje a v briefu to nebylo
- Varianty beurre noisette detail: Domysleno.
- Technologické pasti 3D: Rozšířeno.
- Attempts v 7B: Z briefu OK.
- Glossary: Přidané termíny.

### C. Ztracené informace (F1 → F2 translation loss)
Brief přesnější v ratios; karta zjednodušila.

### D. Duplicitní informace
"200 °C horkovzduch" duplicitní 3x; OK pro reinforcement.

### E. Top 3 chain issues

| Severity | Popis |
|---|---|
| STŘEDNÍ | Confidence_matrix nevyužito. |
| STŘEDNÍ | Alternative_sources ztracené. |
| NÍZKÁ | Varianty inflací. |

## Shrnutí

- **Overall verdict:** SHIPS WITH PATCHES
- **Top 5 kritických:** 12 kroků zahltí; špatný pára mechanismus; blok 1 příliš dlouhý; chybí plnění foto; confidence labels špatné.
- **Top 3 systémové nálezy:** Přidej kroky optimalizaci; striktní štítky pozice; line_card_lite sekci.
