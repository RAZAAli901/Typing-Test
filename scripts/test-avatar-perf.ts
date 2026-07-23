import sharp from "sharp";

async function testReencodingPerformance() {
  console.log("Running Commit 44 performance benchmark: sharp re-encoding latency...");

  // Generate synthetic high-density image near max dimensions (2048x2048)
  const startTime = Date.now();
  const testImageBuffer = await sharp({
    create: {
      width: 2048,
      height: 2048,
      channels: 4,
      background: { r: 57, g: 255, b: 20, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const createTimeMs = Date.now() - startTime;
  console.log(`Generated 2048x2048 test image (${(testImageBuffer.length / 1024 / 1024).toFixed(2)} MB) in ${createTimeMs}ms.`);

  // Measure re-encoding & 512x512 resizing pipeline latency
  const reencodeStart = Date.now();
  const processedBuffer = await sharp(testImageBuffer)
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  const reencodeLatencyMs = Date.now() - reencodeStart;

  console.log(`Re-encoding & resizing latency: ${reencodeLatencyMs}ms (Processed size: ${(processedBuffer.length / 1024).toFixed(2)} KB).`);

  if (reencodeLatencyMs > 2500) {
    throw new Error(`FAIL: Re-encoding latency exceeded maximum threshold (${reencodeLatencyMs}ms > 2500ms)`);
  }

  console.log("PASS: Re-encoding latency is well within performance budget (< 2.5s).");
}

testReencodingPerformance().catch((err) => {
  console.error("Performance test failed:", err);
  process.exit(1);
});
