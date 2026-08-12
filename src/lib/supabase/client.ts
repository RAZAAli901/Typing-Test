// Client-safe file - BROWSER ENVIRONMENT ONLY
import { createClient } from "@supabase/supabase-js";

/**
 * ============================================================================
 * BROWSER-SIDE SUPABASE CLIENT SETUP
 * ============================================================================
 * KEY TYPE USED: NEXT_PUBLIC_SUPABASE_ANON_KEY (Public Anon Key)
 * 
 * WHY THIS KEY IS USED HERE:
 * - Public API key safe for inclusion in client-side JS bundles.
 * - Used for real-time WebSocket subscriptions (Leaderboard, Presence).
 * - All queries/subscriptions made via this client are strictly subject to Supabase RLS policies.
 * 
 * SECURITY RULES:
 * 1. ONLY use NEXT_PUBLIC_SUPABASE_ANON_KEY in browser components.
 * 2. NEVER attempt to include service role keys in this file or any browser code.
 * ============================================================================
 */


// SECURITY ASSERTION: Ensure service role key is never passed to browser client
if (process.env.SUPABASE_SERVICE_ROLE_KEY && typeof window !== "undefined") {
  console.error("SECURITY RISK DETECTED: Service Role Key leaked into browser context!");
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);


