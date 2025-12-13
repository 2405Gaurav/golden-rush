$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logDir = Join-Path $root "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

Write-Host "Starting backend (reads env vars)..."
Start-Process powershell -WorkingDirectory $root -ArgumentList @(
  "-NoProfile","-ExecutionPolicy","Bypass",
  "-Command", "& '$root\\scripts\\run-backend.ps1' *>> '$logDir\\backend.log'"
) | Out-Null

Write-Host "Starting frontend (Next.js)..."
Start-Process powershell -WorkingDirectory $root -ArgumentList @(
  "-NoProfile","-ExecutionPolicy","Bypass",
  "-Command", "& '$root\\scripts\\run-frontend.ps1' *>> '$logDir\\frontend.log'"
) | Out-Null

Write-Host "Logs:"
Write-Host " - $logDir\\backend.log"
Write-Host " - $logDir\\frontend.log"
Write-Host "Open:"
Write-Host " - http://localhost:3000"






