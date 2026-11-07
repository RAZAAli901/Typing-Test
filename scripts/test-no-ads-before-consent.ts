import { spawn } from "child_process";
import http from "http";

const PORT = 3125;
const BASE_URL = `http://localhost:${PORT}`;

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/play",
  "/leaderboard",
  "/stats",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
  "/editorial-policy",
  "/login",
  "/signup",
  "/verify",
];

function fetchHtml(urlPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${urlPath}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function waitForServer(retries = 25): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await fetchHtml("/");
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return false;
}

async function runNoAdsBeforeConsentTests() {
  console.log(`🚀 Starting production server on port ${PORT} to verify zero pre-consent ad script leakage...`);

  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    const isReady = await waitForServer();
    if (!isReady) {
      throw new Error(`Server failed to start on port ${PORT} within timeout`);
    }

    console.log("✅ Production server ready. Scanning all public routes for googlesyndication...\n");

    let violationCount = 0;

    for (const route of PUBLIC_ROUTES) {
      const html = await fetchHtml(route);
      if (html.includes("googlesyndication")) {
        console.error(`❌ [VIOLATION] Found googlesyndication script in server HTML on route: ${route}`);
        violationCount++;
      } else {
        console.log(`✅ [CLEAN] ${route}: Zero ad scripts detected in server HTML.`);
      }
    }

    if (violationCount > 0) {
      console.error(`\nTest failed: ${violationCount} route(s) leaked ad scripts before consent.`);
      process.exit(1);
    }

    console.log(`\n🎉 Verification complete: All ${PUBLIC_ROUTES.length} routes are verified 100% free of pre-consent ad scripts!`);
  } finally {
    if (server.pid) {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"]);
      } else {
        server.kill("SIGTERM");
      }
    }
  }
}

runNoAdsBeforeConsentTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
