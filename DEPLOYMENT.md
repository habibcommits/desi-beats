# Vercel Deployment Guide for DESI Beats Café

## Quick Fix for 404 Error

Your app is getting a 404 error because Vercel needs to be configured properly. Follow these steps:

### Option 1: Redeploy with Updated Configuration

1. **Push the latest changes to your Git repository** (if using Git):
   ```bash
   git add .
   git commit -m "Fix Vercel configuration"
   git push
   ```

2. **Go to your Vercel dashboard** at https://vercel.com/dashboard

3. **Find your project** and click on it

4. **Click "Deployments"** tab

5. **Click the three dots** on your latest deployment and select **"Redeploy"**

6. Make sure to check **"Use existing build cache"** is UNCHECKED to force a fresh build

### Option 2: Deploy from Scratch

If redeploying doesn't work, try a fresh deployment:

1. **Delete the project** from Vercel dashboard (Settings → Delete)

2. **Redeploy using Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
   
3. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project's name? **desi-beats-cafe** (or your preferred name)
   - In which directory is your code located? **/** (press Enter)
   - Want to override settings? **No**

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## What Was Fixed

1. **Added build command** to `vercel.json` so Vercel knows to run `npm run build`
2. **Updated `.vercelignore`** to include necessary source files
3. **Fixed static file paths** in production server
4. **Configured proper routing** for both API and frontend

## Verifying the Deployment

After deployment, you should be able to:

1. **Visit the homepage** - You'll see the DESI Beats Café website
2. **Browse categories** - All 16 food categories should load
3. **View menu items** - 200+ Pakistani dishes should be available
4. **Check API endpoints**:
   - `https://your-app.vercel.app/api/categories` - Returns category list
   - `https://your-app.vercel.app/api/menu-items` - Returns all menu items

## Important Notes

- The app uses **in-memory storage**, so data resets on each deployment
- All menu data is **pre-seeded** automatically when the server starts
- No database setup required for Vercel deployment

## Troubleshooting

If you still get 404 errors after redeploying:

1. **Check Vercel build logs**:
   - Go to your deployment in Vercel dashboard
   - Click on the deployment
   - Look at the "Building" section for errors

2. **Check function logs**:
   - Click "Functions" tab in your deployment
   - Make sure `dist/index.js` appears in the functions list

3. **Verify build output**:
   - In deployment details, check the "Output" section
   - Make sure `dist/public/` and `dist/index.js` exist

## Contact Support

If issues persist, you can:
- Check Vercel's deployment logs for specific error messages
- Contact Vercel support at https://vercel.com/support
- Review Vercel's debugging guide: https://vercel.com/guides/why-is-my-deployed-project-giving-404
