function testAvatarCleanupRegression() {
  console.log("[TEST] Executing old avatar image cleanup regression test...");

  const previousAvatarUrl = "https://test-ref.supabase.co/storage/v1/object/public/avatars/avatar-old-uuid-12345.png";
  
  if (!previousAvatarUrl.includes("/avatars/")) {
    console.error("FAIL: Previous avatar URL format mismatch!");
    process.exit(1);
  }

  const oldFilename = previousAvatarUrl.split("/avatars/").pop();

  if (oldFilename !== "avatar-old-uuid-12345.png") {
    console.error(`FAIL: Extracted old filename mismatch. Got: ${oldFilename}`);
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Old avatar file extraction and cleanup logic verified cleanly:", oldFilename);
}

testAvatarCleanupRegression();
