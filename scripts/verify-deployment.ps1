# Verify Deployment Status

Write-Host "🔍 Verifying Deployment Status" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check Backend
Write-Host "`n📋 Backend Status:" -ForegroundColor Yellow
cd backend
railway status
railway domain --service sweetshop-backend
railway variables --service sweetshop-backend | Select-String -Pattern "DATABASE|JWT|CORS" | Select-Object -First 5

# Check Frontend
Write-Host "`n📋 Frontend Status:" -ForegroundColor Yellow
cd ..
railway status
railway domain --service sweetshop-frontend
railway variables --service sweetshop-frontend | Select-String -Pattern "NEXT_PUBLIC"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`n✅ Verification Complete!" -ForegroundColor Green


