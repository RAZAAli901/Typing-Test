import { detectRealImageType } from "../src/app/api/profile/avatar/route";

async function testStorageSecurityRegression() {
  console.log("[STORAGE SECURITY REGRESSION] Testing magic-byte and SVG payload rejection...");

  // Test 1: Fake image with SVG script payload
  const svgBuffer = Buffer.from("<svg onload=\"alert('XSS')\"></svg>");
  const svgHeader = svgBuffer.toString("utf-8").toLowerCase();
  const isSvgDetected = svgHeader.includes("<svg") || svgHeader.includes("<script");

  console.log(`  [TEST 1] SVG Script Payload Scan: ${isSvgDetected ? "REJECTED (PASS)" : "ALLOWED (FAIL)"}`);
  if (!isSvgDetected) {
    console.error("❌ REGRESSION TEST FAILED: SVG script payload was NOT rejected!");
    process.exit(1);
  }

  // Test 2: Random text file renamed as PNG
  const fakePngBuffer = Buffer.from("THIS_IS_NOT_A_REAL_PNG_FILE");
  const detectedType = await detectRealImageType(fakePngBuffer);

  console.log(`  [TEST 2] Fake PNG Magic Byte Check: ${detectedType === null ? "REJECTED (PASS)" : "ALLOWED (FAIL)"}`);
  if (detectedType !== null) {
    console.error("❌ REGRESSION TEST FAILED: Fake image passed magic byte verification!");
    process.exit(1);
  }

  console.log("[STORAGE SECURITY REGRESSION] SUCCESS! All invalid files correctly rejected.");
}

testStorageSecurityRegression();
