const rateLimits = new Map<string, number>();

// Clean up stale entries every 10 minutes to prevent memory leaks in long-running Node processes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(now: number) {
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [key, timestamp] of rateLimits.entries()) {
      if (now - timestamp > CLEANUP_INTERVAL_MS) {
        rateLimits.delete(key);
      }
    }
    lastCleanup = now;
  }
}

/**
 * Basic in-memory rate limiter with leak protection.
 * In a serverless/Vercel environment, this resets on cold starts.
 * For true distributed rate limiting, replace with Redis/Upstash.
 * @param userId - The user ID to check.
 * @param limitMs - The cooldown period in milliseconds (default: 5000ms).
 * @returns boolean indicating if the user is allowed to proceed.
 */
export function checkRateLimit(userId: string, limitMs: number = 5000): boolean {
  const now = Date.now();
  
  // Periodically clean up to prevent memory leaks
  cleanupStaleEntries(now);

  const lastCall = rateLimits.get(userId);

  if (lastCall && now - lastCall < limitMs) {
    return false;
  }

  rateLimits.set(userId, now);
  return true;
}
