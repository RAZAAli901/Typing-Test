// Server-only file - Password reset API route
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isIpRateLimited, buildRateLimitResponse } from "@/lib/rateLimit";
import { hashVerificationCode, timingSafeCompare } from "@/lib/verification";
import { isCommonPassword } from "@/lib/passwords";
import { logSecurityEvent } from "@/lib/logger";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => !/^\d+$/.test(val), "Password cannot be purely numeric"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    // Dedicated strict rate limit: max 3 reset attempts per minute per IP
    if (isIpRateLimited(ip, "reset-password", 3, 60000)) {
      logSecurityEvent({
        event: "RATE_LIMIT_TRIGGERED",
        ip,
        reason: "Password reset rate limit exceeded",
      });
      return buildRateLimitResponse(60, "Too many password reset requests. Please wait a minute before trying again.");
    }

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = parsed.data;
    const lowerEmail = email.toLowerCase();

    if (isCommonPassword(newPassword)) {
      return NextResponse.json(
        { error: "This password is too common or easily guessed." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    if (!user) {
      // Return generic success to prevent email enumeration
      return NextResponse.json(
        { success: true, message: "If an account exists, the password has been reset." },
        { status: 200 }
      );
    }

    const verificationCode = await db.verificationCode.findFirst({
      where: { userId: user.username },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    if (Date.now() > verificationCode.expiresAt.getTime()) {
      return NextResponse.json(
        { error: "Verification code has expired." },
        { status: 400 }
      );
    }

    if (verificationCode.attempts >= 5) {
      return NextResponse.json(
        { error: "Maximum verification attempts exceeded." },
        { status: 400 }
      );
    }

    const submittedHash = hashVerificationCode(code);
    if (!timingSafeCompare(submittedHash, verificationCode.codeHash)) {
      await db.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // Hash new password using bcrypt cost factor 12
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const now = new Date();
    await db.$transaction([
      db.user.update({
        where: { username: user.username },
        data: {
          passwordHash: hashedPassword,
          passwordChangedAt: now,
          sessionInvalidatedAt: now,
        },
      }),
      db.verificationCode.deleteMany({
        where: { userId: user.username },
      }),
    ]);

    logSecurityEvent({
      event: "PASSWORD_RESET",
      email: lowerEmail,
      ip,
      reason: "Password successfully updated via verification code flow",
    });

    return NextResponse.json(
      { success: true, message: "Password updated successfully. Please log in with your new password." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
