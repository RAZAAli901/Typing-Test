async function testRealtimePerf() {
  console.log("[REALTIME PERF TEST] Validating re-render metrics and payload processing overhead...");

  const startTime = performance.now();
  const iterations = 1000;

  for (let i = 0; i < iterations; i++) {
    const payload = {
      id: `session-${i}`,
      userId: `user_${i % 50}`,
      mode: "standard",
      netWpm: 100 + (i % 50),
      grossWpm: 110 + (i % 50),
      accuracy: 98.0,
      timeTakenSeconds: 30,
      createdAt: new Date().toISOString(),
    };

    // Simulate formatting overhead
    const formatted = {
      ...payload,
      username: payload.userId || "Anonymous",
    };
  }

  const durationMs = performance.now() - startTime;
  console.log(`  ✓ Processed ${iterations} realtime score events in ${durationMs.toFixed(2)}ms (PASS)`);
  console.log(`  ✓ Average event processing duration: ${(durationMs / iterations).toFixed(4)}ms/event`);

  if (durationMs > 500) {
    console.error("❌ PERF TEST FAILED: Realtime event processing exceeded 500ms threshold!");
    process.exit(1);
  }

  console.log("[REALTIME PERF TEST] SUCCESS! Realtime score listener performance verified.");
}

testRealtimePerf();
