# Deployment Guide - Railway CLI

This guide will help you deploy your Sweet Shop application (both frontend and backend) to Railway using the CLI.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install via `npm install -g @railway/cli`
3. **Node.js**: Required for Railway CLI
4. **Java 21+**: Required for backend (Railway will handle this automatically)

## Quick Start

### Option 1: Deploy Everything (Recommended)

Deploy both frontend and backend in one command:

**Windows PowerShell:**
```powershell
.\scripts\deploy-all-railway.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy-all-railway.sh
./scripts/deploy-all-railway.sh
```

### Option 2: Deploy Separately

**Deploy Backend:**
```powershell
# Windows
.\scripts\deploy-backend-railway.ps1

# Linux/Mac
./scripts/deploy-backend-railway.sh
```

**Deploy Frontend:**
```powershell
# Windows
.\scripts\deploy-frontend-railway.ps1

# Linux/Mac
./scripts/deploy-frontend-railway.sh
```

### Option 3: Manual CLI Deployment

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login

```bash
railway login
```

#### Step 3: Deploy Backend

```bash
cd backend
railway init
railway up

# Set environment variables
railway variables
```

#### Step 4: Deploy Frontend

```bash
cd ..
railway init
railway up

# Set environment variables
railway variables
```

## Step-by-Step Deployment

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

Follow the prompts to authenticate via browser.

### Step 3: Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Initialize Railway project (creates .railway directory)
railway init

# Deploy backend
railway up
```

### Step 4: Configure Backend Environment Variables

```bash
# Interactive mode
railway variables

# Or set individually
railway variables set DATABASE_JDBC_URL="your-jdbc-url"
railway variables set DATABASE_USERNAME="your-username"
railway variables set DATABASE_PASSWORD="your-password"
railway variables set JWT_SECRET_BASE64="your-jwt-secret"
railway variables set CORS_ALLOWED_ORIGINS="http://localhost:3000"
railway variables set BOOTSTRAP_ADMIN_ENABLED="true"
railway variables set BOOTSTRAP_ADMIN_EMAIL="admin@sweetshop.local"
railway variables set BOOTSTRAP_ADMIN_PASSWORD="admin123!"
```

**Get your backend URL:**
```bash
railway domain
# Or check Railway dashboard
```

### Step 5: Deploy Frontend

```bash
# Navigate back to root directory
cd ..

# Initialize Railway project
railway init

# Deploy frontend
railway up
```

### Step 6: Configure Frontend Environment Variables

```bash
# Set backend API URL (replace with your actual backend URL)
railway variables set NEXT_PUBLIC_API_BASE_URL="https://your-backend.railway.app"
```

### Step 7: Update Backend CORS

After getting your frontend URL, update backend CORS:

```bash
cd backend
railway variables set CORS_ALLOWED_ORIGINS="https://your-frontend.railway.app,http://localhost:3000"
railway up
```

## Environment Variables Checklist

### Backend (Railway)

Required variables (see `backend/ENV.example`):

- ✅ `DATABASE_JDBC_URL` - PostgreSQL JDBC connection string
- ✅ `DATABASE_USERNAME` - Database username
- ✅ `DATABASE_PASSWORD` - Database password
- ✅ `JWT_SECRET_BASE64` - Base64 encoded JWT secret (32+ bytes minimum)
- ✅ `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- ✅ `BOOTSTRAP_ADMIN_ENABLED` - Set to `true`
- ✅ `BOOTSTRAP_ADMIN_EMAIL` - Admin email
- ✅ `BOOTSTRAP_ADMIN_PASSWORD` - Admin password

### Frontend (Railway)

Required variables:

- ✅ `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL (e.g., `https://your-backend.railway.app`)

## Adding PostgreSQL Database (Railway)

Railway makes it easy to add a PostgreSQL database:

1. Go to Railway Dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway will automatically provide connection details
4. Use the connection details in your backend environment variables

Or via CLI:
```bash
# In backend directory
railway add postgresql
railway variables  # Shows DATABASE_URL automatically set
```

## Useful Railway CLI Commands

```bash
# View project status
railway status

# View logs
railway logs

# View environment variables
railway variables

# Set environment variable
railway variables set KEY=value

# Get deployment URL
railway domain

# Link to existing project
railway link

# Open Railway dashboard
railway open

# View service info
railway service
```

## Project Structure

Railway will create `.railway` directories in:
- Root directory (for frontend)
- `backend/` directory (for backend)

Each `.railway` directory contains project configuration.

## Post-Deployment

1. **Get your URLs:**
   ```bash
   # Backend URL
   cd backend && railway domain
   
   # Frontend URL
   cd .. && railway domain
   ```

2. **Test the deployment:**
   - Visit your frontend URL
   - Try logging in
   - Verify API calls work

3. **Monitor logs:**
   ```bash
   # Backend logs
   cd backend && railway logs
   
   # Frontend logs
   cd .. && railway logs
   ```

## Troubleshooting

### Issue: Build fails
**Solution**: 
- Check logs: `railway logs`
- Verify all dependencies are in `package.json` (frontend) or `pom.xml` (backend)
- Check Node.js/Java version compatibility

### Issue: Environment variables not working
**Solution**: 
- Verify variables are set: `railway variables`
- Redeploy after setting variables: `railway up`
- Check variable names match exactly (case-sensitive)

### Issue: CORS errors
**Solution**: 
- Update `CORS_ALLOWED_ORIGINS` in backend to include your frontend URL
- Ensure URLs use HTTPS in production
- Redeploy backend after updating CORS

### Issue: Database connection fails
**Solution**: 
- Verify `DATABASE_JDBC_URL` is correct
- Check database is running in Railway dashboard
- Ensure database credentials are correct

### Issue: Backend not accessible
**Solution**: 
- Check Railway dashboard for service status
- Verify port is set correctly (Spring Boot defaults to 8080)
- Check Railway automatically exposes port 8080

## Continuous Deployment

Railway automatically deploys when you push to your connected Git repository:

1. Connect GitHub repository in Railway dashboard
2. Railway watches your repository
3. Pushes to `main` branch trigger automatic deployments

## Cost

Railway offers:
- **Free tier**: $5 credit/month
- **Pro plan**: Pay-as-you-go pricing
- Both frontend and backend can run on free tier for development/testing

## Support

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Railway Discord](https://discord.gg/railway)
