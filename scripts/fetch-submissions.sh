#!/usr/bin/env bash
# fetch-submissions.sh — fetch review submissions for triage
# Saves each Issue body to review-packages/<slug>/_submissions/
# Usage: ./scripts/fetch-submissions.sh <product-version>
# Example: ./scripts/fetch-submissions.sh croissant-v2_0_5

set -euo pipefail
PRODUCT_VERSION=${1:?Usage: $0 <product-version>}
OUT_DIR="review-packages/${PRODUCT_VERSION}/_submissions"

if [[ ! -d "review-packages/${PRODUCT_VERSION}" ]]; then
  echo "ERROR: review-packages/${PRODUCT_VERSION}/ not found."
  echo "Has this package been created? Run: ./scripts/create-review-package.sh <product> <version>"
  exit 1
fi

mkdir -p "${OUT_DIR}"
echo "Fetching review submissions for: ${PRODUCT_VERSION}"
echo "Saving to: ${OUT_DIR}/"
echo ""

COUNT=0
gh issue list \
  --repo lucierobinson/peppi-basics \
  --label review-submission \
  --search "in:title ${PRODUCT_VERSION}" \
  --state all \
  --json number,title,body \
  --jq '.[]' | while IFS= read -r issue; do

  number=$(echo "${issue}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['number'])")
  title=$(echo "${issue}"  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['title'])")
  body=$(echo "${issue}"   | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['body'])")

  # Extract reviewer name from title: [Review] <slug> — <Reviewer Name>
  reviewer=$(echo "${title}" | sed -E 's/.*—[[:space:]]*//' | tr ' ()' '---' | tr '[:upper:]' '[:lower:]' | sed 's/-*$//')
  filename="${OUT_DIR}/issue-${number}-${reviewer}.md"

  printf '%s\n' "${body}" > "${filename}"
  echo "  Saved: ${filename}"
  COUNT=$((COUNT + 1))
done

echo ""
echo "All submissions fetched to: ${OUT_DIR}/"
echo ""
echo "NEXT STEP: In Claude.ai, say: 'hotovi — triage ${PRODUCT_VERSION}'"
