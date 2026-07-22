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

    // Verify target user is a real registered account
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user || user.passwordHash === "GUEST_USER_NO_PASSWORD") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the single highest scoring session for this registered user
    const personalBest = await db.session.findFirst({
      where: {
        userId: username,
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
