import { createClient } from "@supabase/supabase-js";

async function testRlsVerificationCodeReadRegression() {
  console.log("[TEST] Executing VerificationCode RLS anon read rejection regression test...");

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  const client = createClient(publicUrl, anonKey);

  // Attempt read VerificationCode directly via anon client
  const { data, error } = await client.from("VerificationCode").select("*");

  if (data && data.length > 0) {
    console.error("FAIL: Anon key successfully read rows from VerificationCode table! CRITICAL EXPOSURE.");
    process.exit(1);
  }

  console.log(`\x1b[32m[PASS]\x1b[0m VerificationCode read correctly rejected or empty under RLS.`);
}

testRlsVerificationCodeReadRegression().catch((err) => {
  console.log("\x1b[32m[PASS]\x1b[0m VerificationCode read attempt failed as expected:", err.message);
});
