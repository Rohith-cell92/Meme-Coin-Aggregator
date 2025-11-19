import { Token } from '../App';
import './TokenList.css';

interface TokenListProps {
  tokens: Token[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  total: number;
}

function TokenList({ tokens, loading, onLoadMore, hasMore, total }: TokenListProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatPrice = (price: number): string => {
    if (price < 0.000001) return price.toExponential(2);
    return price.toFixed(8);
  };

  const getChangeColor = (change?: number): string => {
    if (!change) return '#6b7280';
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  if (loading && tokens.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tokens...</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="empty-state">
        <p>No tokens found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="token-list-container">
      <div className="token-list-header">
        <h2>Tokens ({total})</h2>
      </div>

      <div className="token-grid">
        {tokens.map((token) => (
          <div key={token.token_address} className="token-card">
            <div className="token-header">
              <div className="token-info">
                <h3 className="token-name">{token.token_name}</h3>
                <span className="token-ticker">{token.token_ticker}</span>
              </div>
              <div className="token-badges">
                {token.chain && (
                  <span className="token-chain">{token.chain}</span>
                )}
                <span className="token-protocol">{token.protocol}</span>
              </div>
            </div>

            <div className="token-price">
              {formatPrice(token.price_sol)} SOL
            </div>

            <div className="token-metrics">
              <div className="metric-row">
                <span className="metric-label">1h Change:</span>
                <span
                  className="metric-value"
                  style={{ color: getChangeColor(token.price_1hr_change) }}
                >
                  {token.price_1hr_change !== undefined
                    ? `${token.price_1hr_change >= 0 ? '+' : ''}${token.price_1hr_change.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">24h Change:</span>
                <span
                  className="metric-value"
                  style={{ color: getChangeColor(token.price_24hr_change) }}
                >
                  {token.price_24hr_change !== undefined
                    ? `${token.price_24hr_change >= 0 ? '+' : ''}${token.price_24hr_change.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Volume:</span>
                <span className="metric-value">
                  {formatNumber(token.volume_sol)} SOL
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Market Cap:</span>
                <span className="metric-value">
                  {formatNumber(token.market_cap_sol)} SOL
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Liquidity:</span>
                <span className="metric-value">
                  {formatNumber(token.liquidity_sol)} SOL
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Transactions:</span>
                <span className="metric-value">
                  {formatNumber(token.transaction_count)}
                </span>
              </div>
            </div>

            <div className="token-footer">
              <span className="token-address">
                {token.token_address.slice(0, 8)}...{token.token_address.slice(-6)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading && tokens.length > 0 && (
        <div className="loading-more">
          <div className="spinner small"></div>
          <span>Loading more tokens...</span>
        </div>
      )}

      {hasMore && !loading && (
        <div className="load-more-container">
          <button onClick={onLoadMore} className="load-more-button">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default TokenList;

