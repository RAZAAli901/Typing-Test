import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";
import { checkSupabaseVarsPresence } from "@/lib/env";
import { promises as fs } from "fs";
import path from "path";

/**
 * DELETE /api/profile
 * Allows authenticated users to permanently delete their account and associated records.
 * Relational cascades automatically remove associated Sessions and VerificationCodes.
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const username = session.user.name;

    // 1. Fetch user to check for avatar files
    const user = await db.user.findUnique({
      where: { username },
      select: { username: true, avatarUrl: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Best-effort avatar cleanup if present
    if (user.avatarUrl) {
      try {
        if (user.avatarUrl.startsWith("/uploads/avatars/")) {
          const localPath = path.join(process.cwd(), "public", user.avatarUrl);
          await fs.unlink(localPath).catch(() => {});
        } else if (checkSupabaseVarsPresence() && supabaseServer) {
          const filename = user.avatarUrl.split("/").pop();
          if (filename) {
            await supabaseServer.storage.from("avatars").remove([filename]).catch(() => {});
          }
        }
      } catch (cleanupErr) {
        console.warn(`[ACCOUNT DELETION] Non-fatal error cleaning avatar for ${username}:`, cleanupErr);
      }
    }

    // 3. Delete user record (cascades to Session and VerificationCode via schema relation)
    await db.user.delete({
      where: { username },
    });

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted successfully.",
    });
  } catch (err) {
    console.error("[ACCOUNT DELETION ERROR]:", err);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
