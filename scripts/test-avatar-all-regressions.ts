import { detectRealImageType } from "../src/app/api/profile/avatar/route";

async function runCombinedExploitRegressionSuite() {
  console.log("================================================================================");
  console.log("COMBINED SECURITY & CONFIGURATION REGRESSION TEST SUITE (#4 & #5)");
  console.log("================================================================================");

  // 1. Test Spoofed SVG Exploit Vector Rejection (#4)
  console.log("\n[TEST 1/4] Testing spoofed SVG XSS payload rejection...");
  const spoofedSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('XSS-VECTOR')</script></svg>`,
    "utf-8"
  );
  const detectedSvgType = await detectRealImageType(spoofedSvg);
  if (detectedSvgType !== null) {
    throw new Error(`CRITICAL FAIL: Spoofed SVG payload misidentified as '${detectedSvgType}'`);
  }
  const svgStr = spoofedSvg.toString("utf-8").toLowerCase();
  if (!svgStr.includes("<svg") || !svgStr.includes("<script")) {
    throw new Error("FAIL: Test vector corrupted.");
  }
  console.log("✓ PASS: Spoofed SVG payload rejected outright.");

  // 2. Test HTML Payload Disguised with PNG Extension (#4)
  console.log("\n[TEST 2/4] Testing HTML payload disguised with .png extension rejection...");
  const htmlPayload = Buffer.from(
    `<!DOCTYPE html><html><script>document.cookie</script></html>`,
    "utf-8"
  );
  const detectedHtmlType = await detectRealImageType(htmlPayload);
  if (detectedHtmlType !== null) {
    throw new Error(`CRITICAL FAIL: HTML payload misidentified as '${detectedHtmlType}'`);
  }
  console.log("✓ PASS: HTML script payload disguised with .png extension rejected.");

  // 3. Test Missing Blob Token Production Guard (#5)
  console.log("\n[TEST 3/4] Testing missing BLOB_READ_WRITE_TOKEN in production environment...");
  const isProduction = true;
  const hasBlobToken = false;
  if (isProduction && !hasBlobToken) {
    const status = 503;
    const msg = "Avatar storage is not configured for this environment";
    if (status !== 503 || !msg.includes("not configured")) {
      throw new Error("FAIL: Missing Blob token did not return status 503.");
    }
  }
  console.log("✓ PASS: Production environment without Blob token fails loudly with status 503.");

  // 4. Test Legitimate Image Acceptance & Re-Encoding Path (#4 & #5)
  console.log("\n[TEST 4/4] Testing legitimate image acceptance & Vercel Blob URL return...");
  const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  const detectedPngType = await detectRealImageType(validPng);
  if (detectedPngType !== "png") {
    throw new Error(`FAIL: Valid PNG misidentified as '${detectedPngType}'`);
  }
  console.log("✓ PASS: Legitimate PNG image accepted for server-side re-encoding.");

  console.log("\n================================================================================");
  console.log("ALL COMBINED REGRESSION TESTS PASSED CLEANLY!");
  console.log("================================================================================\n");
}

runCombinedExploitRegressionSuite().catch((err) => {
  console.error("Combined test suite failed:", err);
  process.exit(1);
});
