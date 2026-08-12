import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { recomputeSessionMetrics, validateSanityBounds, validateAccuracyConsistency, validateGrossWpmPlausibility, validateSpeedCeiling } from "@/lib/scoreValidation";
import { TEXT_ASSETS } from "@/content/texts";

// Rate limiting in-memory store
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();
const WINDOW_LIMIT = 10;
const WINDOW_DURATION = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const info = rateLimitMap.get(ip);

  if (!info) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_DURATION });
    return false;
  }

  if (now > info.resetTime) {
    info.count = 1;
    info.resetTime = now + WINDOW_DURATION;
    return false;
  }

  info.count += 1;
  return info.count > WINDOW_LIMIT;
}

// Basic profanity and reserved keyword filter
const BLOCKED_USERNAMES = [
  "admin", "moderator", "root", "system", "support",
  "fuck", "shit", "ass", "bitch", "cunt", "nigger", "retard", "bastard", "dick", "pussy"
];

function isProfane(username: string): boolean {
  const lower = username.toLowerCase();
  return BLOCKED_USERNAMES.some((bad) => lower.includes(bad));
}

const KeystrokeEventSchema = z.object({
  char: z.string(),
  timestamp: z.number(),
  correct: z.boolean(),
});

// Zod Schema boundary validation: Enforces strict sane bounds on all numeric metrics (WPM, accuracy, time)
const SessionPostSchema = z.object({
  practiceSessionId: z.string().optional(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9 _-]+$/).optional(),
  guestDisplayName: z.string().min(3).max(20).optional(),
  mode: z.string(),
  grossWpm: z.number().int("Gross WPM must be an integer").min(0, "Gross WPM cannot be negative").max(400, "Gross WPM exceeds human ceiling of 400").optional(),
  netWpm: z.number().int("Net WPM must be an integer").min(0, "Net WPM cannot be negative").max(400, "Net WPM exceeds human ceiling of 400").optional(),
  accuracy: z.number().min(0, "Accuracy cannot be negative").max(100, "Accuracy cannot exceed 100%").optional(),
  timeTakenSeconds: z.number().gt(0, "Time taken must be greater than 0").max(3600, "Time taken cannot exceed 1 hour").optional(),
  charsTyped: z.number().int().min(0).max(50000).optional(),
  mistakes: z.number().int().min(0).max(5000).optional(),
  events: z.array(KeystrokeEventSchema).optional(),
});

