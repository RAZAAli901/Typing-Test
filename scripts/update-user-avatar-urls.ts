import { db } from "../src/lib/db";
import { formatAvatarUrl } from "../src/lib/utils";

async function updateUserAvatarUrls() {
  console.log("[AVATAR URL UPDATE] Standardizing user avatar URLs in database...");

  const users = await db.user.findMany({
    where: { avatarUrl: { not: null } },
  });

  console.log(`[AVATAR URL UPDATE] Found ${users.length} users with avatar URLs.`);

  let updatedCount = 0;

  for (const user of users) {
    if (!user.avatarUrl) continue;
    const formatted = formatAvatarUrl(user.avatarUrl);
    if (formatted && formatted !== user.avatarUrl) {
      await db.user.update({
        where: { username: user.username },
        data: { avatarUrl: formatted },
      });
      console.log(`  ✓ Updated '${user.username}': ${user.avatarUrl} -> ${formatted}`);
      updatedCount++;
    }
  }

  console.log(`[AVATAR URL UPDATE COMPLETE] Updated ${updatedCount} avatar URLs.`);
}

updateUserAvatarUrls();
