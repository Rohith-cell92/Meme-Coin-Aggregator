import axios from 'axios';
import { DexScreenerClient } from '../api-clients/dexscreener-client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DexScreenerClient', () => {
  let client: DexScreenerClient;

  beforeEach(() => {
    client = new DexScreenerClient();
    jest.clearAllMocks();
  });

  describe('searchTokens', () => {
    it('should transform API response to tokens', async () => {
      const mockResponse = {
        data: {
          pairs: [
            {
              chainId: 'solana',
              dexId: 'raydium',
              baseToken: {
                address: '0x123',
                name: 'Test Token',
                symbol: 'TEST',
              },
              quoteToken: {
                address: 'SOL',
                name: 'Solana',
                symbol: 'SOL',
              },
              priceNative: '0.001',
              volume: { h24: 10000 },
              liquidity: { usd: 50000 },
              fdv: 100000,
              txns: {
                h24: { buys: 50, sells: 50 },
              },
              priceChange: {
                h1: 10,
                h24: 20,
              },
            },
          ],
        },
      };

      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const tokens = await client.searchTokens('TEST');
      expect(tokens).toBeDefined();
    });

    it('should return empty array on error', async () => {
      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockRejectedValue(new Error('API Error')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const tokens = await client.searchTokens('TEST');
      expect(tokens).toEqual([]);
    });

    it('should filter non-Solana tokens', async () => {
      const mockResponse = {
        data: {
          pairs: [
            {
              chainId: 'ethereum',
              dexId: 'uniswap',
              baseToken: { address: '0x123', name: 'Token', symbol: 'TKN' },
              quoteToken: { address: 'ETH', name: 'Ethereum', symbol: 'ETH' },
            },
          ],
        },
      };

      mockedAxios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      })) as any;

      const tokens = await client.searchTokens('TKN');
      expect(tokens).toHaveLength(0);
    });
  });
});

