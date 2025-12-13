#!/bin/bash
# Deploy Next.js Frontend to Railway using CLI

echo "🚀 Deploying Frontend to Railway..."

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

# Check if project is initialized
if [ ! -d ".railway" ]; then
    echo ""
    echo "📦 Initializing Railway project..."
    railway init
fi

# Check for environment variables
echo ""
echo "📝 Checking environment variables..."
if ! railway variables 2>/dev/null | grep -q "NEXT_PUBLIC_API_BASE_URL"; then
    echo "⚠️  NEXT_PUBLIC_API_BASE_URL is not set!"
    echo "   This should point to your backend API URL"
    read -p "Enter your backend API URL (or press Enter to skip): " api_url
    if [ -n "$api_url" ]; then
        railway variables set NEXT_PUBLIC_API_BASE_URL="$api_url"
    fi
fi

# Deploy
echo ""
echo "🚀 Deploying frontend..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📌 Next steps:"
echo "   1. Set environment variables if needed:"
echo "      railway variables"
echo "   2. Required variable:"
echo "      - NEXT_PUBLIC_API_BASE_URL (your backend API URL)"
echo "   3. Get your frontend URL from Railway dashboard"
echo "   4. Update backend CORS settings to allow your Railway frontend domain"

