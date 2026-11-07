import fs from "fs";
import path from "path";

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

  console.log("\n🎉 All AdSense readiness prerequisite files exist!");
}

checkAdsenseReadiness();
