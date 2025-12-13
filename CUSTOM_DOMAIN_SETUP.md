# Custom Domain Setup - sweetshop.yashdhiman.in

## Overview
This guide will help you configure your custom domain `sweetshop.yashdhiman.in` to point to your Railway deployment.

## Step 1: Configure DNS in GoDaddy

1. **Login to GoDaddy**
   - Go to https://godaddy.com
   - Login to your account

2. **Access DNS Management**
   - Go to **My Products** → **Domains**
   - Click on `yashdhiman.in`
   - Click **DNS** or **Manage DNS**

3. **Add CNAME Record**
   - Click **Add** or **+** to add a new record
   - Select **CNAME** as the record type
   - **Name/Host**: `sweetshop` (or `sweetshop.yashdhiman.in` - depends on GoDaddy interface)
   - **Value/Target**: `sweetshop-frontend-production.up.railway.app`
   - **TTL**: 3600 (or default)
   - Click **Save**

4. **Add Backend Subdomain (Optional)**
   - If you want `api.yashdhiman.in` for backend:
   - Add another CNAME:
     - **Name**: `api`
     - **Value**: `sweetshop-backend-production.up.railway.app`

## Step 2: Configure Domain in Railway (Frontend)

### Via Railway Dashboard:
1. Go to Railway Dashboard → `sweetshop-frontend` project
2. Click on the service
3. Go to **Settings** tab
4. Scroll to **"Domains"** section
5. Click **"Custom Domain"** or **"Add Domain"**
6. Enter: `sweetshop.yashdhiman.in`
7. Railway will verify DNS and provision SSL certificate

### Via Railway CLI:
```powershell
cd "C:\Users\yashd\Downloads\neobrutalist-ui-design (1)"
railway domain sweetshop.yashdhiman.in --service sweetshop-frontend
```

Railway will show you the DNS records to add. Copy the CNAME record.

## Step 3: Configure Domain in Railway (Backend - Optional)

If you want `api.yashdhiman.in`:

```powershell
cd backend
railway domain api.yashdhiman.in --service sweetshop-backend
```

Railway will provide DNS records for this domain too.

## Step 4: Update Environment Variables

After domains are configured, update CORS and API URLs:

### Update Backend CORS:
```powershell
cd backend
railway variables --service sweetshop-backend --set "CORS_ALLOWED_ORIGINS=https://sweetshop.yashdhiman.in,https://sweetshop-frontend-production.up.railway.app,http://localhost:3000"
```

### Update Frontend API URL (if using api.yashdhiman.in):
```powershell
railway variables --service sweetshop-frontend --set "NEXT_PUBLIC_API_BASE_URL=https://api.yashdhiman.in"
```

Or keep using Railway domain:
```powershell
railway variables --service sweetshop-frontend --set "NEXT_PUBLIC_API_BASE_URL=https://sweetshop-backend-production.up.railway.app"
```

## Step 5: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Usually takes 15-30 minutes
- Check propagation: https://dnschecker.org

## Step 6: Verify SSL Certificate

Railway automatically provisions SSL certificates via Let's Encrypt:
- Usually takes 5-10 minutes after DNS is verified
- Check Railway dashboard for SSL status

## DNS Record Summary

### ✅ Railway Domains Created!

### For Frontend (sweetshop.yashdhiman.in):
```
Type: CNAME
Name: sweetshop
Value: o0ru7kyv.up.railway.app
TTL: 3600 (or default)
```

### For Backend (api.yashdhiman.in):
```
Type: CNAME
Name: api
Value: wg1ubctf.up.railway.app
TTL: 3600 (or default)
```

**⚠️ Important:** Use the Railway-provided values above, NOT the production.up.railway.app URLs!

## Troubleshooting

### DNS Not Resolving
- Wait 15-30 minutes for propagation
- Check DNS with: `nslookup sweetshop.yashdhiman.in`
- Verify CNAME record in GoDaddy

### SSL Certificate Issues
- Railway auto-provisions SSL (takes 5-10 min)
- Ensure DNS is pointing correctly
- Check Railway dashboard for SSL status

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` to include new domain
- Redeploy backend after updating CORS

## After Setup

Your application will be accessible at:
- **Frontend**: https://sweetshop.yashdhiman.in
- **Backend**: https://sweetshop-backend-production.up.railway.app (or api.yashdhiman.in if configured)
