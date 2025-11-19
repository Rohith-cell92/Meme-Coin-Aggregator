# 🚀 Running Guide - Complete Setup

## ✅ Current Status

**Both services are running successfully!**

- ✅ **Backend**: Running on `http://localhost:3000`
- ✅ **Frontend**: Running on `http://localhost:5173`
- ✅ **Redis**: Connected to Redis Cloud
- ✅ **WebSocket**: Active and ready

## 🎯 Quick Access

### Frontend Application
**Open in your browser:**
```
http://localhost:5173
```

### Backend API
- Health Check: `http://localhost:3000/api/health`
- Tokens API: `http://localhost:3000/api/tokens`
- WebSocket: `ws://localhost:3000`

## 📋 Features Available

### ✅ Filtering (Implemented)
- **Time Period**: 1h, 24h, 7d price changes
- **Min Volume**: Filter by minimum volume in SOL
- **Min Liquidity**: Filter by minimum liquidity in SOL
- **Protocol**: Filter by DEX protocol

### ✅ Sorting (Implemented)
- **Fields**: Volume, Price Change, Market Cap, Liquidity, Transactions
- **Order**: Ascending or Descending
- Real-time sorting

### ✅ Search
- Search by token name or symbol
- Debounced search (500ms)

### ✅ Real-time Updates
- WebSocket connection
- Live price and volume updates
- Connection status indicator

## 🛠️ How to Use

### Starting Services

**Option 1: Start Both Separately**

1. **Start Backend** (from project root):
   ```bash
   npm start
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

**Option 2: Development Mode**

1. **Backend** (from project root):
   ```bash
   npm run dev
   ```

2. **Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

### Stopping Services

**Stop Backend (Port 3000):**
```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess -Unique | Stop-Process -Force
```

**Stop Frontend (Port 5173):**
```powershell
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess -Unique | Stop-Process -Force
```

**Stop All Node Processes:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 🎨 Frontend Features

### Main Interface
- **Header**: Shows connection status (Live Updates indicator)
- **Search Bar**: Search tokens by name or symbol
- **Filter Panel**: 
  - Time period buttons (1h, 24h, 7d, All)
  - Min volume input
  - Min liquidity input
  - Protocol filter
  - Sort field dropdown
  - Sort order buttons
- **Token Grid**: Displays tokens in cards with:
  - Token name and ticker
  - Current price
  - Price changes (1h, 24h) - color coded
  - Volume, Market Cap, Liquidity
  - Transaction count
  - Protocol badge
  - Token address

### Interactive Features
- Click time period buttons to filter
- Enter values in filter inputs
- Select sort field from dropdown
- Toggle sort order (Asc/Desc)
- Search automatically triggers after 500ms
- "Load More" button for pagination
- Real-time updates appear automatically

## 🔍 Testing the Features

### Test Filtering
1. Click "1h" button - shows tokens with 1h price change
2. Enter "1000" in Min Volume - shows tokens with volume > 1000 SOL
3. Enter "Raydium" in Protocol - shows only Raydium tokens

### Test Sorting
1. Select "Price Change" from Sort dropdown
2. Click "Descending" - shows highest price changes first
3. Click "Ascending" - shows lowest price changes first

### Test Search
1. Type "SOL" in search bar
2. Wait 500ms - results update automatically
3. Type "BONK" - see BONK tokens

### Test Real-time Updates
1. Open multiple browser tabs
2. Watch token prices update in real-time
3. Connection indicator shows "Live Updates" when connected

## 📊 API Endpoints Used

The frontend uses these endpoints:

- `GET /api/tokens` - Get tokens with filters and sorting
- `GET /api/health` - Health check
- `WebSocket /` - Real-time updates

### Example API Calls

**Get tokens with filters:**
```
GET /api/tokens?timePeriod=24h&minVolume=1000&sortField=volume&sortOrder=desc&limit=20
```

**Search tokens:**
```
GET /api/tokens?q=SOL&limit=10
```

## 🐛 Troubleshooting

### Frontend shows "Disconnected"
- Check if backend is running on port 3000
- Check browser console for WebSocket errors
- Verify CORS settings in backend

### No tokens showing
- Check backend logs
- Verify Redis connection
- Check browser network tab for API errors
- Try refreshing the page

### Filters not working
- Check browser console for errors
- Verify API is receiving correct parameters
- Check network tab to see API requests

### Real-time updates not working
- Check WebSocket connection status
- Verify backend WebSocket is enabled
- Check browser console for WebSocket errors

## 📝 Next Steps

1. ✅ Frontend is running and accessible
2. ✅ All filtering and sorting features work
3. ✅ Real-time updates are active
4. Open http://localhost:5173 and explore!

## 🎉 Success!

Your complete meme coin aggregator is now running with:
- ✅ Backend API with filtering & sorting
- ✅ Modern React frontend
- ✅ Real-time WebSocket updates
- ✅ Beautiful, responsive UI
- ✅ All features working

Enjoy exploring meme coins! 🚀

