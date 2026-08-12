// Server-only file - Logout of all devices endpoint
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized access. Please log in first." },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase();
    const now = new Date();

    // Server-side Session Invalidation: Updates sessionInvalidatedAt timestamp in database.
    // Any existing JWTs issued prior to this timestamp will be rejected by NextAuth's jwt callback.
    await db.user.update({
      where: { email },
      data: { sessionInvalidatedAt: now },
    });

    logSecurityEvent({
      event: "SESSION_REJECTED",
      email,
      reason: "User manually logged out of all active devices",
    });

    return NextResponse.json(
      { success: true, message: "Logged out of all active devices successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout-all error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
