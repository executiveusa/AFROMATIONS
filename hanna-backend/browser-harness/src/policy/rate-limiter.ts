import { config } from '../config.js';

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

function refill(bucket: Bucket): void {
  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 60_000; // minutes
  bucket.tokens = Math.min(
    config.BROWSER_RATE_LIMIT_RPM,
    bucket.tokens + elapsed * config.BROWSER_RATE_LIMIT_RPM,
  );
  bucket.lastRefill = now;
}

export const rateLimiter = {
  consume(key: string): boolean {
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { tokens: config.BROWSER_RATE_LIMIT_RPM, lastRefill: Date.now() };
      buckets.set(key, bucket);
    }
    refill(bucket);
    if (bucket.tokens < 1) return false;
    bucket.tokens -= 1;
    return true;
  },

  remaining(key: string): number {
    const bucket = buckets.get(key);
    if (!bucket) return config.BROWSER_RATE_LIMIT_RPM;
    refill(bucket);
    return Math.floor(bucket.tokens);
  },

  reset(key: string): void {
    buckets.delete(key);
  },
};
