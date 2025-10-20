# KidChart Deployment Guide

## GitHub Pages Deployment

### Initial Setup (One-time)

1. **Enable GitHub Pages in your repository:**
   - Go to https://github.com/soitgoes887/kidchart/settings/pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"
   - Click "Save"

2. **Get Cloudflare Analytics Token:**
   - Go to https://dash.cloudflare.com
   - Navigate to "Web Analytics"
   - Click "Add a site"
   - Enter your site name (e.g., "KidChart")
   - Copy the token
   - Replace `YOUR_CLOUDFLARE_TOKEN_HERE` in `index.html` with your actual token

### Deploy

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Build your app
2. Deploy to GitHub Pages
3. Your site will be available at: https://soitgoes887.github.io/kidchart/

### Manual Deployment

You can also trigger deployment manually:
1. Go to https://github.com/soitgoes887/kidchart/actions
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"

### Local Testing

Test the production build locally:
```bash
npm run build
npm run preview
```

## Alternative: Cloudflare Pages

If you prefer Cloudflare Pages over GitHub Pages:

1. **Go to Cloudflare Dashboard:**
   - Navigate to "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"

2. **Connect your GitHub repo:**
   - Select `soitgoes887/kidchart`
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `/`

3. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be available at a cloudflare.pages.dev URL
   - You can add a custom domain later

4. **Update vite.config.ts:**
   - Change `base: '/kidchart/'` to `base: '/'` (Cloudflare uses root path)

### Benefits of Cloudflare Pages:
- Free SSL
- Global CDN
- Built-in analytics (no need for separate token)
- Faster builds
- Preview deployments for PRs

## Current Status

✅ Vite configured for GitHub Pages
✅ GitHub Actions workflow created
✅ Cloudflare Analytics script added (needs token)
⏳ Pending: Push to GitHub and enable Pages

## Next Steps

1. Get your Cloudflare Analytics token
2. Update `index.html` with the token
3. Commit and push:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```
4. Enable GitHub Pages in repository settings
5. Wait 2-3 minutes for deployment
6. Visit https://soitgoes887.github.io/kidchart/
