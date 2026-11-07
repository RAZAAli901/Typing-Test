export const SITE_NAME = "TypeMaster";
export const SITE_DESCRIPTION =
  "Test, analyze, and master your typing speed and accuracy with global live leaderboards, detailed metrics, and retro CRT styling.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const OPERATOR_NAME = process.env.NEXT_PUBLIC_OPERATOR_NAME || "TypeMaster";
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

export const LEGAL_LAST_UPDATED = "2026-11-07";
