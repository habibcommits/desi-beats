# Vercel Deployment Guide for DESI Beats Café

## Understanding the 404 Error

The 404 error occurs because Vercel needs your app to be structured in a specific way. I've restructured the project to work with Vercel's Express auto-detection.

## What Changed

1. **Created `index.ts`** at the root - This is the entry point Vercel looks for
2. **Created `public/` directory** - Vercel serves static files from here
3. **Updated `vercel.json`** - Simplified configuration for Express apps
4. **Updated `.vercelignore`** - Prevents uploading unnecessary files

## How to Deploy (3 Simple Steps)

### Step 1: Build Locally First
Before deploying to Vercel, run this command in your terminal:

```bash
npm run build && cp -r dist/public/* public/
```

This creates the production build and copies static files to where Vercel expects them.

### Step 2: Push to Git (if using Git integration)
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**
```bash
npm i -g vercel
vercel
```

When prompted:
- **Set up and deploy?** Yes
- **Link to existing project?** No (unless you want to redeploy to existing one)
- **Project name?** desi-beats-cafe (or your choice)
- **Directory?** ./ (just press Enter)
- **Override settings?** No

Then deploy to production:
```bash
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect the settings
4. Click "Deploy"

## After Deployment

Your app should be live at: `https://your-project-name.vercel.app`

You can test:
- **Homepage**: Should show DESI Beats Café website
- **API**: `https://your-app.vercel.app/api/categories` should return categories
- **Menu**: All 16 categories and 200+ menu items should work

## Important Notes

- **Build before deploying**: Always run `npm run build && cp -r dist/public/* public/` before deploying
- **In-memory storage**: Data resets on each deployment (this is expected)
- **Auto-seeded data**: All 200+ menu items load automatically
- **Environment variables**: Set these in Vercel dashboard if needed:
  - `ADMIN_USERNAME` (default: admin)
  - `ADMIN_PASSWORD` (default: admin)

## Troubleshooting

### Still getting 404?

1. **Check Vercel build logs**:
   - Go to your deployment in Vercel dashboard
   - Click on the deployment
   - Review the "Building" and "Output" tabs for errors

2. **Verify files were uploaded**:
   - In deployment details, check the "Source" tab
   - Make sure `index.ts` and `public/` directory exist

3. **Check Functions tab**:
   - Your Express app should appear as a function
   - Make sure it's not showing errors

4. **Local test**:
   ```bash
   vercel dev
   ```
   This runs your app locally using Vercel's environment

### Build failing?

Make sure all dependencies are installed:
```bash
npm install
npm run build
```

### Static files not loading?

Run the copy command again:
```bash
cp -r dist/public/* public/
```

Then redeploy.

## Alternative: Keep Current Structure for Other Platforms

The `index.ts` file I created is specifically for Vercel. Your existing Replit deployment still works using:
- `npm run dev` - Development server
- `npm run start` - Production server from `dist/index.js`

This means you can deploy to:
- **Replit** - Works as-is
- **Vercel** - Uses the new `index.ts`
- **Other platforms** - Use `npm run build` + `npm run start`

## Need Help?

- Check build logs in Vercel dashboard
- Use `vercel dev` to test locally
- Vercel support: https://vercel.com/support
