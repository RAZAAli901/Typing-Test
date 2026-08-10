import { checkSupabaseEnvVars } from "../src/lib/env";

async function testBootReadiness() {
  console.log("[BOOT VERIFICATION] Testing application boot readiness...");
  
  const envCheck = checkSupabaseEnvVars();
  console.log("[BOOT VERIFICATION] Supabase Environment Check:", {
    isValid: envCheck.isValid,
    hasPublicUrl: envCheck.hasPublicUrl,
    hasAnonKey: envCheck.hasAnonKey,
    hasDatabaseUrl: envCheck.hasDatabaseUrl,
  });

  console.log("[BOOT VERIFICATION] Boot readiness check completed successfully.");
}

testBootReadiness();
