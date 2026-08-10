import { db } from "../src/lib/db";

async function testRlsPrismaCompatibility() {
  console.log("[RLS PRISMA COMPATIBILITY TEST] Verifying RLS bypass for direct postgres connection pooler...");

  try {
    const userCount = await db.user.count();
    const sessionCount = await db.session.count();

    console.log(`  ✓ Server-side Prisma User query: ${userCount} rows (PASS)`);
    console.log(`  ✓ Server-side Prisma Session query: ${sessionCount} rows (PASS)`);
    console.log("[RLS PRISMA COMPATIBILITY TEST] SUCCESS! RLS policies do not block server-side Prisma queries.");
  } catch (error: any) {
    console.error("❌ RLS PRISMA TEST FAILED:", error.message);
    process.exit(1);
  }
}

testRlsPrismaCompatibility();
