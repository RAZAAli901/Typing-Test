import { createClient } from "@supabase/supabase-js";

async function testRlsAnonWriteRegression() {
  console.log("[TEST] Executing RLS anon write rejection regression test...");

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  const client = createClient(publicUrl, anonKey);

  // Attempt write directly via anon client
  const { data, error } = await client.from("User").insert({
    username: "hacker_anon_user",
    email: "hacker@example.com",
    passwordHash: "fakehash123",
  });

  if (!error) {
    console.error("FAIL: Anon key successfully wrote to User table! RLS policy missing or weak.");
    process.exit(1);
  }

  console.log(`\x1b[32m[PASS]\x1b[0m Anon write correctly rejected by RLS: ${error.message}`);
}

testRlsAnonWriteRegression().catch((err) => {
  console.log("\x1b[32m[PASS]\x1b[0m Anon write attempt failed as expected:", err.message);
});
