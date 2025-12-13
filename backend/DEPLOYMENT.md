# Backend Deployment Guide

## ⚠️ Important: Vercel Limitation

**Vercel does NOT support Java/Spring Boot applications.** Vercel is designed for:
- Frontend frameworks (Next.js, React, Vue, etc.)
- Serverless functions (Node.js, Python, Go, etc.)

Your Spring Boot backend requires a platform that supports long-running Java processes.

## Recommended Platforms for Java Spring Boot

### 1. Railway (Easiest - Recommended) ⭐

Railway automatically detects Java applications and handles deployment.

#### Deploy via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Link to existing project or create new
railway link

# Set environment variables
railway variables set DATABASE_JDBC_URL="your-jdbc-url"
railway variables set DATABASE_USERNAME="your-username"
railway variables set DATABASE_PASSWORD="your-password"
railway variables set JWT_SECRET_BASE64="your-jwt-secret"
railway variables set CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
railway variables set BOOTSTRAP_ADMIN_ENABLED="true"
railway variables set BOOTSTRAP_ADMIN_EMAIL="admin@sweetshop.local"
railway variables set BOOTSTRAP_ADMIN_PASSWORD="admin123!"

# Deploy
railway up
```

#### Or via Railway Dashboard:
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `backend` directory
5. Add PostgreSQL database
6. Add environment variables
7. Deploy!

### 2. Render

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Create service
render service:create \
  --name sweetshop-backend \
  --type web \
  --build-command "./mvnw clean package" \
  --start-command "java -jar target/*.jar" \
  --env DATABASE_JDBC_URL="your-jdbc-url" \
  --env DATABASE_USERNAME="your-username" \
  --env DATABASE_PASSWORD="your-password" \
  --env JWT_SECRET_BASE64="your-jwt-secret" \
  --env CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
```

### 3. Google Cloud Run

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Build container
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/sweetshop-backend

# Deploy
gcloud run deploy sweetshop-backend \
  --image gcr.io/YOUR_PROJECT/sweetshop-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_JDBC_URL="your-jdbc-url" \
  --set-env-vars DATABASE_USERNAME="your-username" \
  --set-env-vars DATABASE_PASSWORD="your-password"
```

### 4. AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p java-21 sweetshop-backend

# Create environment
eb create sweetshop-backend-env

# Set environment variables
eb setenv DATABASE_JDBC_URL="your-jdbc-url" \
          DATABASE_USERNAME="your-username" \
          DATABASE_PASSWORD="your-password" \
          JWT_SECRET_BASE64="your-jwt-secret" \
          CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"

# Deploy
eb deploy
```

## Environment Variables Required

See `ENV.example` for all required variables:

- `DATABASE_JDBC_URL` - PostgreSQL JDBC connection string
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `JWT_SECRET_BASE64` - Base64 encoded JWT secret (32+ bytes minimum)
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins (include your Vercel frontend URL)
- `BOOTSTRAP_ADMIN_ENABLED` - Set to `true`
- `BOOTSTRAP_ADMIN_EMAIL` - Admin email
- `BOOTSTRAP_ADMIN_PASSWORD` - Admin password

## Quick Start with Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize and deploy
railway init
railway up

# Set environment variables (interactive)
railway variables
```

## After Deployment

1. Get your backend URL (e.g., `https://your-backend.railway.app`)
2. Update frontend environment variable in Vercel:
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   # Enter: https://your-backend.railway.app
   ```
3. Update backend CORS to include your Vercel domain
4. Redeploy frontend: `vercel --prod`

## Why Not Vercel?

Vercel's serverless functions have:
- Execution time limits (10 seconds on free tier, 60 seconds on Pro)
- Cold start delays
- No support for long-running processes
- No native Java runtime

Spring Boot applications need:
- Long-running processes
- Database connection pooling
- JVM warm-up time
- Full Java runtime environment

These are incompatible with Vercel's serverless model.


