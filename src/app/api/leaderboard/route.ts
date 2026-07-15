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
    
    let errorMessage = "Internal server error";
    
    // Classify database errors
    if (error.code === "P2021") {
      errorMessage = "Database tables are not initialized. Please run migrations.";
    } else if (error.code === "P2002") {
      errorMessage = "Database unique constraint violation.";
    } else if (
      error.code === "ECONNREFUSED" ||
      (error.message && (error.message.includes("ECONNREFUSED") || error.message.includes("Can't reach database")))
    ) {
      errorMessage = "Database connection refused. Please check if PostgreSQL is running and environment variables are configured.";
    } else if (error.name === "PrismaClientInitializationError") {
      errorMessage = "Failed to initialize database client. Check environment variables and network access.";
    } else if (error.message) {
      if (error.message.includes("invocation in") || error.message.includes("PrismaClient")) {
        errorMessage = "Database connection or query failed. Please verify database schema and connection.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
