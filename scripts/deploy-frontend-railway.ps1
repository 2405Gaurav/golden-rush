# Deploy Next.js Frontend to Railway using CLI

Write-Host "🚀 Deploying Frontend to Railway..." -ForegroundColor Cyan

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Check if user is logged in
Write-Host "📋 Checking Railway authentication..." -ForegroundColor Yellow
$railwayWhoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Railway. Please login:" -ForegroundColor Yellow
    railway login
}

# Check if project is initialized
if (-not (Test-Path ".railway")) {
    Write-Host "`n📦 Initializing Railway project..." -ForegroundColor Yellow
    railway init
}

# Check for environment variables
Write-Host "`n📝 Checking environment variables..." -ForegroundColor Yellow
$envVars = railway variables 2>&1
if ($LASTEXITCODE -ne 0 -or -not ($envVars -match "NEXT_PUBLIC_API_BASE_URL")) {
    Write-Host "⚠️  NEXT_PUBLIC_API_BASE_URL is not set!" -ForegroundColor Yellow
    Write-Host "   This should point to your backend API URL" -ForegroundColor Yellow
    $apiUrl = Read-Host "Enter your backend API URL (or press Enter to skip)"
    if ($apiUrl) {
        railway variables set NEXT_PUBLIC_API_BASE_URL=$apiUrl
    }
}

# Deploy
Write-Host "`n🚀 Deploying frontend..." -ForegroundColor Cyan
railway up

Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
Write-Host "`n📌 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Set environment variables if needed:" -ForegroundColor White
Write-Host "      railway variables" -ForegroundColor Gray
Write-Host "   2. Required variable:" -ForegroundColor White
Write-Host "      - NEXT_PUBLIC_API_BASE_URL (your backend API URL)" -ForegroundColor Gray
Write-Host "   3. Get your frontend URL from Railway dashboard" -ForegroundColor White
Write-Host "   4. Update backend CORS settings to allow your Railway frontend domain" -ForegroundColor White


