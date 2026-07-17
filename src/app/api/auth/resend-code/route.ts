import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVerificationCode, hashVerificationCode, isEmailRateLimited } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

/**
 * Endpoint: POST /api/auth/resend-code
 * Regenerates and resends a 6-digit access code for unverified users.
 * Protects against email scanning by returning a generic success status.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase();

    // Look up the user
    const user = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    // Security: Return generic success if user does not exist
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If this identity profile is registered, a new access key has been transmitted." },
        { status: 200 }
      );
    }

    // Security: Return generic success if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: "If this identity profile is registered, a new access key has been transmitted." },
        { status: 200 }
      );
    }

    // Enforce rate limit (max 3 sends per hour)
    if (await isEmailRateLimited(lowerEmail)) {
      return NextResponse.json(
        { error: "Too many verification requests. Please check your inbox or try again later." },
        { status: 429 }
      );
    }

    // Generate new code
    const rawCode = generateVerificationCode();
    const codeHash = hashVerificationCode(rawCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    // Save code (implicitly invalidates older codes by prioritizing the newest via orderBy)
    await db.verificationCode.create({
      data: {
        userId: user.username,
        codeHash,
        expiresAt,
      },
    });

    // Send email
    const emailSent = await sendVerificationEmail(user.email, rawCode);
    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "If this identity profile is registered, a new access key has been transmitted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend code endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
