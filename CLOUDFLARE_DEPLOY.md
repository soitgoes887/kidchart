# Cloudflare Pages Deployment

## Framework Details
- **Frontend**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts

## Deploy to Cloudflare Pages

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix Cloudflare Pages deployment"
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
   - **Framework preset**: `None` (we'll configure manually)
   - **Build command**: `npm install --legacy-peer-deps && npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

6. Click "Environment variables (advanced)" and add:
   - **Name**: `NODE_VERSION`
   - **Value**: `20`

7. Click "Save and Deploy"

### Alternative Build Command

If the above doesn't work, try:
```bash
./build.sh
```
(Make sure build.sh is in your repo and executable)

### Step 3: Wait for Deployment
- First deployment takes ~2-3 minutes
- You'll get a URL like: `kidchart.pages.dev`

### Step 4: Add Custom Domain (Optional)
1. Go to your project → "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `kidchart.com`)
4. Follow DNS setup instructions

## Troubleshooting

### Build Fails with npm Error
- Try: `npm install --legacy-peer-deps && npm run build`
- Or use the build.sh script

### Node Version Issues
- Ensure NODE_VERSION=20 is set in environment variables
- Check that .nvmrc and .node-version files are in the repo

## Benefits of Cloudflare Pages

✅ **Free SSL** - Automatic HTTPS
✅ **Global CDN** - Lightning fast worldwide
✅ **Built-in Analytics** - No setup needed!
✅ **Unlimited bandwidth**
✅ **Preview deployments** - Test PRs before merging
✅ **Automatic deployments** - Every push to main auto-deploys

## Local Testing

Before deploying, test locally:
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
✅ Custom build script created
⏳ Pending: Push to GitHub and deploy on Cloudflare

## Next Steps

1. Commit your changes
2. Push to GitHub
3. Follow Step 2 above to deploy on Cloudflare
4. Your app will be live at `kidchart.pages.dev`!

