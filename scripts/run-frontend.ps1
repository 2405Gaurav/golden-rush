$ErrorActionPreference = "Stop"

if (-not $env:NEXT_PUBLIC_API_BASE_URL) {
  $env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080"
}

Push-Location (Join-Path $PSScriptRoot "..")
try {
  npm install
  npm run dev
} finally {
  Pop-Location
}





