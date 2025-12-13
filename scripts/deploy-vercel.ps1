# Deploy Next.js Frontend to Vercel using CLI
# This script deploys the frontend application to Vercel

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in to Vercel
Write-Host "📋 Checking Vercel authentication..." -ForegroundColor Yellow
$vercelWhoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to Vercel. Please login:" -ForegroundColor Yellow
    Write-Host "   Run: vercel login" -ForegroundColor Yellow
    vercel login
}

# Check for environment variables
Write-Host "`n📝 Checking environment variables..." -ForegroundColor Yellow
if (-not $env:NEXT_PUBLIC_API_BASE_URL) {
    Write-Host "⚠️  NEXT_PUBLIC_API_BASE_URL is not set!" -ForegroundColor Yellow
    Write-Host "   This should point to your backend API URL (e.g., https://your-backend.railway.app)" -ForegroundColor Yellow
    $apiUrl = Read-Host "Enter your backend API URL"
    if ($apiUrl) {
        $env:NEXT_PUBLIC_API_BASE_URL = $apiUrl
    }
}

# Deploy to production
Write-Host "`n🚀 Deploying to Vercel (production)..." -ForegroundColor Cyan
Write-Host "   This will deploy your Next.js frontend to Vercel" -ForegroundColor Gray
Write-Host ""

$deployChoice = Read-Host "Deploy to production? (Y/n)"
if ($deployChoice -eq "" -or $deployChoice -eq "Y" -or $deployChoice -eq "y") {
    vercel --prod
} else {
    Write-Host "Deploying to preview environment..." -ForegroundColor Yellow
    vercel
}

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`n📌 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Set environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host "      - NEXT_PUBLIC_API_BASE_URL (your backend API URL)" -ForegroundColor Gray
Write-Host "   2. Update your backend CORS settings to allow your Vercel domain" -ForegroundColor White
Write-Host "   3. Redeploy if you need to update environment variables" -ForegroundColor White
