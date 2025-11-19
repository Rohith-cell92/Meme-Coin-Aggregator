import { Filters, SortOptions } from '../App';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: Filters;
  sort: SortOptions;
  onFilterChange: (filters: Filters) => void;
  onSortChange: (sort: SortOptions) => void;
}

function FilterPanel({ filters, sort, onFilterChange, onSortChange }: FilterPanelProps) {
  const handleTimePeriodChange = (period: '1h' | '24h' | '7d' | '') => {
    onFilterChange({
      ...filters,
      timePeriod: period || undefined,
    });
  };

  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      minVolume: value ? parseFloat(value) : undefined,
    });
  };

  const handleMinLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      minLiquidity: value ? parseFloat(value) : undefined,
    });
  };

  const handleProtocolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      protocol: value || undefined,
    });
  };

  const handleSortFieldChange = (field: SortOptions['field']) => {
    onSortChange({ ...sort, field });
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    onSortChange({ ...sort, order });
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Time Period:</label>
          <div className="button-group">
            <button
              className={filters.timePeriod === '1h' ? 'active' : ''}
              onClick={() => handleTimePeriodChange('1h')}
            >
              1h
            </button>
            <button
              className={filters.timePeriod === '24h' ? 'active' : ''}
              onClick={() => handleTimePeriodChange('24h')}
            >
              24h
            </button>
            <button
              className={filters.timePeriod === '7d' ? 'active' : ''}
              onClick={() => handleTimePeriodChange('7d')}
            >
              7d
            </button>
            <button
              className={!filters.timePeriod ? 'active' : ''}
              onClick={() => handleTimePeriodChange('')}
            >
              All
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Min Volume (SOL):</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minVolume || ''}
            onChange={handleMinVolumeChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Min Liquidity (SOL):</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minLiquidity || ''}
            onChange={handleMinLiquidityChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Protocol:</label>
          <input
            type="text"
            placeholder="e.g., Raydium, Orca"
            value={filters.protocol || ''}
            onChange={handleProtocolChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Chain:</label>
          <select
            value={filters.chain || ''}
            onChange={(e) => onFilterChange({ ...filters, chain: e.target.value || undefined })}
            className="filter-select"
          >
            <option value="">All Chains</option>
            <option value="solana">Solana</option>
            <option value="ethereum">Ethereum</option>
            <option value="bsc">BSC</option>
            <option value="polygon">Polygon</option>
            <option value="avalanche">Avalanche</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
            <option value="fantom">Fantom</option>
          </select>
        </div>
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <div className="filter-group">
          <label>Field:</label>
          <select
            value={sort.field}
            onChange={(e) => handleSortFieldChange(e.target.value as SortOptions['field'])}
            className="filter-select"
          >
            <option value="volume">Volume</option>
            <option value="price_change">Price Change</option>
            <option value="market_cap">Market Cap</option>
            <option value="liquidity">Liquidity</option>
            <option value="transaction_count">Transactions</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order:</label>
          <div className="button-group">
            <button
              className={sort.order === 'desc' ? 'active' : ''}
              onClick={() => handleSortOrderChange('desc')}
            >
              ↓ Descending
            </button>
            <button
              className={sort.order === 'asc' ? 'active' : ''}
              onClick={() => handleSortOrderChange('asc')}
            >
              ↑ Ascending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;

