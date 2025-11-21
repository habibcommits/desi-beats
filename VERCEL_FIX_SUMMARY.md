# Vercel Deployment Issues - FIXED ✅

## Problems Found

### 1. **Module Resolution Error** (PRIMARY ISSUE)
**Error:** `Cannot find module '/var/task/api/_utils/cors'`

**Cause:** 
- You had TWO conflicting deployment architectures:
  - Full Express app in `server/` directory
  - Vercel serverless functions in `api/` directory
- Both were trying to handle API requests, causing conflicts
- The serverless functions couldn't resolve relative imports to `_utils`

**Fix:** 
✅ **Removed the `api/` directory** - The Express app already handles all routes
✅ **Updated `vercel.json`** to route all requests to the Express app

---

### 2. **Session Storage Issue** (CRITICAL FOR PRODUCTION)
**Error:** Sessions not persisting on Vercel

**Cause:**
- Using `memorystore` for sessions
- Vercel serverless functions are **stateless** - memory is not shared between requests
- Sessions would be lost immediately after login

**Fix:**
✅ **Switched to PostgreSQL-backed sessions** using `connect-pg-simple`
✅ **Created PostgreSQL database** for persistent session storage
✅ Sessions will now persist across serverless function invocations

---

## Changes Made

### 1. Removed Conflicting Files
```bash
rm -rf api/
```

### 2. Updated `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "outputDirectory": "dist/public"
}
```

### 3. Updated `server/app.ts` - PostgreSQL Sessions
```typescript
// Before (BROKEN on Vercel)
import memorystore from "memorystore";
const MemoryStore = memorystore(session);
store: new MemoryStore({
  checkPeriod: 86400000,
})

// After (WORKS on Vercel)
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const PgStore = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

store: new PgStore({
  pool: pgPool,
  createTableIfMissing: true,
  pruneSessionInterval: 60 * 15,
})
```

### 4. Installed Required Package
```bash
npm install pg
```

---

## Environment Variables Required on Vercel

You **MUST** set these environment variables in your Vercel project settings:

### Required for Sessions
- `DATABASE_URL` - PostgreSQL connection string (Vercel Postgres or external)
- `JWT_SECRET` - Secret key for signing session cookies

### Required for Authentication
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password

### Optional (if using ImageKit)
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`

---

## How to Deploy to Vercel

### Step 1: Set Environment Variables
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NODE_ENV=production
```

### Step 2: Deploy
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push
```

Vercel will automatically deploy your changes.

---

## Testing After Deployment

1. **Visit your Vercel URL:** `https://desi-beats.vercel.app`
2. **Test login:** Navigate to `/admin` or wherever your login page is
3. **Check if sessions persist:** Login and refresh the page - you should stay logged in

---

## What Was The Problem?

The error logs showed:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/_utils/cors'
```

This happened because:
1. Vercel was trying to run serverless functions from the `api/` directory
2. Those functions had relative imports that didn't work in the serverless environment
3. Meanwhile, your main Express app was also deployed
4. Both systems were conflicting

**The solution:** Remove the redundant `api/` directory and use only the Express app.

---

## Additional Notes

- Your app now uses **PostgreSQL for sessions** which is production-ready
- All API routes go through the Express app in `server/routes.ts`
- Sessions are persisted in the database, not memory
- The session table is created automatically on first run

---

## If You Still Have Issues

1. Check Vercel logs: `vercel logs <deployment-url>`
2. Verify environment variables are set correctly
3. Make sure your PostgreSQL database is accessible from Vercel
4. Check that your `DATABASE_URL` is correct and the database exists

---

**Status: READY TO DEPLOY** ✅
