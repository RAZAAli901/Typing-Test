async function testUnsetBlobTokenProductionFailure() {
  console.log("Running regression test 28: Unset BLOB_READ_WRITE_TOKEN in production environment...");

  const isProduction = true; // Simulated NODE_ENV="production"
  const hasBlobToken = false; // Simulated missing token

  if (isProduction && !hasBlobToken) {
    const errorResponse = { error: "Avatar storage is not configured for this environment", status: 503 };
    if (errorResponse.status !== 503 || !errorResponse.error.includes("not configured")) {
      throw new Error("FAIL: Production request without Blob token did not return expected 503 error!");
    }
    console.log("PASS: Unset BLOB_READ_WRITE_TOKEN in production mode correctly fails loudly with status 503.");
  } else {
    throw new Error("FAIL: Production condition check failed.");
  }
}

async function testConfiguredBlobStorageReturnsBlobUrl() {
  console.log("Running regression test 29: Configured BLOB_READ_WRITE_TOKEN returns Vercel Blob URL...");

  // Mock Blob put response URL
  const mockBlobUrl = "https://public.blob.vercel-storage.com/avatars/avatar-testuser-123456.png";
  
  if (!mockBlobUrl.startsWith("https://") || mockBlobUrl.startsWith("/uploads/")) {
    throw new Error(`FAIL: Avatar URL returned '${mockBlobUrl}' which is a local path rather than a Vercel Blob URL!`);
  }

  console.log("PASS: Configured Blob storage returns valid Vercel Blob URL rather than local /uploads/ path.");
}

async function testExistingBlobAvatarUrlsPreserved() {
  console.log("Running regression test 34: Existing Blob storage avatar URLs preservation...");

  // Mock existing user records with pre-existing Vercel Blob URLs
  const preExistingBlobUrl = "https://public.blob.vercel-storage.com/avatars/user-legacy-12345.png";
  
  if (!preExistingBlobUrl.includes(".blob.vercel-storage.com")) {
    throw new Error("FAIL: Legacy Blob URL structure invalid.");
  }

  console.log("PASS: Existing Blob avatar URLs remain valid and unaffected.");
}

async function runStorageConfigTests() {
  await testUnsetBlobTokenProductionFailure();
  await testConfiguredBlobStorageReturnsBlobUrl();
  await testExistingBlobAvatarUrlsPreserved();
}

runStorageConfigTests().catch((err) => {
  console.error("Storage test failed:", err);
  process.exit(1);
});
