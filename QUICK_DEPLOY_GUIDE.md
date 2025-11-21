# Quick Vercel Deployment Guide

## Your App is Ready for Vercel FREE TIER! 🎉

All image issues are fixed and the app is converted to serverless architecture.

## What to Do NOW

### Option 1: Deploy Without Database (Quick Test)

This will work but **orders won't persist** between serverless function calls.

```bash
# Just push to GitHub
git add .
git commit -m "Fix image paths and add serverless support"
git push origin main
```

Vercel will automatically redeploy. Your images will now work!

### Option 2: Deploy With MongoDB (Recommended for Production)

#### Step 1: Get FREE MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create FREE M0 cluster (512MB free forever)
4. Create database user:
   - Username: `desibeats`
   - Password: `[create a strong password]`
5. Network Access: Add `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   ```
   mongodb+srv://desibeats:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/desi-beats-cafe?retryWrites=true&w=majority
   ```

#### Step 2: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Find your `desi-beats` project
3. Go to **Settings** → **Environment Variables**
4. Add these:
   - `MONGODB_URI` = `mongodb+srv://desibeats:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/desi-beats-cafe?retryWrites=true&w=majority`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `[your secure password]`

#### Step 3: Seed Database (ONE TIME ONLY)

After deploying, you need to seed the database with categories and menu items:

```bash
# Install Vercel CLI if not already
npm install -g vercel

# Set environment variable locally
export MONGODB_URI="mongodb+srv://desibeats:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/desi-beats-cafe"

# Run seed script
npx tsx server/seed-mongo.ts
```

This will populate your MongoDB with all categories and menu items!

#### Step 4: Deploy

```bash
git add .
git commit -m "Fix images and add MongoDB serverless support"
git push origin main
```

## What's Fixed

✅ All images moved to `/client/public/`  
✅ Header logo path fixed  
✅ Hero slider images fixed  
✅ Menu item images fixed (14 items)  
✅ Serverless API created in `/api` folder  
✅ MongoDB support added  
✅ CORS configured correctly  
✅ Vercel configuration optimized  

## After Deployment

Your site will be at: `https://desi-beats.vercel.app`

Test these:
- Homepage loads with images ✓
- Categories display ✓
- Menu items show with images ✓
- Orders can be created ✓
- Hero slider works ✓

## If Images Still Don't Show

1. Go to Vercel dashboard
2. Click "Redeploy"
3. **UNCHECK** "Use existing Build Cache"
4. Click "Redeploy"

This forces a fresh build.

## Cost

Everything you're using is **100% FREE**:
- Vercel Free Tier: ✅ Free forever
- MongoDB Atlas M0: ✅ Free forever (512MB)
- Your serverless functions: ✅ Within free limits

No credit card required!

## Need Help?

All your files are ready. Just follow the steps above and you'll be deployed in 5 minutes!
