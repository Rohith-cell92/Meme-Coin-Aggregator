# Railway Deployment Checklist

## ✅ Pre-Deployment

- [x] Project configured for single-unit deployment
- [x] Backend serves frontend in production
- [x] Build scripts created
- [x] Railway configuration files added
- [x] Environment variables documented

## 📦 What's Been Configured

### 1. Build Configuration
- ✅ `railway.json` - Railway configuration
- ✅ `nixpacks.toml` - Build system configuration
- ✅ `Procfile` - Process configuration
- ✅ `.npmrc` - NPM settings

### 2. Package Scripts
- ✅ `npm run build` - Build backend
- ✅ `npm run build:frontend` - Build frontend
- ✅ `npm run build:all` - Build both (used by Railway)
- ✅ `npm start` - Start production server

### 3. Server Configuration
- ✅ Backend serves API at `/api/*`
- ✅ Backend serves frontend static files at `/`
- ✅ WebSocket works on same domain
- ✅ SPA routing support (all routes → index.html)

### 4. Frontend Configuration
- ✅ Vite configured for production build
- ✅ API calls use relative URLs in production
- ✅ WebSocket connects to same domain

## 🚀 Deployment Steps

### Step 1: Push to GitHub ✅

```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will auto-detect configuration

### Step 3: Add Redis Database

1. In Railway project dashboard
2. Click **"New"** → **"Database"** → **"Redis"**
3. Railway automatically configures:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_PASSWORD`

### Step 4: Set Environment Variables

In Railway **Variables** tab, add:

```
NODE_ENV=production
REDIS_USERNAME=default
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
LOG_LEVEL=info
```

**Note**: Railway auto-sets `PORT`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

### Step 5: Deploy

Railway automatically:
1. ✅ Installs dependencies
2. ✅ Builds backend (TypeScript)
3. ✅ Builds frontend (React)
4. ✅ Starts server
5. ✅ Provides public URL

## 🔍 Verify Deployment

### Check Build Logs
- Go to Railway dashboard
- Click on deployment
- Check build logs for errors

### Test Endpoints

**1. Health Check**
```bash
curl https://your-app.up.railway.app/api/health
```
Should return: `{"status":"ok","services":{"redis":"connected"}}`

**2. API Endpoint**
```bash
curl https://your-app.up.railway.app/api/tokens?limit=5
```
Should return token data

**3. Frontend**
Open in browser: `https://your-app.up.railway.app`
Should show React frontend

**4. WebSocket**
Open frontend and check connection status indicator
Should show "Live Updates" when connected

## 📋 Environment Variables Required

### Auto-configured by Railway:
- `RAILWAY_ENVIRONMENT` ← Railway sets this
- `PORT` ← Railway assigns this
- `REDIS_HOST` ← From Redis database
- `REDIS_PORT` ← From Redis database  
- `REDIS_PASSWORD` ← From Redis database

### Manually configure:
- `NODE_ENV=production`
- `REDIS_USERNAME=default`
- `REDIS_TTL=30`
- `UPDATE_INTERVAL=30`
- `WEBSOCKET_UPDATE_INTERVAL=5`
- `LOG_LEVEL=info`

## 🏗️ Build Process

Railway executes:
```bash
# 1. Install backend dependencies
npm install

# 2. Build backend
npm run build  # TypeScript → JavaScript in dist/

# 3. Install frontend dependencies & build
cd frontend && npm install && npm run build  # React → Static files in frontend/dist/

# 4. Start server
npm start  # node dist/index.js
```

## 📂 Folder Structure After Build

```
.
├── dist/                    # Built backend (JavaScript)
│   ├── index.js
│   ├── config/
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend/
│   └── dist/               # Built frontend (Static files)
│       ├── index.html
│       ├── assets/
│       └── ...
├── node_modules/
└── package.json
```

Server serves:
- `/api/*` → Backend API (from `dist/`)
- `/*` → Frontend (from `frontend/dist/`)

## 🔧 Troubleshooting

### Build Fails

**Issue**: "npm run build:frontend" fails

**Solution**:
- Check frontend dependencies
- Run locally: `cd frontend && npm install && npm run build`
- Check build logs in Railway

### Redis Connection Error

**Issue**: Health check shows Redis disconnected

**Solution**:
- Verify Redis database is created in Railway
- Check environment variables are set
- Restart the service

### Frontend 404 Errors

**Issue**: Frontend routes return 404

**Solution**:
- Verify `frontend/dist` folder exists after build
- Check server logs for static file serving
- Ensure `NODE_ENV=production`

### WebSocket Not Working

**Issue**: "Disconnected" status in frontend

**Solution**:
- Railway handles WebSocket automatically
- Check CORS is enabled in backend
- Verify frontend connects to correct domain

## 📊 Monitoring

### View Logs
```
Railway Dashboard → Your Service → Logs
```

### Check Metrics
```
Railway Dashboard → Your Service → Metrics
```

### Health Endpoint
```bash
watch -n 5 curl https://your-app.up.railway.app/api/health
```

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Railway auto-deploys
```

## ⚙️ Configuration Files Explained

### `railway.json`
Railway-specific configuration
- Build command: `npm run build:all`
- Start command: `npm start`

### `nixpacks.toml`
Nixpacks build system configuration
- Node.js version
- Build phases
- Start command

### `Procfile`
Alternative process configuration
- Backup if Railway doesn't detect automatically

### `.npmrc`
NPM configuration
- Disables engine-strict for compatibility
- Enables legacy-peer-deps

## 🎯 Success Criteria

✅ Build completes without errors
✅ Health endpoint returns 200 OK
✅ Redis shows as connected
✅ API returns token data
✅ Frontend loads and displays
✅ WebSocket connects successfully
✅ Filtering and sorting work
✅ Real-time updates function

## 📝 Notes

- **Single Service**: Backend and frontend deploy together
- **Zero Config Redis**: Railway handles Redis setup
- **Auto HTTPS**: Railway provides SSL certificate
- **Custom Domain**: Can add custom domain in Railway
- **Environment Separation**: Use branches for staging/production

## 🚀 You're Ready to Deploy!

All configuration is complete. Follow the deployment steps above to launch your app on Railway.

**Estimated deployment time**: 5-10 minutes

**Your app will be live at**: `https://your-app-name.up.railway.app`

