import { db } from "@/lib/db";

/**
 * Regression test for Issue #1: Impersonation / Identity forgery.
 * Sends a POST request simulation to /api/sessions with a real registered username
 * but no active NextAuth session cookie, confirming the score does NOT attach to the real user account.
 */
export async function testSessionForgeryRegression() {
  console.log("[Regression Check #1] Testing unauthenticated session submission with registered username...");

  const targetUsername = "registered_test_user_" + Date.now();
  
  // 1. Create a dummy registered user
  const user = await db.user.create({
    data: {
      username: targetUsername,
      email: `${targetUsername}@example.com`,
      passwordHash: "$2a$10$abcdefghijklmnopqrstuu", // real bcrypt hash format
      emailVerified: true,
    },
  });

  console.log(`Created test registered user: ${user.username}`);

  // 2. Simulate POST payload targeting targetUsername without session cookie
  const payload = {
    username: targetUsername,
    mode: "standard",
    grossWpm: 100,
    netWpm: 95,
    accuracy: 98,
    timeTakenSeconds: 30,
  };

  // Import POST route handler dynamically or perform logic check
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

  // 3. Verify session was NOT attached to the registered user
  const attachedSessions = await db.session.findMany({
    where: { userId: targetUsername },
  });

  // Cleanup test user
  await db.user.delete({ where: { username: targetUsername } });
  if (result.session?.id) {
    await db.session.delete({ where: { id: result.session.id } }).catch(() => {});
  }

  if (attachedSessions.length === 0) {
    console.log("SUCCESS: Unauthenticated score did NOT attach to registered user!");
    return true;
  } else {
    console.error("FAIL: Unauthenticated score attached to registered user!");
    throw new Error("Regression test failed: Impersonation vulnerability present");
  }
}
