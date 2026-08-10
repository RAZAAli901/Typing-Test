import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function testSupabaseAuthFlow() {
  console.log("[AUTH TEST] Testing signup -> login -> session cycle against Supabase...");

  const testUsername = `test_user_${Date.now()}`;
  const testEmail = `${testUsername}@example.com`;
  const rawPassword = "Password123!";

  try {
    // 1. Signup / User Creation
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const createdUser = await db.user.create({
      data: {
        username: testUsername,
        email: testEmail,
        passwordHash,
        emailVerified: true,
      },
    });

    console.log(`  ✓ Created user record: ${createdUser.username} (${createdUser.email})`);

    // 2. Login Authentication Query
    const dbUser = await db.user.findUnique({
      where: { username: testUsername },
    });

    if (!dbUser) {
      throw new Error("Created user record not found in database!");
    }

    const isValidPassword = await bcrypt.compare(rawPassword, dbUser.passwordHash);
    console.log(`  ✓ Password authentication verification: ${isValidPassword ? "MATCH (PASS)" : "FAIL"}`);

    if (!isValidPassword) {
      throw new Error("Password verification failed!");
    }

    // Cleanup test record
    await db.user.delete({ where: { username: testUsername } });
    console.log(`  ✓ Cleaned up test user record: ${testUsername}`);
    console.log("[AUTH TEST] SUCCESS! Full signup -> login cycle verified against Supabase.");
  } catch (error: any) {
    console.error("[AUTH TEST FAILED]:", error.message);
    process.exit(1);
  }
}

testSupabaseAuthFlow();
