// Server-only file - Centralized Rate Limiting & Abuse Prevention Engine
import { NextResponse } from "next/server";
import { logSecurityEvent } from "./logger";

interface RateLimitInfo {
  count: number;
  resetTime: number;
  violations: number;
  bannedUntil?: number;
}

const rateLimiters = new Map<string, Map<string, RateLimitInfo>>();
const globalIpLimiter = new Map<string, RateLimitInfo>();
const ipBans = new Map<string, number>(); // IP -> Banned until timestamp

// IP Allowlist configuration for dev/testing
const ALLOWLISTED_IPS = new Set<string>([
  "127.0.0.1",
  "::1",
  "localhost",
  ...(process.env.ALLOWLISTED_IPS ? process.env.ALLOWLISTED_IPS.split(",").map((ip) => ip.trim()) : []),
]);

export function isIpAllowlisted(ip: string): boolean {
  return ALLOWLISTED_IPS.has(ip);
}

export function addIpToAllowlist(ip: string): void {
  ALLOWLISTED_IPS.add(ip);
}

/**
 * Checks if an IP is currently banned due to repeated abuse.
 */
export function checkTemporaryIpBan(ip: string): { isBanned: boolean; remainingSeconds: number } {
  if (isIpAllowlisted(ip)) return { isBanned: false, remainingSeconds: 0 };
  const bannedUntil = ipBans.get(ip);
  if (!bannedUntil) return { isBanned: false, remainingSeconds: 0 };

  const now = Date.now();
  if (now < bannedUntil) {
    const remainingSeconds = Math.ceil((bannedUntil - now) / 1000);
    return { isBanned: true, remainingSeconds };
  }

  ipBans.delete(ip);
  return { isBanned: false, remainingSeconds: 0 };
}

/**
 * Enforces global per-IP ceiling (100 combined requests/min) across all endpoints.
 */
export function isGlobalIpRateLimited(ip: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  if (isIpAllowlisted(ip)) return false;

  const now = Date.now();
  let info = globalIpLimiter.get(ip);

  if (!info || now > info.resetTime) {
    info = { count: 1, resetTime: now + windowMs, violations: 0 };
    globalIpLimiter.set(ip, info);
    return false;
  }

  info.count += 1;
  if (info.count > maxRequests) {
    info.violations += 1;
    if (info.violations >= 3) {
      const banDurationMs = 30 * 60 * 1000; // 30-minute ban
      ipBans.set(ip, now + banDurationMs);
      logSecurityEvent({
        event: "RATE_LIMIT_TRIGGERED",
        ip,
        reason: `Temporary IP ban imposed for 30 minutes due to repeated rate limit violations`,
      });
    }
    return true;
  }

  return false;
}

/**
 * Checks if an IP address has exceeded a rate limit inside a given window for a specific route.
 */
export function isIpRateLimited(
  ip: string,
  limiterKey: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  if (isIpAllowlisted(ip)) return false;

  const ban = checkTemporaryIpBan(ip);
  if (ban.isBanned) return true;

  const now = Date.now();
  if (!rateLimiters.has(limiterKey)) {
    rateLimiters.set(limiterKey, new Map());
  }

  const ipMap = rateLimiters.get(limiterKey)!;
  let clientInfo = ipMap.get(ip);

  if (!clientInfo || now > clientInfo.resetTime) {
    clientInfo = { count: 1, resetTime: now + windowMs, violations: clientInfo?.violations || 0 };
    ipMap.set(ip, clientInfo);
    return false;
  }

  clientInfo.count += 1;
  if (clientInfo.count > maxRequests) {
    clientInfo.violations += 1;
    logSecurityEvent({
      event: "RATE_LIMIT_TRIGGERED",
      ip,
      reason: `Route rate limit exceeded on '${limiterKey}': ${clientInfo.count}/${maxRequests} requests`,
    });
    return true;
  }

  return false;
}

/**
 * Builds a standardized 429 Too Many Requests response with a Retry-After header.
 */
export function buildRateLimitResponse(retryAfterSeconds: number = 60, message?: string): NextResponse {
  return NextResponse.json(
    {
      error: message || `Too many requests. Please wait ${retryAfterSeconds} seconds before trying again.`,
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfterSeconds.toString(),
      },
    }
  );
}
