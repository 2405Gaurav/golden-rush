# Script to randomly select 27 commits and add ChatGPT as co-author
$repoPath = "C:\Users\yashd\Downloads\neobrutalist-ui-design (1)"
Set-Location $repoPath

# Get all 37 commit hashes
$allCommits = git log --format="%H" -37 | Where-Object { $_ -ne "" }

# Randomly select 27 commits
$random = New-Object System.Random
$selectedCommits = $allCommits | Sort-Object { $random.Next() } | Select-Object -First 27

# Write selected commits to file (one per line)
$selectedCommits | Out-File -FilePath "$repoPath\selected_commits_coauthor.txt" -Encoding utf8

Write-Host "Selected 27 commits randomly:"
$selectedCommits | ForEach-Object { Write-Host $_ }

# Create updated git-msg-filter.sh
$filterScript = @"
#!/bin/bash
COMMIT_HASH=`$(git rev-parse HEAD)
if grep -Fxq "`$COMMIT_HASH" "$repoPath/selected_commits_coauthor.txt"; then
    # Read the original message
    cat
    # Add co-author if not already present
    echo ""
    echo "Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
else
    # Just pass through the original message
    cat
fi
"@

$filterScript | Out-File -FilePath "$repoPath\scripts\git-msg-filter.sh" -Encoding utf8 -NoNewline

Write-Host "`nFilter script updated. Run git filter-branch to rewrite commits."

