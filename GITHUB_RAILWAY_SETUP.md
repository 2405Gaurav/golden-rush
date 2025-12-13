# Connect Railway to GitHub - Step by Step Guide

## ✅ Code Pushed to GitHub
- Repository: `https://github.com/theyashdhiman04/SSMS`
- Latest commit: Dockerfiles and Railway configuration added

## 🔗 Connect Railway to GitHub (Via Dashboard)

### Step 1: Connect Backend to GitHub

1. **Open Railway Dashboard**
   - Go to: https://railway.app
   - Navigate to `sweetshop-backend` project

2. **Go to Settings**
   - Click on **"Settings"** tab (top navigation)

3. **Connect GitHub Repository**
   - Scroll to **"Source"** section
   - Click **"New"** button (or **"Connect GitHub"** if available)
   - Select **"GitHub Repo"** option
   - Authorize Railway to access your GitHub (if first time)
   - Select repository: **`theyashdhiman04/SSMS`**
   - Set **Branch**: `main`
   - Set **Root Directory**: `backend`
   - Click **"Deploy"** or **"Save"**

4. **Verify**
   - Railway will immediately trigger a deployment from GitHub
   - Check the "Activity" tab to see the deployment starting
   - The source should now show your GitHub repo instead of "Upload"

### Step 2: Connect Frontend to GitHub

1. **Open Railway Dashboard**
   - Navigate to `sweetshop-frontend` project

2. **Go to Settings**
   - Click on **"Settings"** tab

3. **Connect GitHub Repository**
   - Scroll to **"Source"** section
   - Click **"New"** → **"GitHub Repo"**
   - Select repository: **`theyashdhiman04/SSMS`**
   - Set **Branch**: `main`
   - Set **Root Directory**: `/` (leave empty or put `/`)
   - Click **"Deploy"** or **"Save"**

4. **Verify**
   - Railway will trigger a deployment from GitHub
   - Check deployment status in Activity tab

## 🎯 After Connection

### Automatic Deployments
- Every `git push origin main` will automatically trigger deployments
- Both backend and frontend will deploy automatically
- No need to run `railway up` anymore!

### Test It
```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "Test auto-deployment"
git push origin main

# Railway will automatically detect and deploy!
```

## 📋 Current Status

- ✅ Code pushed to GitHub
- ⏳ **Next**: Connect Railway projects to GitHub (via dashboard)
- ⏳ **Then**: Automatic deployments will work!

## 🔍 Verify Connection

After connecting, you should see:
- In Railway Dashboard → Settings → Source:
  - Shows: `theyashdhiman04/SSMS` (GitHub icon)
  - Instead of: "Upload" or "CLI"

## ⚠️ Important Notes

1. **Remove Direct Uploads**: Once connected to GitHub, Railway will use GitHub as the source
2. **Environment Variables**: These remain in Railway (not in GitHub)
3. **Database**: Still needs to be added in Railway dashboard
4. **Root Directories**: 
   - Backend: `backend`
   - Frontend: `/` (root)

## 🆘 Troubleshooting

If connection fails:
- Make sure Railway has GitHub access (check GitHub → Settings → Applications)
- Verify repository name: `theyashdhiman04/SSMS`
- Check branch name: `main`
- Ensure root directories are set correctly
