import { PrismaClient } from "@prisma/client";

async function verifyLeaderboardTable() {
  const prisma = new PrismaClient();
  try {
    console.log("[SCHEMA CHECK] Verifying Leaderboard top score queries against Session table...");
    const topScores = await prisma.session.findMany({
      take: 10,
      orderBy: { netWpm: "desc" },
      select: { id: true, userId: true, mode: true, netWpm: true, accuracy: true },
    });
    console.log(`[SCHEMA CHECK] Leaderboard query executed successfully. Sample records retrieved: ${topScores.length}`);
  } catch (error: any) {
    console.error("[SCHEMA CHECK] Failed to query Leaderboard data:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLeaderboardTable();
