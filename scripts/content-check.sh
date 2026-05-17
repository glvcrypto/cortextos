#!/usr/bin/env bash
# content-check.sh — checks a markdown file for banned content patterns
# Usage: ./scripts/content-check.sh <file>
# Exit 0 = pass. Exit 1 = violation found (error printed to stderr).

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 <file.md>" >&2
  exit 1
fi

FILE="$1"

if [[ ! -f "$FILE" ]]; then
  echo "content-check: file not found: $FILE" >&2
  exit 1
fi

# Opt-out: first line contains <!-- skip-content-check -->
FIRST_LINE=$(head -1 "$FILE")
if [[ "$FIRST_LINE" == *"skip-content-check"* ]]; then
  exit 0
fi

FAIL=0

# Check 1: em-dashes
EM_DASH_COUNT=$(grep -c "—" "$FILE" 2>/dev/null || true)
if [[ "$EM_DASH_COUNT" -gt 0 ]]; then
  echo "content-check FAIL: em-dashes detected in $FILE (count: $EM_DASH_COUNT). Banned per [[feedback-no-emdashes]]. Replace with comma, period, or dash." >&2
  FAIL=1
fi

# Check 2: AI-tell phrases
AI_TELL_COUNT=$(grep -ci "\bfurthermore\b\|\bin addition\b\|\bmoreover\b\|\bleverage\b\|\butilize\b\|\bdeliver value\b" "$FILE" 2>/dev/null || true)
if [[ "$AI_TELL_COUNT" -gt 0 ]]; then
  echo "content-check FAIL: AI-tell phrases detected in $FILE (count: $AI_TELL_COUNT). Banned per [[feedback-glv-social-content-rules]]. Rewrite in plain voice." >&2
  FAIL=1
fi

exit "$FAIL"
