# Comet Dovednosti (Skills) pro Peppi Basics review panel

> **Aktualizováno 2026-04-20 — oprava problému s Computer agentem**

---

## Co je správná funkce pro tyhle skripty?

**Perplexity Skills (Dovednosti)** — to je správná funkce. Stránka `/account/shortcuts`
zobrazuje: _„Zkratky jsou nyní dovednosti"_ a přesměruje na `/account/skills`.
Shortcuts byly přejmenovány na Skills, jde o tutéž funkci.

Skills instaluj na: **`perplexity.ai/account/skills`**

---

## Proč `peppi-panel example-v0_1_0` vrátilo „Insufficient credits"?

Perplexity AI automaticky rozhoduje, zda skill spustit jako:
- **Normální Perplexity thread** → zdarma (Pro plán)
- **Computer agent** → platí se kredity

Rozhodnutí závisí na obsahu skill promptu. Tři ze 8 původních skillů obsahovaly
frázování popisující browser automation:

| Skill | Problematická fráze | Výsledek |
|-------|---------------------|---------|
| `peppi-panel` | _"Open all 7 tabs... Poll all 7 tabs every 60 seconds..."_ | → Computer (placené) |
| `peppi-review-gemini-direct` | _"You are a Comet Assistant performing browser automation..."_ | → Computer (placené) |
| `peppi-review-grok-direct` | _"Open a new browser tab and navigate to grok.com..."_ | → Computer (placené) |

Ostatních 5 skillů (01 Gemini Perp, 03 Sonnet, 04 GPT, 05 Nemotron, 06 Sonar DR)
popis browser automation **neobsahují** → spouštějí se jako normální Perplexity thread → **zdarma**.

---

## Rychlý start (po přeinstalaci)

### 5 Perplexity threadů (zdarma):
```
peppi-review-gemini-perp croissant-v2_0_5
peppi-review-sonnet-perp croissant-v2_0_5
peppi-review-gpt-perp croissant-v2_0_5
peppi-review-nemotron-perp croissant-v2_0_5
peppi-review-sonar-dr-perp croissant-v2_0_5
```

### Master koordinátor (zdarma — nová verze):
```
peppi-panel croissant-v2_0_5
```
→ Validuje package + vytiskne 7 příkazů. Robinson je spustí ručně.

### 2 manuální recenzenti:
```
peppi-review-gemini-direct croissant-v2_0_5   ← vygeneruje prompt k vložení do gemini.google.com
peppi-review-grok-direct croissant-v2_0_5     ← vygeneruje prompt k vložení do grok.com
```

---

## Dva sety souborů v této složce

### `shortcuts-v2/` — **OPRAVENÉ verze (použij tyto)**

8 souborů s opravenými prompty. 3 klíčové změny:
- `skill-MASTER-peppi-panel.md` — odstraněna tab automation, přidán launch guide
- `skill-02-gemini-direct.md` — odstraněn "browser automation" jazyk, generuje copy-paste prompt
- `skill-07-grok-direct.md` — stejné jako výše pro grok.com

### `skill-*.md` (kořen složky) — **DEPRECATED verze**

Původní soubory. Tři z nich (MASTER, 02, 07) obsahují browser automation jazyk
a spustí Computer agent (placené). Označeny deprecated hlavičkou.
Ponechány pro referenci.

---

## Instalace opravených skillů (jednorázově, ~10 minut)

### Krok 1 — Odinstaluj 3 problematické staré skilly

1. Otevři `perplexity.ai/account/skills`
2. Najdi `peppi-panel` → Akce dovednosti → Smazat
3. Najdi `peppi-review-gemini-direct` → Akce dovednosti → Smazat
4. Najdi `peppi-review-grok-direct` → Akce dovednosti → Smazat
5. Ostatní 5 peppi skillů **NEmaž** — fungují správně

### Krok 2 — Nainstaluj opravené verze z `shortcuts-v2/`

Pro každý z těchto 3 souborů:
- `shortcuts-v2/skill-MASTER-peppi-panel.md`
- `shortcuts-v2/skill-02-gemini-direct.md`
- `shortcuts-v2/skill-07-grok-direct.md`

Postup:
1. `perplexity.ai/account/skills` → **Vytvořit dovednost**
2. Drag & drop `.md` souboru nebo vložení obsahu
3. Ověř správné `name` a `description` z YAML frontmatter
4. Uložit

### Krok 3 — Otestuj

```
peppi-panel example-v0_1_0
```

Očekávaný výsledek: Perplexity thread (NE Computer agent), validace → 7 příkazů.

---

## Troubleshooting

### Stále "Insufficient credits"?

1. Používáš soubor z `shortcuts-v2/` (ne kořenový `skill-*.md`)?
2. Zobrazuje se v `/account/skills` správný description (bez "tab automation" frází)?
3. Zkus skill smazat a přidat znovu.

### Jak zjistit, jestli skill spustil Computer nebo normální thread?

Comet zobrazí `Computer` label v aktivní session. Normální thread žádný label nemá.

---

## Kompletní seznam dovedností

| Soubor v `shortcuts-v2/` | Skill name | Typ | Stav |
|--------------------------|------------|-----|------|
| `skill-01-gemini-perplexity.md` | `peppi-review-gemini-perp` | Perplexity thread | ✅ funguje |
| `skill-02-gemini-direct.md` | `peppi-review-gemini-direct` | Generuje manuální prompt | ✅ opraveno |
| `skill-03-sonnet-perplexity.md` | `peppi-review-sonnet-perp` | Perplexity thread | ✅ funguje |
| `skill-04-gpt-perplexity.md` | `peppi-review-gpt-perp` | Perplexity thread | ✅ funguje |
| `skill-05-nemotron-perplexity.md` | `peppi-review-nemotron-perp` | Perplexity thread | ✅ funguje |
| `skill-06-sonar-dr-perplexity.md` | `peppi-review-sonar-dr-perp` | Perplexity thread | ✅ funguje |
| `skill-07-grok-direct.md` | `peppi-review-grok-direct` | Generuje manuální prompt | ✅ opraveno |
| `skill-MASTER-peppi-panel.md` | `peppi-panel` | Koordinátor + launch guide | ✅ opraveno |

---

## Přihlášení (předpoklady)

- [x] perplexity.ai / Comet (Pro plán)
- [ ] gemini.google.com (Google account) — pro reviewer #2
- [ ] grok.com (X account) — pro reviewer #7
