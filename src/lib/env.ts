/**
 * Environment Variable Validation & Startup Checks
 *
 * Checks presence of required environment variables for Supabase integration:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY (server-side operations)
 * - DATABASE_URL / DIRECT_URL (Prisma connection pooling & migrations)
 */

export interface SupabaseEnvCheckResult {
  hasPublicUrl: boolean;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  hasDatabaseUrl: boolean;
  hasDirectUrl: boolean;
  isValid: boolean;
  missingVars: string[];
}

export function checkSupabaseEnvVars(): SupabaseEnvCheckResult {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  const missingVars: string[] = [];

  if (!publicUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  if (!anonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)");
  if (!databaseUrl) missingVars.push("DATABASE_URL");

  return {
    hasPublicUrl: !!publicUrl,
    hasAnonKey: !!anonKey,
    hasServiceRoleKey: !!serviceRoleKey,
    hasDatabaseUrl: !!databaseUrl,
    hasDirectUrl: !!directUrl,
    isValid: missingVars.length === 0,
    missingVars,
  };
}

export function assertSupabaseEnvVars(): void {
  const result = checkSupabaseEnvVars();
  if (!result.isValid) {
    console.warn(
      `[SUPABASE ENV WARNING] Missing required Supabase environment variables: ${result.missingVars.join(
        ", "
      )}`
    );
  }
}

/**
 * Early presence check for Supabase configuration.
 * Returns true if all minimal client/server Supabase credentials are configured.
 */
export function checkSupabaseVarsPresence(): boolean {
  const hasUrl = !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const hasKey = !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
  return hasUrl && hasKey;
}

