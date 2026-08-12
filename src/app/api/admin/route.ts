// Server-only file - Admin Management Route
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const isOwner =
      (adminEmail && session.user.email === adminEmail) ||
      session.user.name === "admin";

    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden: Admin ownership access required" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin dashboard authorized",
      systemStatus: "HEALTHY",
    });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
