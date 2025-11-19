import { Router, Request, Response } from 'express';
import { AggregatorService } from '../services/aggregator';
import { FilterOptions, SortOptions, PaginationOptions } from '../types';
import logger from '../utils/logger';

const router = Router();
const aggregator = new AggregatorService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string | undefined;
    const timePeriod = req.query.timePeriod as '1h' | '24h' | '7d' | undefined;
    const minVolume = req.query.minVolume
      ? parseFloat(req.query.minVolume as string)
      : undefined;
    const minLiquidity = req.query.minLiquidity
      ? parseFloat(req.query.minLiquidity as string)
      : undefined;
    const protocol = req.query.protocol as string | undefined;
    const sortField = (req.query.sortField as string) || 'volume';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;
    const cursor = req.query.cursor as string | undefined;

    // Validate limit
    const validLimit = Math.min(Math.max(limit, 1), 100);

    // Build filters
    const filters: FilterOptions = {};
    if (timePeriod) filters.timePeriod = timePeriod;
    if (minVolume !== undefined) filters.minVolume = minVolume;
    if (minLiquidity !== undefined) filters.minLiquidity = minLiquidity;
    if (protocol) filters.protocol = protocol;

    // Build sort options
    const sort: SortOptions = {
      field: sortField as any,
      order: sortOrder,
    };

    // Build pagination
    const pagination: PaginationOptions = {
      limit: validLimit,
      cursor,
    };

    // Aggregate tokens
    let tokens = await aggregator.aggregateTokens(query);

    // Apply filters
    if (Object.keys(filters).length > 0) {
      tokens = aggregator.filterTokens(tokens, filters);
    }

    // Apply sorting
    tokens = aggregator.sortTokens(tokens, sort);

    // Apply pagination
    const { tokens: paginatedTokens, nextCursor } = aggregator.paginateTokens(
      tokens,
      pagination
    );

    res.json({
      data: paginatedTokens,
      pagination: {
        limit: validLimit,
        nextCursor,
        total: tokens.length,
      },
      filters,
      sort,
      timestamp: new Date(),
    });
  } catch (error: any) {
    logger.error('Error fetching tokens:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

router.get('/:address', async (req: Request, res: Response) => {
  try {
    const address = req.params.address;
    const tokens = await aggregator.aggregateTokens(address);

    const token = tokens.find(
      (t) => t.token_address.toLowerCase() === address.toLowerCase()
    );

    if (!token) {
      return res.status(404).json({
        error: 'Token not found',
      });
    }

    return res.json({
      data: token,
      timestamp: new Date(),
    });
  } catch (error: any) {
    logger.error('Error fetching token:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

export default router;

