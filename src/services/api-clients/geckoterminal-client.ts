import { BaseApiClient } from './base-client';
import { config } from '../../config';
import { GeckoTerminalToken, Token } from '../../types';
import logger from '../../utils/logger';

export class GeckoTerminalClient extends BaseApiClient {
  private apiKey?: string;

  constructor() {
    super(config.api.geckoterminal.baseUrl, config.api.geckoterminal.rateLimit);
    this.apiKey = config.api.geckoterminal.apiKey;

    if (this.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.apiKey}`;
    }
  }

  async searchTokens(query: string): Promise<Token[]> {
    try {
      // GeckoTerminal uses different endpoint structure
      // For now, we'll use a simplified approach
      // In production, you'd use their actual search endpoint
      const response = await this.makeRequest(() =>
        this.client.get(`/networks/solana/tokens`, {
          params: {
            query: query,
            page: 1,
          },
        })
      );

      const tokens = response.data?.data as GeckoTerminalToken[];
      if (!tokens || tokens.length === 0) {
        return [];
      }

      return this.transformTokens(tokens);
    } catch (error: any) {
      logger.error('GeckoTerminal search error:', error.message);
      // GeckoTerminal might require API key, so we'll return empty array on error
      return [];
    }
  }

  private transformTokens(geckoTokens: GeckoTerminalToken[]): Token[] {
    return geckoTokens.map((token) => {
      const attrs = token.attributes;
      const priceUsd = parseFloat(attrs.price_usd || '0');
      const solPriceUsd = 100; // Approximate
      const priceSol = priceUsd / solPriceUsd;
      const volume24h = attrs.volume_usd?.h24 || 0;
      const volumeSol = volume24h / solPriceUsd;
      const marketCapUsd = attrs.market_cap_usd || attrs.fdv_usd || 0;
      const marketCapSol = marketCapUsd / solPriceUsd;

      return {
        token_address: attrs.address,
        token_name: attrs.name,
        token_ticker: attrs.symbol,
        price_sol: priceSol,
        market_cap_sol: marketCapSol,
        volume_sol: volumeSol,
        liquidity_sol: 0, // Not directly available
        transaction_count: 0,
        price_1hr_change: attrs.price_change_percentage?.h1 || 0,
        price_24hr_change: attrs.price_change_percentage?.h24 || 0,
        price_7d_change: 0,
        protocol: 'GeckoTerminal',
        source: 'geckoterminal',
        last_updated: new Date(),
      } as Token;
    });
  }
}

