/**
 * In-memory rate limiter.
 * For production, swap with Redis-backed solution.
 * Uses sliding window counter pattern.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  windowMs: number; // time window in ms
  maxRequests: number; // max requests per window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  // No existing entry or window expired
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Within window
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Rate limited
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

// Default rate limit configs
export const RATE_LIMITS = {
  // Research endpoint: 10 requests per minute per IP
  research: { windowMs: 60_000, maxRequests: 10 },
  // Sources endpoint: 30 requests per minute per IP
  sources: { windowMs: 60_000, maxRequests: 30 },
} as const;
