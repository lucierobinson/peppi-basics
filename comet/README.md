# Comet Skills pro Peppi Basics review panel

> **Poznámka (2026-04-20):** Perplexity přejmenoval "Shortcuts" na "Skills" (Dovednosti).
> V Comet UI: Settings → Skills (nebo `/account/skills` na perplexity.ai).
> Tato složka obsahuje skills ve dvou formátech — viz níže.

---

## Dva formáty

### Formát A — SKILL.md (doporučený, nový)

Každý soubor `skill-*.md` v této složce je platný `SKILL.md` soubor s YAML frontmatter.
Nahraj přímo do Comet: **Settings → Skills → Create skill → Upload a skill**.
Drag & drop `.md` soubor.

**Jak napsat skill name jako trigger:** Pokud jsi pojmenoval skill `peppi-panel`,
napíšeš v Comet search: `peppi-panel` nebo popíšeš úkol přirozeně.
Varianta `/peppi-panel` funguje jako přímý trigger v Comet search baru.

**Vstupní proměnná:** Skills nemají explicitní `{input}` placeholder — produkt-verzi
napíšeš ZA jméno skillu:
```
peppi-panel croissant-v2_0_5
```
→ Comet AI skill dostane jako kontext: celý prompt + `croissant-v2_0_5` na konci.
Prompty jsou proto psány tak, aby ENDING tvoří "The product-version slug:".

### Formát B — Manuální copy-paste (fallback)

Každý soubor obsahuje i sekci "Prompt template" — čistý text k přímému vložení
do Comet search baru, bez SKILL.md workflow.

---

## Instalace SKILL.md (5 minut jednorázově)

1. Otevři Comet browser → **Settings → Skills → Create skill → Upload a skill**
2. Pro každý soubor `skill-0*.md` a `skill-MASTER*.md` v této složce:
   - Drag & drop soubor do upload area
   - Ověř, že se zobrazí `name` a `description` ze YAML frontmatter
   - Potvrď
3. Ověř, že skills jsou v sekci "My Skills"

---

## Seznam skills

| Soubor | Skill name | Účel |
|--------|-----------|------|
| `skill-01-gemini-perplexity.md` | `peppi-review-gemini-perp` | Gemini 3.1 Pro Thinking + DR v Perplexity |
| `skill-02-gemini-direct.md` | `peppi-review-gemini-direct` | Gemini 3.1 Pro napřímo v gemini.google.com |
| `skill-03-sonnet-perplexity.md` | `peppi-review-sonnet-perp` | Claude Sonnet 4.6 v Perplexity |
| `skill-04-gpt-perplexity.md` | `peppi-review-gpt-perp` | GPT-5.4 v Perplexity |
| `skill-05-nemotron-perplexity.md` | `peppi-review-nemotron-perp` | Nemotron 3 Super (single-response variant) |
| `skill-06-sonar-dr-perplexity.md` | `peppi-review-sonar-dr-perp` | Sonar Deep Research v Perplexity |
| `skill-07-grok-direct.md` | `peppi-review-grok-direct` | Grok napřímo v grok.com |
| `skill-MASTER-peppi-panel.md` | `peppi-panel` | **Master orchestrátor** — všech 7 + Collector |

---

## Denní použití (po instalaci)

```
peppi-panel croissant-v2_0_5
```

nebo přirozeně: `"spusť peppi panel pro croissant-v2_0_5"`

Robinson jde dělat něco jiného. Za 20–40 minut notifikace "Panel complete".

---

## Testing

Po instalaci spusť:
```
peppi-panel example-v0_1_0
```
Ověř: 7 GitHub Issues s labelem `review-submission` v `lucierobinson/peppi-basics`.

---

## Přihlášení (předpoklady)

- [ ] perplexity.ai / Comet (Pro plan)
- [ ] gemini.google.com (Google account)
- [ ] grok.com (X account)
