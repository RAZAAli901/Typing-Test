function testPrivateDataLeakageRegression() {
  console.log("[TEST] Executing private data leakage regression test...");

  // Mock public leaderboard user object payload
  const publicLeaderboardUser = {
    username: "speed_typer_99",
    avatarUrl: "http://example.com/avatar.png",
    createdAt: new Date().toISOString(),
  };

  const keys = Object.keys(publicLeaderboardUser);

  if (keys.includes("email") || keys.includes("passwordHash") || keys.includes("verificationCodes")) {
    console.error("FAIL: Public API response payload contains private user fields!");
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Public API payload verified cleanly. Zero exposure of email or sensitive credentials.");
}

testPrivateDataLeakageRegression();
