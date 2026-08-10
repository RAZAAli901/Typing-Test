import { PrismaClient } from "@prisma/client";

async function verifyVerificationCodeTable() {
  const prisma = new PrismaClient();
  try {
    console.log("[SCHEMA CHECK] Verifying 'VerificationCode' table structure...");
    const count = await prisma.verificationCode.count();
    console.log(`[SCHEMA CHECK] 'VerificationCode' table verified successfully. Existing row count: ${count}`);
  } catch (error: any) {
    console.error("[SCHEMA CHECK] Failed to query 'VerificationCode' table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyVerificationCodeTable();
