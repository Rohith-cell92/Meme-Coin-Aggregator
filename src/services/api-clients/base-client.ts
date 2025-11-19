import axios, { AxiosInstance, AxiosError } from 'axios';
import logger from '../../utils/logger';
import { withRetry } from '../../utils/retry';

export abstract class BaseApiClient {
  protected client: AxiosInstance;
  protected rateLimit: number;
  private requestQueue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestCount = 0;
  private resetInterval: NodeJS.Timeout;

  constructor(baseUrl: string, rateLimit: number) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.rateLimit = rateLimit;

    // Reset request count every minute
    this.resetInterval = setInterval(() => {
      this.requestCount = 0;
    }, 60000);

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          logger.warn(`Rate limit hit for ${baseUrl}`);
        }
        return Promise.reject(error);
      }
    );
  }

  protected async makeRequest<T>(
    requestFn: () => Promise<T>,
    retryable = true
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          // Check rate limit
          if (this.requestCount >= this.rateLimit) {
            const waitTime = 60000 - (Date.now() % 60000);
            logger.warn(`Rate limit reached, waiting ${waitTime}ms`);
            await this.sleep(waitTime);
            this.requestCount = 0;
          }

          this.requestCount++;

          if (retryable) {
            const result = await withRetry(requestFn, {
              maxRetries: 3,
              initialDelay: 1000,
              backoffMultiplier: 2,
            });
            resolve(result);
          } else {
            const result = await requestFn();
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          logger.error('Request failed:', error);
        }
      }
    }

    this.processing = false;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  destroy(): void {
    clearInterval(this.resetInterval);
  }
}

