import { PrismaClient } from "@prisma/client";

async function main() {
  console.log("[PRISMA CONNECTIVITY TEST] Testing database connection...");
  const prisma = new PrismaClient();

  try {
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, current_database() as db_name;`;
    console.log("[PRISMA CONNECTIVITY TEST] SUCCESS! Connected to database:", result);
  } catch (error: any) {
    console.error("[PRISMA CONNECTIVITY TEST] CONNECTION FAILED:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
