# Review by Sonar Deep Research

**Model preference (API):** `pplx_alpha`
**Display model (response):** `pplx_pro`
**Duration:** 28859 ms
**Answer length:** 5323 chars (extracted)
**Timestamp:** 2026-04-24T12:04:51.765Z
**Flag:** none

---

---REVIEW-SUBMISSION-START---
Reviewer: Sonar Deep Research (Perplexity)
Date: 2026-04-24T12:04:00Z
Product: example
Version: v0_1_0
Verdict: REDO

### Sekce A: Identita a etymologie
**Verdikt:** PARTIAL  
**Nálezy:**  
- Etymologie "example" z latinského *exemplum* je správná, ale chybí kulinářský kontext nebo zdroj (např. OED nebo culinary dictionary) — line ref: `<p>Etymologie: slovo "example" ... Test, 2026.</p>` v sekci <!-- Section A --> — závažnost: major  
- Karta je označena jako testovací bez reálného obsahu, což nesplňuje požadavek na ověřitelnou historii produktu — line ref: `<div class="warning"> ... Neobsahuje reálný obsah.` — závažnost: critical  
**Návrh opravy:** Nahradit testovacím obsahem skutečnou identitu produktu (např. pro **croissant** uveď francouzský původ, zdroj: "The Professional Pastry Chef" by Bo Friberg, str. 456); přidej specifický zdroj pro etymologii.

### Sekce B: Věda a principy
**Verdikt:** FAIL  
**Nálezy:**  
- Maillardova reakce správně uvedena při **140–165 °C** (standardní rozsah podle McGee "On Food and Cooking", ch. 4) — line ref: `<p>Fiktivní vědecký princip: Maillardova reakce ...` — závažnost: N/A (OK)  
- Chybný fakt: Voda vře při **90 °C** na úrovni moře (skutečně **100 °C** při standardním atmosférickém tlaku 101.3 kPa, zdroj: základní fyzikální tabulky nebo McGee, ch. 9) — line ref: `<p>Záměrná chyba: Voda vře při 90 °C ...` v sekci <!-- Section B --> — závažnost: critical  
**Návrh opravy:** Oprav na "**100 °C** na úrovni moře (101.3 kPa)"; přidej zdroj [web: standard physics reference, e.g., NIST data].

### Sekce C: Ingredience a tabulky
**Verdikt:** FAIL  
**Nálezy:**  
- Nekonzistence v gramážích: **Máslo** **250g** v hlavní tabulce vs. **300g** v mise en place — line ref: hlavní tabulka `<tr><td>Máslo</td><td>250</td></tr>` a mise en place `<tr><td>Máslo</td><td>300</td><!-- záměrná nekonzistence -->` — závažnost: critical  
- Ostatní ingredience konzistentní (**Mouka 500g**, **Cukr 100g**, **Vejce 150g**), ale bez ověřených poměrů pro reálný recept — line ref: tabulky v sekci <!-- Section C --> — závažnost: major  
- Chybí dual-unit (g + US, např. cups) — line ref: celé tabulky — závažnost: minor  
**Návrh opravy:** Sjednotit na **250g** v obou tabulkách; přidej US ekvivalent (např. "250g (1 cup + 2 tbsp)"); ověř poměry proti zdroji jako CIA Baking & Pastry.

### Sekce D: Pracovní postup
**Verdikt:** OK  
**Nálezy:**  
- Timeline konzistentní: **5 + 10 + 3 + 25 = 43 min** — line ref: `<p>Total timeline: 5 + 10 + 3 + 25 = 43 min. ...` — závažnost: N/A  
- Pořadí kroků logické (smíchat suché → tuk → vejce → pečení), ale ne specifikováno pro pastry (např. creaming method) — line ref: `<ol><li>Krok 1: ...` v sekci <!-- Section D --> — závažnost: minor (ale OK pro test)  
**Návrh opravy:** Žádná nutná; pro reálnou kartu specifikuj techniku (např. "cream butter and sugar at speed 2").

### Sekce E: Troubleshooting matrix
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně (žádná troubleshooting matrix) — line ref: neexistuje v card.html — závažnost: critical  
**Návrh opravy:** Přidej tabulku s klíčovými failure modes (např. "plochý produkt: nedostatek lepku → méně vejce → přidej 1 ks").

### Sekce F: Varianty
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: neexistuje v card.html — závažnost: critical  
**Návrh opravy:** Přidej 2–3 varianty s tagy (např. "David Lebovitz adaptace: +vanilka").

### Sekce G: Pravidla a mýty
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: neexistuje v card.html — závažnost: critical  
**Návrh opravy:** Přidej sekci s 3 pravidly/mýty, ozdrojenými (např. "Mýtus: máslo musí být studené — pro cookies ano, pro cake ne [McGee]").

### Sekce H: Škálování a kontext prostředí
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: neexistuje v card.html — závažnost: major  
**Návrh opravy:** Přidej tabulku škálování (x0.5 pro domácí, x2 pro pro) a equipment (stand mixer).

### Sekce I: Tréninkový protokol
**Verdikt:** FAIL  
**Nálezy:**  
- Sekce chybí úplně — line ref: neexistuje v card.html — závažnost: major  
**Návrh opravy:** Přidej A/B testy (Úroveň 1: basic mix; milestone: "rovnoměrná emulze").

### Sekce J: Prompt-engineering diagnostika
**Verdikt:** PARTIAL  
**Nálezy:**  
- Viditelné AI failure modes: fiktivní obsah, záměrné chyby (vření vody, máslo), nekompletní sekce — line ref: warning div + komentáře `<!-- Reviewer notes: ... -->` — závažnost: critical  
- Struktura konzistentní s F4 (HTML, sekce 1-4), ale neúplná (chybí E-K) — line ref: celý dokument — závažnost: major  
**Návrh opravy:** Spustit F0-F4 chain s plnou rubric; opravit halucinace.

### Sekce K: Overall UX a vizuál
**Verdikt:** PARTIAL  
**Nálezy:**  
- Dobrá hierarchie (**h1/h2**, tabulky, warning box), čitelný font, print-friendly — line ref: `<style>` + struktura — závažnost: N/A  
- Neúplná (chybí sekce E-K), příliš testovací warning — line ref: `<div class="warning">` — závažnost: major  
**Návrh opravy:** Odstranit test warning po naplnění; přidej více callouts pro kroky.

## Finální verdikt
**REDO** — Záměrné chyby (vření vody [critical], nekonzistence másla [critical]), chybějící sekce E-K (fundamentální nekompletnost), testovací obsah. Karta potřebuje úplné přepracování do reálného produktu.

---REVIEW-SUBMISSION-END---
