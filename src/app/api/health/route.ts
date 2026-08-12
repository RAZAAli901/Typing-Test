// Server-only file - Health Check & First-Line Incident Diagnostic Endpoint
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkSupabaseVarsPresence } from "@/lib/env";

export async function GET() {
  const timestamp = new Date().toISOString();
  const isSupabaseConfigured = checkSupabaseVarsPresence();
  const hasBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

  try {
    // 1. Check Database Connectivity via parameterized query
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        ok: true,
        timestamp,
        services: {
          database: { status: "connected", ping: "ok" },
          supabase: { status: isSupabaseConfigured ? "configured" : "unconfigured" },
          storage: { status: isSupabaseConfigured || hasBlobConfigured ? "configured" : "unconfigured" },
          realtime: { status: isSupabaseConfigured ? "ready" : "disabled" },
          auth: { status: "ready" },
        },
        environment: process.env.NODE_ENV || "development",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Health check failure:", error);
    return NextResponse.json(
      {
        status: "degraded",
        ok: false,
        timestamp,
        error: error.message || "Database connection failure",
        services: {
          database: { status: "disconnected", error: error.message },
          supabase: { status: isSupabaseConfigured ? "configured" : "unconfigured" },
          storage: { status: isSupabaseConfigured || hasBlobConfigured ? "configured" : "unconfigured" },
          realtime: { status: "degraded" },
          auth: { status: "degraded" },
        },
      },
      { status: 503 }
    );
  }
}
