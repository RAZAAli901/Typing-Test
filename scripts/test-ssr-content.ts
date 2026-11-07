import { spawn } from "child_process";
import http from "http";

const PORT = 3123;
const BASE_URL = `http://localhost:${PORT}`;

const TESTS = [
  { path: "/", expectedText: "Master Your Typing Speed" },
  { path: "/about", expectedText: "ABOUT TYPEMASTER" },
  { path: "/leaderboard", expectedText: "GLOBAL HIGHSCORES" },
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

async function waitForServer(retries = 20): Promise<boolean> {
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

async function runSsrTests() {
  console.log(`🚀 Starting production server on port ${PORT} for SSR assertions...`);

  // Start next server
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

    console.log("✅ Production server ready. Fetching server-rendered HTML...\n");

    let failed = false;

    for (const test of TESTS) {
      const html = await fetchHtml(test.path);
      if (html.includes(test.expectedText)) {
        console.log(`✅ [PASS] ${test.path} contains expected SSR heading text ("${test.expectedText}")`);
      } else {
        console.error(`❌ [FAIL] ${test.path} missing expected SSR heading text ("${test.expectedText}")`);
        failed = true;
      }
    }

    if (failed) {
      process.exit(1);
    }

    console.log("\n🎉 All SSR content tests passed cleanly!");
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

runSsrTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
