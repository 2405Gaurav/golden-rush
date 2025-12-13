#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OLDEST_COMMIT=$(git log --format="%H" -37 | tail -1)
cd "$REPO_ROOT"

# Update co-author from ChatGPT to GitHub Copilot
git filter-branch -f --msg-filter "
cat | sed 's|Co-authored-by: ChatGPT <AI@users.noreply.github.com>|Co-authored-by: GitHub Copilot <copilot@users.noreply.github.com>|g'
" -- $OLDEST_COMMIT..HEAD
