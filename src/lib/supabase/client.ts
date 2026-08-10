import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase Client
 * 
 * KEY USAGE: Uses NEXT_PUBLIC_SUPABASE_ANON_KEY exclusively.
 * SCOPE: Client components ('use client'), browser hooks, and public Realtime subscriptions.
 * SECURITY NOTICE: Uses anon public key. Operations are governed strictly by Supabase RLS policies.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
