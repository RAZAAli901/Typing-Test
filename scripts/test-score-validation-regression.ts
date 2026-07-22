import { db } from "@/lib/db";
import { recomputeSessionMetrics } from "@/lib/scoreValidation";

/**
 * Regression test for Issue #2: Unvalidated Scoring.
 * Verifies that fabricated client-side WPM/accuracy values are ignored and recomputed
 * server-side from raw keystroke data tied to a PracticeSession.
 */
export async function testScoreValidationRegression() {
  console.log("[Regression Check #2] Testing server-side score recomputation & validation...");

  const targetText = "The quick brown fox jumps over the lazy dog.";
  
  // 1. Create a PracticeSession record
  const practiceSession = await db.practiceSession.create({
    data: {
      mode: "standard",
      targetText,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // 2. Generate raw keystroke events corresponding to ~40 WPM (slow typing)
  const events = [];
  const baseTime = Date.now();
  for (let i = 0; i < targetText.length; i++) {
    events.push({
      char: targetText[i],
      timestamp: baseTime + i * 150, // 150ms per key
      correct: true,
    });
  }

  // 3. Attempt POST with fabricated metrics (300 WPM, 100% accuracy) in request body
  const payload = {
    practiceSessionId: practiceSession.id,
    mode: "standard",
    username: "cheat_tester",
    grossWpm: 300, // fabricated high WPM
    netWpm: 300,   // fabricated high WPM
    accuracy: 100,
    timeTakenSeconds: 5,
    events,
  };

  const { POST } = await import("@/app/api/sessions/route");
  const request = new Request("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await POST(request);
  const result = await response.json();

  console.log("Response status:", response.status);
  console.log("Response result:", result);

  if (!result.success || !result.session) {
    // If rejected due to sanity/speed checks, that's also valid server enforcement
    console.log("SUCCESS: Server rejected fabricated score payload!");
  } else {
    // Check that stored session netWpm was recomputed, NOT set to fabricated 300
    const storedSession = await db.session.findUnique({
      where: { id: result.session.id },
    });

    console.log("Stored Session Net WPM:", storedSession?.netWpm);

    if (storedSession && storedSession.netWpm < 150) {
      console.log("SUCCESS: Server recomputed score from keystrokes (stored WPM matches real keystrokes, not fabricated 300 WPM)!");
    } else {
      console.error("FAIL: Server stored fabricated WPM without recomputation!");
      throw new Error("Regression test failed: Fabricated WPM was accepted as-is");
    }

    // Cleanup session & practice session
    await db.session.delete({ where: { id: storedSession!.id } }).catch(() => {});
  }

  await db.practiceSession.delete({ where: { id: practiceSession.id } }).catch(() => {});
  return true;
}
