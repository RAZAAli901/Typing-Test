import { execSync } from "child_process";

async function runLeaderboardImport() {
  console.log("[MIGRATION EXECUTION] Running full 'Leaderboard' import into Supabase...");
  try {
    execSync("npx tsx scripts/import-leaderboard.ts", { stdio: "inherit" });
    console.log("[MIGRATION EXECUTION] 'Leaderboard' import execution finished.");
  } catch (error: any) {
    console.error("[MIGRATION EXECUTION] 'Leaderboard' import error:", error.message);
    process.exit(1);
  }
}

runLeaderboardImport();
