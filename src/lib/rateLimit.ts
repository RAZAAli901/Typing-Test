interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimiters = new Map<string, Map<string, RateLimitInfo>>();

/**
 * Checks if an IP address has exceeded a rate limit inside a given window.
 * Useful for slow-down of credentials brute force.
 */
export function isIpRateLimited(
  ip: string,
  limiterKey: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  if (!rateLimiters.has(limiterKey)) {
    rateLimiters.set(limiterKey, new Map());
  }

  const ipMap = rateLimiters.get(limiterKey)!;
  const clientInfo = ipMap.get(ip);

  if (!clientInfo) {
    ipMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > clientInfo.resetTime) {
    clientInfo.count = 1;
    clientInfo.resetTime = now + windowMs;
    return false;
  }

  clientInfo.count += 1;
  return clientInfo.count > maxRequests;
}
