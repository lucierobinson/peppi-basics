#!/usr/bin/env bash
# create-review-package.sh — create a review package for a new card version
# Usage: ./scripts/create-review-package.sh <product-slug> <version>
# Example: ./scripts/create-review-package.sh croissant v2_0_5

set -euo pipefail

PRODUCT=${1:?Usage: $0 <product-slug> <version>}
VERSION=${2:?Usage: $0 <product-slug> <version>}
SLUG="${PRODUCT}-${VERSION}"
CARD_SRC="cards/${PRODUCT}-${VERSION}.html"
PKG_DIR="review-packages/${SLUG}"
TEMPLATE_DIR="review-packages/_template"

echo "Creating review package: ${SLUG}"
echo ""

# Step 1 — verify card exists
if [[ ! -f "${CARD_SRC}" ]]; then
  echo "ERROR: Card not found at ${CARD_SRC}"
  echo "Run the F4 Formatter first and save output to cards/${PRODUCT}-${VERSION}.html"
  exit 1
fi

# Step 2 — create package dir
if [[ -d "${PKG_DIR}" ]]; then
  echo "WARNING: ${PKG_DIR} already exists. Overwriting template files only (preserving existing edits)."
fi
mkdir -p "${PKG_DIR}/_submissions"

# Step 3 — copy and populate card.html
cp "${CARD_SRC}" "${PKG_DIR}/card.html"
echo "✓ card.html → copied from ${CARD_SRC}"

# Step 4 — copy rubric.md from template
cp "${TEMPLATE_DIR}/rubric.md" "${PKG_DIR}/rubric.md"
echo "✓ rubric.md → copied from template"

# Step 5 — copy reviewer prompts, replace PRODUCT_VERSION_PLACEHOLDER
sed "s/PRODUCT_VERSION_PLACEHOLDER/${SLUG}/g" "${TEMPLATE_DIR}/reviewer-prompt.md" > "${PKG_DIR}/reviewer-prompt.md"
sed "s/PRODUCT_VERSION_PLACEHOLDER/${SLUG}/g" "${TEMPLATE_DIR}/reviewer-prompt-nemotron.md" > "${PKG_DIR}/reviewer-prompt-nemotron.md"
echo "✓ reviewer-prompt.md → placeholder replaced with ${SLUG}"
echo "✓ reviewer-prompt-nemotron.md → placeholder replaced with ${SLUG}"

# Step 6 — assemble source-prompt.md from prompts/ directory
SOURCE_PROMPT="${PKG_DIR}/source-prompt.md"
cat > "${SOURCE_PROMPT}" << SRCEOF
# Source Prompt — F0–F4 chain
# Product: ${PRODUCT} | Version: ${VERSION}
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

SRCEOF

for stage in F0 F1 F2 F3 F4; do
  # Find current prompt for each stage
  PROMPT_FILE=$(find prompts/ -name "${stage}-*current*" -o -name "${stage}-*latest*" 2>/dev/null | head -1)
  if [[ -z "${PROMPT_FILE}" ]]; then
    PROMPT_FILE=$(find prompts/ -name "${stage}*.md" 2>/dev/null | sort -r | head -1)
  fi
  if [[ -n "${PROMPT_FILE}" ]]; then
    echo "" >> "${SOURCE_PROMPT}"
    echo "---" >> "${SOURCE_PROMPT}"
    echo "## ${stage} — $(basename "${PROMPT_FILE}")" >> "${SOURCE_PROMPT}"
    echo "---" >> "${SOURCE_PROMPT}"
    echo "" >> "${SOURCE_PROMPT}"
    cat "${PROMPT_FILE}" >> "${SOURCE_PROMPT}"
    echo "✓ source-prompt.md → ${stage} from ${PROMPT_FILE}"
  else
    echo "" >> "${SOURCE_PROMPT}"
    echo "---" >> "${SOURCE_PROMPT}"
    echo "## ${stage} — [NOT FOUND]" >> "${SOURCE_PROMPT}"
    echo "---" >> "${SOURCE_PROMPT}"
    echo "[${stage} prompt not found in prompts/ directory]" >> "${SOURCE_PROMPT}"
    echo "WARNING: ${stage} prompt not found in prompts/"
  fi
done

# Step 7 — create changelog (pre-filled from git log if possible)
CHANGELOG="${PKG_DIR}/changelog-from-previous.md"
if [[ ! -f "${CHANGELOG}" ]]; then
  # Try to detect previous version from git log
  PREV_VERSION=$(git log --oneline --grep="${PRODUCT}" --grep="review" -- review-packages/ 2>/dev/null | head -1 | grep -oP 'v\d+_\d+_\d+' | head -1 || echo "v<N-1>")
  cat > "${CHANGELOG}" << CLEOF
# Changelog from previous version

**Previous version:** ${PREV_VERSION}
**Current version:** ${VERSION}
**Date:** $(date +"%Y-%m-%d")
**Product:** ${PRODUCT}

## Changes in this version

- [TODO: document changes from triage of ${PREV_VERSION} review panel]

## Rationale

[TODO: why these changes were made]

## Known limitations (carry-over)

- [TODO: list known gaps that will be addressed in next version]
CLEOF
  echo "✓ changelog-from-previous.md → created (fill in TODO sections)"
else
  echo "  changelog-from-previous.md → already exists, skipping"
fi

# Step 8 — .gitkeep for _submissions
touch "${PKG_DIR}/_submissions/.gitkeep"

# Step 9 — commit
git add "${PKG_DIR}/" "${CARD_SRC}"
git commit -m "feat(review): create review package for ${SLUG}

Card: ${CARD_SRC}
Package: ${PKG_DIR}/
Reviewers: 7-panel (Gemini DR, Gemini direct, Sonnet, GPT, Nemotron, Sonar DR, Grok)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git push

echo ""
echo "=========================================="
echo "✅ Review package ready: ${PKG_DIR}/"
echo ""
echo "NEXT STEP — Open Comet and run:"
echo "  /peppi-panel ${SLUG}"
echo "=========================================="
