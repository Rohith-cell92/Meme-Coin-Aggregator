# API Endpoints Documentation

Complete list of all endpoints for Postman/Insomnia testing.

**Base URL**: `http://localhost:3000`

---

## 1. Health Check

### GET `/api/health`

Check the service health status.

**Request:**
```
GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-19T16:15:36.962Z",
  "services": {
    "redis": "connected",
    "websocket": {
      "connected": 0,
      "status": "running"
    }
  }
}
```

**Status Codes:**
- `200` - Service is healthy
- `503` - Service is unhealthy

---

## 2. Root Endpoint

### GET `/`

Get API information.

**Request:**
```
GET http://localhost:3000/
```

**Response:**
```json
{
  "message": "Meme Coin Aggregator API",
  "version": "1.0.0",
  "endpoints": {
    "tokens": "/api/tokens",
    "health": "/api/health",
    "websocket": "ws://localhost:3000"
  }
}
```

---

## 3. Get All Tokens

### GET `/api/tokens`

Get paginated list of tokens with optional filters and sorting.

**Request:**
```
GET http://localhost:3000/api/tokens
```

**Query Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `limit` | number | No | Number of results (max: 100) | `20` |
| `cursor` | string | No | Pagination cursor | `base64-cursor` |
| `sortField` | string | No | Sort field | `volume`, `price_change`, `market_cap`, `liquidity`, `transaction_count` |
| `sortOrder` | string | No | Sort order | `asc` or `desc` |
| `q` | string | No | Search query | `BONK`, `PEPE` |
| `timePeriod` | string | No | Time period filter | `1h`, `24h`, `7d` |
| `minVolume` | number | No | Minimum volume | `1000` |
| `minLiquidity` | number | No | Minimum liquidity | `500` |
| `protocol` | string | No | Protocol filter | `Raydium`, `Uniswap` |
| `chain` | string | No | Chain filter | `solana`, `ethereum`, `bsc`, `polygon` |

