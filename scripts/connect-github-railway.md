# Connect Railway to GitHub for Automatic Deployments

## Current Status
- ✅ Code is pushed to GitHub: `https://github.com/theyashdhiman04/SSMS`
- ⚠️ Railway is currently using direct uploads (not connected to GitHub)

## Connect Railway to GitHub

### Option 1: Via Railway Dashboard (Recommended)

1. **Backend Project:**
   - Go to Railway Dashboard → `sweetshop-backend` project
   - Click **Settings** tab
   - Scroll to **"Source"** section
   - Click **"Connect GitHub"** or **"New"** → **"GitHub Repo"**
   - Select repository: `theyashdhiman04/SSMS`
   - Set **Root Directory**: `backend`
   - Railway will automatically deploy on every push to `main` branch

2. **Frontend Project:**
   - Go to Railway Dashboard → `sweetshop-frontend` project
   - Click **Settings** tab
   - Scroll to **"Source"** section
   - Click **"Connect GitHub"** or **"New"** → **"GitHub Repo"**
   - Select repository: `theyashdhiman04/SSMS`
   - Set **Root Directory**: `/` (root)
   - Railway will automatically deploy on every push to `main` branch

### Option 2: Via Railway CLI

```bash
# For Backend
cd backend
railway link --github theyashdhiman04/SSMS --branch main --path backend

# For Frontend  
cd ..
railway link --github theyashdhiman04/SSMS --branch main --path /
```

## Benefits of GitHub Integration

✅ **Automatic Deployments**: Every push to `main` branch triggers deployment
✅ **Pull Request Previews**: Get preview deployments for PRs
✅ **Better Version Control**: Track deployments with git commits
✅ **No Manual Uploads**: No need to run `railway up` manually

## After Connecting

Once connected, you can:
- Push code to GitHub: `git push origin main`
- Railway automatically detects changes and deploys
- View deployment status in Railway dashboard

