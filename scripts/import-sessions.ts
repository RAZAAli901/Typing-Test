import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function importSessions() {
  const isDryRun = process.argv.includes("--dry-run");
  const prisma = new PrismaClient();
  const exportPath = path.join(process.cwd(), "data-exports", "sessions_export.json");

  console.log(`[IMPORT SESSION] Mode: ${isDryRun ? "DRY-RUN (No DB commits)" : "FULL IMPORT"}`);

  if (!fs.existsSync(exportPath)) {
    console.warn(`[IMPORT SESSION] Export file not found at ${exportPath}. Skipping import.`);
    process.exit(0);
  }

  const sessions: any[] = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
  console.log(`[IMPORT SESSION] Loaded ${sessions.length} session records from dump.`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const session of sessions) {
    if (isDryRun) {
      console.log(`  [DRY-RUN] Would upsert Session ID: ${session.id} (User: ${session.userId || "guest"})`);
      insertedCount++;
    } else {
      try {
        await prisma.session.upsert({
          where: { id: session.id },
          update: {
            userId: session.userId,
            guestDisplayName: session.guestDisplayName,
            practiceSessionId: session.practiceSessionId,
            mode: session.mode,
            grossWpm: session.grossWpm,
            netWpm: session.netWpm,
            accuracy: session.accuracy,
            timeTakenSeconds: session.timeTakenSeconds,
            charsTyped: session.charsTyped ?? 0,
            mistakes: session.mistakes ?? 0,
            createdAt: new Date(session.createdAt),
          },
          create: {
            id: session.id,
            userId: session.userId,
            guestDisplayName: session.guestDisplayName,
            practiceSessionId: session.practiceSessionId,
            mode: session.mode,
            grossWpm: session.grossWpm,
            netWpm: session.netWpm,
            accuracy: session.accuracy,
            timeTakenSeconds: session.timeTakenSeconds,
            charsTyped: session.charsTyped ?? 0,
            mistakes: session.mistakes ?? 0,
            createdAt: new Date(session.createdAt),
          },
        });
        insertedCount++;
      } catch (err: any) {
        console.error(`  ❌ Failed to import Session '${session.id}':`, err.message);
        skippedCount++;
      }
    }
  }

  console.log(
    `[IMPORT SESSION SUMMARY] Processed: ${sessions.length} | Inserted/Updated: ${insertedCount} | Failed/Skipped: ${skippedCount}`
  );
  await prisma.$disconnect();
}

importSessions();
