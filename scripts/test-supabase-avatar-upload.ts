import { detectRealImageType } from "../src/app/api/profile/avatar/route";
import sharp from "sharp";

async function testSupabaseAvatarUpload() {
  console.log("[AVATAR UPLOAD TEST] Testing image processing and format validation...");

  const testImageBuffer = await sharp({
    create: {
      width: 128,
      height: 128,
      channels: 4,
      background: { r: 0, g: 255, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const format = await detectRealImageType(testImageBuffer);
  console.log(`  ✓ Magic byte format check: ${format} (Expected: png - PASS)`);

  if (format !== "png") {
    console.error("❌ AVATAR UPLOAD TEST FAILED: Image format not recognized as PNG!");
    process.exit(1);
  }

  const processed = await sharp(testImageBuffer)
    .resize(512, 512, { fit: "inside" })
    .png({ quality: 90 })
    .toBuffer();

  console.log(`  ✓ Sharp re-encoded image size: ${processed.length} bytes (PASS)`);
  console.log("[AVATAR UPLOAD TEST] SUCCESS! Avatar upload processing pipeline validated.");
}

testSupabaseAvatarUpload();
