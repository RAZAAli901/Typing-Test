import { execSync } from "child_process";

const SECURITY_TEST_SCRIPTS = [
  "scripts/test-account-lockout.ts",
  "scripts/test-session-invalidation.ts",
  "scripts/test-rls-anon-write.ts",
  "scripts/test-rls-verification-code.ts",
  "scripts/test-profile-authorization.ts",
  "scripts/test-private-data-leakage.ts",
  "scripts/test-input-validation.ts",
  "scripts/test-custom-text-xss.ts",
  "scripts/test-cors-forged-origin.ts",
  "scripts/test-cors-legitimate-origin.ts",
  "scripts/test-global-rate-limit.ts",
  "scripts/test-legitimate-rate-limit.ts",
  "scripts/test-security-headers.ts",
  "scripts/test-health-degraded.ts",
  "scripts/test-path-traversal-upload.ts",
  "scripts/test-avatar-cleanup.ts",
];

function runMasterSecuritySuite() {
  console.log("================================================================================");
  console.log("🔒 EXECUTING MASTER SECURITY REGRESSION TEST SUITE (16 TEST MODULES)");
  console.log("================================================================================\n");

  let passedCount = 0;
  let failedCount = 0;

  for (const scriptPath of SECURITY_TEST_SCRIPTS) {
    try {
      console.log(`\x1b[34m[RUNNING]\x1b[0m ${scriptPath}...`);
      execSync(`npx tsx ${scriptPath}`, { stdio: "inherit" });
      passedCount += 1;
      console.log(`\x1b[32m[PASSED]\x1b[0m ${scriptPath}\n`);
    } catch (error) {
      failedCount += 1;
      console.error(`\x1b[31m[FAILED]\x1b[0m ${scriptPath}\n`);
    }
  }

  console.log("================================================================================");
  console.log(`SECURITY TEST SUMMARY: Total: ${SECURITY_TEST_SCRIPTS.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runMasterSecuritySuite();
