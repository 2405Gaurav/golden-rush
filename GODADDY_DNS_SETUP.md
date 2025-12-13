# GoDaddy DNS Setup for sweetshop.yashdhiman.in

## Quick Setup Guide

### Step 1: Login to GoDaddy
1. Go to https://godaddy.com
2. Login to your account

### Step 2: Access DNS Management
1. Click **"My Products"** (top right)
2. Find **"yashdhiman.in"** domain
3. Click **"DNS"** button (or **"Manage DNS"**)

### Step 3: Add CNAME Records

#### For Frontend (sweetshop.yashdhiman.in):

1. Click **"Add"** button (or **"+"** icon)
2. Select record type: **CNAME**
3. Fill in:
   - **Name**: `sweetshop`
   - **Value**: `o0ru7kyv.up.railway.app`
   - **TTL**: `600` (or leave default)
4. Click **"Save"**

#### For Backend API (api.yashdhiman.in):

1. Click **"Add"** button again
2. Select record type: **CNAME**
3. Fill in:
   - **Name**: `api`
   - **Value**: `wg1ubctf.up.railway.app`
   - **TTL**: `600` (or leave default)
4. Click **"Save"**

### Step 4: Verify DNS Records

After adding, you should see:
```
Type    Name        Value                     
CNAME   sweetshop   o0ru7kyv.up.railway.app   
CNAME   api         wg1ubctf.up.railway.app   
```

### Step 5: Wait for DNS Propagation

- **Typical time**: 15-30 minutes
- **Maximum**: Up to 72 hours
- **Check status**: https://dnschecker.org

### Step 6: Railway SSL Certificate

Railway automatically provisions SSL certificates:
- Usually takes 5-10 minutes after DNS is verified
- Check Railway dashboard → Domains section
- Your site will be accessible via HTTPS automatically

## After DNS Propagates

Your application will be accessible at:
- **Frontend**: https://sweetshop.yashdhiman.in
- **Backend API**: https://api.yashdhiman.in

## Troubleshooting

### DNS Not Working?
1. Verify CNAME records in GoDaddy match exactly
2. Wait 15-30 minutes for propagation
3. Check with: `nslookup sweetshop.yashdhiman.in`
4. Clear browser cache

### SSL Certificate Issues?
- Railway auto-provisions SSL (wait 5-10 min)
- Ensure DNS is pointing correctly
- Check Railway dashboard for SSL status

### Still Using Railway Domain?
- DNS propagation can take time
- Railway domain still works: https://sweetshop-frontend-production.up.railway.app
- Custom domain will work once DNS propagates
