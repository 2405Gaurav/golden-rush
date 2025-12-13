# Set Database Environment Variables for Railway Backend
# Run this after adding PostgreSQL database in Railway

Write-Host "🔧 Setting Database Environment Variables" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

cd backend

# Get DATABASE_URL from Railway (Railway auto-sets this when PostgreSQL is added)
Write-Host "`n📋 Getting DATABASE_URL from Railway..." -ForegroundColor Yellow
$dbUrl = railway variables --service sweetshop-backend --json | ConvertFrom-Json | Where-Object { $_.name -eq "DATABASE_URL" } | Select-Object -ExpandProperty value

if (-not $dbUrl) {
    Write-Host "❌ DATABASE_URL not found!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "  1. Go to Railway Dashboard → sweetshop-backend project" -ForegroundColor White
    Write-Host "  2. Click '+ New' → 'Database' → 'PostgreSQL'" -ForegroundColor White
    Write-Host "  3. Railway will auto-set DATABASE_URL" -ForegroundColor White
    Write-Host "  4. Run this script again`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Found DATABASE_URL" -ForegroundColor Green

# Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
# Example: postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
    $dbUser = $matches[1]
    $dbPassword = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
    
    # Construct JDBC URL
    $jdbcUrl = "jdbc:postgresql://${dbHost}:${dbPort}/${dbName}?sslmode=require&channelBinding=require"
    
    Write-Host "`n📝 Setting database variables..." -ForegroundColor Yellow
    
    # Set variables
    railway variables --service sweetshop-backend --set "DATABASE_JDBC_URL=$jdbcUrl"
    railway variables --service sweetshop-backend --set "DATABASE_USERNAME=$dbUser"
    railway variables --service sweetshop-backend --set "DATABASE_PASSWORD=$dbPassword"
    
    Write-Host "`n✅ Database variables set!" -ForegroundColor Green
    Write-Host "  DATABASE_JDBC_URL: $jdbcUrl" -ForegroundColor Gray
    Write-Host "  DATABASE_USERNAME: $dbUser" -ForegroundColor Gray
    Write-Host "  DATABASE_PASSWORD: ***" -ForegroundColor Gray
    
    Write-Host "`n🚀 Backend will auto-redeploy with new variables!" -ForegroundColor Cyan
    Write-Host "Check Railway dashboard for deployment status`n" -ForegroundColor Gray
} else {
    Write-Host "❌ Could not parse DATABASE_URL format" -ForegroundColor Red
    Write-Host "DATABASE_URL: $dbUrl" -ForegroundColor Yellow
    Write-Host "`nPlease set variables manually in Railway dashboard`n" -ForegroundColor Yellow
}

cd ..

