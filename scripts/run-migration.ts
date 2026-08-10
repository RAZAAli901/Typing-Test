import { execSync } from "child_process";

async function runMigration() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");

  console.log("================================================================================");
  console.log(`[DATA MIGRATION SUITE] Starting Supabase Data Migration`);
  console.log(`[MODE]: ${isDryRun ? "DRY-RUN (Simulation only)" : "LIVE EXECUTION (Database Writes Enabled)"}`);
  console.log("================================================================================");

  const dryRunFlag = isDryRun ? " --dry-run" : "";

  try {
    console.log("\n[STEP 1/3] Importing Users...");
    execSync(`npx tsx scripts/import-users.ts${dryRunFlag}`, { stdio: "inherit" });

    console.log("\n[STEP 2/3] Importing Sessions...");
    execSync(`npx tsx scripts/import-sessions.ts${dryRunFlag}`, { stdio: "inherit" });

    console.log("\n[STEP 3/3] Importing Leaderboard Scores...");
    execSync(`npx tsx scripts/import-leaderboard.ts${dryRunFlag}`, { stdio: "inherit" });

    console.log("\n================================================================================");
    console.log(`[DATA MIGRATION SUITE] Migration finished successfully (${isDryRun ? "DRY-RUN" : "LIVE"}).`);
    console.log("================================================================================");
  } catch (error: any) {
    console.error("\n❌ [DATA MIGRATION SUITE] Migration error:", error.message);
    process.exit(1);
  }
}

runMigration();
