import { spawn } from "child_process";
import http from "http";

const PORT = 3126;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(
  method: string,
  urlPath: string
): Promise<{ statusCode: number; data: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `${BASE_URL}${urlPath}`,
      { method },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({
            statusCode: res.statusCode || 0,
            data,
            headers: res.headers,
          })
        );
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function waitForServer(retries = 30): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await makeRequest("GET", "/api/health");
      if (res.statusCode === 200 || res.statusCode === 404) return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return false;
}

async function runTests() {
  console.log("=========================================");
  console.log("TypeMaster Data Rights API Security Test");
  console.log(`Targeting production server on port ${PORT}...`);
  console.log("=========================================");

  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "ignore",
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    const ready = await waitForServer();
    if (!ready) {
      throw new Error(`Server failed to boot on port ${PORT}`);
    }

    let hasErrors = false;

    // Test 1: DELETE /api/profile without auth
    console.log("Checking DELETE /api/profile without authentication...");
    const deleteRes = await makeRequest("DELETE", "/api/profile");
    if (deleteRes.statusCode !== 401) {
      console.error(
        `❌ Expected 401 Unauthorized for DELETE /api/profile, got ${deleteRes.statusCode}`
      );
      hasErrors = true;
    } else {
      console.log(`✅ DELETE /api/profile correctly rejected unauthorized request (401)`);
    }

    // Test 2: GET /api/profile/export without auth
    console.log("Checking GET /api/profile/export without authentication...");
    const exportRes = await makeRequest("GET", "/api/profile/export");
    if (exportRes.statusCode !== 401) {
      console.error(
        `❌ Expected 401 Unauthorized for GET /api/profile/export, got ${exportRes.statusCode}`
      );
      hasErrors = true;
    } else {
      console.log(`✅ GET /api/profile/export correctly rejected unauthorized request (401)`);
    }

    if (hasErrors) {
      console.error("\n❌ Data rights security test failed!");
      process.exit(1);
    } else {
      console.log("\n✅ All data rights endpoints successfully verified secure!");
      process.exit(0);
    }
  } finally {
    if (process.platform === "win32" && server.pid) {
      spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"]);
    } else {
      server.kill("SIGTERM");
    }
  }
}

runTests();

