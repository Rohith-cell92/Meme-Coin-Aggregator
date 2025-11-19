# Railway Deployment Guide

## 🚀 Single-Unit Deployment (Backend + Frontend)

This project is configured to deploy as a single unit on Railway, with the backend serving the frontend static files.

---

## Prerequisites

1. GitHub account
2. Railway account (sign up at https://railway.app)
3. Redis database (Railway provides this)
4. Push your code to GitHub

---

## Deployment Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Meme Coin Aggregator"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Authorize GitHub** and select your repository
5. **Railway will auto-detect the configuration**

### Step 3: Add Redis Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Redis"**
3. Railway will create a Redis instance
4. Redis credentials will be automatically available as environment variables

### Step 4: Configure Environment Variables

Railway will automatically set:
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `PORT`

You may want to add:

```env
NODE_ENV=production
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
LOG_LEVEL=info
```

To add variables:
1. Click on your service
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add the variables above

### Step 5: Deploy

Railway will automatically:
1. Install backend dependencies
2. Install frontend dependencies
3. Build backend (TypeScript → JavaScript)
4. Build frontend (React → Static files)
5. Start the server

The backend will serve the frontend at the root URL.

---

## Build Process

Railway executes:
```bash
npm install                    # Install backend deps
npm run build                  # Build backend (TypeScript)
cd frontend && npm install     # Install frontend deps
cd frontend && npm run build   # Build frontend (Vite)
npm start                      # Start server
```

The server serves:
- API endpoints at `/api/*`
- Frontend at `/` (root and all other routes)

---

## Configuration Files

### `railway.json`
Railway-specific configuration for build and deploy commands.

### `nixpacks.toml`
Nixpacks configuration for Railway's build system.

### `Procfile`
Process configuration (backup for Railway).

### `.npmrc`
NPM configuration for compatibility.

---

## Environment Variables on Railway

Railway auto-configures:
```
RAILWAY_ENVIRONMENT=production
PORT=<assigned-port>
REDIS_HOST=<redis-host>
REDIS_PORT=<redis-port>
REDIS_PASSWORD=<redis-password>
```

Additional variables to set manually:
```
NODE_ENV=production
REDIS_USERNAME=default
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
LOG_LEVEL=info
```

---

## Accessing Your Deployment

After deployment:

1. **Get your URL**: Railway provides a public URL like `https://your-app.up.railway.app`
2. **Access frontend**: `https://your-app.up.railway.app/`
3. **Access API**: `https://your-app.up.railway.app/api/tokens`
4. **Health check**: `https://your-app.up.railway.app/api/health`
5. **WebSocket**: `wss://your-app.up.railway.app`

---

## How It Works

### Production Mode

1. Backend serves API at `/api/*`
2. Frontend static files served from `/frontend/dist`
3. All non-API routes serve `index.html` (SPA support)
4. WebSocket works on the same domain

### Request Flow

```
User Request
    ↓
Railway Domain (https://your-app.up.railway.app)
    ↓
    ├─ /api/* → Backend API
    ├─ /socket.io/* → WebSocket
    └─ /* → Frontend (React SPA)
```

---

## Troubleshooting

### Build Fails

**Check logs:**
- Go to Railway dashboard
- Click on your service
- Go to "Deployments" tab
- Click on the failed deployment
- Check the build logs

**Common issues:**
1. **Missing dependencies**: Ensure `package.json` is correct
2. **Build timeout**: Increase build timeout in Railway settings
3. **Memory issues**: Upgrade Railway plan if needed

### Redis Connection Issues

**Check Redis variables:**
```bash
# In Railway variables tab, verify:
REDIS_HOST=<should be set>
REDIS_PORT=<should be set>
REDIS_PASSWORD=<should be set>
REDIS_USERNAME=default
```

**Test connection:**
- Check health endpoint: `https://your-app.up.railway.app/api/health`
- Should show `"redis": "connected"`

### Frontend Not Loading

**Check build output:**
- Verify `frontend/dist` folder exists after build
- Check Railway build logs for frontend build errors

**Check environment:**
- Ensure `NODE_ENV=production` is set
- Check server logs for static file serving

### WebSocket Not Connecting

**Update frontend to use production URL:**
- WebSocket should connect to same domain as frontend
- Railway handles WebSocket proxying automatically

### API Errors

**Check API logs:**
- Go to Railway dashboard
- View deployment logs
- Check for errors in server startup or API calls

**Check external APIs:**
- Verify DexScreener, Jupiter, GeckoTerminal are accessible
- Check rate limits

---

## Monitoring

### View Logs
1. Go to Railway dashboard
2. Click on your service
3. Go to "Logs" tab
4. See real-time logs

### Metrics
1. Railway provides CPU, memory, and network metrics
2. View in the "Metrics" tab

### Health Monitoring
Set up external monitoring:
- UptimeRobot: https://uptimerobot.com
- Ping endpoint: `https://your-app.up.railway.app/api/health`

---

## Scaling

### Vertical Scaling
- Railway automatically scales based on usage
- Upgrade plan for more resources

### Horizontal Scaling
For multiple instances:
1. Add a shared Redis instance (already done)
2. Enable horizontal scaling in Railway
3. All instances share the same Redis cache

---

## CI/CD

Railway automatically deploys on push to main branch:
1. Push to GitHub
2. Railway detects changes
3. Builds and deploys automatically
4. Zero downtime deployment

---

## Cost Optimization

**Free Tier:**
- Railway offers $5/month free credit
- Good for development and testing

**Reduce Costs:**
1. **Optimize API calls**: Use caching (already implemented)
2. **Reduce update frequency**: Adjust `UPDATE_INTERVAL`
3. **Use Railway's sleep mode**: For hobby projects

---

## Environment-Specific Configurations

### Development
```bash
npm run dev           # Backend
npm run dev:frontend  # Frontend (separate process)
```

### Production (Railway)
```bash
npm run build:all     # Builds both
npm start            # Serves both
```

---

## Post-Deployment Checklist

- [ ] Service is deployed and running
- [ ] Public URL is accessible
- [ ] API endpoints return data
- [ ] Frontend loads correctly
- [ ] WebSocket connections work
- [ ] Redis is connected (check health endpoint)
- [ ] Environment variables are set
- [ ] Logs show no errors
- [ ] External API calls are working

---

## Updating the Deployment

```bash
# Make changes to code
git add .
git commit -m "Update description"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Rebuilds
# 3. Deploys
# 4. Switches traffic to new version
```

---

## Rollback

If deployment fails:
1. Go to Railway dashboard
2. Go to "Deployments" tab
3. Click on previous successful deployment
4. Click "Redeploy"

---

## Support

**Railway Documentation**: https://docs.railway.app
**Railway Discord**: https://discord.gg/railway
**Project Issues**: Open issue on GitHub

---

## Summary

✅ **Single command deployment** to Railway
✅ **Backend + Frontend** in one service
✅ **Auto-scaling** with Railway
✅ **Zero-config Redis** integration
✅ **Automatic HTTPS** and domain
✅ **CI/CD** on push to main
✅ **WebSocket** support included

Deploy and your app will be live at: `https://your-app.up.railway.app` 🚀

