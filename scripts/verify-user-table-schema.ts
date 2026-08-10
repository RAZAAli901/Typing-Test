import { PrismaClient } from "@prisma/client";

async function verifyUserTable() {
  const prisma = new PrismaClient();
  try {
    console.log("[SCHEMA CHECK] Verifying 'User' table structure...");
    const count = await prisma.user.count();
    console.log(`[SCHEMA CHECK] 'User' table verified successfully. Existing row count: ${count}`);
  } catch (error: any) {
    console.error("[SCHEMA CHECK] Failed to query 'User' table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUserTable();
