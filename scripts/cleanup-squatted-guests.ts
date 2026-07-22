import { db } from "@/lib/db";

/**
 * One-time migration/cleanup script for existing squatted User rows.
 * Finds User rows created with passwordHash = "GUEST_USER_NO_PASSWORD",
 * reassigns their sessions to Session.guestDisplayName,
 * and deletes the squatted User rows so those usernames become available for real signups.
 */
export async function cleanupSquattedGuestUsers() {
  console.log("=== Starting Cleanup of Squatted Guest User Rows ===");

  const squattedUsers = await db.user.findMany({
    where: {
      passwordHash: "GUEST_USER_NO_PASSWORD",
    },
    include: {
      sessions: true,
    },
  });

  console.log(`Found ${squattedUsers.length} squatted guest user row(s) to process.`);

  let reassignedSessionsCount = 0;
  let deletedUsersCount = 0;

  for (const guestUser of squattedUsers) {
    console.log(`Processing squatted username: "${guestUser.username}" (${guestUser.sessions.length} sessions)`);

    // Reassign all associated sessions to guestDisplayName
    if (guestUser.sessions.length > 0) {
      const updateResult = await db.session.updateMany({
        where: {
          userId: guestUser.username,
        },
        data: {
          guestDisplayName: guestUser.username,
          userId: null,
        },
      });
      reassignedSessionsCount += updateResult.count;
    }

    // Delete the squatted user row to free the username
    await db.user.delete({
      where: {
        username: guestUser.username,
      },
    });

    deletedUsersCount++;
  }

  console.log("=== Cleanup Summary ===");
  console.log(`- Freed ${deletedUsersCount} squatted username(s).`);
  console.log(`- Reassigned ${reassignedSessionsCount} session record(s) to guestDisplayName.`);
  console.log("Cleanup completed successfully.");
}

// Support CLI direct execution
if (require.main === module) {
  cleanupSquattedGuestUsers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Cleanup error:", err);
      process.exit(1);
    });
}
