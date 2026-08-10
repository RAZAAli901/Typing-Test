import { db } from "../src/lib/db";

async function verifyNoOrphanedRows() {
  console.log("[ORPHAN CHECK] Checking for orphaned Session rows with non-resolving User foreign keys...");

  const orphanedSessions = await db.session.findMany({
    where: {
      userId: { not: null },
      user: { is: null },
    },
    select: { id: true, userId: true },
  });

  console.log(`[ORPHAN CHECK] Found ${orphanedSessions.length} orphaned Session records.`);

  if (orphanedSessions.length > 0) {
    console.error("❌ ORPHAN CHECK FAILED: Found Sessions referencing non-existent User IDs:");
    for (const o of orphanedSessions) {
      console.error(`  - Session ID: ${o.id} -> Non-existent User: ${o.userId}`);
    }
    process.exit(1);
  }

  console.log("[ORPHAN CHECK SUCCESS] Zero orphaned rows found. 100% of foreign keys resolve cleanly.");
}

verifyNoOrphanedRows();
