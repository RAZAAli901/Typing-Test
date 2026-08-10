import { db } from "../src/lib/db";
import { supabaseServer } from "../src/lib/supabase/server";

async function migrateAvatars() {
  console.log("[AVATAR MIGRATION] Starting legacy avatar migration to Supabase Storage...");

  try {
    const usersWithAvatars = await db.user.findMany({
      where: {
        avatarUrl: { not: null },
      },
      select: { username: true, avatarUrl: true },
    });

    console.log(`[AVATAR MIGRATION] Found ${usersWithAvatars.length} users with stored avatars.`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const u of usersWithAvatars) {
      if (!u.avatarUrl) continue;

      if (u.avatarUrl.includes("supabase.co/storage")) {
        console.log(`  ✓ User '${u.username}' already uses Supabase Storage URL.`);
        skippedCount++;
        continue;
      }

      console.log(`  - Fetching legacy avatar for '${u.username}': ${u.avatarUrl}`);

      try {
        const response = await fetch(u.avatarUrl);
        if (!response.ok) {
          console.warn(`  ⚠️ Could not fetch legacy avatar (HTTP ${response.status}). Skipping.`);
          skippedCount++;
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `avatar-${u.username.replace(/[^a-zA-Z0-9_-]/g, "_")}-migrated.png`;

        const { data, error: uploadErr } = await supabaseServer.storage
          .from("avatars")
          .upload(filename, buffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadErr) {
          console.error(`  ❌ Failed to upload avatar to Supabase Storage:`, uploadErr.message);
          skippedCount++;
          continue;
        }

        const { data: publicUrlData } = supabaseServer.storage.from("avatars").getPublicUrl(data.path);

        await db.user.update({
          where: { username: u.username },
          data: { avatarUrl: publicUrlData.publicUrl },
        });

        console.log(`  ✓ Successfully migrated avatar for '${u.username}' -> ${publicUrlData.publicUrl}`);
        migratedCount++;
      } catch (err: any) {
        console.error(`  ❌ Error processing user '${u.username}':`, err.message);
        skippedCount++;
      }
    }

    console.log(`[AVATAR MIGRATION COMPLETE] Migrated: ${migratedCount} | Skipped/Failed: ${skippedCount}`);
  } catch (error: any) {
    console.error("[AVATAR MIGRATION FAILED]:", error.message);
    process.exit(1);
  }
}

migrateAvatars();
