import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function exportSessions() {
  const prisma = new PrismaClient();
  const exportDir = path.join(process.cwd(), "data-exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log("[EXPORT] Exporting 'Session' records to JSON dump...");

  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: "asc" },
    });

    const exportPath = path.join(exportDir, "sessions_export.json");
    fs.writeFileSync(exportPath, JSON.stringify(sessions, null, 2), "utf-8");

    console.log(`[EXPORT SUCCESS] Exported ${sessions.length} Session records to ${exportPath}`);
  } catch (error: any) {
    console.error("[EXPORT FAILED] Failed to export Session table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportSessions();
