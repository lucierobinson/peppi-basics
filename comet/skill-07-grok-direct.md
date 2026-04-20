---
name: peppi-review-grok-direct
description: Run a Peppi Basics culinary card review using Grok directly at grok.com (with real-time X/Twitter data access). Use when running the Grok reviewer in the Peppi panel. Trigger with "peppi-review-grok-direct <product>-v<version>".
---

# Peppi Basics Review — Grok (Direct, grok.com)

## Instructions

You are a Comet Assistant performing browser automation. Execute this task:

1. Open a new browser tab and navigate to: `https://grok.com`
2. Verify the user is logged in. If not: STOP and report "Not logged in to grok.com".
3. In the Grok chat input, paste this prompt (replace SLUG with the product-version slug from the end of this skill invocation):

```
You are an expert culinary and prompt-engineering reviewer. You have access to real-time web data and X/Twitter.

Product-version being reviewed: SLUG

Fetch and review:
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/card.html
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/rubric.md
- https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md

Follow all instructions in reviewer-prompt.md exactly.
You may use web search and real-time data to verify culinary claims.
Identify yourself as: "Grok (direct — grok.com)"

Wrap output between:
---REVIEW-SUBMISSION-START---
[review]
---REVIEW-SUBMISSION-END---
```

4. Submit. Wait up to 12 minutes for `---REVIEW-SUBMISSION-END---`.
5. Extract text between the markers.
6. Report: "Grok review complete for SLUG. Verdict: [verdict]."

## The product-version slug:
