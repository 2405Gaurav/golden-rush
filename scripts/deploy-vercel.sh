#!/bin/bash
# Deploy Next.js Frontend to Vercel using CLI
# This script deploys the frontend application to Vercel

echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "📋 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel. Please login:"
    vercel login
fi

# Check for environment variables
echo ""
echo "📝 Checking environment variables..."
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_API_BASE_URL is not set!"
    echo "   This should point to your backend API URL (e.g., https://your-backend.railway.app)"
    read -p "Enter your backend API URL: " api_url
    if [ -n "$api_url" ]; then
        export NEXT_PUBLIC_API_BASE_URL="$api_url"
    fi
fi

# Deploy to production
echo ""
echo "🚀 Deploying to Vercel (production)..."
echo "   This will deploy your Next.js frontend to Vercel"
echo ""

read -p "Deploy to production? (Y/n): " deploy_choice
if [ -z "$deploy_choice" ] || [ "$deploy_choice" = "Y" ] || [ "$deploy_choice" = "y" ]; then
    vercel --prod
else
    echo "Deploying to preview environment..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Set environment variables in Vercel dashboard:"
echo "      - NEXT_PUBLIC_API_BASE_URL (your backend API URL)"
echo "   2. Update your backend CORS settings to allow your Vercel domain"
echo "   3. Redeploy if you need to update environment variables"
