# Cloudflare Pages Deployment Guide

This document explains how to deploy your Next.js car calculator app to Cloudflare Pages using the modern OpenNext Cloudflare adapter.

## ✅ Setup Complete

Your app is now configured for Cloudflare deployment with the following components:

### Dependencies Installed
- `@opennextjs/cloudflare` - Modern adapter for deploying Next.js to Cloudflare Workers
- `wrangler` - Cloudflare CLI tool for deployment and local development

### Configuration Files
- `open-next.config.ts` - OpenNext configuration for Cloudflare
- `wrangler.toml` - Wrangler configuration for deployment settings

### Build Scripts Added
- `npm run build:cf` - Builds the app for Cloudflare deployment
- `npm run preview` - Local development with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers/Pages

## 🚀 Deployment Options

### Option 1: Automatic Git Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Cloudflare deployment configuration"
   git push
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to `Workers & Pages > Create application > Pages > Connect to Git`
   - Select your repository and branch (`v2`)

3. **Configure Build Settings:**
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `.open-next`
   - **Node.js version:** `18.x` or higher

4. **Set Environment Variables (if needed):**
   - Add any environment variables in the Cloudflare Pages dashboard

### Option 2: Manual CLI Deployment

1. **Login to Wrangler:**
   ```bash
   npx wrangler login
   ```

2. **Build the app:**
   ```bash
   npm run build:cf
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Configuration Details

### wrangler.toml Configuration
```toml
name = "budgetgear-calculator"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

### Key Features Enabled
- **nodejs_compat flag:** Enables Node.js compatibility for your Next.js app
- **Static assets:** Properly configured for serving images and static files
- **Environment support:** Separate configs for production and preview

## 💰 Cloudflare Pages Free Tier Limits

✅ **Generous Free Tier:**
- **Builds:** 1 build at a time, 500 builds per month
- **Bandwidth:** 100GB per month
- **Requests:** 100,000 requests per day
- **Sites:** Up to 100 custom domains per account
- **File Size:** 3MB limit per Worker (10MB on paid)

Your car calculator app is well within these limits!

## 🌐 Custom Domain Setup

After deployment:

1. **In Cloudflare Pages Dashboard:**
   - Go to your deployed app
   - Navigate to `Custom domains`
   - Add `budgetgear.in`
   - Follow DNS configuration instructions

2. **Update Domain in Code:**
   Your app is already configured to use `budgetgear.in` in:
   - `src/app/layout.tsx` - SEO metadata
   - `src/app/prepayment/layout.tsx` - Page metadata

## 🔍 Local Development with Cloudflare

Test your app locally with Cloudflare Workers environment:

```bash
# Build for Cloudflare
npm run build:cf

# Start local Cloudflare development
npm run preview
```

## 📊 Monitoring & Analytics

After deployment, monitor your app:
- **Cloudflare Analytics:** Built-in traffic and performance metrics
- **Real User Monitoring:** Available in Cloudflare dashboard
- **Error Tracking:** View errors in Wrangler logs

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Ensure Node.js version is 18+ locally
   - Check for TypeScript errors: `npm run build`

2. **Asset Loading Issues:**
   - Verify assets are in the `.open-next/assets` directory
   - Check wrangler.toml asset binding configuration

3. **Runtime Errors:**
   - Check compatibility flags in wrangler.toml
   - Use `wrangler tail` to view live logs

### Debugging Commands:
```bash
# View live logs
npx wrangler tail budgetgear-calculator

# Check build output
ls -la .open-next/

# Test local build
npm run preview
```

## 🚀 Next Steps

1. **Deploy:** Use Option 1 (Git) for continuous deployment
2. **Custom Domain:** Set up budgetgear.in domain
3. **Analytics:** Enable Cloudflare Web Analytics
4. **Performance:** Monitor Core Web Vitals in dashboard
5. **SEO:** Submit sitemap to Google Search Console

## 📝 Build Success ✅

Your app has been successfully built for Cloudflare deployment:
- **Build Status:** ✅ Completed
- **Output Directory:** `.open-next/`
- **Worker File:** `.open-next/worker.js`
- **Assets:** `.open-next/assets/`
- **Bundle Size:** Optimized for Cloudflare Workers

Ready for deployment! 🚀