# Deployment Guide - Vercel CLI

This guide will help you deploy your Sweet Shop application to Vercel using the CLI.

## ⚠️ Important Note

**Vercel only supports the Next.js frontend.** Your Java Spring Boot backend needs to be deployed separately on a platform that supports Java applications, such as:
- **Railway** (recommended - easy setup)
- **Render**
- **AWS Elastic Beanstalk**
- **Google Cloud Run**
- **Heroku**
- **Azure App Service**

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Already installed (version 47.0.7)
3. **Backend Deployed**: Your backend API must be deployed and accessible via HTTPS

## Quick Start

### Option 1: Using PowerShell Script (Windows)

```powershell
.\scripts\deploy-vercel.ps1
```

### Option 2: Using Bash Script (Linux/Mac)

```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

### Option 3: Manual CLI Deployment

1. **Login to Vercel** (if not already logged in):
   ```bash
   vercel login
   ```

2. **Set environment variables** (replace with your backend URL):
   ```bash
   # Windows PowerShell
   $env:NEXT_PUBLIC_API_BASE_URL="https://your-backend.railway.app"
   
   # Linux/Mac
   export NEXT_PUBLIC_API_BASE_URL="https://your-backend.railway.app"
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

   Or deploy to preview:
   ```bash
   vercel
   ```

## Step-by-Step Deployment

### Step 1: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 2: Configure Environment Variables

You need to set the backend API URL. You can do this in two ways:

#### Option A: Set via CLI (for this deployment)

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_API_BASE_URL="https://your-backend-url.com"

# Linux/Mac
export NEXT_PUBLIC_API_BASE_URL="https://your-backend-url.com"
```

#### Option B: Set in Vercel Dashboard (recommended)

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.railway.app`)
   - **Environment**: Production, Preview, Development (select all)

### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy to preview (for testing)
vercel
```

### Step 4: Update Backend CORS Settings

After deployment, Vercel will provide you with a URL like:
- `https://your-app.vercel.app`

You need to update your backend's CORS configuration to allow this domain:

**In your backend environment variables:**
```bash
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

Then redeploy your backend.

## Backend Deployment Options

Since Vercel doesn't support Java applications, here are recommended alternatives:

### Railway (Easiest)

1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `backend` directory
5. Add environment variables from `backend/ENV.example`
6. Railway will automatically detect Java and deploy

### Render

1. Sign up at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `./mvnw clean package`
   - **Start Command**: `java -jar target/*.jar`
5. Add environment variables

## Environment Variables Checklist

### Frontend (Vercel)
- ✅ `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL

### Backend (Railway/Render/etc.)
- ✅ `DATABASE_JDBC_URL` - PostgreSQL connection string
- ✅ `DATABASE_USERNAME` - Database username
- ✅ `DATABASE_PASSWORD` - Database password
- ✅ `JWT_SECRET_BASE64` - Base64 encoded JWT secret (32+ bytes)
- ✅ `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins (include your Vercel URL)
- ✅ `BOOTSTRAP_ADMIN_ENABLED` - Set to `true`
- ✅ `BOOTSTRAP_ADMIN_EMAIL` - Admin email
- ✅ `BOOTSTRAP_ADMIN_PASSWORD` - Admin password

## Post-Deployment

1. **Test the deployment**: Visit your Vercel URL
2. **Check backend connection**: Try logging in
3. **Verify CORS**: Ensure API calls work from the frontend
4. **Monitor logs**: Use `vercel logs` to check for errors

## Useful Vercel CLI Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# View project info
vercel inspect

# Remove a deployment
vercel remove

# Link to existing project
vercel link

# View environment variables
vercel env ls
```

## Troubleshooting

### Issue: Environment variables not working
**Solution**: Set them in Vercel Dashboard → Settings → Environment Variables, then redeploy.

### Issue: CORS errors
**Solution**: Update `CORS_ALLOWED_ORIGINS` in your backend to include your Vercel domain.

### Issue: Backend connection fails
**Solution**: 
1. Verify backend is deployed and accessible
2. Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
3. Ensure backend URL uses HTTPS (required for production)

### Issue: Build fails
**Solution**: 
1. Check build logs: `vercel logs`
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

## Continuous Deployment

Vercel automatically deploys when you push to your connected Git repository:
- **Production**: Deploys from `main`/`master` branch
- **Preview**: Deploys from other branches and pull requests

To enable:
1. Go to Vercel Dashboard
2. Import your Git repository
3. Configure build settings (usually auto-detected)
4. Deploy!

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
