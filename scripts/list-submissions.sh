#!/usr/bin/env bash
# list-submissions.sh — list all review-submission Issues for a product-version
# Usage: ./scripts/list-submissions.sh <product-version>
# Example: ./scripts/list-submissions.sh croissant-v2_0_5

set -euo pipefail
PRODUCT_VERSION=${1:?Usage: $0 <product-version>}

echo "Fetching review submissions for: ${PRODUCT_VERSION}"
echo ""

gh issue list \
  --repo lucierobinson/peppi-basics \
  --label review-submission \
  --search "in:title ${PRODUCT_VERSION}" \
  --state all \
  --json number,title,labels,createdAt,state \
  --jq '.[] | "  #\(.number) [\(.state)] \(.title) (\(.createdAt | split("T")[0]))"'

echo ""
echo "Total: $(gh issue list --repo lucierobinson/peppi-basics --label review-submission --search "in:title ${PRODUCT_VERSION}" --state all --json number --jq 'length') submissions"
