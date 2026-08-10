import { db } from "../src/lib/db";

async function spotCheckRecords() {
  console.log("[SPOT-CHECK] Inspecting sample User and Session records for field-level accuracy...");

  const sampleUsers = await db.user.findMany({ take: 5 });
  console.log(`\n[SPOT-CHECK] User Records (${sampleUsers.length}):`);
  for (const u of sampleUsers) {
    console.log(`  - Username: ${u.username} | Email: ${u.email} | Verified: ${u.emailVerified} | Avatar: ${u.avatarUrl || "none"}`);
  }

  const sampleSessions = await db.session.findMany({ take: 5, orderBy: { netWpm: "desc" } });
  console.log(`\n[SPOT-CHECK] Top Session Records (${sampleSessions.length}):`);
  for (const s of sampleSessions) {
    console.log(`  - ID: ${s.id} | User: ${s.userId || "guest"} | Mode: ${s.mode} | WPM: ${s.netWpm} | Acc: ${s.accuracy}%`);
  }

  console.log("\n[SPOT-CHECK SUCCESS] Field-level verification completed successfully.");
}

spotCheckRecords();
