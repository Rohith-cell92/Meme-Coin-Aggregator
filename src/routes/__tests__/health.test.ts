import request from 'supertest';
import express from 'express';
import healthRouter from '../health';

const app = express();
app.use(express.json());
app.use('/api/health', healthRouter);

describe('Health Router', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
    });

    it('should include Redis status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.services).toHaveProperty('redis');
    });

    it('should include WebSocket status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body.services).toHaveProperty('websocket');
    });
  });
});

