# Deployment Guide

## Overview
This guide covers all deployment options for the Hydrate Move application, including local development, GitHub Pages, Cloudflare Pages, and custom domain setup.

## 🏠 Local Development

### Quick Start
```bash
git clone https://github.com/starry3085/hydrate-move.git
cd hydrate-move
# Open index.html or use any static server
```

### Using Static Server
```bash
# Option 1: Node.js http-server
npx http-server . -p 8080

# Option 2: Python
python -m http.server 8080

# Option 3: PHP
php -S localhost:8080
```

Visit `http://localhost:8080` to test the application.

## 🚀 Cloudflare Pages Deployment

### Auto Deploy (Recommended)
**Live**: https://hydrate-move.pages.dev

```bash
cmd /c npx wrangler pages deploy . --project-name=hydrate-move --branch=main
```

### Manual Deployment
1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the project:
```bash
wrangler pages deploy . --project-name=hydrate-move
```

## 🌐 Custom Domain Setup

### Current Deployment Status
- **Cloudflare Pages地址**: https://db86eabf.hydrate-move.pages.dev
- **目标自定义域名**: https://hydrate-move.lightyearai.info

### Step 1: Cloudflare Dashboard Configuration
1. Visit https://dash.cloudflare.com
2. Login to your account
3. Click **Pages** in the left menu
4. Find **hydrate-move** project
5. Click **Custom domains** tab
6. Click **Set up a custom domain**
7. Enter: `hydrate-move.lightyearai.info`
8. Click **Continue** and **Activate domain**

### Step 2: DNS Configuration
Login to your domain management backend and add DNS record for `lightyearai.info`:

```
Record Type: CNAME
Host Record: hydrate-move
Record Value: db86eabf.hydrate-move.pages.dev
TTL: Auto
```

> ⚠️ **Important**: Use the complete subdomain `db86eabf.hydrate-move.pages.dev` not just `hydrate-move.pages.dev`

### Step 3: Verify Configuration
Wait 5-10 minutes, then:

1. **Check DNS propagation**:
   ```bash
   nslookup hydrate-move.lightyearai.info
   ```

2. **Browser access**:
   https://hydrate-move.lightyearai.info

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Test locally with static server
- [ ] Verify all assets load correctly
- [ ] Check core functionality / 检查核心功能
- [ ] Test notifications and reminders
- [ ] Validate analytics configuration (if enabled)

### Post-Deployment
- [x] Project deployed to Cloudflare Pages
- [x] Domain corrected to lightyearai.info
- [ ] Custom domain configured in Cloudflare
- [ ] CNAME record added to domain DNS
- [ ] DNS propagation completed (5-30 minutes)
- [ ] Test access via custom domain
- [ ] Verify HTTPS certificate

## 🚨 Important Notes

### About Unregistered Domains
- ✅ Cloudflare Pages supports unregistered domains
- ⚠️ Access from China mainland may be unstable
- ⚠️ Recommend testing from different network environments

### Troubleshooting
If you encounter issues:
1. Check DNS records are correct
2. Confirm domain resolution has propagated
3. Clear browser cache and DNS cache
4. Contact domain provider support for DNS configuration help

## 🎯 Final Access URLs
- **Temporary URL**: https://db86eabf.hydrate-move.pages.dev
- **Custom Domain**: https://hydrate-move.lightyearai.info (after configuration)

## 🔧 Alternative Deployment Options

### GitHub Pages
1. Fork or clone the repository
2. Push changes to the `main` branch
3. Go to repository Settings → Pages
4. Select source: "Deploy from a branch"
5. Choose branch: `main` and folder: `/ (root)`
6. Access at: `https://yourusername.github.io/hydrate-move/`

### Netlify
1. Connect your GitHub repository
2. Set build command: (leave empty for static site)
3. Set publish directory: `/` (root)
4. Deploy automatically on push

### Vercel
1. Import project from GitHub
2. Framework preset: Other
3. Build command: (leave empty)
4. Output directory: `./`
5. Deploy

## 📱 Browser Compatibility / 浏览器兼容性
- Ensure cross-browser functionality / 确保跨浏览器功能
- Test responsive design on mobile devices / 测试移动设备响应式设计
- Verify notification permissions / 验证通知权限
- Check timer accuracy across browsers / 检查定时器在各浏览器的准确性

Start configuring your custom domain now!