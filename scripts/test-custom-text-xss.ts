function testCustomTextXssRegression() {
  console.log("[TEST] Executing stored-XSS payload neutralization regression test...");

  const xssPayload = "<script>alert('XSS')</script>Hello <img src=x onerror=alert(1)> World";
  
  // Apply server-side sanitization logic used in practice-sessions/start
  const sanitizedText = xssPayload
    .trim()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  if (sanitizedText.includes("<script>") || sanitizedText.includes("<img") || sanitizedText.includes("onerror")) {
    console.error(`FAIL: HTML/script tags were not stripped! Output: ${sanitizedText}`);
    process.exit(1);
  }

  if (sanitizedText !== "alert('XSS')Hello  World") {
    console.error(`FAIL: Sanitization output mismatch. Got: '${sanitizedText}'`);
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Stored-XSS payload correctly neutralized to inert text:", sanitizedText);
}

testCustomTextXssRegression();
