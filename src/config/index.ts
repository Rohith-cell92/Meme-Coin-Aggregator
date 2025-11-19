import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: parseInt(process.env.REDIS_TTL || '30', 10),
  },
  api: {
    dexscreener: {
      baseUrl: 'https://api.dexscreener.com',
      rateLimit: parseInt(process.env.DEXSCREENER_RATE_LIMIT || '300', 10),
    },
    jupiter: {
      baseUrl: 'https://lite-api.jup.ag',
      rateLimit: parseInt(process.env.JUPITER_RATE_LIMIT || '100', 10),
    },
    geckoterminal: {
      baseUrl: 'https://api.geckoterminal.com/api/v2',
      rateLimit: parseInt(process.env.GECKOTERMINAL_RATE_LIMIT || '100', 10),
      apiKey: process.env.GECKOTERMINAL_API_KEY || undefined,
    },
  },
  updates: {
    interval: parseInt(process.env.UPDATE_INTERVAL || '30', 10),
    websocketInterval: parseInt(process.env.WEBSOCKET_UPDATE_INTERVAL || '5', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

