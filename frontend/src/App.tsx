import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import TokenList from './components/TokenList';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import './App.css';

export interface Token {
  token_address: string;
  token_name: string;
  token_ticker: string;
  price_sol: number;
  market_cap_sol: number;
  volume_sol: number;
  liquidity_sol: number;
  transaction_count: number;
  price_1hr_change?: number;
  price_24hr_change?: number;
  price_7d_change?: number;
  protocol: string;
  source?: string;
  last_updated?: string;
}

export interface TokenUpdate {
  token_address: string;
  price_sol?: number;
  volume_sol?: number;
  market_cap_sol?: number;
  price_1hr_change?: number;
  price_24hr_change?: number;
  price_7d_change?: number;
  transaction_count?: number;
  timestamp: string;
}

export interface Filters {
  timePeriod?: '1h' | '24h' | '7d';
  minVolume?: number;
  minLiquidity?: number;
  protocol?: string;
}

export interface SortOptions {
  field: 'volume' | 'price_change' | 'market_cap' | 'liquidity' | 'transaction_count';
  order: 'asc' | 'desc';
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'volume', order: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ limit: 20, nextCursor: null as string | null, total: 0 });

  // Fetch tokens from API
  const fetchTokens = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: pagination.limit,
        sortField: sort.field,
        sortOrder: sort.order,
      };

      if (cursor) params.cursor = cursor;
      if (searchQuery) params.q = searchQuery;
      if (filters.timePeriod) params.timePeriod = filters.timePeriod;
      if (filters.minVolume) params.minVolume = filters.minVolume;
      if (filters.minLiquidity) params.minLiquidity = filters.minLiquidity;
      if (filters.protocol) params.protocol = filters.protocol;

      const response = await axios.get(`${API_BASE}/api/tokens`, { params });
      
      if (cursor) {
        // Append for pagination
        setTokens(prev => [...prev, ...response.data.data]);
      } else {
        // Replace for new search/filter
        setTokens(response.data.data);
      }

      setPagination({
        limit: response.data.pagination.limit,
        nextCursor: response.data.pagination.nextCursor,
        total: response.data.pagination.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tokens');
      console.error('Error fetching tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket connection
  useEffect(() => {
    const newSocket = io(API_BASE, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('tokens:initial', (data: { tokens: Token[] }) => {
      console.log('Initial tokens received:', data.tokens.length);
      // Optionally merge with API data
    });

    newSocket.on('tokens:update', (data: { updates: TokenUpdate[] }) => {
      console.log('Token updates received:', data.updates.length);
      setTokens(prev => {
        const updated = [...prev];
        data.updates.forEach(update => {
          const index = updated.findIndex(
            t => t.token_address === update.token_address
          );
          if (index !== -1) {
            updated[index] = { ...updated[index], ...update };
          }
        });
        return updated;
      });
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch tokens when filters, sort, or search change
  useEffect(() => {
    fetchTokens();
  }, [filters, sort, searchQuery]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    if (pagination.nextCursor && !loading) {
      fetchTokens(pagination.nextCursor);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Meme Coin Aggregator</h1>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>{connected ? 'Live Updates' : 'Disconnected'}</span>
        </div>
      </header>

      <div className="app-content">
        <div className="controls-panel">
          <SearchBar onSearch={handleSearch} />
          <FilterPanel
            filters={filters}
            sort={sort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <TokenList
          tokens={tokens}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={!!pagination.nextCursor}
          total={pagination.total}
        />
      </div>
    </div>
  );
}

export default App;

