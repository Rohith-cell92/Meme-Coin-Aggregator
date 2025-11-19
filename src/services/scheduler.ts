import cron from 'node-cron';
import { AggregatorService } from './aggregator';
import { cacheService } from './cache';
import { config } from '../config';
import logger from '../utils/logger';

export class SchedulerService {
  private aggregator: AggregatorService;
  private updateJob: cron.ScheduledTask | null = null;

  constructor() {
    this.aggregator = new AggregatorService();
  }

  start(): void {
    // Update tokens every UPDATE_INTERVAL seconds
    const intervalSeconds = config.updates.interval;
    const cronExpression = `*/${intervalSeconds} * * * * *`; // Every N seconds

    this.updateJob = cron.schedule(cronExpression, async () => {
      logger.info('Running scheduled token update...');
      try {
        await this.updateTokens();
      } catch (error) {
        logger.error('Error in scheduled update:', error);
      }
    });

    logger.info(
      `Scheduler started: updating tokens every ${intervalSeconds} seconds`
    );

    // Run initial update
    this.updateTokens();
  }

  private async updateTokens(): Promise<void> {
    try {
      // Invalidate cache to force fresh data
      await cacheService.invalidatePattern('tokens:*');

      // Fetch fresh data (will be cached)
      await this.aggregator.aggregateTokens();

      logger.debug('Token cache refreshed');
    } catch (error) {
      logger.error('Error updating tokens:', error);
    }
  }

  stop(): void {
    if (this.updateJob) {
      this.updateJob.stop();
      this.updateJob = null;
      logger.info('Scheduler stopped');
    }
  }
}

