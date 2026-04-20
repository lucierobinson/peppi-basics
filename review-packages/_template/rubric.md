# Review Rubric — Peppi Basics karta

Každá recenze musí pokrýt sekce A–K. Pro každou sekci: verdikt + nálezy + line references.

---

## A. Identita a etymologie

- Je původ / historie / etymologie uvedena správně a ozdrojovaně?
- Jsou citace konkrétní (kniha, strana, autor) nebo jen vágní "dle tradice"?
- Jsou geografické nebo kulturní tvrzení ověřitelná?

## B. Věda a principy

- Jsou vědecké principy (gelatinizace, denaturace, Maillard, chemie kypřidla) fakticky správné?
- Sedí s aktuální culinary science literaturou (McGee, López-Alt, Modernist)?
- Jsou výjimky nebo nuance zmíněny, kde jsou relevantní?

## C. Ingredience a tabulky

- Jsou gramáže konzistentní napříč hlavní tabulkou, mise en place a variantami?
- Sedí poměry s ověřenými zdroji (CIA B&P, FCI, nebo T1)?
- Jsou substituce realistické a atribuované?
- Je dual-unit (g + US) konzistentní?

## D. Pracovní postup

- Sedí celková timeline s součtem dílčích kroků?
- Jsou teplotní / časové checkpointy správně?
- Dává pořadí kroků kulinářský smysl (mise en place → příprava → sestavení)?
- Jsou kritické kroky (laminace, tempering, šlehání) dostatečně specifikované?

## E. Troubleshooting matrix

- Pokrývá klíčové failure modes pro tento typ produktu?
- Sedí diagnostika (příčina → symptom → oprava) se skutečnými kulinářskými principy?
- Jsou zahrnuty jak beginner chyby, tak pokročilé?

## F. Varianty

- Jsou varianty ozdrojované / správně atribuované (Michalak, Lebovitz, ATK, atd.)?
- Mají povinný tag: "přímý zdroj / volná adaptace / autorská extrapolace"?
- Jsou gramáže ve variantách konzistentní s biologií produktu?

## G. Pravidla a mýty

- Jsou "pravidla" skutečně culinárně závazná, ne jen preferencí autora?
- Jsou "mýty" skutečně mýty, nebo jen minority opinion / nepotvrzené tvrzení?
- Je každé tvrzení ozdrojované?

## H. Škálování a kontext prostředí

- Jsou limity škálování správně specifikovány?
- Je kontext (profesionální kuchyně, domácí pekař) jasně odlišen?
- Jsou equipment requirements realistické?

## I. Tréninkový protokol

- Je progresivita A/B testů pedagogicky smysluplná?
- Jsou milestones měřitelné (konkrétní, ne jen "zvládni techniku")?
- Sedí náročnost s cílovou skupinou karty?

## J. Prompt-engineering diagnostika

- Jsou viditelné failure modes promptu: halucinace, nekonzistence, ignorování rubric?
- Které sekce karty působí "forced" nebo AI-generated vs. culinárně autentické?
- Je výstup strukturálně konzistentní se specifikací F4 Formatteru?

## K. Overall UX a vizuál

- Vizuální hierarchie, čitelnost, density, print-friendliness
- Jsou sekce logicky odděleny (Headers, tabulky, callout boxy)?
- Vhodnost pro cílovou skupinu (aspirující pastry professional)

---

## Formát výstupu pro každou sekci

```
### Sekce X: [název]
Verdikt: OK | PARTIAL | FAIL
Nálezy:
- [konkrétní nález] — line ref: [blok/krok/řádek] — závažnost: critical | major | minor
- ...
Návrh opravy: [konkrétní text nebo instrukce]
```

---

## Finální verdikt

- **SHIPS** — karta je použitelná bez změn
- **SHIPS WITH PATCHES** — 1–5 konkrétních oprav potřeba (uveden seznam)
- **REDO** — fundamentální problém (nesprávná věda, zásadní nekonzistence), kartu přepracovat

---

## Pravidla pro reviewery

1. **Citation discipline.** Pokud tvrdíš "tohle se kuchařsky dělá jinak", uveď zdroj. Netvrdí se nic bez důkazu.
2. **No hallucination.** Pokud si nejsi jistý faktem, explicitně označ: `[unverified]` nebo `[suspected]`.
3. **Line references are required.** Každý nález musí mít identifikaci místa v `card.html`.
4. **Be concrete.** "Tabulka C-4 má 75g mouky v hlavní tabulce ale 80g v mise en place" > "gramáže nesedí".
