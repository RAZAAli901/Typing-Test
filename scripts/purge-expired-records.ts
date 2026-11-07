import { db } from "../src/lib/db";

async function purgeExpiredRecords() {
  const now = new Date();
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  console.log("=========================================");
  console.log("TypeMaster Database Retention Purge");
  console.log(`Execution Time: ${now.toISOString()}`);
  console.log("=========================================");

  try {
    // 1. Purge expired verification codes
    const purgedCodes = await db.verificationCode.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });
    console.log(`🧹 Purged expired verification codes: ${purgedCodes.count}`);

    // 2. Purge stale / expired practice sessions
    const purgedSessions = await db.practiceSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { completed: false, startedAt: { lt: cutoff24h } },
        ],
      },
    });
    console.log(`🧹 Purged stale practice sessions: ${purgedSessions.count}`);

    console.log("=========================================");
    console.log("✅ Retention purge completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Retention purge failed with error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

purgeExpiredRecords();
