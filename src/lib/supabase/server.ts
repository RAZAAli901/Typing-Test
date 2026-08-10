import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase Client
 * 
 * KEY USAGE: Uses SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY as fallback).
 * SCOPE: Server-side API routes, Server Components, and Node.js backend routines ONLY.
 * SECURITY NOTICE: The service role key bypasses Row Level Security (RLS).
 * NEVER import this file into a client-side component ('use client').
 */

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
