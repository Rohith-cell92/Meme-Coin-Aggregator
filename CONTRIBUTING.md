# Contributing Guide

Thank you for your interest in contributing to the Meme Coin Aggregator Service!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env`)
4. Start Redis: `docker run -d -p 6379:6379 redis:latest`
5. Run in development: `npm run dev`

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run `npm run lint` before committing
- Run `npm run format` to format code

## Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Maintain or improve test coverage
- Test WebSocket functionality manually using `test-websocket.html`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests
4. Update documentation if needed
5. Ensure all tests pass
6. Submit a pull request with a clear description

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add new filtering option`
- `fix: resolve Redis connection issue`
- `docs: update API documentation`
- `test: add tests for aggregator service`

## Questions?

Open an issue for questions or discussions about the project.

