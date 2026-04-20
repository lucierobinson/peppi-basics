> **DEPRECATED — TRIGGERS COMPUTER AGENT (PAID)**
> Prompt říká "You are a Comet Assistant performing browser automation. Open a new browser tab..." —
> Perplexity tento jazyk vyhodnotí jako Computer task a požaduje kredity.
> **Použij místo toho: `shortcuts-v2/skill-02-gemini-direct.md`**
> Opravená verze generuje copy-paste prompt pro gemini.google.com bez browser automation.

---
name: peppi-review-gemini-direct
description: Run a Peppi Basics culinary card review using Gemini 3.1 Pro directly at gemini.google.com (different flavor than Perplexity-routed Gemini). Use when running the Gemini Direct reviewer in the Peppi panel. Trigger with "peppi-review-gemini-direct <product>-v<version>".
---

# Peppi Basics Review — Gemini 3.1 Pro (Direct, gemini.google.com)

## Instructions

You are a Comet Assistant performing browser automation. Execute this task:

1. Open a new browser tab and navigate to: `https://gemini.google.com`
2. Verify the user is logged in (chat input box visible). If not: STOP and report "Not logged in to gemini.google.com".
3. In the Gemini chat input, paste this prompt (replace SLUG with the product-version slug from the end of this skill invocation):

```
You are an expert culinary and prompt-engineering reviewer.

Product-version being reviewed: SLUG

Fetch and review:
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/card.html
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/rubric.md
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md

Follow all instructions in reviewer-prompt.md exactly.
Identify yourself as: "Gemini 3.1 Pro (Direct — gemini.google.com)"

Wrap output between:
---REVIEW-SUBMISSION-START---
[review]
---REVIEW-SUBMISSION-END---
```

4. Submit. Wait up to 12 minutes for `---REVIEW-SUBMISSION-END---`.
5. Extract text between the markers.
6. Report: "Gemini Direct review complete for SLUG. Verdict: [verdict]."

## The product-version slug:
