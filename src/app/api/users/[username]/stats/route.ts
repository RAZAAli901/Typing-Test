import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Retrieve user and their sessions
    const user = await db.user.findUnique({
      where: { username },
      include: { sessions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = user.sessions;
    if (sessions.length === 0) {
      return NextResponse.json({
        username,
        totalSessions: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        topWpm: 0,
        totalDurationMinutes: 0,
      });
    }

    const totalSessions = sessions.length;
    const averageWpm = parseFloat(
      (sessions.reduce((sum, s) => sum + s.netWpm, 0) / totalSessions).toFixed(1)
    );
    const averageAccuracy = parseFloat(
      (sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions).toFixed(1)
    );
    const topWpm = Math.max(...sessions.map((s) => s.netWpm));
    const totalDurationMinutes = parseFloat(
      (sessions.reduce((sum, s) => sum + s.timeTakenSeconds, 0) / 60).toFixed(2)
    );

    return NextResponse.json({
      username,
      totalSessions,
      averageWpm,
      averageAccuracy,
      topWpm,
      totalDurationMinutes,
    });
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
