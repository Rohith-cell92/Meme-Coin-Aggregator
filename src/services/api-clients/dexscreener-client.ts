import { AxiosResponse } from 'axios';
import { BaseApiClient } from './base-client';
import { config } from '../../config';
import { DexScreenerPair, Token } from '../../types';
import logger from '../../utils/logger';

export class DexScreenerClient extends BaseApiClient {
  constructor() {
    super(config.api.dexscreener.baseUrl, config.api.dexscreener.rateLimit);
  }

  async searchTokens(query: string): Promise<Token[]> {
    try {
      const response = await this.makeRequest<AxiosResponse<{ pairs: DexScreenerPair[] }>>(() =>
        this.client.get(`/latest/dex/search?q=${encodeURIComponent(query)}`)
      );

      const pairs = response.data.pairs;
      if (!pairs || pairs.length === 0) {
        return [];
      }

      return this.transformPairsToTokens(pairs);
    } catch (error: any) {
      logger.error('DexScreener search error:', error.message);
      return [];
    }
  }

  async getTokenByAddress(address: string): Promise<Token[]> {
    try {
      const response = await this.makeRequest<AxiosResponse<{ pairs: DexScreenerPair[] }>>(() =>
        this.client.get(`/latest/dex/tokens/${address}`)
      );

      const pairs = response.data.pairs;
      if (!pairs || pairs.length === 0) {
        return [];
      }

      return this.transformPairsToTokens(pairs);
    } catch (error: any) {
      logger.error('DexScreener token fetch error:', error.message);
      return [];
    }
  }

  private transformPairsToTokens(pairs: DexScreenerPair[]): Token[] {
    return pairs
      .filter((pair) => {
        // Filter for Solana tokens (chainId: 'solana')
        return pair.chainId === 'solana' && pair.baseToken && pair.quoteToken;
      })
      .map((pair) => {
        const priceSol = parseFloat(pair.priceNative || '0');
        const volume24h = pair.volume?.h24 || 0;
        const liquidityUsd = pair.liquidity?.usd || 0;
        const fdv = pair.fdv || 0;

        // Convert USD values to SOL (approximate 1 SOL = 100 USD)
        const solPriceUsd = 100;
        const volumeSol = volume24h / solPriceUsd;
        const liquiditySol = liquidityUsd / solPriceUsd;
        const marketCapSol = fdv / solPriceUsd;

        const totalTransactions =
          (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0);

        return {
          token_address: pair.baseToken.address,
          token_name: pair.baseToken.name,
          token_ticker: pair.baseToken.symbol,
          price_sol: priceSol,
          market_cap_sol: marketCapSol,
          volume_sol: volumeSol,
          liquidity_sol: liquiditySol,
          transaction_count: totalTransactions,
          price_1hr_change: pair.priceChange?.h1 || 0,
          price_24hr_change: pair.priceChange?.h24 || 0,
          price_7d_change: 0, // Not available in DexScreener
          protocol: pair.dexId,
          source: 'dexscreener',
          last_updated: new Date(),
        } as Token;
      });
  }
}

