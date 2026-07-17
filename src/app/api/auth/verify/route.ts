import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashVerificationCode } from "@/lib/verification";
import { isIpRateLimited } from "@/lib/rateLimit";

/**
 * Endpoint: POST /api/auth/verify
 * Accepts email and code, verifies identity, and activates the user profile.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isIpRateLimited(ip, "verify-api", 5, 60000)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase();

    // Look up the user profile
    const user = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or verification code." },
        { status: 400 }
      );
    }

    // Retrieve the latest code generated for this user
    const verificationCode = await db.verificationCode.findFirst({
      where: { userId: user.username },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Invalid credentials or verification code." },
        { status: 400 }
      );
    }

    // Check code expiry
    if (Date.now() > verificationCode.expiresAt.getTime()) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Check attempts limit
    if (verificationCode.attempts >= 5) {
      return NextResponse.json(
        { error: "Maximum attempts exceeded. Please request a new code." },
        { status: 400 }
      );
    }

    // Hash submitted code
    const submittedHash = hashVerificationCode(code);

    if (submittedHash !== verificationCode.codeHash) {
      // Increment attempt count on mismatch
      await db.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: { increment: 1 } },
      });

      return NextResponse.json(
        { error: "Invalid credentials or verification code." },
        { status: 400 }
      );
    }

    // Code is valid. Perform user activation and delete the code (consume it) in a transaction.
    await db.$transaction([
      db.user.update({
        where: { username: user.username },
        data: { emailVerified: true },
      }),
      db.verificationCode.delete({
        where: { id: verificationCode.id },
      }),
    ]);

    return NextResponse.json(
      { success: true, message: "Identity authorized successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
