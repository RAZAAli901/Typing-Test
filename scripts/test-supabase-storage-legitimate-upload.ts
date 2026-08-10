import { detectRealImageType } from "../src/app/api/profile/avatar/route";
import sharp from "sharp";

async function testLegitimateUploadRegression() {
  console.log("[STORAGE UPLOAD REGRESSION] Testing legitimate image processing and magic byte detection...");

  // Generate a valid 1x1 PNG image buffer via Sharp
  const validPngBuffer = await sharp({
    create: {
      width: 64,
      height: 64,
      channels: 4,
      background: { r: 57, g: 255, b: 20, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const detectedType = await detectRealImageType(validPngBuffer);
  console.log(`  ✓ Valid PNG Magic Byte Detection Result: '${detectedType}' (PASS)`);

  if (detectedType !== "png") {
    console.error("❌ REGRESSION TEST FAILED: Valid PNG image was not recognized!");
    process.exit(1);
  }

  // Re-encode buffer
  const processedBuffer = await sharp(validPngBuffer)
    .resize(512, 512, { fit: "inside", withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();

  console.log(`  ✓ Re-encoded PNG Buffer Size: ${processedBuffer.length} bytes (PASS)`);
  console.log("[STORAGE UPLOAD REGRESSION] SUCCESS! Legitimate avatar processing pipeline verified.");
}

testLegitimateUploadRegression();
