import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (!mode) {
      return NextResponse.json(
        { error: "Mode parameter is required" },
        { status: 400 }
      );
    }

    // Find the single highest scoring session by netWpm descending, with accuracy as a tie-breaker
    const personalBest = await db.session.findFirst({
      where: {
        username: username,
        mode: mode,
      },
      orderBy: [
        { netWpm: "desc" },
        { accuracy: "desc" },
      ],
    });

    return NextResponse.json({ personalBest });
  } catch (error: any) {
    console.error("Error fetching user personal best:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
