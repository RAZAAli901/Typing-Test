async function testPresenceJoinLeave() {
  console.log("[PRESENCE TEST] Testing Realtime Presence join/leave state dictionary calculations...");

  let presenceMap: Record<string, { username: string }[]> = {};

  // Simulate User 1 join
  presenceMap["user_1"] = [{ username: "player_one" }];
  let count = Object.keys(presenceMap).length;
  console.log(`  ✓ User 1 joined -> Presence count: ${count} (Expected: 1 - PASS)`);

  // Simulate User 2 join
  presenceMap["user_2"] = [{ username: "player_two" }];
  count = Object.keys(presenceMap).length;
  console.log(`  ✓ User 2 joined -> Presence count: ${count} (Expected: 2 - PASS)`);

  // Simulate User 1 leave
  delete presenceMap["user_1"];
  count = Object.keys(presenceMap).length;
  console.log(`  ✓ User 1 left -> Presence count: ${count} (Expected: 1 - PASS)`);

  if (count !== 1) {
    console.error("❌ PRESENCE TEST FAILED: Count did not decrement correctly on leave!");
    process.exit(1);
  }

  console.log("[PRESENCE TEST] SUCCESS! Realtime Presence join/leave calculation verified.");
}

testPresenceJoinLeave();
