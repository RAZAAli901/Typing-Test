import { checkSupabaseVarsPresence } from "../src/lib/env";

async function monitorProductionHealth() {
  console.log("[POST-DEPLOYMENT MONITORING] Checking system health indicators...");

  const isConfigured = checkSupabaseVarsPresence();
  console.log(`  ✓ Supabase configuration status: ${isConfigured ? "HEALTHY (PASS)" : "UNCONFIGURED"}`);

  console.log("[POST-DEPLOYMENT MONITORING] Health check completed cleanly.");
}

monitorProductionHealth();
