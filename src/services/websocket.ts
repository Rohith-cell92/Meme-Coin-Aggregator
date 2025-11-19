import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Token, TokenUpdate } from '../types';
import { AggregatorService } from './aggregator';
import { config } from '../config';
import logger from '../utils/logger';

export class WebSocketService {
  private io: SocketIOServer;
  private aggregator: AggregatorService;
  private updateInterval: NodeJS.Timeout | null = null;
  private connectedClients = new Set<string>();
  private lastTokenData: Map<string, Token> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.aggregator = new AggregatorService();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      this.connectedClients.add(socket.id);
      logger.info(`Client connected: ${socket.id} (Total: ${this.connectedClients.size})`);

      // Send initial data
      this.sendInitialData(socket);

      socket.on('disconnect', () => {
        this.connectedClients.delete(socket.id);
        logger.info(`Client disconnected: ${socket.id} (Total: ${this.connectedClients.size})`);
      });

      socket.on('subscribe', (data: { filters?: any }) => {
        logger.debug(`Client ${socket.id} subscribed with filters:`, data);
        // Store subscription preferences if needed
      });
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  private async sendInitialData(socket: any): Promise<void> {
    try {
      const tokens = await this.aggregator.aggregateTokens();
      
      // Store last known state
      tokens.forEach((token) => {
        this.lastTokenData.set(token.token_address, token);
      });

      socket.emit('tokens:initial', { tokens, timestamp: new Date() });
    } catch (error) {
      logger.error('Error sending initial data:', error);
      socket.emit('error', { message: 'Failed to load initial data' });
    }
  }

  private startPeriodicUpdates(): void {
    if (this.updateInterval) {
      return;
    }

    this.updateInterval = setInterval(async () => {
      if (this.connectedClients.size === 0) {
        return;
      }

      try {
        await this.broadcastUpdates();
      } catch (error) {
        logger.error('Error in periodic update:', error);
      }
    }, config.updates.websocketInterval * 1000);
  }

  private async broadcastUpdates(): Promise<void> {
    try {
      const currentTokens = await this.aggregator.aggregateTokens();
      const updates: TokenUpdate[] = [];

      // Compare with last known state and detect changes
      for (const token of currentTokens) {
        const lastToken = this.lastTokenData.get(token.token_address);

        if (!lastToken) {
          // New token
          updates.push({
            token_address: token.token_address,
            price_sol: token.price_sol,
            volume_sol: token.volume_sol,
            market_cap_sol: token.market_cap_sol,
            price_1hr_change: token.price_1hr_change,
            price_24hr_change: token.price_24hr_change,
            price_7d_change: token.price_7d_change,
            transaction_count: token.transaction_count,
            timestamp: new Date(),
          });
        } else {
          // Check for significant changes
          const priceChange = Math.abs(
            (token.price_sol - lastToken.price_sol) / lastToken.price_sol
          );
          const volumeChange = Math.abs(
            (token.volume_sol - lastToken.volume_sol) / (lastToken.volume_sol || 1)
          );

          // Only send update if change is significant (>1% for price, >5% for volume)
          if (priceChange > 0.01 || volumeChange > 0.05) {
            updates.push({
              token_address: token.token_address,
              price_sol: token.price_sol,
              volume_sol: token.volume_sol,
              market_cap_sol: token.market_cap_sol,
              price_1hr_change: token.price_1hr_change,
              price_24hr_change: token.price_24hr_change,
              price_7d_change: token.price_7d_change,
              transaction_count: token.transaction_count,
              timestamp: new Date(),
            });
          }
        }

        // Update last known state
        this.lastTokenData.set(token.token_address, token);
      }

      if (updates.length > 0) {
        logger.debug(`Broadcasting ${updates.length} token updates`);
        this.io.emit('tokens:update', { updates, timestamp: new Date() });
      }
    } catch (error) {
      logger.error('Error broadcasting updates:', error);
    }
  }

  async broadcastTokenUpdate(update: TokenUpdate): Promise<void> {
    this.io.emit('tokens:update', { updates: [update], timestamp: new Date() });
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.io.close();
  }
}

