// Server-only environment variable validation logic
import { z } from "zod";

/**
 * Zod schema defining required and optional environment variables for TypeMaster Web.
 * Fails fast on server startup if any mandatory secret is missing or empty.
 */
export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL").optional(),
  SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

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

/**
 * Validates environment variables against Zod schema.
 * Throws a detailed error and fails fast if validation fails.
 */
export function validateEnvOrThrow(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error("[FATAL ENV ERROR] Environment variable validation failed:\n" + errorDetails);
    throw new Error(`Invalid environment configuration:\n${errorDetails}`);
  }
  return parsed.data;
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

export function checkSupabaseVarsPresence(): boolean {
  const hasUrl = !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const hasKey = !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
  return hasUrl && hasKey;
}
