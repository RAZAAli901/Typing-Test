import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Rate limiting in-memory store
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();
const WINDOW_LIMIT = 10; // Max 10 requests
const WINDOW_DURATION = 60 * 1000; // 1 minute window

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
        { error: "Invalid session data", details: result.error.format() },
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

    // Ensure the User exists in the database
    await db.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });

    // Write the Session record to the database
    const session = await db.session.create({
      data: {
        username,
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
