---
name: peppi-panel
description: Orchestrate the full 7-reviewer Peppi Basics review panel for a culinary study card. Opens 7 review tabs (Gemini DR, Gemini direct, Sonnet, GPT, Nemotron, Sonar DR, Grok), collects submissions, creates GitHub Issues. Use when asked to run the Peppi review panel, evaluate a card with all reviewers, or start a multi-AI culinary review. Trigger with "peppi-panel <product>-v<version>" or "run peppi panel for [slug]".
---

# Peppi Panel — Master Orchestrator

Execute this multi-step agentic task autonomously. The product-version slug is at the end of this prompt.

---

## STEP 1 — VALIDATION

Verify the review package exists. Fetch these URLs (replace SLUG with the slug provided):

- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/card.html`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/rubric.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/reviewer-prompt-nemotron.md`
- `https://raw.githubusercontent.com/lucierobinson/peppi-basics/main/review-packages/SLUG/changelog-from-previous.md`

If any returns 404: **STOP**. Report: "MISSING FILES: [list]. Run: `./scripts/create-review-package.sh <product> <version>`"

If all exist: "✓ Package SLUG validated. Starting panel."

---

## STEP 2 — OPEN 7 REVIEW TABS

Open all 7 tabs. Each tab gets the reviewer-specific prompt with SLUG substituted.

**Tab 1 — Gemini 3.1 Pro Thinking + Deep Research (Perplexity)**
- New Comet/Perplexity tab, model: Gemini 3.1 Pro Thinking, mode: Deep Research
- Invoke skill: `peppi-review-gemini-perp SLUG`

**Tab 2 — Gemini 3.1 Pro (Direct)**
- New browser tab → `https://gemini.google.com`
- Verify logged in
- Paste content of `reviewer-prompt.md` with SLUG substituted
- Prepend: "Identify yourself as: Gemini 3.1 Pro (Direct — gemini.google.com)"

**Tab 3 — Claude Sonnet 4.6 (Perplexity)**
- New Comet/Perplexity tab, model: Claude Sonnet 4.6
- Invoke skill: `peppi-review-sonnet-perp SLUG`

**Tab 4 — GPT-5.4 (Perplexity)**
- New Comet/Perplexity tab, model: GPT-5.4
- Invoke skill: `peppi-review-gpt-perp SLUG`

**Tab 5 — Nemotron 3 Super (Perplexity)**
- New Comet/Perplexity tab, model: Nemotron 3 Super
- Invoke skill: `peppi-review-nemotron-perp SLUG`

**Tab 6 — Sonar Deep Research (Perplexity)**
- New Comet/Perplexity tab, model: Sonar Deep Research (or Sonar Pro + Deep Research mode)
- Invoke skill: `peppi-review-sonar-dr-perp SLUG`

**Tab 7 — Grok (Direct)**
- New browser tab → `https://grok.com`
- Verify logged in
- Paste content of `reviewer-prompt.md` with SLUG substituted
- Prepend: "Identify yourself as: Grok (direct — grok.com). You may use real-time web search."

---

## STEP 3 — WAIT FOR COMPLETION

Poll all 7 tabs every 60 seconds. Done = output contains `---REVIEW-SUBMISSION-END---`.

- Timeout per tab: 12 minutes
- If timeout: flag "Tab [N] timeout — [reviewer]. Continuing."
- Minimum viable panel: 5/7. If <5: alert user, ask whether to proceed.

---

## STEP 4 — COLLECT AND CREATE GITHUB ISSUES

For each completed tab:

1. Extract text between `---REVIEW-SUBMISSION-START---` and `---REVIEW-SUBMISSION-END---`

2. Parse metadata:
   - `Reviewer:` line
   - `Verdict:` line (SHIPS | SHIPS WITH PATCHES | REDO)

3. Create GitHub Issue in `lucierobinson/peppi-basics`:

```bash
gh issue create \
  --repo lucierobinson/peppi-basics \
  --title "[Review] SLUG — [Reviewer name]" \
  --body "[full submission text]" \
  --label "review-submission"
```

Or use GitHub API if gh CLI not available.

4. Close/archive the tab after Issue creation.

---

## STEP 5 — SUMMARY

Output:

```
=== PEPPI PANEL COMPLETE: SLUG ===
Reviewers: [N]/7 completed
Verdicts:
  SHIPS: [count]
  SHIPS WITH PATCHES: [count]
  REDO: [count]

GitHub Issues:
  #[N] — [Reviewer] — [Verdict]
  ...

Failures/timeouts: [list or "none"]

NEXT STEP: Say "hotovi" in Claude.ai for triage.
===========================================
```

Send desktop notification: "Peppi Panel complete — SLUG — [N]/7 done."

---

## Sequential fallback

If parallel tab opening is not supported, execute tabs 1→7 sequentially. Each tab fully completes (gets END marker) before the next opens. Total time: ~35–45 min. Robinson's effort: 0 seconds.

---

## The product-version slug to review:
