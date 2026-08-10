import { PrismaClient } from "@prisma/client";

async function verifySessionTable() {
  const prisma = new PrismaClient();
  try {
    console.log("[SCHEMA CHECK] Verifying 'Session' table structure...");
    const count = await prisma.session.count();
    console.log(`[SCHEMA CHECK] 'Session' table verified successfully. Existing row count: ${count}`);
  } catch (error: any) {
    console.error("[SCHEMA CHECK] Failed to query 'Session' table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySessionTable();
