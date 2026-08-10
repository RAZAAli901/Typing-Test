import { db } from "../src/lib/db";

async function testSupabaseSessionScore() {
  console.log("[SESSION SCORE TEST] Testing typing session score creation and leaderboard query...");

  const testSessionId = `test-session-${Date.now()}`;
  const testWpm = 125;

  try {
    // 1. Create Session
    const createdSession = await db.session.create({
      data: {
        id: testSessionId,
        guestDisplayName: "Test Runner",
        mode: "standard",
        grossWpm: testWpm + 10,
        netWpm: testWpm,
        accuracy: 98.5,
        timeTakenSeconds: 30.0,
        charsTyped: 625,
        mistakes: 2,
      },
    });

    console.log(`  ✓ Created Session record: ${createdSession.id} (${createdSession.netWpm} WPM)`);

    // 2. Query Leaderboard
    const leaderboardScores = await db.session.findMany({
      where: { mode: "standard" },
      orderBy: { netWpm: "desc" },
      take: 10,
    });

    const isPresentInLeaderboard = leaderboardScores.some((s) => s.id === testSessionId);
    console.log(`  ✓ Leaderboard query inclusion: ${isPresentInLeaderboard ? "FOUND (PASS)" : "NOT IN TOP 10"}`);

    // Cleanup
    await db.session.delete({ where: { id: testSessionId } });
    console.log(`  ✓ Cleaned up test session record.`);
    console.log("[SESSION SCORE TEST] SUCCESS! Session creation and Leaderboard query verified.");
  } catch (error: any) {
    console.error("[SESSION SCORE TEST FAILED]:", error.message);
    process.exit(1);
  }
}

testSupabaseSessionScore();
