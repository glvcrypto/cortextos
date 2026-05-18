#!/usr/bin/env bash
# pre-commit-content.sh — invoked by .husky/pre-commit
# Checks staged .md files for banned content patterns.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
SCRIPT="$REPO_ROOT/scripts/content-check.sh"

if [[ ! -x "$SCRIPT" ]]; then
  echo "pre-commit: content-check.sh not found or not executable at $SCRIPT" >&2
  exit 1
fi

# Patterns of paths to check (relative to repo root)
CHECKED_PATTERNS=(
  "orgs/glv/social/glvbuilds/drafts/"
  "orgs/glv/clients/"
  "orgs/glv/agents/ads/notes/"
  "orgs/glv/agents/content/notes/"
  "orgs/glv/agents/designer/notes/"
  "orgs/glv/agents/scout/notes/"
  "orgs/glv/agents/seo/notes/"
  "orgs/glv/agents/web-copy/notes/"
)

# Auto-skip patterns (heartbeat/memory logs — these are fine)
SKIP_PATTERNS=(
  "/memory/"
  "orgs/glv/agents/boss/memory/"
)

FAIL=0

while IFS= read -r staged_file; do
  [[ "$staged_file" != *.md ]] && continue

  SKIP=0
  for pat in "${SKIP_PATTERNS[@]}"; do
    if [[ "$staged_file" == *"$pat"* ]]; then
      SKIP=1
      break
    fi
  done
  [[ "$SKIP" -eq 1 ]] && continue

  MATCH=0
  for pat in "${CHECKED_PATTERNS[@]}"; do
    if [[ "$staged_file" == *"$pat"* ]]; then
      MATCH=1
      break
    fi
  done
  [[ "$MATCH" -eq 0 ]] && continue

  FULL_PATH="$REPO_ROOT/$staged_file"
  [[ ! -f "$FULL_PATH" ]] && continue

  if ! "$SCRIPT" "$FULL_PATH"; then
    FAIL=1
  fi
done < <(git diff --cached --name-only --diff-filter=ACM)

if [[ "$FAIL" -ne 0 ]]; then
  echo "" >&2
  echo "pre-commit: fix the violations above, then re-stage and commit." >&2
  echo "To skip a file: add '<!-- skip-content-check -->' as its first line." >&2
  echo "Ad-hoc check: npm run content:check <file>" >&2
  exit 1
fi

exit 0
