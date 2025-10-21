# Cloudflare Pages Deployment - kidchart.com

## Framework Details
- **Frontend**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Domain**: kidchart.com

## Deploy to Cloudflare Pages

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to kidchart.com"
git push origin main
```

### Step 2: Deploy on Cloudflare

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" → "Create application" → "Pages"
3. Click "Connect to Git"
4. Select your repository: `soitgoes887/kidchart`
5. Configure build settings:
   - **Project name**: `kidchart`
   - **Production branch**: `main`
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

6. Click "Environment variables (advanced)" and add:
   - **Name**: `NODE_VERSION`
   - **Value**: `20`
   - **Name**: `VITE_SAVE_URL`
   - **Value**: `https://your-save-lambda-url.lambda-url.region.on.aws/`
   - **Name**: `VITE_LOAD_URL`
   - **Value**: `https://your-load-lambda-url.lambda-url.region.on.aws/`
   - **Name**: `VITE_SHARE_URL_BASE`
   - **Value**: `https://kidchart.com`

   > **Note**: Get your Lambda URLs by running `cd infrastructure && pulumi stack output`

7. Click "Save and Deploy"

### Step 3: Wait for Deployment
- First deployment takes ~2-3 minutes
- Initially live at: `kidchart.pages.dev`

### Step 4: Connect Your Custom Domain (kidchart.com)

Since you bought the domain through Cloudflare, this is super easy:

1. Go to your Cloudflare Pages project
2. Click "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter: `kidchart.com`
5. Click "Continue"
6. **Also add `www.kidchart.com`** and set it to redirect to `kidchart.com`
7. Cloudflare will automatically configure DNS (no manual DNS setup needed!)
8. SSL certificate will be automatically provisioned (takes ~1 minute)

Your site will be live at:
- ✅ https://kidchart.com
- ✅ https://www.kidchart.com (redirects to main)

### What Changed

✅ **Removed package-lock.json** - Prevents Cloudflare from using `npm ci` which was causing errors
✅ **Added .npmrc** - Disables automatic lockfile generation
✅ **Simple build command** - Just `npm install && npm run build`

## Troubleshooting

### If Build Still Fails
Try this build command:
```bash
npm install --legacy-peer-deps && npm run build
```

### Custom Domain Not Working
- Wait 1-2 minutes for DNS propagation
- Check SSL certificate status in Cloudflare Pages → Custom domains
- Make sure DNS records were created automatically

## Benefits of Cloudflare Pages + Custom Domain

✅ **Free SSL** - Automatic HTTPS for kidchart.com
✅ **Global CDN** - Lightning fast worldwide
✅ **Built-in Analytics** - Track visitors at kidchart.com
✅ **Unlimited bandwidth**
✅ **Preview deployments** - Test PRs before merging
✅ **Automatic deployments** - Every push to main auto-deploys
✅ **Domain included** - No separate DNS management needed

## Local Testing

Before deploying, set up your environment variables:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Lambda URLs:**
   ```bash
   # Get your Lambda URLs from Pulumi
   cd infrastructure
   pulumi stack output
   ```

   Then update `.env`:
   ```
   VITE_SAVE_URL=https://your-save-url.lambda-url.region.on.aws/
   VITE_LOAD_URL=https://your-load-url.lambda-url.region.on.aws/
   VITE_SHARE_URL_BASE=https://kidchart.com
   ```

3. **Test locally:**
   ```bash
   npm install
   npm run dev
   ```
   Visit http://localhost:5173 or http://127.0.0.1:5173

4. **Test production build:**
   ```bash
   npm run build
   npm run preview
   ```
   Visit http://localhost:4173 to preview the production build.

## Deployment Status

✅ Vite configured for Cloudflare Pages
✅ Base path set to root `/`
✅ Build output configured
✅ Node version files added (.nvmrc, .node-version)
✅ Removed package-lock.json to fix npm ci error
✅ Added .npmrc configuration
✅ Domain ready: kidchart.com
⏳ Pending: Connect custom domain after deployment

## Next Steps

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Deploy to kidchart.com"
   git push origin main
   ```

2. **Wait for deployment to succeed** (~2-3 minutes)

3. **Add custom domain in Cloudflare Pages:**
   - Go to project → Custom domains
   - Add `kidchart.com`
   - Add `www.kidchart.com`

4. **Your app will be live at https://kidchart.com!**



