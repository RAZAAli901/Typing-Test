import { db } from "@/lib/db";

export interface SuspiciousSessionFlag {
  sessionId: string;
  username: string;
  mode: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  timeTakenSeconds: number;
  reasons: string[];
}

/**
 * Audits existing database Session records for indicators of forged or impossible submissions.
 * Outputs flagged sessions for manual administrative review without auto-deleting.
 */
export async function auditForgedSessions(): Promise<SuspiciousSessionFlag[]> {
  console.log("=== Auditing Session Records for Prior Forged Submissions ===");
  
  const sessions = await db.session.findMany({
    include: {
      user: true,
    },
  });

  const flagged: SuspiciousSessionFlag[] = [];

  for (const session of sessions) {
    const reasons: string[] = [];

    const sessionName = session.user?.username || session.guestDisplayName || "Guest";

    // 1. Unrealistic speed ceiling (> 250 WPM)
    if (session.netWpm > 250 || session.grossWpm > 250) {
      reasons.push(`Implausible speed: netWpm=${session.netWpm}, grossWpm=${session.grossWpm} (> 250 WPM)`);
    }

    // 2. Net WPM exceeds Gross WPM
    if (session.netWpm > session.grossWpm) {
      reasons.push(`Invalid metric: netWpm (${session.netWpm}) > grossWpm (${session.grossWpm})`);
    }

    // 3. Improbable accuracy with high speed
    if (session.netWpm > 180 && session.accuracy === 100 && session.timeTakenSeconds < 5) {
      reasons.push(`Suspicious perfect accuracy at super-human speed in short duration`);
    }

    // 4. Session attributed to GUEST user placeholder account
    if (session.user && session.user.passwordHash === "GUEST_USER_NO_PASSWORD") {
      reasons.push(`Attributed to auto-created guest placeholder user (${sessionName})`);
    }

    if (reasons.length > 0) {
      flagged.push({
        sessionId: session.id,
        username: sessionName,
        mode: session.mode,
        netWpm: session.netWpm,
        grossWpm: session.grossWpm,
        accuracy: session.accuracy,
        timeTakenSeconds: session.timeTakenSeconds,
        reasons,
      });
    }
  }

  console.log(`Audit Complete. Scanned ${sessions.length} sessions.`);
  console.log(`Flagged ${flagged.length} session(s) for manual review:`);
  
  flagged.forEach((item, idx) => {
    console.log(`\n[#${idx + 1}] Session ID: ${item.sessionId}`);
    console.log(`     User: ${item.username} | Mode: ${item.mode}`);
    console.log(`     Metrics: ${item.netWpm} WPM / ${item.accuracy}% / ${item.timeTakenSeconds}s`);
    console.log(`     Reasons for review: ${item.reasons.join("; ")}`);
  });

  return flagged;
}

// Enable standalone execution if run directly
if (require.main === module) {
  auditForgedSessions()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Audit error:", err);
      process.exit(1);
    });
}
