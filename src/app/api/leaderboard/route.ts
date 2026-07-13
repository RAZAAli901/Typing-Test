import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!mode) {
      return NextResponse.json(
        { error: "Mode parameter is required" },
        { status: 400 }
      );
    }

    const sort = searchParams.get("sort") || "netWpm";
    const orderBy =
      sort === "accuracy"
        ? [{ accuracy: "desc" as const }, { netWpm: "desc" as const }]
        : [{ netWpm: "desc" as const }, { accuracy: "desc" as const }];

    // Retrieve top-N sessions for that mode ordered by chosen parameter
    const sessions = await db.session.findMany({
      where: {
        mode: mode,
      },
      orderBy: orderBy,
      take: limit,
      include: {
        user: true,
      },
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
