# 🚂 Railway Deployment - Quick Start

## ✅ Ready to Deploy!

Your project is **fully configured** for Railway deployment as a **single unit** (backend + frontend together).

---

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to **https://railway.app**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway auto-detects configuration ✅

### Step 3: Add Redis & Configure

1. In Railway project, click **"New"** → **"Database"** → **"Redis"**
2. Go to your service → **"Variables"** tab
3. Add these variables:
   ```
   NODE_ENV=production
   REDIS_USERNAME=default
   REDIS_TTL=30
   UPDATE_INTERVAL=30
   WEBSOCKET_UPDATE_INTERVAL=5
   LOG_LEVEL=info
   ```
4. Done! 🎉

---

## 🔧 What Happens on Railway

Railway automatically:
1. ✅ Installs all dependencies
2. ✅ Builds backend (TypeScript → JavaScript)
3. ✅ Builds frontend (React → Static files)
4. ✅ Starts production server
5. ✅ Provides public URL

---

## 🌐 Access Your App

After deployment (5-10 minutes):

| What | URL |
|------|-----|
| **Frontend** | `https://your-app.up.railway.app/` |
| **API** | `https://your-app.up.railway.app/api/tokens` |
| **Health Check** | `https://your-app.up.railway.app/api/health` |
| **WebSocket** | `wss://your-app.up.railway.app` |

---

## ✅ Verify Deployment

### 1. Check Health
```bash
curl https://your-app.up.railway.app/api/health
```
Expected:
```json
{
  "status": "ok",
  "services": {
    "redis": "connected"
  }
}
```

### 2. Test API
```bash
curl https://your-app.up.railway.app/api/tokens?limit=5
```
Should return token data.

### 3. Open Frontend
Visit: `https://your-app.up.railway.app`

Should see the meme coin aggregator UI.

---

## 📦 Configuration Files Created

| File | Purpose |
|------|---------|
| `railway.json` | Railway configuration |
| `nixpacks.toml` | Build system config |
| `Procfile` | Process config |
| `.npmrc` | NPM settings |
| `RAILWAY_DEPLOYMENT.md` | Full deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |

---

## 🏗️ How It Works

### Build Process
```bash
npm install              # Install backend dependencies
npm run build           # Build backend (TypeScript → dist/)
cd frontend             # Go to frontend
npm install             # Install frontend dependencies
npm run build           # Build frontend (React → dist/)
```

### Runtime
- Server runs from `dist/index.js`
- Serves API at `/api/*`
- Serves frontend static files at `/`
- WebSocket works on same domain
- All routes → `index.html` (SPA support)

### Architecture
```
Railway Domain
    ↓
Your App Server (Port from Railway)
    ├── /api/*          → Backend API
    ├── /socket.io/*    → WebSocket
    └── /*              → Frontend (React)
```

---

## 🔒 Environment Variables

### Auto-configured by Railway:
- `PORT` - Assigned by Railway
- `REDIS_HOST` - From Redis database
- `REDIS_PORT` - From Redis database
- `REDIS_PASSWORD` - From Redis database

### You need to add:
- `NODE_ENV=production`
- `REDIS_USERNAME=default`
- `REDIS_TTL=30`
- `UPDATE_INTERVAL=30`
- `WEBSOCKET_UPDATE_INTERVAL=5`
- `LOG_LEVEL=info`

---

## 🔄 Continuous Deployment

After initial deployment, Railway auto-deploys on every push:

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

## 🐛 Troubleshooting

### Build Fails
**Solution**: Check Railway build logs
- Dashboard → Your Service → Deployments → Click failed deployment

### Redis Connection Error
**Solution**: Verify Redis database is added
- Dashboard → Check Redis service exists
- Variables tab → Check REDIS_* variables are set

### Frontend 404
**Solution**: Verify build completed
- Check build logs for `dist/index.html` creation
- Ensure `NODE_ENV=production` is set

### WebSocket Not Working
**Solution**: Railway handles WebSocket automatically
- Check frontend is using relative URL for API
- Verify CORS is enabled in backend

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

### External Monitoring
Use UptimeRobot or similar to ping:
```
https://your-app.up.railway.app/api/health
```

---

## 💰 Cost

**Railway Free Tier:**
- $5/month free credit
- Perfect for development/testing
- Auto-sleeps after inactivity (wakes on request)

**Usage:**
- This app uses minimal resources
- Redis included in free tier
- Should stay within free credits

---

## 🎯 Success Checklist

After deployment:

- [ ] Public URL is accessible
- [ ] Health endpoint returns OK
- [ ] Redis shows as connected
- [ ] API returns token data
- [ ] Frontend loads correctly
- [ ] WebSocket connects (see status indicator)
- [ ] Filtering works
- [ ] Sorting works
- [ ] Real-time updates work
- [ ] No errors in logs

---

## 📚 Documentation

| File | Description |
|------|-------------|
| `RAILWAY_DEPLOYMENT.md` | Complete deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `RAILWAY_QUICK_START.md` | This file (quick start) |
| `README.md` | Project documentation |
| `API_ENDPOINTS.md` | API documentation |

---

## 🎉 That's It!

Your app is **ready to deploy** on Railway!

**Deployment time**: 5-10 minutes
**Your app will be live at**: `https://your-app.up.railway.app`

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Issues**: Open issue on GitHub
- **Railway Templates**: https://railway.app/templates

---

## 🔥 Pro Tips

1. **Custom Domain**: Add in Railway settings after deployment
2. **Environment Branches**: Use different branches for staging/production
3. **Monitoring**: Set up UptimeRobot for health checks
4. **Logs**: Use Railway's log streaming for debugging
5. **Scaling**: Railway auto-scales based on usage

---

**Happy Deploying! 🚀**

