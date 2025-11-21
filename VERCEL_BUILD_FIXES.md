# Vercel Build Fixes

## Issue
The Vercel build was failing with the error:
```
Could not load /vercel/path0/attached_assets/WhatsApp Image 2025-11-21 at 20.00.27_83f196f8_1763740992228.jpg
```

## Root Cause
The `attached_assets` folder is excluded in `.vercelignore` (line 8), which means Vercel doesn't include these files during the build process. When Vite tries to bundle the application, it cannot find the imported image assets.

## Solution Applied

### 1. Moved Images to Public Folder
Copied the required images from `attached_assets/` to `client/public/`:
- `logo.png` - Main site logo
- `halwa_puri_nashta_platter.png` - Hero slider image
- `chicken_karahi_in_pot.png` - Hero slider image
- `bbq_chicken_tikka_skewers.png` - Hero slider image

### 2. Updated Component Imports

**client/src/components/Header.tsx:**
- Removed: `import logoImage from "@assets/WhatsApp Image 2025-11-21 at 20.00.27_83f196f8_1763740992228.jpg"`
- Changed image source from `{logoImage}` to `"/logo.png"`

**client/src/components/HeroSlider.tsx:**
- Removed asset imports for `halwaImage`, `karahiImage`, and `bbqImage`
- Updated hero slides array to use public folder paths:
  - `"/halwa_puri_nashta_platter.png"`
  - `"/chicken_karahi_in_pot.png"`
  - `"/bbq_chicken_tikka_skewers.png"`

## Why This Works

Files in the `client/public/` folder:
1. ✅ Are included in both development and production builds
2. ✅ Are served from the root path (e.g., `/logo.png`)
3. ✅ Don't need to be imported - they can be referenced directly
4. ✅ Are copied to the build output automatically by Vite
5. ✅ Work correctly with Vercel's deployment process

## Next Steps for Vercel Deployment

Your application should now build successfully on Vercel. The build command will:
1. Run `npm run build` which executes Vite build
2. Copy the built files to the public directory
3. Deploy without any asset loading errors

## Note

The `attached_assets` folder remains in the project for development purposes and contains all original assets. The images needed for the production build are now duplicated in `client/public/` to ensure they're available during the Vercel build process.
