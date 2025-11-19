import { CacheService } from '../cache';

// Mock ioredis
jest.mock('ioredis', () => {
  const mockRedis = {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
  };
  return jest.fn(() => mockRedis);
});

describe('CacheService', () => {
  let cacheService: CacheService;
  const mockRedis = require('ioredis');

  beforeEach(() => {
    jest.clearAllMocks();
    cacheService = new CacheService();
  });

  describe('get', () => {
    it('should return cached data', async () => {
      const mockData = { test: 'data' };
      mockRedis().get.mockResolvedValue(JSON.stringify(mockData));

      const result = await cacheService.get('test-key');
      expect(result).toEqual(mockData);
    });

    it('should return null when key does not exist', async () => {
      mockRedis().get.mockResolvedValue(null);

      const result = await cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      mockRedis().get.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.get('error-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data with TTL', async () => {
      const data = { test: 'data' };
      mockRedis().setex.mockResolvedValue('OK');

      await cacheService.set('test-key', data, 60);
      expect(mockRedis().setex).toHaveBeenCalledWith(
        'test-key',
        60,
        JSON.stringify(data)
      );
    });

    it('should use default TTL when not provided', async () => {
      const data = { test: 'data' };
      mockRedis().setex.mockResolvedValue('OK');

      await cacheService.set('test-key', data);
      expect(mockRedis().setex).toHaveBeenCalled();
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      mockRedis().del.mockResolvedValue(1);

      await cacheService.del('test-key');
      expect(mockRedis().del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('invalidatePattern', () => {
    it('should delete all keys matching pattern', async () => {
      mockRedis().keys.mockResolvedValue(['key1', 'key2']);
      mockRedis().del.mockResolvedValue(2);

      await cacheService.invalidatePattern('tokens:*');
      expect(mockRedis().keys).toHaveBeenCalledWith('tokens:*');
      expect(mockRedis().del).toHaveBeenCalledWith('key1', 'key2');
    });

    it('should handle empty pattern results', async () => {
      mockRedis().keys.mockResolvedValue([]);

      await cacheService.invalidatePattern('empty:*');
      expect(mockRedis().del).not.toHaveBeenCalled();
    });
  });
});

