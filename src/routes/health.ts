import { Router, Request, Response } from 'express';
import { cacheService } from '../services/cache';
import { WebSocketService } from '../services/websocket';

const router = Router();

// Store websocket service reference
let wsService: WebSocketService | null = null;

export function setWebSocketService(service: WebSocketService): void {
  wsService = service;
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check Redis connection
    let redisStatus = 'disconnected';
    try {
      await cacheService.get('health:check');
      redisStatus = 'connected';
    } catch (error) {
      redisStatus = 'error';
    }

    const health = {
      status: 'ok',
      timestamp: new Date(),
      services: {
        redis: redisStatus,
        websocket: {
          connected: wsService ? wsService.getConnectedClientsCount() : 0,
          status: wsService ? 'running' : 'not initialized',
        },
      },
    };

    const isHealthy = redisStatus === 'connected';
    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    });
  }
});

export default router;

