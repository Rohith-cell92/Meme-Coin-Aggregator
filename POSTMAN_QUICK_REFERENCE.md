# Postman Quick Reference Card

## Base URL
```
http://localhost:3000
```

---

## All Endpoints (Copy & Paste Ready)

### 1. Health Check
```
GET http://localhost:3000/api/health
```

### 2. API Info
```
GET http://localhost:3000/
```

### 3. Get All Tokens (Default)
```
GET http://localhost:3000/api/tokens
```

### 4. Get Tokens (Limited)
```
GET http://localhost:3000/api/tokens?limit=10
```

### 5. Search Tokens
```
GET http://localhost:3000/api/tokens?q=BONK
GET http://localhost:3000/api/tokens?q=PEPE
GET http://localhost:3000/api/tokens?q=DOGE
```

### 6. Filter by Time Period
```
GET http://localhost:3000/api/tokens?timePeriod=1h
GET http://localhost:3000/api/tokens?timePeriod=24h
GET http://localhost:3000/api/tokens?timePeriod=7d
```

### 7. Filter by Volume
```
GET http://localhost:3000/api/tokens?minVolume=1000
GET http://localhost:3000/api/tokens?minVolume=5000
GET http://localhost:3000/api/tokens?minVolume=10000
```

### 8. Filter by Liquidity
```
GET http://localhost:3000/api/tokens?minLiquidity=500
GET http://localhost:3000/api/tokens?minLiquidity=1000
GET http://localhost:3000/api/tokens?minLiquidity=5000
```

### 9. Filter by Chain
```
GET http://localhost:3000/api/tokens?chain=solana
GET http://localhost:3000/api/tokens?chain=ethereum
GET http://localhost:3000/api/tokens?chain=bsc
GET http://localhost:3000/api/tokens?chain=polygon
GET http://localhost:3000/api/tokens?chain=avalanche
GET http://localhost:3000/api/tokens?chain=arbitrum
GET http://localhost:3000/api/tokens?chain=optimism
```

### 10. Sort by Volume
```
GET http://localhost:3000/api/tokens?sortField=volume&sortOrder=desc
GET http://localhost:3000/api/tokens?sortField=volume&sortOrder=asc
```

### 11. Sort by Price Change
```
GET http://localhost:3000/api/tokens?sortField=price_change&sortOrder=desc
GET http://localhost:3000/api/tokens?sortField=price_change&sortOrder=asc
```

### 12. Sort by Market Cap
```
GET http://localhost:3000/api/tokens?sortField=market_cap&sortOrder=desc
GET http://localhost:3000/api/tokens?sortField=market_cap&sortOrder=asc
```

### 13. Sort by Liquidity
```
GET http://localhost:3000/api/tokens?sortField=liquidity&sortOrder=desc
```

### 14. Sort by Transactions
```
GET http://localhost:3000/api/tokens?sortField=transaction_count&sortOrder=desc
```

### 15. Pagination (First Page)
```
GET http://localhost:3000/api/tokens?limit=20
```

### 16. Pagination (Next Page)
```
GET http://localhost:3000/api/tokens?limit=20&cursor={nextCursor}
```
*Replace `{nextCursor}` with value from previous response*

### 17. Get Token by Address
```
GET http://localhost:3000/api/tokens/576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y
```

---

## Complex Queries

### 18. High Volume Ethereum Tokens
```
GET http://localhost:3000/api/tokens?chain=ethereum&minVolume=50000&sortField=volume&sortOrder=desc&limit=20
```

### 19. 24h Gainers on Solana
```
GET http://localhost:3000/api/tokens?chain=solana&timePeriod=24h&sortField=price_change&sortOrder=desc&limit=30
```

### 20. Search BONK with Filters
```
GET http://localhost:3000/api/tokens?q=BONK&minVolume=1000&sortField=volume&sortOrder=desc
```

### 21. BSC Tokens by Market Cap
```
GET http://localhost:3000/api/tokens?chain=bsc&sortField=market_cap&sortOrder=desc&limit=50
```

### 22. High Liquidity Tokens (24h)
```
GET http://localhost:3000/api/tokens?minLiquidity=10000&sortField=liquidity&sortOrder=desc&timePeriod=24h
```

### 23. 1h Gainers (All Chains)
```
GET http://localhost:3000/api/tokens?timePeriod=1h&sortField=price_change&sortOrder=desc&limit=50
```

### 24. Ethereum DeFi Tokens
```
GET http://localhost:3000/api/tokens?chain=ethereum&minVolume=100000&minLiquidity=50000&sortField=market_cap&sortOrder=desc
```

### 25. Active Solana Tokens
```
GET http://localhost:3000/api/tokens?chain=solana&sortField=transaction_count&sortOrder=desc&limit=30
```

---

## Curl Commands

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Tokens
```bash
curl http://localhost:3000/api/tokens?limit=5
```

### Search
```bash
curl "http://localhost:3000/api/tokens?q=BONK"
```

### Complex Query
```bash
curl "http://localhost:3000/api/tokens?chain=ethereum&minVolume=1000&sortField=volume&sortOrder=desc&limit=10"
```

---

## Query Parameters Reference

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `q` | string | `BONK` | Search query |
| `limit` | number | `20` | Results per page (max: 100) |
| `cursor` | string | `base64` | Pagination cursor |
| `sortField` | string | `volume` | Sort field |
| `sortOrder` | string | `desc` | Sort order (asc/desc) |
| `timePeriod` | string | `24h` | Time period (1h/24h/7d) |
| `minVolume` | number | `1000` | Minimum volume |
| `minLiquidity` | number | `500` | Minimum liquidity |
| `protocol` | string | `Raydium` | Protocol filter |
| `chain` | string | `ethereum` | Chain filter |

---

## Sort Fields

- `volume` - Trading volume
- `price_change` - Price change percentage
- `market_cap` - Market capitalization
- `liquidity` - Liquidity
- `transaction_count` - Number of transactions

---

## Chains

- `solana`
- `ethereum`
- `bsc`
- `polygon`
- `avalanche`
- `arbitrum`
- `optimism`
- `fantom`

---

## Expected Response Format

```json
{
  "data": [ /* array of tokens */ ],
  "pagination": {
    "limit": 20,
    "nextCursor": "MjA=",
    "total": 150
  },
  "filters": { /* applied filters */ },
  "sort": { /* sort options */ },
  "timestamp": "2024-11-19T16:15:36.962Z"
}
```

---

## Testing Sequence

1. ✅ Health Check → Verify service is running
2. ✅ Get All Tokens → Check basic functionality
3. ✅ Search → Test search with "BONK"
4. ✅ Filter by Chain → Test "ethereum"
5. ✅ Filter by Time → Test "24h"
6. ✅ Sort → Test "volume" descending
7. ✅ Pagination → Test with limit=10
8. ✅ Complex Query → Combine multiple filters
9. ✅ Token by Address → Get specific token
10. ✅ Multiple Rapid Calls → Test rate limiting

---

## Import to Postman

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Set variable `base_url` = `http://localhost:3000`
5. Start testing!

---

## WebSocket Testing

### Using Browser Console
```javascript
const socket = io('http://localhost:3000');
socket.on('tokens:initial', data => console.log('Initial:', data));
socket.on('tokens:update', data => console.log('Update:', data));
```

### Using Socket.io Client
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:3000');
```

---

## Status Codes

- `200` - Success
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable

---

## Tips

- Use `limit=5` for quick tests
- Test pagination with small limits
- Check `nextCursor` in response for next page
- Combine filters for complex queries
- Monitor response times (should be fast with caching)

