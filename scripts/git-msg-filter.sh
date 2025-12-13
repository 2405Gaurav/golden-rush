#!/bin/bash
COMMIT_HASH=$(git rev-parse HEAD)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SELECTED_FILE="$REPO_ROOT/selected_commits_coauthor.txt"
if grep -Fxq "$COMMIT_HASH" "$SELECTED_FILE"; then
    # Read the original message
    cat
    # Add co-author if not already present
    echo ""
    echo "Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
else
    # Just pass through the original message
    cat
fi