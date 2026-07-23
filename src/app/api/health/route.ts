import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Run a trivial Prisma query to check database connectivity
    await db.$queryRaw`SELECT 1`;
    const hasBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;
    return NextResponse.json({
      ok: true,
      database: "connected",
      blobStorage: hasBlobConfigured ? "configured" : "unconfigured",
      blobStorageConfigured: hasBlobConfigured,
    });
  } catch (error: any) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Database connection error",
        blobStorageConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
      { status: 500 }
    );
  }
}
