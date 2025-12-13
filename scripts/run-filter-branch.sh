#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OLDEST_COMMIT=$(git log --format="%H" -37 | tail -1)
cd "$REPO_ROOT"
# Reset counter before running
echo "0" > "$REPO_ROOT/.filter_counter"
git filter-branch -f --msg-filter "bash '$SCRIPT_DIR/git-msg-filter-position.sh'" -- $OLDEST_COMMIT..HEAD
# Clean up counter file
rm -f "$REPO_ROOT/.filter_counter"

