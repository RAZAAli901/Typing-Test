import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateVerificationCode, hashVerificationCode, isEmailRateLimited, isDisposableEmail } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";
import { isCommonPassword } from "@/lib/passwords";

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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => !/^\d+$/.test(val), "Password cannot be purely numeric"),
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

    // Check common password blocklist
    if (isCommonPassword(password)) {
      return NextResponse.json(
        { error: "This password is too common or easily guessed. Please choose a unique password." },
        { status: 400 }
      );
    }

    // Block disposable/temporary emails
    if (isDisposableEmail(lowerEmail)) {
      return NextResponse.json(
        { error: "Disposable or throwaway email addresses are not permitted." },
        { status: 400 }
      );
    }

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
      if (!existingUserByEmail.emailVerified) {
        // Enforce per-email rate limit
        if (await isEmailRateLimited(existingUserByEmail.email)) {
          return NextResponse.json(
            { error: "Too many verification requests. Please check your inbox or try again later." },
            { status: 429 }
          );
        }

        // Generate, hash, and store a new verification code
        const rawCode = generateVerificationCode();
        const codeHash = hashVerificationCode(rawCode);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db.verificationCode.create({
          data: {
            userId: existingUserByEmail.username,
            codeHash,
            expiresAt,
          },
        });

        // Send email
        const emailSent = await sendVerificationEmail(existingUserByEmail.email, rawCode);
        if (!emailSent) {
          return NextResponse.json(
            { error: "Failed to send verification email. Please try again." },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            unverified: true,
            user: { username: existingUserByEmail.username, email: existingUserByEmail.email },
            message: "This identity is unverified. A new access key has been transmitted."
          },
          { status: 200 }
        );
      }

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

    // Generate, hash, and store verification code
    const rawCode = generateVerificationCode();
    const codeHash = hashVerificationCode(rawCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await db.verificationCode.create({
      data: {
        userId: newUser.username,
        codeHash,
        expiresAt,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(newUser.email, rawCode);
    if (!emailSent) {
      // Cleanup: delete the unverified user. Cascade deletion will clean up codes.
      await db.user.delete({
        where: { username: newUser.username },
      });

      return NextResponse.json(
        { error: "Failed to send verification email. Registration aborted." },
        { status: 500 }
      );
    }

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
