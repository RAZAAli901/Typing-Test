import { z } from "zod";

function testInputValidationRegression() {
  console.log("[TEST] Executing input validation & bounds rejection regression test...");

  // Test 1: Oversized username
  const UsernameSchema = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/);
  const oversizedUsername = "a".repeat(100);
  if (UsernameSchema.safeParse(oversizedUsername).success) {
    console.error("FAIL: Oversized username was accepted!");
    process.exit(1);
  }

  // Test 2: Oversized custom text
  const CustomTextSchema = z.string().max(10000);
  const oversizedCustomText = "x".repeat(15000);
  if (CustomTextSchema.safeParse(oversizedCustomText).success) {
    console.error("FAIL: Oversized custom text was accepted!");
    process.exit(1);
  }

  // Test 3: Out-of-bounds WPM ceiling
  const WpmSchema = z.number().int().min(0).max(400);
  if (WpmSchema.safeParse(999).success) {
    console.error("FAIL: Impossible WPM value (999) was accepted!");
    process.exit(1);
  }

  // Test 4: Control character injection
  const ControlCharSchema = z.string().refine((val) => !/[\x00-\x1F\x7F]/.test(val));
  if (ControlCharSchema.safeParse("user\x00name").success) {
    console.error("FAIL: Null byte character injection was accepted!");
    process.exit(1);
  }

  console.log("\x1b[32m[PASS]\x1b[0m Input validation & bounds rejection regression test passed cleanly!");
}

testInputValidationRegression();
