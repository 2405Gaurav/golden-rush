#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
POSITIONS_FILE="$REPO_ROOT/selected_positions.txt"
COUNTER_FILE="$REPO_ROOT/.filter_counter"
if [ ! -f "$COUNTER_FILE" ]; then
    echo "0" > "$COUNTER_FILE"
fi
CURRENT_POS=$(cat "$COUNTER_FILE")
NEXT_POS=$((CURRENT_POS + 1))
echo "$NEXT_POS" > "$COUNTER_FILE"
if grep -Fxq "$CURRENT_POS" "$POSITIONS_FILE"; then
    cat
    echo ""
    echo "Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
else
    cat
fi