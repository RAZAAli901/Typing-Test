import {
  recordFailedLoginAttempt,
  checkAccountLockout,
  resetAccountLockout,
} from "../src/lib/passwords";

function testAccountLockoutRegression() {
  console.log("[TEST] Executing account lockout regression test...");

  const testEmail = "lockout_test_user@example.com";

  // Step 1: Ensure initial state is not locked
  const initialCheck = checkAccountLockout(testEmail);
  if (initialCheck.isLocked) {
    console.error("FAIL: Initial account state should not be locked.");
    process.exit(1);
  }

  // Step 2: Record 4 failed login attempts (should NOT lock yet)
  for (let i = 1; i <= 4; i++) {
    const result = recordFailedLoginAttempt(testEmail);
    if (result.isLocked) {
      console.error(`FAIL: Account locked prematurely on attempt ${i}`);
      process.exit(1);
    }
  }

  // Step 3: Record 5th failed login attempt (MUST trigger lockout)
  const lockResult = recordFailedLoginAttempt(testEmail);
  if (!lockResult.isLocked || lockResult.remainingMinutes !== 15) {
    console.error("FAIL: 5th failed attempt did not trigger 15-minute account lockout.");
    process.exit(1);
  }

  // Step 4: Verify checkAccountLockout returns locked state
  const lockedCheck = checkAccountLockout(testEmail);
  if (!lockedCheck.isLocked) {
    console.error("FAIL: checkAccountLockout did not return locked state.");
    process.exit(1);
  }

  // Step 5: Reset lockout and verify restoration
  resetAccountLockout(testEmail);
  const clearedCheck = checkAccountLockout(testEmail);
  if (clearedCheck.isLocked) {
    console.error("FAIL: Resetting account lockout failed.");
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Account lockout regression test passed cleanly!");
}

testAccountLockoutRegression();
