# Script to apply co-author to selected commits using git filter-branch
$repoPath = "C:\Users\yashd\Downloads\neobrutalist-ui-design (1)"
Set-Location $repoPath

Write-Host "Applying co-author to selected commits using git filter-branch..."

# Find the oldest commit (37 commits back)
$oldestCommit = git log --format="%H" -37 | Select-Object -Last 1

# Use git filter-branch with bash
# Convert Windows path to Git Bash format (escape parentheses)
$bashPath = $repoPath -replace '\\', '/' -replace '^C:', '/c' -replace ' ', '\ ' -replace '\(', '\(' -replace '\)', '\)'
$bashScript = @"
#!/bin/bash
cd "$bashPath"
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --msg-filter 'bash scripts/git-msg-filter.sh' -- $oldestCommit..HEAD
"@

# Write bash script temporarily
$bashScript | Out-File -FilePath "$repoPath\temp-filter.sh" -Encoding utf8 -NoNewline

# Try to find Git Bash
$gitBashPaths = @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files (x86)\Git\bin\bash.exe",
    "$env:ProgramFiles\Git\bin\bash.exe",
    "$env:ProgramFiles(x86)\Git\bin\bash.exe"
)

$bashExe = $null
foreach ($path in $gitBashPaths) {
    if (Test-Path $path) {
        $bashExe = $path
        break
    }
}

if ($bashExe) {
    Write-Host "Found Git Bash at: $bashExe"
    Write-Host "Running git filter-branch..."
    & $bashExe "$repoPath\temp-filter.sh"
    
    # Clean up
    Remove-Item "$repoPath\temp-filter.sh" -ErrorAction SilentlyContinue
    
    Write-Host "Done! Co-authors have been added to the selected commits."
} else {
    Write-Host "Git Bash not found. Please run manually:"
    Write-Host "bash temp-filter.sh"
}

