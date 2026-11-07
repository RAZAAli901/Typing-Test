import { isRouteEligibleForAds } from "../src/lib/adEligibility";

const TEST_CASES: { path: string | null | undefined; expected: boolean; description: string }[] = [
  // Allowed Content Routes
  { path: "/", expected: true, description: "Home page (/)" },
  { path: "/about", expected: true, description: "About page (/about)" },
  { path: "/learn", expected: true, description: "Learn hub (/learn)" },
  { path: "/learn/how-to-improve-typing-speed", expected: true, description: "Learn guide slug" },
  { path: "/learn/glossary", expected: true, description: "Learn glossary" },

  // Blocked Utility & Interactive Routes
  { path: "/play", expected: false, description: "Play game canvas" },
  { path: "/leaderboard", expected: false, description: "Leaderboard data view" },
  { path: "/stats", expected: false, description: "Stats data view" },

  // Blocked Authentication & Account Routes
  { path: "/login", expected: false, description: "Login auth page" },
  { path: "/signup", expected: false, description: "Signup auth page" },
  { path: "/verify", expected: false, description: "Email OTP verification page" },
  { path: "/profile", expected: false, description: "User profile settings" },

  // Blocked Legal & Trust Pages
  { path: "/privacy", expected: false, description: "Privacy policy" },
  { path: "/terms", expected: false, description: "Terms of service" },
  { path: "/cookies", expected: false, description: "Cookie registry" },
  { path: "/contact", expected: false, description: "Contact portal" },
  { path: "/editorial-policy", expected: false, description: "Editorial policy" },

  // Blocked API & Malformed / Unknown Routes
  { path: "/api/health", expected: false, description: "Health check API" },
  { path: "/api/leaderboard", expected: false, description: "Leaderboard API" },
  { path: "/random-non-existent-page", expected: false, description: "404 unknown path" },
  { path: "/learn/nested/too/deep", expected: false, description: "Excessively nested learn path" },
  { path: "", expected: false, description: "Empty string" },
  { path: null, expected: false, description: "Null pathname" },
  { path: undefined, expected: false, description: "Undefined pathname" },
];

function runEligibilityTests() {
  console.log("🔍 Testing AdSense Route Eligibility Policy Engine...\n");

  let passed = 0;
  let failed = 0;

  for (const tc of TEST_CASES) {
    const result = isRouteEligibleForAds(tc.path);
    if (result === tc.expected) {
      console.log(`✅ [PASS] ${tc.description} ("${tc.path}") => ${result}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${tc.description} ("${tc.path}") expected ${tc.expected}, received ${result}`);
      failed++;
    }
  }

  console.log(`\nAd Eligibility Test Summary: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }

  console.log("🎉 All ad eligibility assertions passed!");
}

runEligibilityTests();
