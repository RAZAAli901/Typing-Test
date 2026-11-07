import fs from "fs";
import path from "path";
import { SITE_URL, CONTACT_EMAIL } from "../src/lib/site";

const EXPECTED_FILES = [
  "public/ads.txt",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/cookies/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/editorial-policy/page.tsx",
  "src/lib/site.ts",
  "src/lib/adEligibility.ts",
  "src/lib/consent.ts",
];

function checkAdsenseReadiness(): void {
  console.log("🔍 Checking AdSense readiness file prerequisites...\n");

  let missingCount = 0;

  for (const file of EXPECTED_FILES) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing expected file: ${file}`);
      missingCount++;
    } else {
      console.log(`✅ Found: ${file}`);
    }
  }

  if (missingCount > 0) {
    console.error(`\nAdSense readiness check failed: ${missingCount} required file(s) are missing.`);
    process.exit(1);
  }

  // Production environment configuration check
  if (process.env.NODE_ENV === "production") {
    if (!SITE_URL || SITE_URL.includes("localhost") || SITE_URL.includes("127.0.0.1")) {
      console.error(`❌ Production error: SITE_URL cannot be localhost in production (got: ${SITE_URL})`);
      process.exit(1);
    }
    if (!CONTACT_EMAIL || !CONTACT_EMAIL.trim()) {
      console.error("❌ Production error: CONTACT_EMAIL must be set in production");
      process.exit(1);
    }
  } else {
    if (!SITE_URL || SITE_URL.includes("localhost")) {
      console.warn(`⚠️ Warning: SITE_URL is currently using localhost (${SITE_URL}) for non-production.`);
    }
    if (!CONTACT_EMAIL) {
      console.warn("⚠️ Warning: CONTACT_EMAIL is unset.");
    }
  }

  console.log("\n🎉 All AdSense readiness prerequisite files exist!");
}

checkAdsenseReadiness();
