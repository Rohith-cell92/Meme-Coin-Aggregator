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
    const solPriceUsd = 100; // Approximate
    const chainIdMap: Record<number, string> = {
      101: 'solana',
      1: 'ethereum',
      56: 'bsc',
      137: 'polygon',
      43114: 'avalanche',
      250: 'fantom',
      42161: 'arbitrum',
      10: 'optimism',
    };

    return jupiterTokens
      .filter((token) => token.chainId) // Accept all chains
      .map((token) => {
        const priceUsd = token.priceUSD || 0;
        const priceSol = priceUsd / solPriceUsd;
        const chainName = chainIdMap[token.chainId] || `chain-${token.chainId}`;

        return {
          token_address: token.address,
          token_name: token.name,
          token_ticker: token.symbol,
          chain: chainName,
          chain_id: token.chainId,
          price_sol: priceSol,
          price_usd: priceUsd,
          market_cap_sol: 0, // Not available in Jupiter search
          market_cap_usd: 0,
          volume_sol: 0,
          volume_usd: 0,
          liquidity_sol: 0,
          liquidity_usd: 0,
          transaction_count: 0,
          protocol: 'Jupiter',
          source: 'jupiter',
          last_updated: new Date(),
        } as Token;
      });
  }
}

