import fs from "fs";
import path from "path";

function setupLocalEnv() {
  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  console.log("[ENV SETUP] Ensuring local .env reflects Supabase configuration...");

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("[ENV SETUP] Created local .env from .env.example.");
  } else if (fs.existsSync(envPath)) {
    console.log("[ENV SETUP] Local .env file exists and is ready for Supabase credentials.");
  }
}

setupLocalEnv();