**Response:**
```json
{
  "data": [
    {
      "token_address": "0x123...",
      "token_name": "Example Token",
      "token_ticker": "EXMP",
      "chain": "solana",
      "chain_id": "solana",
      "price_sol": 0.001,
      "price_usd": 0.1,
      "market_cap_sol": 1000,
      "market_cap_usd": 100000,
      "volume_sol": 500,
      "volume_usd": 50000,
      "liquidity_sol": 200,
      "liquidity_usd": 20000,
      "transaction_count": 150,
      "price_1hr_change": 5.2,
      "price_24hr_change": 12.5,
      "price_7d_change": 0,
      "protocol": "Raydium",
      "source": "dexscreener",
      "last_updated": "2024-11-19T16:15:36.962Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "nextCursor": "MjA=",
    "total": 150
  },
  "filters": {
    "timePeriod": "24h",
    "minVolume": 1000
  },
  "sort": {
    "field": "volume",
    "order": "desc"
  },
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

## 4. Search Tokens

### GET `/api/tokens?q={query}`

Search tokens by name or symbol.

**Request:**
```
GET http://localhost:3000/api/tokens?q=BONK
```

**Response:** Same as Get All Tokens

**Examples:**
```
GET /api/tokens?q=SOL
GET /api/tokens?q=DOGE
GET /api/tokens?q=PEPE&limit=10
```

---

## 5. Filter by Time Period

### GET `/api/tokens?timePeriod={period}`

Filter tokens by price change time period.

**Request:**
```
GET http://localhost:3000/api/tokens?timePeriod=24h
```

**Valid periods:** `1h`, `24h`, `7d`

**Examples:**
```
GET /api/tokens?timePeriod=1h
GET /api/tokens?timePeriod=24h&sortField=price_change&sortOrder=desc
GET /api/tokens?timePeriod=7d&limit=50
```

---

## 6. Filter by Volume and Liquidity

### GET `/api/tokens?minVolume={value}&minLiquidity={value}`

Filter tokens by minimum volume and liquidity.

**Request:**
```
GET http://localhost:3000/api/tokens?minVolume=1000&minLiquidity=500
```

**Examples:**
```
GET /api/tokens?minVolume=5000
GET /api/tokens?minLiquidity=1000
GET /api/tokens?minVolume=1000&minLiquidity=500&sortField=volume
```

---

## 7. Filter by Chain

### GET `/api/tokens?chain={chain}`

Filter tokens by blockchain.

**Request:**
```
GET http://localhost:3000/api/tokens?chain=ethereum
```

**Valid chains:**
- `solana`
- `ethereum`
- `bsc`
- `polygon`
- `avalanche`
- `arbitrum`
- `optimism`
- `fantom`

**Examples:**
```
GET /api/tokens?chain=solana
GET /api/tokens?chain=ethereum&minVolume=10000
GET /api/tokens?chain=bsc&sortField=market_cap&sortOrder=desc
```

---

## 8. Sort Tokens

### GET `/api/tokens?sortField={field}&sortOrder={order}`

Sort tokens by various metrics.

**Request:**
```
GET http://localhost:3000/api/tokens?sortField=volume&sortOrder=desc
```

**Sort Fields:**
- `volume` - Trading volume
- `price_change` - Price change percentage
- `market_cap` - Market capitalization
- `liquidity` - Liquidity
- `transaction_count` - Number of transactions

**Sort Orders:**
- `asc` - Ascending
- `desc` - Descending (default)

**Examples:**
```
GET /api/tokens?sortField=volume&sortOrder=desc
GET /api/tokens?sortField=price_change&sortOrder=desc&timePeriod=24h
GET /api/tokens?sortField=market_cap&sortOrder=asc
GET /api/tokens?sortField=transaction_count&sortOrder=desc&limit=30
```

---

## 9. Pagination

### GET `/api/tokens?limit={limit}&cursor={cursor}`

Paginate through large token lists.

**Request:**
```
GET http://localhost:3000/api/tokens?limit=20
```

**Next Page:**
```
GET http://localhost:3000/api/tokens?limit=20&cursor={nextCursor}
```

**Examples:**
```
GET /api/tokens?limit=10
GET /api/tokens?limit=50
GET /api/tokens?limit=20&cursor=MjA=
```

**Notes:**
- Max limit: 100
- Use `nextCursor` from previous response for next page
- `nextCursor` is `null` when no more results

---

## 10. Complex Query Examples

### Combined Filters and Sorting

**Example 1: High Volume Ethereum Tokens**
```
GET /api/tokens?chain=ethereum&minVolume=50000&sortField=volume&sortOrder=desc&limit=20
```

**Example 2: 24h Gainers on Solana**
```
GET /api/tokens?chain=solana&timePeriod=24h&sortField=price_change&sortOrder=desc&limit=30
```

**Example 3: Search BONK with Filters**
```
GET /api/tokens?q=BONK&minVolume=1000&sortField=volume&sortOrder=desc
```

**Example 4: BSC Tokens by Market Cap**
```
GET /api/tokens?chain=bsc&sortField=market_cap&sortOrder=desc&limit=50
```

**Example 5: High Liquidity Tokens**
```
GET /api/tokens?minLiquidity=10000&sortField=liquidity&sortOrder=desc&timePeriod=24h
```

---

## 11. Get Token by Address

### GET `/api/tokens/:address`

Get specific token by its address.

**Request:**
```
GET http://localhost:3000/api/tokens/576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y
```

**Response:**
```json
{
  "data": {
    "token_address": "576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y",
    "token_name": "PIPE CTO",
    "token_ticker": "PIPE",
    "chain": "solana",
    "price_sol": 0.0000004414,
    "price_usd": 0.04414,
    "market_cap_sol": 441.41,
    "volume_sol": 1322.43,
    "liquidity_sol": 149.36,
    "transaction_count": 2205,
    "price_1hr_change": 120.61,
    "protocol": "Raydium CLMM",
    "source": "dexscreener"
  },
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

**Status Codes:**
- `200` - Token found
- `404` - Token not found
- `500` - Internal server error

---

## 12. WebSocket Connection

### WS `ws://localhost:3000`

Connect to WebSocket for real-time updates.

**Connection:**
```javascript
const socket = io('http://localhost:3000');
```

**Events to Listen:**

#### `tokens:initial`
Received when client connects.
```javascript
socket.on('tokens:initial', (data) => {
  console.log(data.tokens); // Array of tokens
});
```

**Data Structure:**
```json
{
  "tokens": [ /* array of tokens */ ],
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

#### `tokens:update`
Received periodically with updates.
```javascript
socket.on('tokens:update', (data) => {
  console.log(data.updates); // Array of updates
});
```

**Data Structure:**
```json
{
  "updates": [
    {
      "token_address": "0x123...",
      "price_sol": 0.001,
      "volume_sol": 500,
      "market_cap_sol": 1000,
      "price_1hr_change": 5.2,
      "price_24hr_change": 12.5,
      "transaction_count": 150,
      "timestamp": "2024-11-19T16:15:36.962Z"
    }
  ],
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

#### `error`
Error notifications.
```javascript
socket.on('error', (error) => {
  console.error(error);
});
```

**Events to Emit:**

#### `subscribe`
Subscribe with filters (optional).
```javascript
socket.emit('subscribe', { 
  filters: { 
    minVolume: 1000,
    chain: 'ethereum'
  } 
});
```

---

## Quick Testing Guide

### 1. Test Basic Functionality
```bash
# Health check
curl http://localhost:3000/api/health

# Get tokens
curl http://localhost:3000/api/tokens?limit=5

# Search
curl "http://localhost:3000/api/tokens?q=BONK"
```

### 2. Test Filtering
```bash
# Time period
curl "http://localhost:3000/api/tokens?timePeriod=24h&limit=10"

# Volume
curl "http://localhost:3000/api/tokens?minVolume=1000&limit=10"

# Chain
curl "http://localhost:3000/api/tokens?chain=ethereum&limit=10"
```

### 3. Test Sorting
```bash
# By volume
curl "http://localhost:3000/api/tokens?sortField=volume&sortOrder=desc&limit=10"

# By price change
curl "http://localhost:3000/api/tokens?sortField=price_change&sortOrder=desc&limit=10"
```

### 4. Test Complex Queries
```bash
# Combined filters
curl "http://localhost:3000/api/tokens?chain=solana&timePeriod=24h&minVolume=1000&sortField=volume&sortOrder=desc&limit=20"
```

---

## Rate Limiting

- No authentication required
- Rate limit: 100 requests per minute per IP
- Rate limit header: `X-RateLimit-*`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid query parameters"
}
```

### 404 Not Found
```json
{
  "error": "Token not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

### 503 Service Unavailable
```json
{
  "status": "error",
  "error": "Service temporarily unavailable",
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

---

## Postman Collection

Import the `postman_collection.json` file included in the project for pre-configured requests.

**Collection includes:**
- Health check
- Get all tokens
- Search tokens
- Filter by time period
- Filter by volume/liquidity
- Filter by chain
- Sort tokens
- Pagination
- Get token by address
- Complex queries

---

## Testing Tips

1. **Start with health check** to ensure service is running
2. **Use small limits** (5-10) for initial testing
3. **Test pagination** with small limits to verify cursor works
4. **Combine filters** to test complex scenarios
5. **Check response times** - should be fast with caching
6. **Test WebSocket** using browser console or Socket.io client

---

## Support

For issues or questions:
- Check logs for errors
- Verify Redis connection
- Check rate limits
- Review API documentation in README.md

