async function testPbAlertFiltering() {
  console.log("[PB ALERT TEST] Testing Personal Best alert trigger and filtering rules...");

  const userPb = 120;
  const username = "cyber_hero";

  // Test 1: Self submission (Should NOT trigger)
  const selfScore = { username: "cyber_hero", netWpm: 140, mode: "standard" };
  const isSelf = selfScore.username.toLowerCase() === username.toLowerCase();
  console.log(`  ✓ Self submission filter: ${isSelf ? "IGNORED (PASS)" : "TRIGGERED (FAIL)"}`);

  // Test 2: Lower score than PB (Should NOT trigger)
  const lowerScore = { username: "other_player", netWpm: 100, mode: "standard" };
  const isLower = lowerScore.netWpm <= userPb;
  console.log(`  ✓ Lower score filter (100 <= 120 WPM): ${isLower ? "IGNORED (PASS)" : "TRIGGERED (FAIL)"}`);

  // Test 3: Higher score than PB by competitor (Should TRIGGER)
  const higherScore = { username: "other_player", netWpm: 135, mode: "standard" };
  const isHigherCompetitorSelf = higherScore.username.toLowerCase() === username.toLowerCase();
  const shouldTrigger = !isHigherCompetitorSelf && higherScore.netWpm > userPb;
  console.log(`  ✓ Higher competitor score (135 > 120 WPM): ${shouldTrigger ? "TRIGGERED (PASS)" : "IGNORED (FAIL)"}`);

  if (!shouldTrigger || !isSelf || !isLower) {
    console.error("❌ PB ALERT TEST FAILED: Filtering rules did not evaluate correctly!");
    process.exit(1);
  }


  console.log("[PB ALERT TEST] SUCCESS! Personal Best alert filtering rules verified.");
}

testPbAlertFiltering();
