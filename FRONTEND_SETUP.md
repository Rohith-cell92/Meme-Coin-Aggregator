# Frontend Setup & Running Guide

## ✅ Frontend Created Successfully!

A modern React frontend has been created with all the required features.

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
cd frontend
npm install
```

### 2. Start the Backend (if not running)
From the project root:
```bash
npm start
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## ✨ Features Implemented

### ✅ Filtering
- **Time Period**: Filter by 1h, 24h, 7d price changes
- **Min Volume**: Filter by minimum volume in SOL
- **Min Liquidity**: Filter by minimum liquidity in SOL
- **Protocol**: Filter by DEX protocol (Raydium, Orca, etc.)

### ✅ Sorting
- **Fields**: Volume, Price Change, Market Cap, Liquidity, Transactions
- **Order**: Ascending or Descending
- Real-time sorting updates

### ✅ Search
- Search tokens by name or symbol
- Debounced search (500ms delay)
- Instant results

### ✅ Real-time Updates
- WebSocket connection to backend
- Live price and volume updates
- Connection status indicator

### ✅ UI Features
- Modern gradient design
- Responsive layout (mobile & desktop)
- Smooth animations
- Token cards with all metrics
- Pagination support
- Loading states

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx       # Search functionality
│   │   ├── FilterPanel.tsx     # Filters & sorting UI
│   │   └── TokenList.tsx        # Token display
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.ts               # Vite configuration
└── tsconfig.json                # TypeScript config
```

## 🎨 UI Components

### SearchBar
- Text input with search icon
- Debounced search (500ms)
- Submit on Enter key

### FilterPanel
- Time period buttons (1h, 24h, 7d, All)
- Min volume input
- Min liquidity input
- Protocol filter
- Sort field dropdown
- Sort order buttons (Asc/Desc)

### TokenList
- Grid layout of token cards
- Each card shows:
  - Token name & ticker
  - Current price in SOL
  - 1h & 24h price changes (color-coded)
  - Volume, Market Cap, Liquidity
  - Transaction count
  - Token address (truncated)
  - Protocol badge
- Load more button for pagination
- Loading states

## 🔧 Configuration

### API URL
The frontend connects to the backend API. By default, it uses:
- Development: `http://localhost:3000` (via Vite proxy)
- Can be configured via `.env` file:
  ```env
  VITE_API_URL=http://localhost:3000
  ```

### WebSocket
WebSocket automatically connects to the same base URL for real-time updates.

## 🧪 Testing

1. **Start Backend**: `npm start` (from root)
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: http://localhost:5173
4. **Test Features**:
   - Search for tokens
   - Apply filters
   - Change sorting
   - Watch real-time updates
   - Load more tokens

## 📱 Responsive Design

The frontend is fully responsive:
- **Desktop**: Multi-column grid layout
- **Tablet**: 2-column grid
- **Mobile**: Single column, optimized for touch

## 🎯 Next Steps

1. ✅ Frontend is ready to use
2. Start both backend and frontend
3. Open http://localhost:5173
4. Test all filtering and sorting features
5. Watch real-time updates via WebSocket

## 🐛 Troubleshooting

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` in frontend directory
- Check Node.js version (18+)

### Can't connect to backend
- Ensure backend is running on port 3000
- Check `VITE_API_URL` in `.env` file
- Check browser console for errors

### WebSocket not connecting
- Ensure backend WebSocket is enabled
- Check CORS settings in backend
- Verify backend is accessible

### No tokens showing
- Check backend logs for errors
- Verify Redis connection
- Check API endpoint in browser network tab

## 📝 Notes

- The frontend uses Vite for fast development
- TypeScript for type safety
- React 18 with hooks
- Socket.io-client for WebSocket
- Axios for HTTP requests
- All styling is in CSS files (no external UI library)

