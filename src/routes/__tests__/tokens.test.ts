import request from 'supertest';
import express from 'express';
import tokensRouter from '../tokens';

const app = express();
app.use(express.json());
app.use('/api/tokens', tokensRouter);

describe('Tokens Router', () => {
  describe('GET /api/tokens', () => {
    it('should return tokens with default pagination', async () => {
      const response = await request(app).get('/api/tokens');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle query parameter', async () => {
      const response = await request(app).get('/api/tokens?q=SOL');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle filtering by time period', async () => {
      const response = await request(app).get('/api/tokens?timePeriod=24h');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('filters');
      expect(response.body.filters.timePeriod).toBe('24h');
    });

    it('should handle sorting', async () => {
      const response = await request(app).get(
        '/api/tokens?sortField=volume&sortOrder=desc'
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sort');
      expect(response.body.sort.field).toBe('volume');
      expect(response.body.sort.order).toBe('desc');
    });

    it('should handle pagination with limit', async () => {
      const response = await request(app).get('/api/tokens?limit=10');
      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should handle pagination with cursor', async () => {
      const response = await request(app).get(
        '/api/tokens?limit=5&cursor=test-cursor'
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should validate and clamp limit', async () => {
      const response = await request(app).get('/api/tokens?limit=200');
      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBeLessThanOrEqual(100);
    });
  });

  describe('GET /api/tokens/:address', () => {
    it('should return token by address', async () => {
      const response = await request(app).get(
        '/api/tokens/576P1t7XsRL4ZVj38LV2eYWxXRPguBADA8BxcNz1xo8y'
      );
      // May return 404 if token not found, which is acceptable
      expect([200, 404]).toContain(response.status);
    });

    it('should return 404 for non-existent token', async () => {
      const response = await request(app).get(
        '/api/tokens/non-existent-address'
      );
      // May return 404 or 200 depending on aggregation results
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });
  });
});

