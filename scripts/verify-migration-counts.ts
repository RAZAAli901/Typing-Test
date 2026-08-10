import { db } from "../src/lib/db";
import fs from "fs";
import path from "path";

async function verifyMigrationCounts() {
  console.log("[VERIFY COUNTS] Comparing data export JSON row counts with live database...");

  const dataDir = path.join(process.cwd(), "data-exports");

  const getExportCount = (filename: string): number => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return 0;
    const records = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return records.length;
  };

  const userExportCount = getExportCount("users_export.json");
  const sessionExportCount = getExportCount("sessions_export.json");

  const liveUserCount = await db.user.count();
  const liveSessionCount = await db.session.count();

  console.log("--------------------------------------------------------------------------------");
  console.log(`User Table   -> Exported: ${userExportCount} | Live Supabase: ${liveUserCount}`);
  console.log(`Session Table -> Exported: ${sessionExportCount} | Live Supabase: ${liveSessionCount}`);
  console.log("--------------------------------------------------------------------------------");

  if (userExportCount > 0 && liveUserCount < userExportCount) {
    console.warn("⚠️ WARNING: Live User count is less than exported count.");
  }
  if (sessionExportCount > 0 && liveSessionCount < sessionExportCount) {
    console.warn("⚠️ WARNING: Live Session count is less than exported count.");
  }

  console.log("[VERIFY COUNTS] Row count comparison completed.");
}

verifyMigrationCounts();
