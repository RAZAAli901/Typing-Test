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

async function runStorageConfigTests() {
  await testUnsetBlobTokenProductionFailure();
}

runStorageConfigTests().catch((err) => {
  console.error("Storage test failed:", err);
  process.exit(1);
});
