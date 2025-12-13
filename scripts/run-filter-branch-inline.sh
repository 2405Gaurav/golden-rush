#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OLDEST_COMMIT=$(git log --format="%H" -37 | tail -1)
cd "$REPO_ROOT"

# Reset counter before running
echo "0" > "$REPO_ROOT/.filter_counter"

# Inline filter function to avoid BOM issues
git filter-branch -f --msg-filter "
SCRIPT_DIR=\"$SCRIPT_DIR\"
REPO_ROOT=\"$REPO_ROOT\"
POSITIONS_FILE=\"\$REPO_ROOT/selected_positions.txt\"
COUNTER_FILE=\"\$REPO_ROOT/.filter_counter\"
if [ ! -f \"\$COUNTER_FILE\" ]; then
    echo \"0\" > \"\$COUNTER_FILE\"
fi
CURRENT_POS=\$(cat \"\$COUNTER_FILE\")
NEXT_POS=\$((CURRENT_POS + 1))
echo \"\$NEXT_POS\" > \"\$COUNTER_FILE\"
if grep -Fxq \"\$CURRENT_POS\" \"\$POSITIONS_FILE\"; then
    cat
    echo \"\"
    echo \"Co-authored-by: ChatGPT <AI@users.noreply.github.com>\"
else
    cat
fi
" -- $OLDEST_COMMIT..HEAD

# Clean up counter file
rm -f "$REPO_ROOT/.filter_counter"

