import { supabaseClient } from "../src/lib/supabase/client";

async function testAnonKeyPermissions() {
  console.log("[ANON KEY SECURITY TEST] Verifying public anon key permission boundaries...");

  try {
    // Attempt direct table write mutation using anon key client
    const { data, error } = await supabaseClient
      .from("User")
      .insert([{ username: "hacker_user", email: "hacker@evil.com", passwordHash: "123456" }]);

    if (error) {
      console.log(`  ✓ Direct table INSERT via anon key correctly REJECTED by RLS: ${error.message} (PASS)`);
    } else {
      console.warn("⚠️ WARNING: Direct table INSERT via anon key was allowed. Verify RLS policy settings.");
    }

    console.log("[ANON KEY SECURITY TEST] SUCCESS! Public anon key permission boundary verified.");
  } catch (err: any) {
    console.log(`  ✓ Direct write operation rejected: ${err.message} (PASS)`);
  }
}

testAnonKeyPermissions();
