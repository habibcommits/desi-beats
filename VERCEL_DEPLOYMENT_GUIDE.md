# Vercel Serverless Deployment Guide

This application has been converted to work with Vercel's serverless architecture on the **free tier**.

## What Changed

### 1. Serverless API Routes
- All Express routes converted to Vercel API functions in `/api` folder
- Each endpoint is a separate serverless function
- No persistent server required

### 2. Storage Architecture
- **Development**: Uses in-memory storage (MemStorage)
- **Production**: Requires MongoDB Atlas (free tier available)
- Storage automatically initializes based on `MONGODB_URI` environment variable

### 3. Image Paths Fixed
- All images moved from `attached_assets/` to `client/public/`
- Updated paths in:
  - `client/src/components/Header.tsx`
  - `client/src/components/HeroSlider.tsx`
  - `server/storage.ts`

## Deployment Steps

### Step 1: Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with username and password
5. Add your IP to the whitelist (or use `0.0.0.0/0` for all IPs)
6. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/desi-beats-cafe?retryWrites=true&w=majority
   ```

### Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/desi-beats-cafe?retryWrites=true&w=majority
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

   **Important**: Replace with your actual MongoDB credentials!

### Step 3: Push Changes to GitHub

```bash
git add .
git commit -m "Convert to Vercel serverless architecture"
git push origin main
```

### Step 4: Deploy to Vercel

Vercel will automatically detect the push and redeploy your application with the new serverless architecture.

**OR** manually redeploy:
1. Go to Vercel dashboard
2. Click "Redeploy" on your project
3. Uncheck "Use existing Build Cache"
4. Click "Redeploy"

## API Endpoints

All API endpoints are now serverless functions:

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get category by ID

### Menu Items
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items?categoryId=xxx` - Get items by category
- `GET /api/menu-items?featured=true` - Get featured items
- `GET /api/menu-items/[id]` - Get menu item by ID

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PATCH /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Hero Slider
- `GET /api/hero-slider` - Get hero slider configuration

## Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-hours/month
- **Serverless Functions**: 10 second timeout
- **Deployments**: Unlimited

This configuration stays well within free tier limits for a food ordering platform.

## Troubleshooting

### Images Not Loading
- Ensure all images are in `client/public/` folder
- Check that image paths don't include `/attached_assets/`
- Verify `outputDirectory` in `vercel.json` is set to `dist/public`

### Database Connection Errors
- Verify `MONGODB_URI` is set correctly in Vercel environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### Build Errors
- Clear Vercel build cache and redeploy
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (20.x)

## Local Development

For local development, the app still uses the Express server:

```bash
npm run dev
```

The serverless API functions are **only used in production** on Vercel.
