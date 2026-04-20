---
name: peppi-panel
description: Validate a Peppi Basics review package and output the complete panel launch guide — 7 ready-to-run review commands with model assignments. Use when asked to start a Peppi review session or when preparing to evaluate a card with all reviewers. Trigger with "peppi-panel <product>-v<version>" or "run peppi panel for [slug]".
---

# Peppi Panel — Package Validator & Launch Guide

The product-version slug is at the end of this prompt. Replace SLUG with the actual slug throughout.

---

## STEP 1 — VALIDATE REVIEW PACKAGE

Fetch these 5 URLs and confirm each returns content (not 404):

- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/card.html`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/rubric.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt-nemotron.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/changelog-from-previous.md`

**If any returns 404:** Stop and report:
```
MISSING FILES for SLUG:
[list each missing file]

Fix: run ./scripts/create-review-package.sh <product> <version>
```

**If all 5 exist:** Continue to Step 2.

---

## STEP 2 — OUTPUT PANEL LAUNCH GUIDE

Print this block exactly, with SLUG substituted:

```
✓ Package SLUG validated — all 5 files present.

═══════════════════════════════════════════════
PEPPI PANEL — SLUG
7-reviewer session ready to launch
═══════════════════════════════════════════════

PERPLEXITY THREADS (5) — open each in a new Comet thread:

  1. peppi-review-gemini-perp SLUG
     → Gemini 3.1 Pro Thinking + Deep Research

  2. peppi-review-sonnet-perp SLUG
     → Claude Sonnet 4.6

  3. peppi-review-gpt-perp SLUG
     → GPT-5.4

  4. peppi-review-nemotron-perp SLUG
     → Nemotron 3 Super (single-response, ~5000 words)

  5. peppi-review-sonar-dr-perp SLUG
     → Sonar Deep Research (fact-checks culinary claims)

MANUAL TABS (2) — paste prompt from skill output:

  6. peppi-review-gemini-direct SLUG
     → open in Comet → copy prompt → paste into gemini.google.com

  7. peppi-review-grok-direct SLUG
     → open in Comet → copy prompt → paste into grok.com

═══════════════════════════════════════════════
AFTER ALL 7 COMPLETE:
  → Open Claude.ai and type: "hotovi — SLUG"
  → Claude will triage GitHub Issues and produce patch prompt
═══════════════════════════════════════════════
```

---

## STEP 3 — CARD SUMMARY (optional)

After printing the launch guide, briefly summarize what the card covers (product name, key topics, version) so Robinson knows what reviewers will be evaluating.

---

## The product-version slug to review:
