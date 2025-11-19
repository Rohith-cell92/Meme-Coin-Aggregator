import { AggregatorService } from '../aggregator';
import { Token, FilterOptions, SortOptions, PaginationOptions } from '../../types';

// Mock API clients
jest.mock('../api-clients/dexscreener-client');
jest.mock('../api-clients/jupiter-client');
jest.mock('../api-clients/geckoterminal-client');
jest.mock('../cache');

describe('AggregatorService', () => {
  let aggregator: AggregatorService;
  const mockTokens: Token[] = [
    {
      token_address: '0x123',
      token_name: 'Token A',
      token_ticker: 'TKA',
      price_sol: 0.001,
      market_cap_sol: 1000,
      volume_sol: 500,
      liquidity_sol: 200,
      transaction_count: 100,
      price_1hr_change: 10,
      price_24hr_change: 20,
      protocol: 'Raydium',
      source: 'dexscreener',
    },
    {
      token_address: '0x456',
      token_name: 'Token B',
      token_ticker: 'TKB',
      price_sol: 0.002,
      market_cap_sol: 2000,
      volume_sol: 1000,
      liquidity_sol: 400,
      transaction_count: 200,
      price_1hr_change: -5,
      price_24hr_change: 15,
      protocol: 'Orca',
      source: 'jupiter',
    },
  ];

  beforeEach(() => {
    aggregator = new AggregatorService();
  });

  describe('mergeDuplicateTokens', () => {
    it('should merge tokens with same address', () => {
      const duplicateTokens: Token[] = [
        { ...mockTokens[0], volume_sol: 500 },
        { ...mockTokens[0], volume_sol: 600, source: 'jupiter' },
      ];

      const merged = (aggregator as any).mergeDuplicateTokens(duplicateTokens);
      expect(merged).toHaveLength(1);
      expect(merged[0].source).toContain('dexscreener');
      expect(merged[0].source).toContain('jupiter');
    });

    it('should keep unique tokens separate', () => {
      const merged = (aggregator as any).mergeDuplicateTokens(mockTokens);
      expect(merged).toHaveLength(2);
    });
  });

  describe('filterTokens', () => {
    it('should filter by minimum volume', () => {
      const filters: FilterOptions = { minVolume: 600 };
      const filtered = aggregator.filterTokens(mockTokens, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].token_address).toBe('0x456');
    });

    it('should filter by minimum liquidity', () => {
      const filters: FilterOptions = { minLiquidity: 300 };
      const filtered = aggregator.filterTokens(mockTokens, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].token_address).toBe('0x456');
    });

    it('should filter by protocol', () => {
      const filters: FilterOptions = { protocol: 'Raydium' };
      const filtered = aggregator.filterTokens(mockTokens, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].protocol).toBe('Raydium');
    });

    it('should filter by time period', () => {
      const filters: FilterOptions = { timePeriod: '1h' };
      const filtered = aggregator.filterTokens(mockTokens, filters);
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should return all tokens when no filters applied', () => {
      const filters: FilterOptions = {};
      const filtered = aggregator.filterTokens(mockTokens, filters);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('sortTokens', () => {
    it('should sort by volume descending', () => {
      const sort: SortOptions = { field: 'volume', order: 'desc' };
      const sorted = aggregator.sortTokens(mockTokens, sort);
      expect(sorted[0].volume_sol).toBeGreaterThanOrEqual(sorted[1].volume_sol);
    });

    it('should sort by volume ascending', () => {
      const sort: SortOptions = { field: 'volume', order: 'asc' };
      const sorted = aggregator.sortTokens(mockTokens, sort);
      expect(sorted[0].volume_sol).toBeLessThanOrEqual(sorted[1].volume_sol);
    });

    it('should sort by market cap', () => {
      const sort: SortOptions = { field: 'market_cap', order: 'desc' };
      const sorted = aggregator.sortTokens(mockTokens, sort);
      expect(sorted[0].market_cap_sol).toBeGreaterThanOrEqual(
        sorted[1].market_cap_sol
      );
    });

    it('should sort by price change', () => {
      const sort: SortOptions = { field: 'price_change', order: 'desc' };
      const sorted = aggregator.sortTokens(mockTokens, sort);
      expect(sorted.length).toBe(2);
    });
  });

  describe('paginateTokens', () => {
    it('should paginate tokens correctly', () => {
      const pagination: PaginationOptions = { limit: 1 };
      const result = aggregator.paginateTokens(mockTokens, pagination);
      expect(result.tokens).toHaveLength(1);
      expect(result.nextCursor).toBeTruthy();
    });

    it('should return null cursor when no more tokens', () => {
      const pagination: PaginationOptions = { limit: 10 };
      const result = aggregator.paginateTokens(mockTokens, pagination);
      expect(result.tokens).toHaveLength(2);
      expect(result.nextCursor).toBeNull();
    });

    it('should handle cursor correctly', () => {
      const pagination: PaginationOptions = { limit: 1, cursor: undefined };
      const firstPage = aggregator.paginateTokens(mockTokens, pagination);
      expect(firstPage.tokens).toHaveLength(1);

      if (firstPage.nextCursor) {
        const secondPage = aggregator.paginateTokens(mockTokens, {
          limit: 1,
          cursor: firstPage.nextCursor,
        });
        expect(secondPage.tokens).toHaveLength(1);
        expect(secondPage.tokens[0].token_address).not.toBe(
          firstPage.tokens[0].token_address
        );
      }
    });
  });
});

