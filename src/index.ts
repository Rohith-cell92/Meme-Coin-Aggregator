import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import logger from './utils/logger';
import { WebSocketService } from './services/websocket';
import { SchedulerService } from './services/scheduler';
import { cacheService } from './services/cache';
import tokensRouter from './routes/tokens';
import healthRouter, { setWebSocketService } from './routes/health';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for frontend assets
}));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// API Routes
app.use('/api/tokens', tokensRouter);
app.use('/api/health', healthRouter);

// Serve frontend static files in production
if (config.server.env === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
} else {
  // Development: Just show API info
  app.get('/', (_req, res) => {
    res.json({
      message: 'Meme Coin Aggregator API',
      version: '1.0.0',
      endpoints: {
        tokens: '/api/tokens',
        health: '/api/health',
        websocket: 'ws://localhost:' + config.server.port,
      },
    });
  });
}

// Initialize services
const wsService = new WebSocketService(server);
setWebSocketService(wsService);

const scheduler = new SchedulerService();
scheduler.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  scheduler.stop();
  wsService.stop();
  await cacheService.close();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  scheduler.stop();
  wsService.stop();
  await cacheService.close();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = config.server.port;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.server.env}`);
  logger.info(`WebSocket available at ws://localhost:${PORT}`);
});

export default app;

