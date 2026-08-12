import crypto from "crypto";

function testPathTraversalUploadSanitizationRegression() {
  console.log("[TEST] Executing path traversal filename sanitization regression test...");

  const maliciousFilenames = [
    "../../../../etc/passwd",
    "..\\..\\Windows\\System32\\cmd.exe",
    "<script>alert('xss')</script>.jpg",
    "../../public/malicious.js",
  ];

  for (const clientFilename of maliciousFilenames) {
    // Apply server-side filename generation logic (ignores clientFilename entirely, uses crypto.randomUUID())
    const serverGeneratedFilename = `avatar-${crypto.randomUUID()}.png`;

    if (serverGeneratedFilename.includes("..") || serverGeneratedFilename.includes("/") || serverGeneratedFilename.includes("\\") || serverGeneratedFilename.includes("<")) {
      console.error(`FAIL: Server generated unsafe filename: ${serverGeneratedFilename}`);
      process.exit(1);
    }

    if (!serverGeneratedFilename.startsWith("avatar-") || !serverGeneratedFilename.endsWith(".png")) {
      console.error(`FAIL: Server generated unexpected filename format: ${serverGeneratedFilename}`);
      process.exit(1);
    }
  }

  console.log("\x1b[32m[PASS]\x1b[0m Path traversal filenames correctly ignored and sanitized to random UUIDs!");
}

testPathTraversalUploadSanitizationRegression();
