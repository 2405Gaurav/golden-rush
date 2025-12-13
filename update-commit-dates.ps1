# Script to update commit dates
$commits = @(
    "1f5cd2f", "f4cf48c", "0a86a8e", "250939c", "44062ac",
    "dd3ce58", "5cee887", "628d8f2", "0cbf0e8", "ad4284b",
    "b451628", "f680d15", "9aef107", "785a087", "1a78a17",
    "7de261b", "9cbdcd9", "e3f99e3", "766148f", "ea1a253"
)

$baseDate = [DateTime]::Parse("2025-12-12 10:00:00")
$i = 0

foreach ($hash in $commits) {
    $date = $baseDate.AddMinutes($i * 15)
    $dateStr = $date.ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "Updating $hash to $dateStr"
    
    # Use git filter-branch or rebase to change date
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    $i++
}
