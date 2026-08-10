import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkSupabaseVarsPresence } from "@/lib/env";

export async function GET() {
  try {
    // Run a trivial Prisma query to check database connectivity
    await db.$queryRaw`SELECT 1`;
    const hasBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;
    const isSupabaseConfigured = checkSupabaseVarsPresence();

    return NextResponse.json({
      ok: true,
      database: "connected",
      supabase: isSupabaseConfigured ? "configured" : "unconfigured",
      supabaseConfigured: isSupabaseConfigured,
      supabaseStorage: isSupabaseConfigured ? "configured" : "unconfigured",
      supabaseStorageConfigured: isSupabaseConfigured,
      blobStorage: hasBlobConfigured ? "configured" : "unconfigured",
      blobStorageConfigured: hasBlobConfigured,
    });

  } catch (error: any) {
    console.error("Database health check failed:", error);
    const isSupabaseConfigured = checkSupabaseVarsPresence();
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Database connection error",
        supabaseConfigured: isSupabaseConfigured,
        blobStorageConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
      { status: 500 }
    );
  }
}

