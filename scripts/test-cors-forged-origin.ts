import { validateOriginAndReferer } from "../src/lib/utils";

function testCorsForgedOriginRegression() {
  console.log("[TEST] Executing forged origin header rejection regression test...");

  // Mock request with mismatched/forged cross-site Origin header
  const mockRequest = new Request("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "origin": "https://malicious-attacker-domain.com",
      "host": "localhost:3000",
    },
  });

  const result = validateOriginAndReferer(mockRequest);

  if (result.valid) {
    console.error("FAIL: Forged origin header was erroneously accepted!");
    process.exit(1);
  }

  console.log(`\x1b[32m[PASS]\x1b[0m Forged origin correctly rejected: ${result.reason}`);
}

testCorsForgedOriginRegression();
