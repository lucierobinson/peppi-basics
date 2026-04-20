---
name: peppi-review-grok-direct
description: Generate the ready-to-paste reviewer prompt for Grok at grok.com, with manual step-by-step instructions. Use when running the Grok reviewer in the Peppi panel. Trigger with "peppi-review-grok-direct <product>-v<version>".
---

# Peppi Basics Review — Grok (Direct, grok.com)

## Instructions

The product-version slug is at the end of this prompt. Replace SLUG in all outputs below.

Read the reviewer prompt from:
`https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md`

Then output the following — substituting SLUG with the actual slug:

---

## Manual steps for this review

1. Open a new tab and navigate to **grok.com**
2. Verify you are logged in (chat input box visible). If not, log in first.
3. Copy the prompt block below and paste it into the Grok chat input
4. Submit — wait up to 12 minutes for `---REVIEW-SUBMISSION-END---`
5. Copy everything between `---REVIEW-SUBMISSION-START---` and `---REVIEW-SUBMISSION-END---`
6. Create a GitHub Issue in `lucierobinson/peppi-basics`:
   - Title: `[Review] SLUG — Grok (Direct)`
   - Body: the copied submission text
   - Label: `review-submission`

---

## Prompt to paste into Grok

```
You are an expert culinary and prompt-engineering reviewer. You have access to real-time web data and X/Twitter.

Product-version being reviewed: SLUG

Fetch and carefully read:
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/card.html
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/rubric.md
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/changelog-from-previous.md

Follow all instructions in reviewer-prompt.md exactly.
You may use web search and real-time data to verify culinary claims.
Identify yourself as: "Grok (direct — grok.com)"

Wrap your entire output between these exact markers:
---REVIEW-SUBMISSION-START---
Reviewer: Grok (direct — grok.com)
Date: [ISO 8601]
Product: [product slug]
Version: [version]
Verdict: [SHIPS | SHIPS WITH PATCHES | REDO]

[Full review, sections A-K]

---REVIEW-SUBMISSION-END---
```

---

## The product-version slug:
