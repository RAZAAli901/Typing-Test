import { db } from "../src/lib/db";
import fs from "fs";
import path from "path";

async function importUsers() {
  const isDryRun = process.argv.includes("--dry-run");
  const exportPath = path.join(process.cwd(), "data-exports", "users_export.json");


  console.log(`[IMPORT USER] Mode: ${isDryRun ? "DRY-RUN (No DB commits)" : "FULL IMPORT"}`);

  if (!fs.existsSync(exportPath)) {
    console.warn(`[IMPORT USER] Export file not found at ${exportPath}. Skipping import.`);
    process.exit(0);
  }

  const users: any[] = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
  console.log(`[IMPORT USER] Loaded ${users.length} user records from dump.`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const user of users) {
    if (isDryRun) {
      console.log(`  [DRY-RUN] Would upsert User: ${user.username} (${user.email})`);
      insertedCount++;
    } else {
      try {
        await db.user.upsert({
          where: { username: user.username },
          update: {
            email: user.email,
            passwordHash: user.passwordHash,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
            createdAt: new Date(user.createdAt),
          },
          create: {
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            avatarUrl: user.avatarUrl,
            emailVerified: user.emailVerified,
            createdAt: new Date(user.createdAt),
          },
        });
        insertedCount++;
      } catch (err: any) {
        console.error(`  ❌ Failed to import User '${user.username}':`, err.message);
        skippedCount++;
      }
    }
  }

  console.log(
    `[IMPORT USER SUMMARY] Processed: ${users.length} | Inserted/Updated: ${insertedCount} | Failed/Skipped: ${skippedCount}`
  );
}


importUsers();
