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

testSpoofedSvgRejection().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
