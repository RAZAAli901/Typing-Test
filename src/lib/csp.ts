/**
 * Content Security Policy (CSP) Configuration Module
 *
 * Defines granular security directives for TypeMaster while ensuring full
 * compatibility with Google AdSense, Next.js hydration, and Supabase WebSockets.
 */

export const CSP_DIRECTIVES = {
  // Fallback for directives not explicitly defined
  defaultSrc: ["'self'"],

  // APIs, Supabase Realtime WebSockets, and secure HTTPS endpoints
  connectSrc: ["'self'", "https:", "wss:"],

  // Avatars, SVGs, and external CDN media
  imgSrc: ["'self'", "data:", "blob:", "https:"],

  // Client-side scripts: Next.js runtime, inline boots, and Google AdSense hosts
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.doubleclick.net",
    "https://*.googleadservices.com",
    "https://*.adtrafficquality.google",
  ],

  // Iframes: AdSense ad units and Sandboxed preview frames
  frameSrc: [
    "'self'",
    "https://googleads.g.doubleclick.net",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.doubleclick.net",
  ],

  // Tailwind / inline theme styles
  styleSrc: ["'self'", "'unsafe-inline'"],

  // Prevent clickjacking / framing of this site
  frameAncestors: ["'none'"],
};

export function buildContentSecurityPolicy(): string {
  const parts: string[] = [
    `default-src ${CSP_DIRECTIVES.defaultSrc.join(" ")}`,
    `connect-src ${CSP_DIRECTIVES.connectSrc.join(" ")}`,
    `img-src ${CSP_DIRECTIVES.imgSrc.join(" ")}`,
    `script-src ${CSP_DIRECTIVES.scriptSrc.join(" ")}`,
    `frame-src ${CSP_DIRECTIVES.frameSrc.join(" ")}`,
    `style-src ${CSP_DIRECTIVES.styleSrc.join(" ")}`,
    `frame-ancestors ${CSP_DIRECTIVES.frameAncestors.join(" ")}`,
    "upgrade-insecure-requests",
  ];

  const policy = parts.join("; ") + ";";

  // Sanity check assertion for AdSense host compliance
  const requiredHosts = [
    "pagead2.googlesyndication.com",
    "doubleclick.net",
    "google.com",
  ];
  for (const host of requiredHosts) {
    if (!policy.includes(host)) {
      throw new Error(`[CSP ERROR] Missing mandatory AdSense host in policy: ${host}`);
    }
  }

  return policy;
}

export const CONTENT_SECURITY_POLICY = buildContentSecurityPolicy();
