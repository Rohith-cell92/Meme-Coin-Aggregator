# Meme Coin Aggregator Service

A real-time data aggregation service that fetches and merges meme coin data from multiple DEX (Decentralized Exchange) sources with efficient caching and WebSocket support for live updates.

## 🚀 Features

- **Multi-Source Aggregation**: Fetches token data from DexScreener, Jupiter, and GeckoTerminal APIs
- **Intelligent Merging**: Automatically merges duplicate tokens from different sources
- **Real-Time Updates**: WebSocket support for live price and volume updates
- **Efficient Caching**: Redis-based caching with configurable TTL (default: 30 seconds)
- **Rate Limiting**: Built-in rate limiting with exponential backoff for API calls
- **Filtering & Sorting**: Support for filtering by time periods, volume, liquidity, and sorting by various metrics
- **Cursor-Based Pagination**: Efficient pagination for large token lists
- **Background Updates**: Scheduled jobs for periodic data refresh

## 📋 Prerequisites

- Node.js (v18 or higher)
- Redis (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meme-coin-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=30
```

4. Start Redis (if not already running):
```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or using your system's package manager
# macOS: brew install redis && brew services start redis
# Ubuntu: sudo apt-get install redis-server && sudo systemctl start redis
```

## 🏃 Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The service will be available at `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns the health status of the service and connected services (Redis, WebSocket).

### Get Tokens
```
GET /api/tokens
```

**Query Parameters:**
- `q` (string, optional): Search query for token name or symbol
- `timePeriod` (string, optional): Filter by time period (`1h`, `24h`, `7d`)
- `minVolume` (number, optional): Minimum volume filter
- `minLiquidity` (number, optional): Minimum liquidity filter
- `protocol` (string, optional): Filter by protocol (e.g., "Raydium", "Orca")
- `sortField` (string, optional): Sort field (`volume`, `price_change`, `market_cap`, `liquidity`, `transaction_count`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)
- `limit` (number, optional): Number of results per page (default: 20, max: 100)
- `cursor` (string, optional): Pagination cursor from previous response

**Example:**
```bash
GET /api/tokens?q=SOL&timePeriod=24h&minVolume=1000&sortField=volume&sortOrder=desc&limit=20
```

### Get Token by Address
```
GET /api/tokens/:address
```

**Example:**
```bash
GET /api/tokens/576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y
```

## 🔌 WebSocket API

Connect to the WebSocket server for real-time updates:

```javascript
const socket = io('http://localhost:3000');

// Listen for initial token data
socket.on('tokens:initial', (data) => {
  console.log('Initial tokens:', data.tokens);
});

// Listen for token updates
socket.on('tokens:update', (data) => {
  console.log('Token updates:', data.updates);
});

// Subscribe with filters (optional)
socket.emit('subscribe', { filters: { minVolume: 1000 } });
```

### WebSocket Events

- `tokens:initial`: Emitted when a client connects, contains all current tokens
- `tokens:update`: Emitted periodically with token updates (price changes, volume spikes)
- `error`: Emitted when an error occurs

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Project Structure

```
src/
├── config/           # Configuration files
├── routes/           # Express routes
│   ├── tokens.ts     # Token endpoints
│   └── health.ts     # Health check endpoint
├── services/         # Business logic
│   ├── aggregator.ts # Token aggregation service
│   ├── cache.ts      # Redis cache service
│   ├── websocket.ts  # WebSocket service
│   ├── scheduler.ts  # Background job scheduler
│   └── api-clients/  # DEX API clients
│       ├── base-client.ts
│       ├── dexscreener-client.ts
│       ├── jupiter-client.ts
│       └── geckoterminal-client.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── logger.ts     # Winston logger
│   └── retry.ts      # Retry logic with exponential backoff
└── index.ts          # Application entry point
```

## 🏗️ Architecture & Design Decisions

### 1. **Multi-Source Aggregation**
- **Decision**: Fetch from multiple DEX APIs (DexScreener, Jupiter, GeckoTerminal)
- **Rationale**: Provides comprehensive coverage and redundancy. If one API fails, others can still provide data.
- **Implementation**: Parallel API calls with `Promise.allSettled()` to handle partial failures gracefully.

### 2. **Intelligent Token Merging**
- **Decision**: Merge tokens with the same address from different sources
- **Rationale**: Same token may appear on multiple DEXs with different data quality
- **Implementation**: Score-based merging that prefers sources with more complete data (volume, market cap, liquidity)

### 3. **Caching Strategy**
- **Decision**: Redis-based caching with 30-second TTL
- **Rationale**: Reduces API calls, improves response times, and respects rate limits
- **Implementation**: Cache keys based on query parameters, automatic invalidation on scheduled updates

### 4. **Rate Limiting & Retry Logic**
- **Decision**: Exponential backoff with configurable retry attempts
- **Rationale**: External APIs have rate limits (e.g., 300 req/min for DexScreener)
- **Implementation**: Request queue with rate limit tracking, automatic retry on 429/5xx errors

### 5. **WebSocket for Real-Time Updates**
- **Decision**: Socket.io for bidirectional communication
- **Rationale**: Avoids polling overhead, provides instant updates to clients
- **Implementation**: Periodic comparison of current vs. last known state, only broadcast significant changes (>1% price, >5% volume)

### 6. **Cursor-Based Pagination**
- **Decision**: Base64-encoded cursor instead of offset-based pagination
- **Rationale**: More efficient for large datasets, avoids issues with data changing during pagination
- **Implementation**: Cursor contains the next index, automatically generated and validated

### 7. **Background Scheduler**
- **Decision**: node-cron for periodic data updates
- **Rationale**: Keeps cache fresh without blocking API requests
- **Implementation**: Configurable interval (default: 30s), invalidates cache before fetching new data

### 8. **Error Handling**
- **Decision**: Graceful degradation - continue with partial data if some APIs fail
- **Rationale**: Service remains available even if one DEX API is down
- **Implementation**: Try-catch blocks, Promise.allSettled for parallel operations, comprehensive logging

## 🔒 Security Considerations

- **Helmet.js**: Security headers for Express
- **CORS**: Configurable CORS policy
- **Rate Limiting**: API-level rate limiting to prevent abuse
- **Input Validation**: Query parameter validation and sanitization
- **Error Messages**: Generic error messages to avoid information leakage

## 📊 Performance Optimizations

1. **Parallel API Calls**: Fetch from multiple sources simultaneously
2. **Redis Caching**: Reduces redundant API calls
3. **Selective Updates**: WebSocket only broadcasts significant changes
4. **Efficient Pagination**: Cursor-based pagination avoids full dataset scans
5. **Request Queue**: Manages rate limits without blocking

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
```

### Docker Deployment (Example)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Free Hosting Options

- **Render**: Supports Node.js and Redis
- **Railway**: Easy deployment with Redis addon
- **Fly.io**: Good for WebSocket support
- **Heroku**: Traditional option (may require paid tier for Redis)

## 📝 API Documentation

See `postman_collection.json` for a complete Postman/Insomnia collection with all endpoints and example requests.

## 🐛 Troubleshooting

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping`
- Check Redis host/port in `.env`
- Verify firewall rules allow Redis connections

### API Rate Limits
- Adjust `UPDATE_INTERVAL` to reduce update frequency
- Check individual API rate limits in config
- Monitor logs for rate limit warnings

### WebSocket Not Connecting
- Verify CORS settings allow your origin
- Check that Socket.io is properly initialized
- Ensure firewall allows WebSocket connections

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

**Note**: This service uses free/public APIs which may have rate limits. For production use with high traffic, consider:
- Using paid API tiers
- Implementing more aggressive caching
- Adding request queuing/batching
- Using a message queue (e.g., Bull) for background jobs

