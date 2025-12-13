# Quick Deploy Script - Railway CLI
# This script will guide you through deployment

Write-Host "🚀 Railway Deployment Guide" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check Railway CLI
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Check login status
Write-Host "`n📋 Checking Railway authentication..." -ForegroundColor Yellow
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Railway!" -ForegroundColor Yellow
    Write-Host "`nPlease run: railway login" -ForegroundColor White
    Write-Host "This will open your browser for authentication.`n" -ForegroundColor Gray
    Write-Host "After logging in, run this script again or:" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy-all-railway.ps1`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Logged in as: $loginCheck" -ForegroundColor Green

# Proceed with deployment
Write-Host "`n🚀 Starting deployment..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Deploy backend
Write-Host "`nStep 1: Deploying Backend..." -ForegroundColor Green
Push-Location backend

if (-not (Test-Path ".railway")) {
    Write-Host "📦 Initializing Railway project for backend..." -ForegroundColor Yellow
    railway init
}

Write-Host "🚀 Deploying backend..." -ForegroundColor Cyan
railway up

Pop-Location

# Deploy frontend
Write-Host "`nStep 2: Deploying Frontend..." -ForegroundColor Green

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
Write-Host "   1. Get backend URL: cd backend && railway domain" -ForegroundColor White
Write-Host "   2. Set frontend env var: railway variables set NEXT_PUBLIC_API_BASE_URL=<backend-url>" -ForegroundColor White
Write-Host "   3. Get frontend URL: railway domain" -ForegroundColor White
Write-Host "   4. Update backend CORS: cd backend && railway variables set CORS_ALLOWED_ORIGINS=<frontend-url>" -ForegroundColor White
Write-Host "   5. Redeploy: railway up (in both directories)`n" -ForegroundColor White

