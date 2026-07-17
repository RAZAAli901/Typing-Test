import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Endpoint: GET /api/auth/verification-status?email=...
 * Retrieves the verification status of the requested identity.
 * Prevents account scanning by returning verified: false if not registered.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return verified: false for unknown profiles to block credential discovery
      return NextResponse.json({ verified: false }, { status: 200 });
    }

    return NextResponse.json({ verified: user.emailVerified }, { status: 200 });
  } catch (error) {
    console.error("Verification status API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
