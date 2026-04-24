# Review by Gemini 3.1 Pro Thinking (Perplexity)

**Model preference (API):** `gemini31pro_high`
**Display model (response):** `pplx_pro`
**Duration:** 26137 ms
**Answer length:** 5622 chars (extracted)
**Timestamp:** 2026-04-24T12:02:31.649Z
**Flag:** none

---

---REVIEW-SUBMISSION-START---
Reviewer: Gemini 3.1 Pro Thinking (Perplexity)
Date: 2026-04-24T12:02:00Z
Product: example-card
Version: v0_1_0
Verdict: REDO

### A. Identita a etymologie
**Verdikt:** PARTIAL  
**Nálezy:**  
- Etymologie "example" z latinského *exemplum* je fakticky správná, ale chybí konkrétní zdroj (např. Oxford Etymological Dictionary); pouze obecné tvrzení bez citace — line ref: `<p>Etymologie: slovo "example" pochází z latinského <em>exemplum</em> (vzor, příklad). Test, 2026.</p>` — závažnost: minor  
- Obsah je označen jako testovací, ne reálný kulinářský produkt, což nesplňuje očekávání autentické identity — line ref: `<p>Toto je testovací karta pro ověření Peppi Basics review pipeline. Neobsahuje reálné kulinářské informace.</p>` — závažnost: major  
**Návrh opravy:** Přidej specifickou citaci pro etymologii (např. "OED, s.v. example") a nahraď testovací obsah reálným kulinářským subjektem (např. **croissant** s historií od 19. století v Paříži ).

### B. Věda a principy
**Verdikt:** FAIL  
**Nálezy:**  
- Správný fakt o **Maillardově reakci** při 140–165 °C je konzistentní s literaturou (McGee, On Food and Cooking, s. 778–780) — line ref: `<p>Fiktivní vědecký princip: Maillardova reakce nastává při 140–165 °C. (Toto je správný fakt — reviewer by měl označit OK.)</p>` — závažnost: none (OK)  
- Záměrná chyba: Voda vře při 90 °C na úrovni moře (správně je 100 °C při standardním atmosférickém tlaku 101.3 kPa; zdroj: CRC Handbook of Chemistry and Physics) — line ref: `<p>Záměrná chyba: Voda vře při 90 °C na úrovni moře. (Toto je špatně — reviewer by měl označit FAIL a flagovat jako critical.)</p>` — závažnost: critical  
**Návrh opravy:** Oprav na "Voda vře při 100 °C na úrovni moře při 101.3 kPa" s citací (např. McGee, s. 7); přidej nuance o nadmořské výšce.

### C. Ingredience a tabulky
**Verdikt:** FAIL  
**Nálezy:**  
- Nekonzistence v gramážích: Hlavní tabulka uvádí **Máslo** 250 g, mise en place 300 g — line ref: hlavní tabulka `<tr><td>Máslo</td><td>250</td><td>Pokojová teplota</td></tr>` vs. mise en place `<tr><td>Máslo</td><td>300</td><!-- záměrná nekonzistence: 250 vs 300 --></tr>` — závažnost: critical  
- Ostatní ingredience (mouka 500 g, cukr 100 g, vejce 150 g) konzistentní mezi tabulkami — line ref: odpovídající řádky v obou tabulkách — závažnost: none (OK)  
- Chybí dual-unit (g + US, např. oz/cups) a ověřené poměry proti standardním receptům (např. CIA Baking and Pastry) — line ref: celé tabulky v sekci 3 — závažnost: major  
**Návrh opravy:** Sjednotit máslo na 250 g v obou tabulkách; přidej sloupec US units (např. "250 g (8.8 oz)") a citaci poměrů (např. "poměr mouka:máslo 2:1 dle CIA B&P, s. 45").

### D. Pracovní postup
**Verdikt:** OK  
**Nálezy:**  
- Celková timeline 5 + 10 + 3 + 25 = 43 min je konzistentní s uvedeným součtem — line ref: `<p>Total timeline: 5 + 10 + 3 + 25 = 43 min. (Konzistentní — reviewer by měl označit OK.)</p>` — závažnost: none  
- Pořadí kroků (mouka+cukr → máslo → vejce → pečení) dává smysl pro základní těsto, teplota 180 °C standardní — line ref: `<ol><li>Krok 1: ...` až `<li>Krok 4: ...</li></ol>` — závažnost: none  
**Návrh opravy:** Žádná; případně specifikuj typ pečeni (horní/dolní ohřev).

### E. Troubleshooting matrix
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně, neobsahuje žádnou troubleshooting matrix — line ref: absence po sekci D — závažnost: critical  
**Návrh opravy:** Přidej tabulku s klíčovými failure modes (např. "těsto nepíše: nedostatek lepku — přidej mouku; zdroj: López-Alt, Serious Eats").

### F. Varianty
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: absence po sekci D — závažnost: major  
**Návrh opravy:** Přidej 2–3 varianty s tagy (např. "vegan: máslo → kokosový olej [Lebovitz adaptace]").

### G. Pravidla a mýty
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: absence — závažnost: major  
**Návrh opravy:** Přidej sekci s pravidly (např. "Pravidlo: peč přesně podle času [CIA]") a mýty (např. "Mýtus: vejce musí být pokojové [unverified]").

### H. Škálování a kontext prostředí
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: absence — závažnost: major  
**Návrh opravy:** Přidej specifikaci (např. "Domácí: max 2x recept; pro: konvektomat 160 °C").

### I. Tréninkový protokol
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: absence — závažnost: major  
**Návrh opravy:** Přidej A/B testy (např. "Milestone 1: těsto se nelepí — úspěch při 80%").

### J. Prompt-engineering diagnostika
**Verdikt:** PARTIAL  
**Nálezy:**  
- Viditelné failure modes: halucinace vědeckých faktů (bod varu vody), nekonzistence v tabulkách — line ref: sekce B a C — závažnost: critical  
- Struktura OK (headers id="s1"–"s4"), ale neúplná (chybí E–K) — line ref: HTML struktura — závažnost: major  
- Obsah působí AI-generated kvůli testovacím poznámkám — line ref: `<!-- Reviewer notes: ... -->` — závažnost: minor  
**Návrh opravy:** Zajisti kompletní F4 strukturu; odstraň testovací komentáře.

### K. Overall UX a vizuál
**Verdikt:** PARTIAL  
**Nálezy:**  
- Dobrá čitelnost (CSS: sans-serif, tabulky, warning box), print-friendly — line ref: `<style>` a body — závažnost: none  
- Neúplná hierarchie (chybí sekce E–K), warning box ruší UX — line ref: `<div class="warning">` — závažnost: minor  
**Návrh opravy:** Odstraň warning pro produkční verzi; přidej všechny sekce A–K.

## Finální verdikt
**REDO** — Zásadní nekonzistence (C), chybná věda (B), absence klíčových sekcí (E–I); karta je testovací, ne produkční. Nutná kompletní přepracování na reálný obsah.

---REVIEW-SUBMISSION-END---
