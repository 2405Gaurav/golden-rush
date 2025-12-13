# Deploy Both Frontend and Backend to Railway using CLI

Write-Host "🚀 Deploying Full Stack to Railway..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

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

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 1: Deploying Backend..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Push-Location backend

if (-not (Test-Path ".railway")) {
    Write-Host "📦 Initializing Railway project for backend..." -ForegroundColor Yellow
    railway init
}

Write-Host "🚀 Deploying backend..." -ForegroundColor Cyan
railway up

Pop-Location

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 2: Deploying Frontend..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (-not (Test-Path ".railway")) {
    Write-Host "📦 Initializing Railway project for frontend..." -ForegroundColor Yellow
    railway init
}

Write-Host "🚀 Deploying frontend..." -ForegroundColor Cyan
railway up

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`n📌 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Get your backend URL from Railway dashboard" -ForegroundColor White
Write-Host "   2. Set frontend environment variable:" -ForegroundColor White
Write-Host "      railway variables" -ForegroundColor Gray
Write-Host "      Add: NEXT_PUBLIC_API_BASE_URL = <your-backend-url>" -ForegroundColor Gray
Write-Host "   3. Get your frontend URL from Railway dashboard" -ForegroundColor White
Write-Host "   4. Update backend CORS to include frontend URL:" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      railway variables" -ForegroundColor Gray
Write-Host "      Update: CORS_ALLOWED_ORIGINS = <frontend-url>,http://localhost:3000" -ForegroundColor Gray
Write-Host "   5. Redeploy both services:" -ForegroundColor White
Write-Host "      cd backend && railway up" -ForegroundColor Gray
Write-Host "      cd .. && railway up" -ForegroundColor Gray

