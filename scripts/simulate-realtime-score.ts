import { db } from "../src/lib/db";

async function simulateRealtimeScore() {
  const mode = process.argv[2] || "standard";
  const netWpm = parseInt(process.argv[3] || "150", 10);
  const username = process.argv[4] || "cyber_runner_99";

  console.log(`[SIMULATE REALTIME SCORE] Inserting test session for mode '${mode}'...`);

  try {
    const session = await db.session.create({
      data: {
        userId: username,
        guestDisplayName: null,
        mode,
        grossWpm: netWpm + 10,
        netWpm,
        accuracy: 99.5,
        timeTakenSeconds: 30.0,
        charsTyped: 750,
        mistakes: 2,
      },
    });

    console.log(`[SIMULATE SUCCESS] Created Session ID: ${session.id} (WPM: ${session.netWpm})`);
    console.log("-> Realtime CDC publication will broadcast this insertion event to active WebSocket listeners!");
  } catch (error: any) {
    console.error("[SIMULATE ERROR] Failed to create score session:", error.message);
    process.exit(1);
  }
}

simulateRealtimeScore();
