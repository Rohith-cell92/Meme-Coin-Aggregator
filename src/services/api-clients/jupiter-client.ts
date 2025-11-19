import { BaseApiClient } from './base-client';
import { config } from '../../config';
import { JupiterToken, Token } from '../../types';
import logger from '../../utils/logger';

export class JupiterClient extends BaseApiClient {
  constructor() {
    super(config.api.jupiter.baseUrl, config.api.jupiter.rateLimit);
  }

  async searchTokens(query: string): Promise<Token[]> {
    try {
      const response = await this.makeRequest(() =>
        this.client.get(`/tokens/v2/search?query=${encodeURIComponent(query)}`)
      );

      const tokens = response.data as JupiterToken[];
      if (!tokens || tokens.length === 0) {
        return [];
      }

      return this.transformTokens(tokens);
    } catch (error: any) {
      logger.error('Jupiter search error:', error.message);
      return [];
    }
  }

  private transformTokens(jupiterTokens: JupiterToken[]): Token[] {
    return jupiterTokens
      .filter((token) => token.chainId === 101) // Solana mainnet
      .map((token) => {
        const priceUsd = token.priceUSD || 0;
        const solPriceUsd = 100; // Approximate
        const priceSol = priceUsd / solPriceUsd;

        return {
          token_address: token.address,
          token_name: token.name,
          token_ticker: token.symbol,
          price_sol: priceSol,
          market_cap_sol: 0, // Not available in Jupiter search
          volume_sol: 0,
          liquidity_sol: 0,
          transaction_count: 0,
          protocol: 'Jupiter',
          source: 'jupiter',
          last_updated: new Date(),
        } as Token;
      });
  }
}

