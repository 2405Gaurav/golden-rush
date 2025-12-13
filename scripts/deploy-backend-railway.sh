#!/bin/bash
# Deploy Spring Boot Backend to Railway using CLI
# Railway supports Java applications natively

echo "🚀 Deploying Backend to Railway..."

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

# Navigate to backend directory
cd backend || exit

# Check if project is initialized
if [ ! -d ".railway" ]; then
    echo ""
    echo "📦 Initializing Railway project..."
    railway init
fi

# Deploy
echo ""
echo "🚀 Deploying backend..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📌 Next steps:"
echo "   1. Set environment variables:"
echo "      railway variables"
echo "   2. Required variables:"
echo "      - DATABASE_JDBC_URL"
echo "      - DATABASE_USERNAME"
echo "      - DATABASE_PASSWORD"
echo "      - JWT_SECRET_BASE64"
echo "      - CORS_ALLOWED_ORIGINS (include your Vercel frontend URL)"
echo "   3. Get your backend URL from Railway dashboard"
echo "   4. Update frontend NEXT_PUBLIC_API_BASE_URL in Vercel"


