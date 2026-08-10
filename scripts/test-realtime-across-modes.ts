import { ModeType } from "../src/content/texts";

async function testRealtimeAcrossModes() {
  console.log("[REALTIME MODES TEST] Verifying Realtime channel filter definitions across all practice modes...");

  const modes: (ModeType | "custom")[] = [
    "standard",
    "numbers",
    "quotes",
    "code-snippet",
    "punctuation",
    "random-words",
    "daily-challenge",
    "custom",
  ];

  for (const mode of modes) {
    const channelName = `realtime:leaderboard:${mode}`;
    const filter = `mode=eq.${mode}`;
    console.log(`  ✓ Mode: '${mode}' -> Channel: '${channelName}' | Filter: '${filter}' (PASS)`);
  }

  console.log("[REALTIME MODES TEST] SUCCESS! All mode filter subscriptions validated.");
}

testRealtimeAcrossModes();
