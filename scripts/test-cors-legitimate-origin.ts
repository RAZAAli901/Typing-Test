import { validateOriginAndReferer } from "../src/lib/utils";

function testCorsLegitimateOriginRegression() {
  console.log("[TEST] Executing legitimate same-origin request regression test...");

  // Mock request with matching same-origin Origin header
  const mockRequest = new Request("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "origin": "http://localhost:3000",
      "host": "localhost:3000",
    },
  });

  const result = validateOriginAndReferer(mockRequest);

  if (!result.valid) {
    console.error(`FAIL: Legitimate same-origin request was rejected! Reason: ${result.reason}`);
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Legitimate same-origin request accepted cleanly.");
}

testCorsLegitimateOriginRegression();
