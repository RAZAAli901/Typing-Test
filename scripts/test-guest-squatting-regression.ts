import { db } from "@/lib/db";

/**
 * Regression test for Issue #3: Guest username squatting.
 * Submits a guest session under a brand-new name, then attempts to sign up using that exact username,
 * confirming it is available and not reserved/squatted in the User table.
 */
export async function testGuestSquattingRegression() {
  console.log("[Regression Check #3] Testing guest session submission username availability...");

  const candidateUsername = "guest_test_name_" + Date.now();

  // 1. Initialize a PracticeSession
  const practiceSession = await db.practiceSession.create({
    data: {
      mode: "standard",
      targetText: "Sample typing text passage for guest test.",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  // 2. Submit a guest session with candidateUsername
  const sessionPayload = {
    practiceSessionId: practiceSession.id,
    guestDisplayName: candidateUsername,
    mode: "standard",
    events: [
      { char: "S", timestamp: Date.now(), correct: true },
      { char: "a", timestamp: Date.now() + 100, correct: true },
    ],
  };

  const { POST: sessionPOST } = await import("@/app/api/sessions/route");
  const sessionReq = new Request("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionPayload),
  });

  const sessionRes = await sessionPOST(sessionReq);
  const sessionJson = await sessionRes.json();
  console.log("Guest session creation response:", sessionJson);

  // 3. Confirm NO User row was created in User table for candidateUsername
  const userCheck = await db.user.findUnique({
    where: { username: candidateUsername },
  });

  if (userCheck) {
    console.error("FAIL: User row was created in User table for guest submission!");
    throw new Error("Regression test failed: Guest username squatting vulnerability present");
  }

  console.log("SUCCESS: No User row created for guest submission.");

  // 4. Attempt to sign up with that exact username via /api/auth/signup logic
  const signupPayload = {
    username: candidateUsername,
    email: `${candidateUsername}@example.com`,
    password: "Password123!",
  };

  const { POST: signupPOST } = await import("@/app/api/auth/signup/route");
  const signupReq = new Request("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupPayload),
  });

  const signupRes = await signupPOST(signupReq);
  const signupJson = await signupRes.json();
  console.log("Signup response:", signupJson);

  // Cleanup created user & session
  await db.user.delete({ where: { username: candidateUsername } }).catch(() => {});
  if (sessionJson.session?.id) {
    await db.session.delete({ where: { id: sessionJson.session.id } }).catch(() => {});
  }
  await db.practiceSession.delete({ where: { id: practiceSession.id } }).catch(() => {});

  if (signupRes.status === 201 || signupJson.success) {
    console.log("SUCCESS: Exact username was available and signup succeeded!");
    return true;
  } else {
    console.error("FAIL: Username was unavailable for signup after guest submission!");
    throw new Error("Regression test failed: Username blocked after guest submission");
  }
}
