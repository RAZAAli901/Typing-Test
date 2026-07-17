import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Rate limiting in-memory store
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();
const WINDOW_LIMIT = 5; // Max 5 signup attempts per minute
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

const signupSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(6).regex(/\d/),
});

export async function POST(request: Request) {
  try {
    // Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many sign up requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input fields." },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;
    const lowerEmail = email.toLowerCase();
    const normalizedUsername = username.trim();

    // Enforce username rules and profanity checks
    const BLOCKED_USERNAMES = [
      "admin", "moderator", "root", "system", "support",
      "fuck", "shit", "ass", "bitch", "cunt", "nigger", "retard", "bastard", "dick", "pussy"
    ];
    if (BLOCKED_USERNAMES.some(bad => normalizedUsername.toLowerCase().includes(bad))) {
      return NextResponse.json(
        { error: "Username contains inappropriate words." },
        { status: 400 }
      );
    }

    // Check if user already exists by username
    const existingUserByUsername = await db.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const existingUserByEmail = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        username: normalizedUsername,
        email: lowerEmail,
        passwordHash: hashedPassword,
        emailVerified: false,
      },
    });

    return NextResponse.json(
      { success: true, user: { username: newUser.username, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
