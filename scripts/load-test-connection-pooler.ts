import { db } from "../src/lib/db";

async function loadTestConnectionPooler() {
  const concurrentRequests = 10;
  console.log(`[POOLER LOAD TEST] Simulating ${concurrentRequests} concurrent database queries over Supabase PgBouncer...`);

  const startTime = performance.now();

  try {
    const promises = Array.from({ length: concurrentRequests }).map(async (_, idx) => {
      const session = await db.session.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, netWpm: true },
      });
      return session;
    });

    const results = await Promise.all(promises);
    const duration = performance.now() - startTime;

    console.log(`  ✓ Successfully executed ${results.length} concurrent queries in ${duration.toFixed(2)}ms (PASS)`);
    console.log("[POOLER LOAD TEST] SUCCESS! Connection pooler handled concurrent requests without connection exhaustion.");
  } catch (error: any) {
    console.error("❌ POOLER LOAD TEST FAILED:", error.message);
    process.exit(1);
  }
}

loadTestConnectionPooler();
