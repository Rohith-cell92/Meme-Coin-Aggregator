# Requirements to Run the Project

## ✅ Current Status

**Project Status**: ✅ **RUNNING SUCCESSFULLY**

The service is currently running on `http://localhost:3000`

### Verified Working:
- ✅ Service starts successfully
- ✅ Health endpoint: `http://localhost:3000/api/health` (Status: 200)
- ✅ Root endpoint: `http://localhost:3000/` (Working)
- ✅ TypeScript compilation successful
- ✅ All dependencies installed
- ✅ Redis Cloud connected and working
- ✅ Token caching functional
- ✅ API endpoints returning data (30+ tokens available)

### Notes:
- ✅ Redis Cloud is configured and connected
- ✅ Tokens endpoint working (may take a few seconds on first request)
- ✅ All systems operational

## 📋 Required Components

### 1. **Node.js** ✅ INSTALLED
- **Version Required**: Node.js 18 or higher
- **Current Version**: v22.20.0 ✅
- **Installation**: 
  - Download from: https://nodejs.org/
  - Or use package manager: `choco install nodejs` (Windows)

### 2. **npm** ✅ INSTALLED
- **Version**: Comes with Node.js
- **Current Version**: 10.9.3 ✅

### 3. **Redis** ✅ CONFIGURED (Redis Cloud)
- **Status**: ✅ Connected to Redis Cloud
- **Connection**: `redis-17912.c212.ap-south-1-1.ec2.cloud.redislabs.com:17912`
- **Configuration**: Already set up in `.env` file
- **Installation Options** (if you need local Redis):

  **Option A: Docker (Recommended)**
  ```bash
  docker run -d -p 6379:6379 --name redis redis:latest
  ```

  **Option B: Windows Installation**
  - Download from: https://github.com/microsoftarchive/redis/releases
  - Or use WSL: `wsl --install` then `sudo apt-get install redis-server`
  - Or use Chocolatey: `choco install redis-64`

  **Option C: Redis Cloud (Free)**
  - Sign up at: https://redis.com/try-free/
  - Get connection string and update `.env` file

- **Verification**: 
  ```bash
  redis-cli ping
  # Should return: PONG
  ```

### 4. **Environment Variables** ✅ CREATED
- **File**: `.env` (created automatically)
- **Required Variables**:
  ```env
  PORT=3000
  NODE_ENV=development
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_TTL=30
  ```

## 🚀 Quick Start Commands

### Install Dependencies
```bash
npm install
```

### Build Project
```bash
npm run build
```

### Run in Development Mode
```bash
npm run dev
```

### Run in Production Mode
```bash
npm start
```

## 🔍 Verification Steps

1. **Check Node.js**: `node --version` (should be 18+)
2. **Check npm**: `npm --version`
3. **Check Redis**: `redis-cli ping` (should return PONG)
4. **Check Service**: `curl http://localhost:3000/api/health`
5. **Check Logs**: Look for "Server running on port 3000" in console

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module 'ioredis'"
**Solution**: Run `npm install`

### Issue: "Redis connection error"
**Solutions**:
- Ensure Redis is running: `redis-cli ping`
- Check Redis host/port in `.env`
- For Windows: Redis might be running on WSL, use `localhost` or WSL IP

### Issue: "Port 3000 already in use"
**Solutions**:
- Change PORT in `.env` to a different port (e.g., 3001)
- Or stop the process using port 3000:
  ```powershell
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <process_id> /F
  ```

### Issue: "API requests timing out"
**Solutions**:
- This is normal for first request (fetching from external APIs)
- Wait a few seconds and try again
- Check internet connection
- Some APIs may have rate limits

### Issue: "TypeScript compilation errors"
**Solution**: Run `npm run build` to see specific errors, then fix them

## 📝 Testing the Service

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Get Tokens
```bash
curl http://localhost:3000/api/tokens?limit=10
```

### 3. Test WebSocket
- Open `test-websocket.html` in your browser
- Or use a WebSocket client to connect to `ws://localhost:3000`

### 4. Run Tests
```bash
npm test
```

## 🌐 External API Requirements

The service uses these free APIs (no API keys required for basic usage):

1. **DexScreener API**
   - URL: `https://api.dexscreener.com`
   - Rate Limit: 300 requests/minute
   - Status: ✅ Working

2. **Jupiter API**
   - URL: `https://lite-api.jup.ag`
   - Rate Limit: ~100 requests/minute
   - Status: ✅ Working

3. **GeckoTerminal API** (Optional)
   - URL: `https://api.geckoterminal.com`
   - API Key: Optional (set `GECKOTERMINAL_API_KEY` in `.env` if needed)
   - Status: Works without API key for basic queries

**Note**: All APIs require internet connection. The service handles rate limiting automatically.

## 📊 System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 512MB (1GB recommended)
- **Disk Space**: ~200MB for node_modules
- **Internet**: Required for API calls
- **Ports**: 3000 (configurable) for the service, 6379 for Redis

## ✅ Pre-flight Checklist

Before running the service, ensure:

- [ ] Node.js 18+ installed
- [ ] npm installed (comes with Node.js)
- [ ] Redis running and accessible
- [ ] `.env` file exists with correct configuration
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] Port 3000 available (or change PORT in `.env`)
- [ ] Internet connection available

## 🎯 Current Project Status

✅ **All requirements met - Service is running!**

- Service URL: `http://localhost:3000`
- Health Status: Healthy
- Redis: Connected
- WebSocket: Running
- API Endpoints: Available

You can now:
1. Test the API using Postman collection
2. Open `test-websocket.html` for WebSocket testing
3. Make API calls to fetch token data
4. Deploy to a hosting platform (see DEPLOYMENT.md)

