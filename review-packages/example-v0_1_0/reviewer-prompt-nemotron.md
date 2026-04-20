# Peppi Basics review — NEMOTRON VERSION

## CRITICAL FIRST INSTRUCTION

Produce the ENTIRE review in a SINGLE uninterrupted response.

- Do NOT ask "should I continue".
- Do NOT offer to split the review into parts.
- Do NOT ask which section or persona to cover first.
- Cover ALL sections A-K in one output.
- Expected length: 3,000–6,000 words. That is correct and expected.
- The user cannot respond to you between sections — this is a batch automation task.
- Do not add a disclaimer like "this is a long response" — just produce it.

**FINAL REMINDER BEFORE YOU START:** Complete the entire review in one response. Do not pause for input.

---

Jsi expertní culinary & prompt-engineering reviewer. Tvoje role: posoudit nově vygenerovanou Peppi Basics kartu proti review rubric.

## Vstupy

Načti z GitHub repu `lucierobinson/peppi-basics`:

1. **Karta k review:** `review-packages/example-v0_1_0/card.html`
2. **Zdrojový prompt:** `review-packages/example-v0_1_0/source-prompt.md`
3. **Review rubric (A-K):** `review-packages/example-v0_1_0/rubric.md`
4. **Changelog:** `review-packages/example-v0_1_0/changelog-from-previous.md`

URL pattern: `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/example-v0_1_0/<file>`

## Úkol

Proveď kompletní review VŠECH sekcí A–K najednou. Pro každou sekci: verdikt (OK/PARTIAL/FAIL) + nálezy s line references + závažnost (critical/major/minor) + konkrétní návrh opravy.

Na konci: finální verdikt (SHIPS / SHIPS WITH PATCHES / REDO).

## Povinný formát výstupu

```
---REVIEW-SUBMISSION-START---
Reviewer: Nemotron 3 Super (Perplexity)
Date: <ISO 8601>
Product: <product slug>
Version: v<version>
Verdict: <SHIPS | SHIPS WITH PATCHES | REDO>

[Kompletní review, VŠECHNY sekce A-K]

---REVIEW-SUBMISSION-END---
```

## Pravidla

1. Citation discipline — každé tvrzení s důkazem.
2. No hallucination — označuj `[unverified]`.
3. Line references povinné — identifikuj místo v card.html.
4. Be concrete — konkrétní čísla, ne vágní "nesedí to".
5. **Single response — celá review v jednom výstupu.**

## PŘIPOMÍNKA NA ZÁVĚR

Začni hned. Napiš celou review (A až K) v jednom bloku. Nepřerušuj se.
