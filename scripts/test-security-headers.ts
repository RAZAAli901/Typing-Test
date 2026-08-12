import nextConfig from "../next.config";

async function testSecurityHeadersRegression() {
  console.log("[TEST] Executing security headers presence regression test...");

  const headersConfig = await nextConfig.headers?.();
  if (!headersConfig || headersConfig.length === 0) {
    console.error("FAIL: next.config.ts headers function returned no configuration!");
    process.exit(1);
  }

  const globalHeaders = headersConfig.find((h) => h.source === "/:path*")?.headers || [];
  const headerKeys = globalHeaders.map((h) => h.key.toLowerCase());

  const REQUIRED_HEADERS = [
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "strict-transport-security",
  ];

  for (const required of REQUIRED_HEADERS) {
    if (!headerKeys.includes(required)) {
      console.error(`FAIL: Missing required security header in next.config.ts: '${required}'`);
      process.exit(1);
    }
  }

  console.log("\x1b[32m[PASS]\x1b[0m All 6 mandatory security headers are verified present in next.config.ts!");
}

testSecurityHeadersRegression();
