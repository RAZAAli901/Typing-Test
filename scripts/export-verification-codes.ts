import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

async function exportVerificationCodes() {
  const prisma = new PrismaClient();
  const exportDir = path.join(process.cwd(), "data-exports");

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log("[EXPORT] Exporting 'VerificationCode' records to JSON dump...");

  try {
    const codes = await prisma.verificationCode.findMany({
      orderBy: { createdAt: "asc" },
    });

    const exportPath = path.join(exportDir, "verification_codes_export.json");
    fs.writeFileSync(exportPath, JSON.stringify(codes, null, 2), "utf-8");

    console.log(`[EXPORT SUCCESS] Exported ${codes.length} VerificationCode records to ${exportPath}`);
  } catch (error: any) {
    console.error("[EXPORT FAILED] Failed to export VerificationCode table:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportVerificationCodes();
