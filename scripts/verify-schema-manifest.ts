import { PrismaClient } from "@prisma/client";

interface ExpectedTableManifest {
  tableName: string;
  expectedColumns: string[];
}

const EXPECTED_MANIFEST: ExpectedTableManifest[] = [
  {
    tableName: "User",
    expectedColumns: ["username", "email", "passwordHash", "avatarUrl", "emailVerified", "createdAt"],
  },
  {
    tableName: "Session",
    expectedColumns: [
      "id",
      "userId",
      "guestDisplayName",
      "practiceSessionId",
      "mode",
      "grossWpm",
      "netWpm",
      "accuracy",
      "timeTakenSeconds",
      "charsTyped",
      "mistakes",
      "createdAt",
    ],
  },
  {
    tableName: "PracticeSession",
    expectedColumns: ["id", "targetText", "mode", "userId", "guestDisplayName", "startedAt", "expiresAt", "completed"],
  },
  {
    tableName: "VerificationCode",
    expectedColumns: ["id", "userId", "codeHash", "expiresAt", "attempts", "createdAt"],
  },
];

async function verifySchemaManifest() {
  const prisma = new PrismaClient();
  let hasError = false;

  console.log("[MANIFEST AUDIT] Verifying database schema against expected manifest...");

  try {
    for (const table of EXPECTED_MANIFEST) {
      console.log(`[MANIFEST AUDIT] Checking table '${table.tableName}'...`);

      const columns: any[] = await prisma.$queryRawUnsafe(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '${table.tableName}'
        ORDER BY column_name;
      `);

      const actualColumnNames = columns.map((c) => c.column_name);

      for (const col of table.expectedColumns) {
        if (!actualColumnNames.includes(col)) {
          console.error(`  ❌ MISSING COLUMN in '${table.tableName}': '${col}'`);
          hasError = true;
        } else {
          console.log(`  ✓ Column verified: '${table.tableName}.${col}'`);
        }
      }
    }

    if (hasError) {
      console.error("[MANIFEST AUDIT] Schema verification FAILED. One or more expected columns are missing.");
      process.exit(1);
    }

    console.log("[MANIFEST AUDIT] SUCCESS! All tables and columns match the expected manifest.");
  } catch (error: any) {
    console.error("[MANIFEST AUDIT FAILED]:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySchemaManifest();
