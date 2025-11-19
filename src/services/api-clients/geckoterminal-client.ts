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
      // GeckoTerminal supports multiple networks
      // Fetch from multiple popular chains
      const networks = ['solana', 'ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism'];
      const allTokens: Token[] = [];

      for (const network of networks) {
        try {
          const response = await this.makeRequest(() =>
            this.client.get(`/networks/${network}/tokens`, {
              params: {
                query: query,
                page: 1,
              },
            })
          );

          const tokens = response.data?.data as GeckoTerminalToken[];
          if (tokens && tokens.length > 0) {
            const transformed = this.transformTokens(tokens, network);
            allTokens.push(...transformed);
          }
          
          // Small delay to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          // Continue with other networks if one fails
          logger.debug(`GeckoTerminal search failed for ${network}:`, error);
        }
      }

      return allTokens;
    } catch (error: any) {
      logger.error('GeckoTerminal search error:', error.message);
      return [];
    }
  }

  private transformTokens(geckoTokens: GeckoTerminalToken[], network: string): Token[] {
    const solPriceUsd = 100; // Approximate

    return geckoTokens.map((token) => {
      const attrs = token.attributes;
      const priceUsd = parseFloat(attrs.price_usd || '0');
      const priceSol = priceUsd / solPriceUsd;
      const volume24h = attrs.volume_usd?.h24 || 0;
      const volumeSol = volume24h / solPriceUsd;
      const marketCapUsd = attrs.market_cap_usd || attrs.fdv_usd || 0;
      const marketCapSol = marketCapUsd / solPriceUsd;

      return {
        token_address: attrs.address,
        token_name: attrs.name,
        token_ticker: attrs.symbol,
        chain: network,
        chain_id: network,
        price_sol: priceSol,
        price_usd: priceUsd,
        market_cap_sol: marketCapSol,
        market_cap_usd: marketCapUsd,
        volume_sol: volumeSol,
        volume_usd: volume24h,
        liquidity_sol: 0, // Not directly available
        liquidity_usd: 0,
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

