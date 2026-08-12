// Server-only file - RESTRICTED TO SERVER EXECUTION
import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error(
    "SERVER-ONLY GUARD EXCEPTION: 'src/lib/supabase/server.ts' contains privileged service keys and MUST NOT be imported into client components."
  );
}

/**
 * ============================================================================
 * SERVER-SIDE SUPABASE CLIENT SETUP
 * ============================================================================
 * KEY TYPE USED: SUPABASE_SERVICE_ROLE_KEY (Service Role Key / Admin Key)
 * 
 * WHY THIS KEY IS USED HERE:
 * - The Service Role Key bypasses Row Level Security (RLS) policies completely.
 * - Used strictly for privileged backend administrative tasks (e.g. storage bucket policy bypass, database seed scripts, service operations).
 * - FALLBACK: Uses SUPABASE_ANON_KEY if Service Role Key is absent in dev.
 * 
 * SECURITY RULES:
 * 1. NEVER expose SUPABASE_SERVICE_ROLE_KEY to client components or NEXT_PUBLIC_* variables.
 * 2. NEVER import this module inside any file marked with 'use client'.
 * ============================================================================
 */


const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

