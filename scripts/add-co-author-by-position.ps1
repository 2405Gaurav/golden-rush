# Script to add co-author based on commit position
$repoPath = "C:\Users\yashd\Downloads\neobrutalist-ui-design (1)"
Set-Location $repoPath

# Get all 37 commit hashes (current ones after filter-branch)
$allCommits = git log --format="%H" -37 | Where-Object { $_ -ne "" }

# Randomly select 27 commit positions (0-indexed from oldest to newest)
$random = New-Object System.Random
$positions = 0..36 | Sort-Object { $random.Next() } | Select-Object -First 27 | Sort-Object

# Write selected positions to file
$positions | Out-File -FilePath "$repoPath\selected_positions.txt" -Encoding utf8

Write-Host "Selected positions (0=oldest, 36=newest):"
$positions | ForEach-Object { $pos = $_; Write-Host "Position $pos`: $($allCommits[$pos])" }

# Create a new filter script that tracks position
$filterScript = @'
#!/bin/bash
# Track commit position during filter-branch
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
POSITIONS_FILE="$REPO_ROOT/selected_positions.txt"

# Get current commit position (count from oldest)
# We need to track this globally, so we'll use a counter file
COUNTER_FILE="$REPO_ROOT/.filter_counter"
if [ ! -f "$COUNTER_FILE" ]; then
    echo "0" > "$COUNTER_FILE"
fi
CURRENT_POS=$(cat "$COUNTER_FILE")
NEXT_POS=$((CURRENT_POS + 1))
echo "$NEXT_POS" > "$COUNTER_FILE"

# Check if current position is in selected positions
if grep -Fxq "$CURRENT_POS" "$POSITIONS_FILE"; then
    # Read the original message
    cat
    # Add co-author
    echo ""
    echo "Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
else
    # Just pass through the original message
    cat
fi
'@

$filterScript | Out-File -FilePath "$repoPath\scripts\git-msg-filter-position.sh" -Encoding utf8

Write-Host "`nPosition-based filter script created. Ready to run filter-branch."

