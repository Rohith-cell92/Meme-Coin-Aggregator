import Redis from 'ioredis';
import logger from '../utils/logger';
import { config } from '../config';
import { Token } from '../types';

export class CacheService {
  private client: Redis;
  private ttl: number;

  constructor() {
    const redisConfig: any = {
      host: config.redis.host,
      port: config.redis.port,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    // Add username if provided (for Redis 6+ with ACL)
    if (config.redis.username) {
      redisConfig.username = config.redis.username;
    }

    // Add password if provided
    if (config.redis.password) {
      redisConfig.password = config.redis.password;
    }

    this.client = new Redis(redisConfig);

    this.ttl = config.redis.ttl;

    this.client.on('error', (err: Error) => {
      logger.error('Redis connection error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis connected successfully');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttl || this.ttl, serialized);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async getTokens(key: string): Promise<Token[] | null> {
    return this.get<Token[]>(key);
  }

  async setTokens(key: string, tokens: Token[], ttl?: number): Promise<void> {
    await this.set(key, tokens, ttl);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      logger.error(`Cache invalidate pattern error for ${pattern}:`, error);
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}

export const cacheService = new CacheService();

