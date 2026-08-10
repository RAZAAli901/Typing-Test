import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function importLeaderboard() {
  const isDryRun = process.argv.includes("--dry-run");
  const prisma = new PrismaClient();
  const exportPath = path.join(process.cwd(), "data-exports", "leaderboard_export.json");

  console.log(`[IMPORT LEADERBOARD] Mode: ${isDryRun ? "DRY-RUN (No DB commits)" : "FULL IMPORT"}`);

  if (!fs.existsSync(exportPath)) {
    console.warn(`[IMPORT LEADERBOARD] Export file not found at ${exportPath}. Skipping import.`);
    process.exit(0);
  }

  const items: any[] = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
  console.log(`[IMPORT LEADERBOARD] Loaded ${items.length} leaderboard session records.`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    if (isDryRun) {
      console.log(`  [DRY-RUN] Would import high score Session: ${item.id} (WPM: ${item.netWpm})`);
      insertedCount++;
    } else {
      try {
        await prisma.session.upsert({
          where: { id: item.id },
          update: {
            userId: item.userId,
            guestDisplayName: item.guestDisplayName,
            mode: item.mode,
            grossWpm: item.grossWpm,
            netWpm: item.netWpm,
            accuracy: item.accuracy,
            timeTakenSeconds: item.timeTakenSeconds,
            createdAt: new Date(item.createdAt),
          },
          create: {
            id: item.id,
            userId: item.userId,
            guestDisplayName: item.guestDisplayName,
            mode: item.mode,
            grossWpm: item.grossWpm,
            netWpm: item.netWpm,
            accuracy: item.accuracy,
            timeTakenSeconds: item.timeTakenSeconds,
            createdAt: new Date(item.createdAt),
          },
        });
        insertedCount++;
      } catch (err: any) {
        console.error(`  ❌ Failed to import Leaderboard Session '${item.id}':`, err.message);
        skippedCount++;
      }
    }
  }

  console.log(
    `[IMPORT LEADERBOARD SUMMARY] Processed: ${items.length} | Inserted/Updated: ${insertedCount} | Failed/Skipped: ${skippedCount}`
  );
  await prisma.$disconnect();
}

importLeaderboard();
