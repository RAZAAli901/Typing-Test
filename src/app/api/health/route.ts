import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Run a trivial Prisma query to check database connectivity
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Database connection error" },
      { status: 500 }
    );
  }
}
