# Meme Coin Aggregator - Frontend

Modern React frontend for the Meme Coin Aggregator service with real-time updates, filtering, and sorting.

## Features

- 🔍 **Search**: Search tokens by name or symbol
- 🎯 **Filtering**: Filter by time period (1h, 24h, 7d), volume, liquidity, and protocol
- 📊 **Sorting**: Sort by volume, price change, market cap, liquidity, or transaction count
- 🔄 **Real-time Updates**: WebSocket integration for live price and volume updates
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API requests to `http://localhost:3000`.

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## Usage

1. Start the backend service (from project root):
   ```bash
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## Features in Detail

### Filtering
- **Time Period**: Filter tokens by price change in 1h, 24h, or 7d
- **Min Volume**: Filter by minimum volume in SOL
- **Min Liquidity**: Filter by minimum liquidity in SOL
- **Protocol**: Filter by DEX protocol (e.g., Raydium, Orca)

### Sorting
- **Volume**: Sort by trading volume
- **Price Change**: Sort by price change percentage
- **Market Cap**: Sort by market capitalization
- **Liquidity**: Sort by liquidity
- **Transactions**: Sort by transaction count
- **Order**: Ascending or descending

### Real-time Updates
- WebSocket connection for live updates
- Automatic token price and volume updates
- Connection status indicator

