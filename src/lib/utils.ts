// Client-safe utility file - Safe for browser components (Reads NEXT_PUBLIC_SUPABASE_URL)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes user avatar URLs to Supabase Storage CDN URL structure.
 */
export function formatAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/avatars/${url}`;
  }
  return url;
}

/**
 * Validates Origin and Referer headers on custom state-changing API requests (POST/PUT/DELETE)
 * to prevent Cross-Site Request Forgery (CSRF) and origin spoofing.
 */
export function validateOriginAndReferer(request: Request): { valid: boolean; reason?: string } {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!origin && !referer) {
    // Same-origin navigation or server-to-server request
    return { valid: true };
  }

  const checkHeader = origin || referer;
  if (!checkHeader) return { valid: true };

  try {
    const url = new URL(checkHeader);
    const requestHost = host ? host.split(":")[0] : "";
    const originHost = url.hostname;

    const isLocalhost = originHost === "localhost" || originHost === "127.0.0.1" || originHost === "::1";
    const isSameHost = host && (url.host === host || originHost === requestHost);
    const isAllowedProductionDomain = process.env.NEXTAUTH_URL
      ? url.origin === new URL(process.env.NEXTAUTH_URL).origin
      : false;

    if (isLocalhost || isSameHost || isAllowedProductionDomain) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: `Mismatched Origin/Referer header '${checkHeader}' for target host '${host}'`,
    };
  } catch {
    return { valid: false, reason: "Malformed Origin/Referer header URL" };
  }
}
