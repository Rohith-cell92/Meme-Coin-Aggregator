export interface Token {
  token_address: string;
  token_name: string;
  token_ticker: string;
  chain?: string; // Chain identifier (e.g., 'ethereum', 'solana', 'bsc', 'polygon')
  chain_id?: string | number; // Chain ID for identification
  price_sol: number; // Price in SOL (normalized for comparison)
  price_usd?: number; // Price in USD
  market_cap_sol: number;
  market_cap_usd?: number;
  volume_sol: number;
  volume_usd?: number;
  liquidity_sol: number;
  liquidity_usd?: number;
  transaction_count: number;
  price_1hr_change?: number;
  price_24hr_change?: number;
  price_7d_change?: number;
  protocol: string;
  source?: string; // Which API this came from
  last_updated?: Date;
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
  timestamp: Date;
}

export interface FilterOptions {
  timePeriod?: '1h' | '24h' | '7d';
  minVolume?: number;
  minLiquidity?: number;
  protocol?: string;
  chain?: string; // Filter by blockchain chain
}

export interface SortOptions {
  field: 'volume' | 'price_change' | 'market_cap' | 'liquidity' | 'transaction_count';
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  limit: number;
  cursor?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: Date;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

export interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags?: string[];
  priceUSD?: number;
}

export interface GeckoTerminalToken {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    total_supply: string;
    price_usd?: string;
    price_change_percentage?: {
      m5?: number;
      h1?: number;
      h6?: number;
      h24?: number;
    };
    volume_usd?: {
      m5?: number;
      h1?: number;
      h6?: number;
      h24?: number;
    };
    fdv_usd?: number;
    market_cap_usd?: number;
  };
}

