import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function exportUsers() {
  const prisma = new PrismaClient();
  const exportDir = path.join(process.cwd(), "data-exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log("[EXPORT] Exporting 'User' records to JSON dump...");

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    const exportPath = path.join(exportDir, "users_export.json");
    fs.writeFileSync(exportPath, JSON.stringify(users, null, 2), "utf-8");

    console.log(`[EXPORT SUCCESS] Exported ${users.length} User records to ${exportPath}`);
  } catch (error: any) {
    console.error("[EXPORT FAILED] Failed to export User table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportUsers();
