import { execSync } from "child_process";

async function runAllTests() {
  console.log("================================================================================");
  console.log("EXECUTION MASTER TEST SUITE — SUPABASE MIGRATION VERIFICATION");
  console.log("================================================================================");

  const testScripts = [
    "scripts/test-boot-readiness.ts",
    "scripts/test-supabase-storage-security.ts",
    "scripts/test-supabase-storage-legitimate-upload.ts",
    "scripts/test-realtime-across-modes.ts",
    "scripts/test-polling-fallback.ts",
    "scripts/test-realtime-perf.ts",
    "scripts/test-presence-join-leave.ts",
    "scripts/test-pb-alert-filtering.ts",
    "scripts/test-supabase-auth-flow.ts",
    "scripts/test-supabase-avatar-upload.ts",
    "scripts/test-supabase-session-score.ts",
    "scripts/test-supabase-realtime-event.ts",
    "scripts/test-rls-prisma-compatibility.ts",
    "scripts/test-anon-key-permissions.ts",
    "scripts/load-test-connection-pooler.ts",
    "scripts/test-migration-idempotency.ts",
    "scripts/test-rollback-restoration.ts",
  ];

  let passed = 0;

  for (const script of testScripts) {
    try {
      console.log(`\n[RUNNING TEST]: npx tsx ${script}`);
      execSync(`npx tsx ${script}`, { stdio: "inherit" });
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${script}`);
    }
  }

  console.log("\n================================================================================");
  console.log(`MASTER TEST SUITE COMPLETED: ${passed}/${testScripts.length} Passed`);
  console.log("================================================================================");
}

runAllTests();
