import { isGlobalIpRateLimited } from "../src/lib/rateLimit";

function testGlobalRateLimitRegression() {
  console.log("[TEST] Executing global per-IP rate limit regression test...");

  const testIp = "198.51.100.45";

  // Simulate 5 requests under a max 5 threshold
  for (let i = 1; i <= 5; i++) {
    const limited = isGlobalIpRateLimited(testIp, 5, 60000);
    if (limited) {
      console.error(`FAIL: Global rate limit triggered prematurely on request ${i}`);
      process.exit(1);
    }
  }

  // 6th request must trigger global ceiling
  const limited6 = isGlobalIpRateLimited(testIp, 5, 60000);
  if (!limited6) {
    console.error("FAIL: Global rate limit did not trigger on 6th request exceeding ceiling!");
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Global per-IP rate ceiling regression test passed cleanly!");
}

testGlobalRateLimitRegression();