import { validateOriginAndReferer } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // 0. CSRF & Origin Validation
    const originCheck = validateOriginAndReferer(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { error: `Cross-origin request rejected: ${originCheck.reason}` },
        { status: 403 }
      );
    }

    // 1. IP and User Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const authSession = await getServerSession(authOptions);
    const authenticatedUser = authSession?.user?.name || authSession?.user?.id;
    const rateLimitKey = authenticatedUser ? `user:${authenticatedUser}` : `ip:${ip}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // 2. Validate request body
    const result = SessionPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid session data", details: body.username ? result.error.format() : "Username must be 3-20 characters long and contain only alphanumeric characters, dashes, or underscores." },
        { status: 400 }
      );
    }

    const {
      practiceSessionId,
      username,
      mode,
      grossWpm: clientGross = 0,
      netWpm: clientNet = 0,
      accuracy: clientAcc = 0,
      timeTakenSeconds: clientTime = 0,
      charsTyped: clientChars = 0,
      mistakes: clientMistakes = 0,
      events,
    } = result.data;

    // Validate PracticeSession record
    let targetText = TEXT_ASSETS[mode as keyof typeof TEXT_ASSETS] || TEXT_ASSETS.standard;

    if (!practiceSessionId) {
      console.warn("[SECURITY REJECT] Session submission rejected: Missing practiceSessionId", { ip, user: authenticatedUser || "guest", timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: "Invalid session submission: missing practiceSessionId" },
        { status: 400 }
      );
    }

    const practiceSession = await db.practiceSession.findUnique({
      where: { id: practiceSessionId },
    });

    if (!practiceSession) {
      console.warn("[SECURITY REJECT] Session submission rejected: Practice session not found", { practiceSessionId, ip, user: authenticatedUser || "guest", timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: "Practice session not found or invalid" },
        { status: 400 }
      );
    }

    if (practiceSession.completed) {
      console.warn("[SECURITY REJECT] Session submission rejected: Practice session already completed (replay attempt)", { practiceSessionId, ip, user: authenticatedUser || "guest", timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: "Practice session has already been completed" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(practiceSession.expiresAt)) {
      console.warn("[SECURITY REJECT] Session submission rejected: Practice session expired", { practiceSessionId, ip, user: authenticatedUser || "guest", timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: "Practice session has expired" },
        { status: 400 }
      );
    }

    // Use server-verified targetText from PracticeSession
    targetText = practiceSession.targetText;
    
    // Server-side score recomputation: Never trust client-submitted metrics for database storage
    let grossWpm = clientGross;
    let netWpm = clientNet;
    let accuracy = clientAcc;
    let timeTakenSeconds = clientTime;
    let charsTyped = clientChars;
    let mistakes = clientMistakes;

    if (events && events.length > 0) {
      const recomputed = recomputeSessionMetrics(targetText, events);
      grossWpm = recomputed.grossWpm;
      netWpm = recomputed.netWpm;
      accuracy = recomputed.accuracy;
      timeTakenSeconds = recomputed.timeTakenSeconds;
      charsTyped = recomputed.charsTyped;
      mistakes = recomputed.mistakes;
    }

    // Defense-in-depth sanity bounds check
    const sanityCheck = validateSanityBounds({
      grossWpm,
      netWpm,
      accuracy,
      charsTyped,
      mistakes,
      timeTakenSeconds,
    });

    if (!sanityCheck.valid) {
      return NextResponse.json(
        { error: `Sanity bounds check failed: ${sanityCheck.reason}` },
        { status: 400 }
      );
    }

    const accuracyCheck = validateAccuracyConsistency({
      grossWpm,
      netWpm,
      accuracy,
      charsTyped,
      mistakes,
      timeTakenSeconds,
    });

    if (!accuracyCheck.valid) {
      return NextResponse.json(
        { error: `Accuracy consistency check failed: ${accuracyCheck.reason}` },
        { status: 400 }
      );
    }

    const grossWpmCheck = validateGrossWpmPlausibility({
      grossWpm,
      netWpm,
      accuracy,
      charsTyped,
      mistakes,
      timeTakenSeconds,
    });

    if (!grossWpmCheck.valid) {
      return NextResponse.json(
        { error: `Gross WPM plausibility check failed: ${grossWpmCheck.reason}` },
        { status: 400 }
      );
    }

    const speedCeilingCheck = validateSpeedCeiling({
      grossWpm,
      netWpm,
      accuracy,
      charsTyped,
      mistakes,
      timeTakenSeconds,
    });

    if (!speedCeilingCheck.valid) {
      return NextResponse.json(
        { error: `Speed ceiling check failed: ${speedCeilingCheck.reason}` },
        { status: 400 }
      );
    }

    // 3. Profanity and reserved word check
    if (username && isProfane(username)) {
      return NextResponse.json(
        { error: "Username contains blocked or inappropriate words." },
        { status: 400 }
      );
    }

    // SECURITY ENFORCEMENT (Issue #1 & Commit 40):
    // Authenticated users strictly derive identity from server session token (authSession.user).
    // Client-supplied `username` or `userId` in request body is completely ignored for authenticated users.
    let finalUsername: string;
    if (authenticatedUser) {
      finalUsername = authenticatedUser;
    } else {
      finalUsername = username || "Guest";
    }

    // Coordinate with guest handling: tag colliding guest display names cleanly
    if (!authenticatedUser) {
      const registeredUser = await db.user.findUnique({
        where: { username: finalUsername },
      });
      if (registeredUser && registeredUser.passwordHash !== "GUEST_USER_NO_PASSWORD") {
        // Clearly tag/distinguish guest submission from real account
        finalUsername = `${finalUsername} (guest)`;
      }
    }

    // Note: Guest submissions never create or reserve User table rows (Issue #3 fix).

    // Mark PracticeSession as completed to prevent replay attacks
    await db.practiceSession.update({
      where: { id: practiceSession.id },
      data: { completed: true },
    });

    // Write the Session record to the database (guests populate guestDisplayName, authenticated users populate userId)
    const session = await db.session.create({
      data: {
        userId: authenticatedUser ? authenticatedUser : null,
        guestDisplayName: !authenticatedUser ? finalUsername : null,
        practiceSessionId: practiceSession.id,
        mode,
        grossWpm,
        netWpm,
        accuracy,
        timeTakenSeconds,
        charsTyped,
        mistakes,
      },
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating typing session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
