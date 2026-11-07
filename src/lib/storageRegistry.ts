import { CONSENT_STORAGE_KEY } from "@/lib/consent";

export type StorageCategory = "Necessary" | "Functional" | "Advertising";
export type StorageType = "cookie" | "localStorage" | "sessionStorage";

export interface StorageEntry {
  name: string;
  type: StorageType;
  category: StorageCategory;
  provider: string;
  duration: string;
  purpose: string;
}

export const STORAGE_REGISTRY: StorageEntry[] = [
  {
    name: "next-auth.session-token / __Secure-next-auth.session-token",
    type: "cookie",
    category: "Necessary",
    provider: "TypeMaster (NextAuth)",
    duration: "30 days (rolling)",
    purpose: "Maintains your cryptographically signed, encrypted user authentication session token.",
  },
  {
    name: "next-auth.csrf-token / __Host-next-auth.csrf-token",
    type: "cookie",
    category: "Necessary",
    provider: "TypeMaster (NextAuth)",
    duration: "Browser Session",
    purpose: "Prevents Cross-Site Request Forgery (CSRF) on authentication endpoints.",
  },
  {
    name: "next-auth.callback-url / __Secure-next-auth.callback-url",
    type: "cookie",
    category: "Necessary",
    provider: "TypeMaster (NextAuth)",
    duration: "Browser Session",
    purpose: "Stores the redirect destination following successful user authentication.",
  },
  {
    name: CONSENT_STORAGE_KEY,
    type: "localStorage",
    category: "Necessary",
    provider: "TypeMaster",
    duration: "12 months",
    purpose: "Records your advertising and analytics cookie consent status and timestamp.",
  },
  {
    name: "typemaster_username",
    type: "localStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Persistent",
    purpose: "Remembers your guest display name or username locally to automatically prefill form inputs.",
  },
  {
    name: "typemaster_crt_theme",
    type: "localStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Persistent",
    purpose: "Saves your custom CRT color theme selection (Amber, Green, Cyan, or Classic).",
  },
  {
    name: "typemaster_crt_effects",
    type: "localStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Persistent",
    purpose: "Stores whether retro CRT scanline overlays and monitor curvature effects are active.",
  },
  {
    name: "typemaster_crt_sound",
    type: "localStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Persistent",
    purpose: "Stores your preference for mechanical typewriter sound synthesis on keystrokes.",
  },
  {
    name: "typemaster_crt_live_flash",
    type: "localStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Persistent",
    purpose: "Stores whether real-time score alert flashes are highlighted on the live leaderboard.",
  },
  {
    name: "typemaster_booted",
    type: "sessionStorage",
    category: "Functional",
    provider: "TypeMaster",
    duration: "Browser Tab Session",
    purpose: "Prevents the retro terminal boot animation from repeating during internal page navigation.",
  },
  {
    name: "__gads, __gpi, IDE, DSID (Google AdSense)",
    type: "cookie",
    category: "Advertising",
    provider: "Google LLC / Ad Partners",
    duration: "Up to 13 months",
    purpose: "Delivers non-intrusive advertisements, limits ad frequency, and measures performance. Active ONLY after consent.",
  },
];
