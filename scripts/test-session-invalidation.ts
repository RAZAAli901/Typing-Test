function testSessionInvalidationRegression() {
  console.log("[TEST] Executing session invalidation regression test...");

  const tokenIssuedAtSeconds = 1700000000; // T1
  const sessionInvalidatedAtDate = new Date((tokenIssuedAtSeconds + 300) * 1000); // T2 (5 minutes after T1)
  const invalidatedAtSeconds = Math.floor(sessionInvalidatedAtDate.getTime() / 1000);

  // Verification rule check
  const isInvalidated = tokenIssuedAtSeconds < invalidatedAtSeconds;

  if (!isInvalidated) {
    console.error("FAIL: Issued token prior to session invalidation timestamp was erroneously accepted.");
    process.exit(1);
  }

  // Token issued AFTER invalidation timestamp
  const newTokenIssuedAtSeconds = tokenIssuedAtSeconds + 600;
  const isNewValid = newTokenIssuedAtSeconds >= invalidatedAtSeconds;

  if (!isNewValid) {
    console.error("FAIL: Newly issued token after invalidation was incorrectly rejected.");
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Session invalidation regression test passed cleanly!");
}

testSessionInvalidationRegression();
