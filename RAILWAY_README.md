# 🚂 Railway Deployment - Complete Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [What's Configured](#whats-configured)
3. [Deployment Steps](#deployment-steps)
4. [Environment Variables](#environment-variables)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Documentation Index](#documentation-index)

---

## 🚀 Quick Start

Your meme coin aggregator is **100% ready** for Railway deployment as a single unit.

### 3-Step Deployment (5 minutes)

```bash
# 1. Push to GitHub (2 min)
git init
git add .
git commit -m "Ready for Railway"
git push origin main

# 2. Deploy on Railway (1 min)
# Visit https://railway.app
# Click "New Project" → "Deploy from GitHub repo"

# 3. Configure (2 min)
# Add Redis database
# Set environment variables (see .env.production)
```

**Done! Your app will be live at:** `https://your-app.up.railway.app`

---

## ✅ What's Configured

### Build System
- ✅ **Backend**: TypeScript compiled to JavaScript
- ✅ **Frontend**: React built to optimized static files
- ✅ **Single Server**: Backend serves frontend in production
- ✅ **Railway Config**: `railway.json`, `nixpacks.toml`, `Procfile`

### Features
- ✅ **Data Aggregation**: DexScreener, Jupiter, GeckoTerminal APIs
- ✅ **Real-time Updates**: WebSocket support
- ✅ **Filtering & Sorting**: Time periods, volume, market cap, etc.
- ✅ **Caching**: Redis integration (auto-configured by Railway)
- ✅ **Rate Limiting**: Exponential backoff for API calls
- ✅ **Multi-chain**: All blockchain networks supported
- ✅ **SPA Routing**: Frontend routing works correctly
- ✅ **Auto HTTPS**: Railway provides SSL certificate

### Project Structure
```
Server (Railway Port)
    ├── /api/*          → Backend API
    ├── /socket.io/*    → WebSocket
    └── /*              → Frontend (React)
```

---

## 📝 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Meme coin aggregator - Railway deployment ready"

# Set main branch
git branch -M main

# Add remote
git remote add origin https://github.com/yourusername/your-repo.git

# Push
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will auto-detect the configuration ✅

### Step 3: Add Redis Database

1. In your Railway project dashboard
2. Click **"New"**
3. Select **"Database"** → **"Redis"**
4. Railway automatically sets:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_PASSWORD`

### Step 4: Set Environment Variables

Go to your service → **"Variables"** tab

Add these variables:

```env
NODE_ENV=production
REDIS_USERNAME=default
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
LOG_LEVEL=info
```

### Step 5: Deploy

Railway automatically:
1. Installs dependencies
2. Builds backend (TypeScript)
3. Builds frontend (React)
4. Starts server
5. Provides public URL

**Deployment time:** 5-10 minutes

---

## 🔐 Environment Variables

### Auto-configured by Railway:
| Variable | Source | Description |
|----------|--------|-------------|
| `PORT` | Railway | Server port |
| `REDIS_HOST` | Railway Redis | Redis hostname |
| `REDIS_PORT` | Railway Redis | Redis port |
| `REDIS_PASSWORD` | Railway Redis | Redis password |
| `RAILWAY_ENVIRONMENT` | Railway | Environment name |

### You need to add:
| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `REDIS_USERNAME` | `default` | Redis username |
| `REDIS_TTL` | `30` | Cache TTL (seconds) |
| `UPDATE_INTERVAL` | `30` | Data update interval (seconds) |
| `WEBSOCKET_UPDATE_INTERVAL` | `5` | WebSocket update interval (seconds) |
| `LOG_LEVEL` | `info` | Logging level |

---

## ✅ Verification

### 1. Check Health Endpoint

```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "redis": "connected"
  }
}
```

### 2. Test API

```bash
curl https://your-app.up.railway.app/api/tokens?limit=5
```

Should return array of token data.

### 3. Test Frontend

Open in browser:
```
https://your-app.up.railway.app
```

Should see the React UI with search, filters, and token list.

### 4. Check WebSocket

Open the frontend and check the status indicator in the top-right.
Should show **"Live Updates"** when connected.

### 5. View Logs

In Railway dashboard:
- Click on your service
- Go to **"Logs"** tab
- Check for errors

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** Deployment fails during build

**Solution:**
1. Check Railway build logs
2. Verify `package.json` scripts are correct
3. Ensure dependencies are properly listed
4. Check for TypeScript errors

### Redis Connection Error

**Problem:** Health check shows Redis disconnected

**Solution:**
1. Verify Redis database is created in Railway
2. Check environment variables (`REDIS_*`)
3. Ensure `REDIS_USERNAME=default` is set
4. Restart the service

### Frontend 404 Errors

**Problem:** Frontend routes return 404

**Solution:**
1. Verify `frontend/dist/index.html` exists after build
2. Check `NODE_ENV=production` is set
3. Check server logs for static file serving
4. Verify build completed successfully

### WebSocket Not Connecting

**Problem:** "Disconnected" status in frontend

**Solution:**
1. Railway handles WebSocket automatically
2. Check CORS is enabled in backend
3. Verify frontend connects to correct domain
4. Check browser console for errors

### API Returns Empty Data

**Problem:** API endpoints return empty arrays

**Solution:**
1. Check external API connections (DexScreener, Jupiter, GeckoTerminal)
2. Verify API rate limits haven't been exceeded
3. Check backend logs for API errors
4. Test individual API clients

---

## 📊 Monitoring

### View Logs
```
Railway Dashboard → Your Service → Logs
```

### View Metrics
```
Railway Dashboard → Your Service → Metrics
```
- CPU usage
- Memory usage
- Network traffic

### External Monitoring

Set up **UptimeRobot** (free):
1. Go to https://uptimerobot.com
2. Add new monitor
3. URL: `https://your-app.up.railway.app/api/health`
4. Get alerts if service goes down

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Rebuilds app
# 3. Deploys new version
# 4. Zero downtime switch
```

---

## 💰 Cost

### Railway Free Tier
- **$5/month** free credit
- Perfect for development and testing
- Auto-sleeps after inactivity

### This Project
- **Low resource usage**
- Redis included in free tier
- Should stay within free credits

### Optimization
- Caching reduces API calls (already implemented)
- Adjust update intervals to reduce CPU usage
- Use Railway's sleep mode for hobby projects

---

## 🎯 Success Checklist

After deployment:

- [ ] App is accessible at Railway URL
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Redis shows as `"connected"`
- [ ] API returns token data
- [ ] Frontend loads and displays correctly
- [ ] WebSocket status shows "Live Updates"
- [ ] Search functionality works
- [ ] Filters work (time, chain, volume, etc.)
- [ ] Sorting works (volume, price, market cap)
- [ ] Pagination works (load more)
- [ ] Real-time updates function
- [ ] No errors in Railway logs
- [ ] External APIs are responding

---

## 📚 Documentation Index

### Start Here
- **START_HERE.md** - Main entry point (read first!)
- **RAILWAY_QUICK_START.md** - Quick deployment guide

### Deployment
- **RAILWAY_DEPLOYMENT.md** - Detailed deployment guide
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist
- **WHAT_WAS_CHANGED.md** - Summary of changes made

### API & Testing
- **API_ENDPOINTS.md** - Complete API documentation
- **POSTMAN_QUICK_REFERENCE.md** - Postman collection guide
- **postman_collection.json** - Postman collection file

### Configuration
- **.env.production** - Environment variables template
- **railway.json** - Railway configuration
- **nixpacks.toml** - Build system configuration
- **Procfile** - Process configuration

### Project Info
- **README.md** - Main project README
- **PROJECT_SUMMARY.md** - Project summary
- **REQUIREMENTS.md** - Original requirements
- **CORE_FEATURES_CHECKLIST.md** - Feature checklist

---

## 🆘 Support

### Railway
- **Documentation**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Templates**: https://railway.app/templates
- **Status**: https://status.railway.app

### Project
- **GitHub Issues**: Open issue on your repository
- **Documentation**: All `.md` files in this project

---

## 🎉 You're Ready!

Everything is configured and ready to deploy.

**Next Action:** Follow the [3-Step Deployment](#quick-start) above!

**Questions?** Check the [Documentation Index](#documentation-index) for detailed guides.

---

**Happy Deploying! 🚀**

Your app will be live at: `https://your-app.up.railway.app`

---

## 📝 Notes

- **Single Service**: Backend and frontend deployed together
- **Auto-scaling**: Railway scales based on usage
- **Zero-config**: Redis automatically configured
- **HTTPS**: Automatic SSL certificate
- **Custom Domain**: Can be added in Railway settings
- **Environment Separation**: Use branches for staging/production

---

**Built with:** Node.js, TypeScript, Express, React, Socket.io, Redis, Vite

**Deployed to:** Railway

**Deployment Type:** Single-unit (Backend + Frontend)

