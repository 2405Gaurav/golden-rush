# Deploy Spring Boot Backend to Railway using CLI
# Railway supports Java applications natively

Write-Host "🚀 Deploying Backend to Railway..." -ForegroundColor Cyan

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

# Navigate to backend directory
Push-Location backend

# Check if project is initialized
if (-not (Test-Path ".railway")) {
    Write-Host "`n📦 Initializing Railway project..." -ForegroundColor Yellow
    railway init
}

# Deploy
Write-Host "`n🚀 Deploying backend..." -ForegroundColor Cyan
railway up

Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
Write-Host "`n📌 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Set environment variables:" -ForegroundColor White
Write-Host "      railway variables" -ForegroundColor Gray
Write-Host "   2. Required variables:" -ForegroundColor White
Write-Host "      - DATABASE_JDBC_URL" -ForegroundColor Gray
Write-Host "      - DATABASE_USERNAME" -ForegroundColor Gray
Write-Host "      - DATABASE_PASSWORD" -ForegroundColor Gray
Write-Host "      - JWT_SECRET_BASE64" -ForegroundColor Gray
Write-Host "      - CORS_ALLOWED_ORIGINS (include your Vercel frontend URL)" -ForegroundColor Gray
Write-Host "   3. Get your backend URL from Railway dashboard" -ForegroundColor White
Write-Host "   4. Update frontend NEXT_PUBLIC_API_BASE_URL in Vercel" -ForegroundColor White

Pop-Location


