import { testSessionForgeryRegression } from "./test-session-forgery-regression";
import { testScoreValidationRegression } from "./test-score-validation-regression";
import { testGuestSquattingRegression } from "./test-guest-squatting-regression";

export async function runFullSecurityIntegrationSuite() {
  console.log("=================================================");
  console.log("  TYPE MASTER SECURITY INTEGRATION REGRESSION SUITE");
  console.log("=================================================\n");

  try {
    console.log("--> Executing Test #1: Impersonation Protection");
    await testSessionForgeryRegression();
    console.log("[PASS] Test #1 Passed.\n");

    console.log("--> Executing Test #2: Score Recomputation & Validation");
    await testScoreValidationRegression();
    console.log("[PASS] Test #2 Passed.\n");

    console.log("--> Executing Test #3: Guest Username Isolation");
    await testGuestSquattingRegression();
    console.log("[PASS] Test #3 Passed.\n");

    console.log("=================================================");
    console.log("  ALL REGRESSION INTEGRATION TESTS PASSED (3/3)");
    console.log("=================================================");
    return true;
  } catch (error) {
    console.error("\n[FAIL] Security Integration Suite Failed:", error);
    throw error;
  }
}

if (require.main === module) {
  runFullSecurityIntegrationSuite()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
