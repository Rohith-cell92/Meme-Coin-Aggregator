import { Token, FilterOptions, SortOptions, PaginationOptions } from '../types';
import { DexScreenerClient } from './api-clients/dexscreener-client';
import { JupiterClient } from './api-clients/jupiter-client';
import { GeckoTerminalClient } from './api-clients/geckoterminal-client';
import { cacheService } from './cache';
import logger from '../utils/logger';

export class AggregatorService {
  private dexscreener: DexScreenerClient;
  private jupiter: JupiterClient;
  private geckoterminal: GeckoTerminalClient;

  constructor() {
    this.dexscreener = new DexScreenerClient();
    this.jupiter = new JupiterClient();
    this.geckoterminal = new GeckoTerminalClient();
  }

  async aggregateTokens(query?: string): Promise<Token[]> {
    const cacheKey = `tokens:${query || 'all'}`;
    
    // Try cache first
    const cached = await cacheService.getTokens(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    logger.info('Fetching tokens from multiple DEX sources...');

    // Fetch from all sources in parallel
    const [dexscreenerTokens, jupiterTokens, geckoterminalTokens] =
      await Promise.allSettled([
        query
          ? this.dexscreener.searchTokens(query)
          : this.fetchPopularTokens(),
        this.jupiter.searchTokens(query || 'SOL'),
        this.geckoterminal.searchTokens(query || 'SOL'),
      ]);

    const allTokens: Token[] = [];

    if (dexscreenerTokens.status === 'fulfilled') {
      allTokens.push(...dexscreenerTokens.value);
    }

    if (jupiterTokens.status === 'fulfilled') {
      allTokens.push(...jupiterTokens.value);
    }

    if (geckoterminalTokens.status === 'fulfilled') {
      allTokens.push(...geckoterminalTokens.value);
    }

    // Merge duplicate tokens
    const mergedTokens = this.mergeDuplicateTokens(allTokens);

    // Cache the result
    await cacheService.setTokens(cacheKey, mergedTokens);

    logger.info(`Aggregated ${mergedTokens.length} unique tokens`);
    return mergedTokens;
  }

  private async fetchPopularTokens(): Promise<Token[]> {
    // Fetch popular meme coins by searching common terms
    const queries = ['SOL', 'BONK', 'WIF', 'POPCAT', 'MYRO'];
    const allTokens: Token[] = [];

    for (const query of queries) {
      try {
        const tokens = await this.dexscreener.searchTokens(query);
        allTokens.push(...tokens);
        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        logger.error(`Error fetching tokens for ${query}:`, error);
      }
    }

    return allTokens;
  }

  private mergeDuplicateTokens(tokens: Token[]): Token[] {
    const tokenMap = new Map<string, Token>();

    for (const token of tokens) {
      const address = token.token_address.toLowerCase();
      const existing = tokenMap.get(address);

      if (!existing) {
        tokenMap.set(address, token);
      } else {
        // Merge: prefer data from source with more complete information
        const merged = this.mergeTokenData(existing, token);
        tokenMap.set(address, merged);
      }
    }

    return Array.from(tokenMap.values());
  }

  private mergeTokenData(token1: Token, token2: Token): Token {
    // Prefer token with higher volume or more complete data
    const score1 = this.calculateTokenScore(token1);
    const score2 = this.calculateTokenScore(token2);

    const primary = score1 >= score2 ? token1 : token2;
    const secondary = score1 >= score2 ? token2 : token1;

    return {
      ...primary,
      // Merge missing fields from secondary
      price_1hr_change:
        primary.price_1hr_change ?? secondary.price_1hr_change ?? 0,
      price_24hr_change:
        primary.price_24hr_change ?? secondary.price_24hr_change ?? 0,
      price_7d_change: primary.price_7d_change ?? secondary.price_7d_change ?? 0,
      volume_sol: primary.volume_sol || secondary.volume_sol || 0,
      market_cap_sol: primary.market_cap_sol || secondary.market_cap_sol || 0,
      liquidity_sol: primary.liquidity_sol || secondary.liquidity_sol || 0,
      transaction_count:
        primary.transaction_count || secondary.transaction_count || 0,
      // Combine sources
      source: `${primary.source},${secondary.source}`,
    };
  }

  private calculateTokenScore(token: Token): number {
    let score = 0;
    if (token.volume_sol > 0) score += 10;
    if (token.market_cap_sol > 0) score += 5;
    if (token.liquidity_sol > 0) score += 5;
    if (token.transaction_count > 0) score += 2;
    if (token.price_1hr_change !== undefined) score += 1;
    if (token.price_24hr_change !== undefined) score += 1;
    return score;
  }

  filterTokens(tokens: Token[], filters: FilterOptions): Token[] {
    return tokens.filter((token) => {
      if (filters.minVolume && token.volume_sol < filters.minVolume) {
        return false;
      }
      if (filters.minLiquidity && token.liquidity_sol < filters.minLiquidity) {
        return false;
      }
      if (filters.protocol && token.protocol !== filters.protocol) {
        return false;
      }
      if (filters.timePeriod) {
        const changeField = `price_${filters.timePeriod}_change` as keyof Token;
        const change = token[changeField] as number | undefined;
        if (change === undefined || change === 0) {
          return false;
        }
      }
      return true;
    });
  }

  sortTokens(tokens: Token[], sort: SortOptions): Token[] {
    const sorted = [...tokens];

    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sort.field) {
        case 'volume':
          aValue = a.volume_sol;
          bValue = b.volume_sol;
          break;
        case 'market_cap':
          aValue = a.market_cap_sol;
          bValue = b.market_cap_sol;
          break;
        case 'liquidity':
          aValue = a.liquidity_sol;
          bValue = b.liquidity_sol;
          break;
        case 'transaction_count':
          aValue = a.transaction_count;
          bValue = b.transaction_count;
          break;
        case 'price_change':
          // Use 24h change as default, fallback to 1h
          aValue = a.price_24hr_change ?? a.price_1hr_change ?? 0;
          bValue = b.price_24hr_change ?? b.price_1hr_change ?? 0;
          break;
        default:
          return 0;
      }

      if (sort.order === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }

  paginateTokens(
    tokens: Token[],
    pagination: PaginationOptions
  ): { tokens: Token[]; nextCursor: string | null } {
    const { limit, cursor } = pagination;
    let startIndex = 0;

    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        startIndex = parseInt(decoded, 10);
        if (isNaN(startIndex) || startIndex < 0) {
          startIndex = 0;
        }
      } catch {
        startIndex = 0;
      }
    }

    const endIndex = startIndex + limit;
    const paginatedTokens = tokens.slice(startIndex, endIndex);
    const hasMore = endIndex < tokens.length;

    const nextCursor = hasMore
      ? Buffer.from(endIndex.toString(), 'utf-8').toString('base64')
      : null;

    return { tokens: paginatedTokens, nextCursor };
  }
}

