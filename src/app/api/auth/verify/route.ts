import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashVerificationCode } from "@/lib/verification";

/**
 * Endpoint: POST /api/auth/verify
 * Accepts email and code, verifies identity, and activates the user profile.
 */
export async function POST(request: Request) {
  try {
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

    return NextResponse.json(
      { success: false, message: "Code hash matches. Activation pending." },
      { status: 501 }
    );
  } catch (error) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
