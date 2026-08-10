import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function exportLeaderboard() {
  const prisma = new PrismaClient();
  const exportDir = path.join(process.cwd(), "data-exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log("[EXPORT] Exporting 'Leaderboard' top scores to JSON dump...");

  try {
    const leaderboardScores = await prisma.session.findMany({
      orderBy: { netWpm: "desc" },
      take: 500,
      include: {
        user: {
          select: { username: true, avatarUrl: true },
        },
      },
    });

    const exportPath = path.join(exportDir, "leaderboard_export.json");
    fs.writeFileSync(exportPath, JSON.stringify(leaderboardScores, null, 2), "utf-8");

    console.log(`[EXPORT SUCCESS] Exported ${leaderboardScores.length} Leaderboard records to ${exportPath}`);
  } catch (error: any) {
    console.error("[EXPORT FAILED] Failed to export Leaderboard records:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportLeaderboard();
