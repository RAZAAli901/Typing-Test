import { execSync } from "child_process";

async function runUserImport() {
  console.log("[MIGRATION EXECUTION] Running full 'User' table import into Supabase...");
  try {
    execSync("npx tsx scripts/import-users.ts", { stdio: "inherit" });
    console.log("[MIGRATION EXECUTION] 'User' table import execution finished.");
  } catch (error: any) {
    console.error("[MIGRATION EXECUTION] 'User' table import error:", error.message);
    process.exit(1);
  }
}

runUserImport();
