# Deployment Guide

This guide covers deploying the Meme Coin Aggregator Service to various hosting platforms.

## Prerequisites

- Node.js 18+ installed
- Redis instance (can be provided by hosting platform or external service)
- Git repository access

## Environment Variables

Create a `.env` file or set environment variables in your hosting platform:

```env
NODE_ENV=production
PORT=3000
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TTL=30
UPDATE_INTERVAL=30
WEBSOCKET_UPDATE_INTERVAL=5
LOG_LEVEL=info
```

## Deployment Options

### 1. Render.com

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add Redis instance from Render's Redis addon
6. Set environment variables
7. Deploy

**Note**: Free tier has limitations. Consider paid tier for production.

### 2. Railway.app

1. Connect your GitHub repository
2. Create a new project
3. Add Redis service from Railway's addons
4. Set environment variables
5. Deploy

Railway automatically detects Node.js and runs `npm start`.

### 3. Fly.io

1. Install Fly CLI: `npm install -g @fly/cli`
2. Login: `fly auth login`
3. Initialize: `fly launch`
4. Add Redis: `fly redis create`
5. Set secrets: `fly secrets set REDIS_HOST=... REDIS_PORT=...`
6. Deploy: `fly deploy`

### 4. Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add Redis: `heroku addons:create heroku-redis:mini` (paid)
5. Set config vars in Heroku dashboard
6. Deploy: `git push heroku main`

### 5. DigitalOcean App Platform

1. Connect GitHub repository
2. Create new app
3. Add Redis database component
4. Set environment variables
5. Deploy

## Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t meme-coin-aggregator .
docker run -p 3000:3000 --env-file .env meme-coin-aggregator
```

## Redis Hosting Options

### Free Redis Services

1. **Upstash Redis**: Free tier with 10K commands/day
2. **Redis Cloud**: Free tier available
3. **Railway Redis**: Included with Railway deployment
4. **Render Redis**: Available as addon

### Self-Hosted Redis

If deploying Redis yourself:

```bash
docker run -d -p 6379:6379 redis:latest
```

## Health Checks

Most platforms support health checks. Use:

```
GET /api/health
```

Expected response: `200 OK` with service status.

## Monitoring

Consider adding:

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Logging**: Logtail, Papertrail
- **Metrics**: Prometheus, DataDog

## Scaling Considerations

For high traffic:

1. Use Redis cluster for caching
2. Implement horizontal scaling (multiple instances)
3. Use load balancer (nginx, Cloudflare)
4. Consider message queue (Bull, RabbitMQ) for background jobs
5. Upgrade to paid API tiers for higher rate limits

## Troubleshooting

### Redis Connection Issues

- Verify Redis host/port are correct
- Check firewall rules
- Ensure Redis password is set if required
- Test connection: `redis-cli -h HOST -p PORT ping`

### Port Issues

- Ensure PORT environment variable matches platform's expected port
- Some platforms (Heroku, Railway) set PORT automatically

### Build Failures

- Ensure Node.js version matches (18+)
- Check that all dependencies are in package.json
- Verify TypeScript compilation succeeds locally first

## Post-Deployment Checklist

- [ ] Service is accessible at public URL
- [ ] Health endpoint returns 200
- [ ] Redis connection is working
- [ ] WebSocket connections work
- [ ] API endpoints return data
- [ ] Environment variables are set correctly
- [ ] Logs are accessible
- [ ] Error tracking is configured (optional)

## Example Deployment URLs

After deployment, update these in your documentation:

- API Base URL: `https://your-app.railway.app` or `https://your-app.onrender.com`
- WebSocket URL: `wss://your-app.railway.app` or `wss://your-app.onrender.com`
- Health Check: `https://your-app.railway.app/api/health`

