import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

// Basic Zod Schema validation with sanity bounds
const SessionPostSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  mode: z.string(),
  grossWpm: z.number().int().min(0).max(400),
  netWpm: z.number().int().min(0).max(400),
  accuracy: z.number().min(0).max(100),
  timeTakenSeconds: z.number().gt(0).max(3600),
  charsTyped: z.number().int().min(0).max(50000).optional(),
  mistakes: z.number().int().min(0).max(5000).optional(),
});

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
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
      username,
      mode,
      grossWpm,
      netWpm,
      accuracy,
      timeTakenSeconds,
      charsTyped = 0,
      mistakes = 0,
    } = result.data;

    // 3. Profanity and reserved word check
    if (isProfane(username)) {
      return NextResponse.json(
        { error: "Username contains blocked or inappropriate words." },
        { status: 400 }
      );
    }

    // Check active authentication session
    const authSession = await getServerSession(authOptions);
    const authenticatedUser = authSession?.user?.name || authSession?.user?.id;
    
    // If authenticated, use verified session identity; never trust client-supplied username/userId
    const finalUsername = authenticatedUser || username;

    // Ensure the User exists in the database
    const userExists = await db.user.findUnique({
      where: { username: finalUsername },
    });

    if (!userExists) {
      await db.user.create({
        data: {
          username: finalUsername,
          email: `${finalUsername.toLowerCase()}@guest.typemaster.local`,
          passwordHash: "GUEST_USER_NO_PASSWORD",
        },
      });
    }

    // Write the Session record to the database
    const session = await db.session.create({
      data: {
        username: finalUsername,
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
