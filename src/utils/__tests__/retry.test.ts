import { withRetry } from '../retry';

describe('withRetry', () => {
  it('should succeed on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await withRetry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockResolvedValue('success');

    const result = await withRetry(fn, { maxRetries: 3 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should fail after max retries', async () => {
    const error = { response: { status: 500 } };
    const fn = jest.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 2 })).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should not retry on non-retryable status codes', async () => {
    const error = { response: { status: 400 } };
    const fn = jest.fn().mockRejectedValue(error);

    await expect(withRetry(fn)).rejects.toEqual(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use exponential backoff', async () => {
    const startTime = Date.now();
    const fn = jest
      .fn()
      .mockRejectedValueOnce({ response: { status: 500 } })
      .mockResolvedValue('success');

    await withRetry(fn, {
      maxRetries: 1,
      initialDelay: 100,
      backoffMultiplier: 2,
    });

    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

