import { execSync } from "child_process";

async function runSessionImport() {
  console.log("[MIGRATION EXECUTION] Running full 'Session' table import into Supabase...");
  try {
    execSync("npx tsx scripts/import-sessions.ts", { stdio: "inherit" });
    console.log("[MIGRATION EXECUTION] 'Session' table import execution finished.");
  } catch (error: any) {
    console.error("[MIGRATION EXECUTION] 'Session' table import error:", error.message);
    process.exit(1);
  }
}

runSessionImport();
