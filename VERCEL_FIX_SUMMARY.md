# Vercel Deployment Fix - MongoDB Sessions ✅

## The Problem

Your Vercel deployment was failing with this error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/_utils/cors'
```

**Root Cause:** You had duplicate API handling systems running at the same time:
- Express app in `server/` directory (your main app)
- Serverless functions in `api/` directory (conflicting system)

Both were trying to handle the same routes, and the serverless functions couldn't find their dependencies.

---

## The Fix

### ✅ What Was Changed

1. **Removed the `api/` directory** - Deleted the conflicting serverless functions
2. **Updated `vercel.json`** - Routes everything through your Express app
3. **Fixed sessions for MongoDB** - Uses `connect-mongo` to store sessions in your existing MongoDB database

---

## Updated Files

### `server/app.ts` - MongoDB Sessions
```typescript
import MongoStore from "connect-mongo";

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(
  session({
    name: "desibeats.sid",
    secret: process.env.JWT_SECRET || "default-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: mongoUri ? MongoStore.create({
      mongoUrl: mongoUri,
      touchAfter: 24 * 3600,
      crypto: {
        secret: process.env.JWT_SECRET || "default-secret-change-in-production"
      }
    }) : undefined,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
```

### `vercel.json` - Single Express App
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

---

## Environment Variables for Vercel

Set these in your Vercel project settings:

### **Required**
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for signing session cookies
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password
- `NODE_ENV` - Set to `production`

### **Optional** (if using ImageKit)
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`

---

## Deploy to Vercel

```bash
git add .
git commit -m "Fix Vercel deployment with MongoDB sessions"
git push
```

Vercel will automatically redeploy.

---

## What This Fixes

✅ Module resolution errors  
✅ Sessions now persist in MongoDB (not lost on serverless restarts)  
✅ Single deployment architecture (no conflicts)  
✅ Works with your existing MongoDB setup  

---

**Status: READY TO DEPLOY** 🚀
