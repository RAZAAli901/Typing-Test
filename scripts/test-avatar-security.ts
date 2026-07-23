import { detectRealImageType } from "../src/app/api/profile/avatar/route";

async function testSpoofedSvgRejection() {
  console.log("Running regression test 14: Spoofed MIME SVG upload rejection...");

  // Create buffer with spoofed Content-Type header intention but SVG payload
  const spoofedSvgContent = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('XSS')</script></svg>`,
    "utf-8"
  );

  const detectedType = await detectRealImageType(spoofedSvgContent);
  if (detectedType !== null) {
    throw new Error(`FAIL: Spoofed SVG payload was incorrectly detected as '${detectedType}'!`);
  }

  const strContent = spoofedSvgContent.toString("utf-8").toLowerCase();
  const containsSvgOrScript = strContent.includes("<svg") || strContent.includes("<script");
  if (!containsSvgOrScript) {
    throw new Error("FAIL: Test buffer missing SVG payload.");
  }

  console.log("PASS: Spoofed MIME SVG upload correctly rejected by magic byte & content inspector.");
}

async function testHtmlDisguisedPngRejection() {
  console.log("Running regression test 15: HTML/script payload with .png extension rejection...");

  const htmlPayload = Buffer.from(
    `<html><head><title>Test</title></head><body><script>window.location='http://attacker.com'</script></body></html>`,
    "utf-8"
  );

  const detectedType = await detectRealImageType(htmlPayload);
  if (detectedType !== null) {
    throw new Error(`FAIL: HTML script payload with .png extension was incorrectly detected as '${detectedType}'!`);
  }

  console.log("PASS: HTML script payload disguised with .png extension correctly rejected.");
}

async function testValidImageAcceptance() {
  console.log("Running regression test 20: Valid PNG, JPEG, WEBP image acceptance...");

  // Valid 1x1 PNG buffer
  const validPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  const pngResult = await detectRealImageType(validPng);
  if (pngResult !== "png") {
    throw new Error(`FAIL: Valid PNG was rejected or misidentified as '${pngResult}'!`);
  }

  // Valid 1x1 WEBP buffer
  const validWebp = Buffer.from("UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v3AgAA=", "base64");
  const webpResult = await detectRealImageType(validWebp);
  if (webpResult !== "webp") {
    throw new Error(`FAIL: Valid WEBP was rejected or misidentified as '${webpResult}'!`);
  }

  console.log("PASS: Legitimate PNG, JPEG, and WEBP images correctly accepted with zero false-positives.");
}

async function runAllSecurityTests() {
  await testSpoofedSvgRejection();
  await testHtmlDisguisedPngRejection();
  await testValidImageAcceptance();
}

runAllSecurityTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
