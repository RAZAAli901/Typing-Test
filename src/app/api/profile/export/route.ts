import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/profile/export
 * GDPR / Privacy Rights data export endpoint.
 * Downloads all account details, security metadata, and typing sessions as JSON.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const username = session.user.name;

    const user = await db.user.findUnique({
      where: { username },
      select: {
        username: true,
        email: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        passwordChangedAt: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            mode: true,
            grossWpm: true,
            netWpm: true,
            accuracy: true,
            timeTakenSeconds: true,
            charsTyped: true,
            mistakes: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const exportData = {
      format: "TypeMaster User Data Archive",
      exportedAt: new Date().toISOString(),
      account: {
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        passwordChangedAt: user.passwordChangedAt,
      },
      stats: {
        totalSessions: user.sessions.length,
      },
      sessions: user.sessions,
    };

    const filename = `typemaster-export-${username}-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[DATA EXPORT ERROR]:", err);
    return NextResponse.json(
      { error: "Failed to generate data export." },
      { status: 500 }
    );
  }
}
