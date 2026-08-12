import { execSync } from "child_process";
import fs from "fs";

/**
 * Pre-commit secret inspection script.
 * Scans git staged files for patterns resembling API keys, service role keys,
 * database connection strings with embedded passwords, or secret tokens.
 */
const SECRET_PATTERNS: { name: string; regex: RegExp }[] = [
  {
    name: "Supabase Service Role Key / JWT secret",
    regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
  },
  {
    name: "Resend API Key",
    regex: /re_[a-zA-Z0-9]{20,}/g,
  },
  {
    name: "Embedded Postgres Password URL",
    regex: /postgres(?:ql)?:\/\/[a-zA-Z0-9_.]+:([^@\s]{6,})@/g,
  },
  {
    name: "Generic Secret Key Assignment",
    regex: /(?:NEXTAUTH_SECRET|SUPABASE_SERVICE_ROLE_KEY|RESEND_API_KEY)\s*=\s*["'](?![^"']*(?:generate-|your-|example|localhost|127\.0\.0\.1))[A-Za-z0-9-_]{16,}["']/gi,
  },
];

function checkStagedFiles() {
  try {
    const stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf-8",
    })
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0 && !f.endsWith(".example") && !f.endsWith(".md"));

    let failed = false;

    for (const filePath of stagedFiles) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf-8");

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(content)) {
          console.error(
            `\x1b[31m[PRE-COMMIT SECURITY ERROR]\x1b[0m Potential secret detected in ${filePath}: matched pattern "${pattern.name}".`
          );
          failed = true;
        }
      }
    }

    if (failed) {
      console.error(
        "\x1b[31m[BLOCKED]\x1b[0m Commit aborted because potential hardcoded secrets were detected. Please remove them or use environment variables."
      );
      process.exit(1);
    } else {
      console.log("\x1b[32m[OK]\x1b[0m Pre-commit secret check passed cleanly.");
    }
  } catch (err: any) {
    if (err.status) {
      process.exit(err.status);
    }
  }
}

checkStagedFiles();
