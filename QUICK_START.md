# Quick Start Guide

Get the Meme Coin Aggregator Service up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Redis running (or use Docker)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Redis

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 6379:6379 redis:latest
```

**Option B: Using System Package Manager**
```bash
# macOS
brew install redis && brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server && sudo systemctl start redis
```

## Step 3: Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development).

## Step 4: Build and Run

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

## Step 5: Test the Service

1. **Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Get Tokens:**
   ```bash
   curl http://localhost:3000/api/tokens
   ```

3. **Test WebSocket:**
   - Open `test-websocket.html` in your browser
   - Or use the Postman collection for WebSocket testing

## Common Issues

### Redis Connection Error
- Ensure Redis is running: `redis-cli ping`
- Check Redis host/port in `.env`

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000

### API Rate Limits
- The service handles rate limits automatically
- If you see warnings, increase `UPDATE_INTERVAL` in `.env`

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Import `postman_collection.json` into Postman/Insomnia
- Run tests: `npm test`

## API Examples

### Search Tokens
```bash
curl "http://localhost:3000/api/tokens?q=SOL&limit=10"
```

### Filter by Volume
```bash
curl "http://localhost:3000/api/tokens?minVolume=1000&sortField=volume&sortOrder=desc"
```

### Get Token by Address
```bash
curl "http://localhost:3000/api/tokens/576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y"
```

## WebSocket Example (JavaScript)

```javascript
const socket = io('http://localhost:3000');

socket.on('tokens:initial', (data) => {
  console.log('Initial tokens:', data.tokens);
});

socket.on('tokens:update', (data) => {
  console.log('Updates:', data.updates);
});
```

That's it! You're ready to go! 🚀

