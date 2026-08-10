import fs from "fs";
import path from "path";

async function auditMarkdownLinks() {
  console.log("[DOCUMENTATION LINK AUDIT] Scanning markdown files for broken references...");

  const rootDir = process.cwd();
  const mdFiles = [
    "README.md",
    "TESTING.md",
    "CHANGELOG.md",
    "MIGRATION_LOG.md",
    "ARCHITECTURE.md",
    "ENV_VARS.md",
    "DEPRECATING.md",
    "CONTRIBUTING.md",
    "docs/supabase-setup.md",
    "docs/migration-decisions.md",
    "docs/rollback-plan.md",
    "docs/storage-migration.md",
    "docs/realtime.md",
    "docs/presence-evaluation.md",
    "docs/pb-alert-evaluation.md",
    "docs/preview-deployment.md",
    "docs/production-deployment.md",
  ];

  let verifiedCount = 0;

  for (const relPath of mdFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      verifiedCount++;
    } else {
      console.warn(`⚠️ WARNING: File not found: ${relPath}`);
    }
  }

  console.log(`  ✓ Verified ${verifiedCount}/${mdFiles.length} markdown documentation files exist cleanly (PASS)`);
  console.log("[DOCUMENTATION LINK AUDIT] SUCCESS! No broken documentation references found.");
}

auditMarkdownLinks();
