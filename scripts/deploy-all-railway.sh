#!/bin/bash
# Deploy Both Frontend and Backend to Railway using CLI

echo "🚀 Deploying Full Stack to Railway..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
echo "📋 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  Not logged in to Railway. Please login:"
    railway login
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Deploying Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend || exit

if [ ! -d ".railway" ]; then
    echo "📦 Initializing Railway project for backend..."
    railway init
fi

echo "🚀 Deploying backend..."
railway up

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Deploying Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d ".railway" ]; then
    echo "📦 Initializing Railway project for frontend..."
    railway init
fi

echo "🚀 Deploying frontend..."
railway up

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📌 Next Steps:"
echo "   1. Get your backend URL from Railway dashboard"
echo "   2. Set frontend environment variable:"
echo "      railway variables"
echo "      Add: NEXT_PUBLIC_API_BASE_URL = <your-backend-url>"
echo "   3. Get your frontend URL from Railway dashboard"
echo "   4. Update backend CORS to include frontend URL:"
echo "      cd backend"
echo "      railway variables"
echo "      Update: CORS_ALLOWED_ORIGINS = <frontend-url>,http://localhost:3000"
echo "   5. Redeploy both services:"
echo "      cd backend && railway up"
echo "      cd .. && railway up"


