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


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
