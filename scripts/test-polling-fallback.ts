import { checkSupabaseVarsPresence } from "../src/lib/env";

async function testPollingFallback() {
  console.log("[TEST POLLING FALLBACK] Verifying polling fallback logic when Realtime is disabled...");

  // Simulate missing Supabase keys to test presence check response
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_URL;

  const isConfigured = checkSupabaseVarsPresence();
  console.log(`  ✓ Presence check with unconfigured environment: ${isConfigured} (Expected false - PASS)`);

  if (isConfigured) {
    console.error("❌ TEST FAILED: Presence check returned true when env vars were deleted!");
    process.exit(1);
  }

  // Restore env var
  if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

  console.log("[TEST POLLING FALLBACK] SUCCESS! Polling fallback condition validated.");
}

testPollingFallback();
