import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";
import { checkSupabaseVarsPresence } from "@/lib/env";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Real Image Magic-Byte & Sharp Metadata Verification:
 * Validates PNG (\x89PNG), JPEG (\xFF\xD8\xFF), and WEBP (RIFF...WEBP) binary headers
 * to prevent extension spoofing and polyglot payload execution.
 */
export async function detectRealImageType(buffer: Buffer): Promise<"png" | "jpeg" | "webp" | null> {
  const isPngMagic = buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isJpegMagic = buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isWebpMagic = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";

  if (!isPngMagic && !isJpegMagic && !isWebpMagic) {
    return null;
  }

  try {
    const metadata = await sharp(buffer).metadata();
    if (metadata.format === "png" && isPngMagic) return "png";
    if (metadata.format === "jpeg" && isJpegMagic) return "jpeg";
    if (metadata.format === "webp" && isWebpMagic) return "webp";
  } catch {
    return null;
  }

  return null;
}

let hasLoggedProductionMissingTokenWarning = false;

import { isIpRateLimited, buildRateLimitResponse } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Daily Avatar Upload Limit: Max 5 avatar uploads per 24 hours per user
    if (isIpRateLimited(session.user.name, "avatar-upload-daily", 5, 86400000)) {
      return buildRateLimitResponse(86400, "Maximum daily avatar uploads limit reached (5 uploads/day). Please try again tomorrow.");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate max file size BEFORE reading full buffer or running sharp re-encoding (early rejection)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB maximum limit" },
        { status: 400 }
      );
    }

    // Read uploaded file buffer for inspection
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // 3. Validate real file type (JPEG, PNG, WEBP) by content bytes, ignoring client file.type
    const fileHeaderStr = rawBuffer.toString("utf-8", 0, Math.min(rawBuffer.length, 1024)).toLowerCase();
    if (fileHeaderStr.includes("<svg") || fileHeaderStr.includes("<?xml") || fileHeaderStr.includes("<script") || fileHeaderStr.includes("http://www.w3.org/2000/svg")) {
      console.warn(`[SECURITY AUDIT] Avatar upload rejected for user '${session.user.name}': Detected prohibited SVG/vector script content.`);
      return NextResponse.json(
        { error: "SVG images and vector scripts are strictly prohibited for avatars." },
        { status: 400 }
      );
    }

    const detectedType = await detectRealImageType(rawBuffer);
    if (!detectedType) {
      console.warn(`[SECURITY AUDIT] Avatar upload rejected for user '${session.user.name}': File structure failed magic byte verification.`);
      return NextResponse.json(
        { error: "Invalid image content. File structure failed magic byte verification." },
        { status: 400 }
      );
    }

    // Generate stored filename server-side using random UUID (completely independent of client input)
    const fileExt = "png";
    const serverGeneratedFilename = `avatar-${crypto.randomUUID()}.${fileExt}`;

    // 4. Server-side image re-encoding using sharp to strip embedded scripts, comments, and polyglot tricks
    // SECURITY AUDIT: All uploads to Supabase Storage strictly pass through:
    // (a) Max file size pre-check (5MB)
    // (b) Prohibited vector/script content scan (SVG/XML/script)
    // (c) Real file magic byte verification (PNG, JPEG, WEBP)
    // (d) Fresh Sharp raster re-encoding (512x512 PNG)
    const processedBuffer = await sharp(rawBuffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();


    let imageUrl = "";

    const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
    const isSupabaseConfigured = checkSupabaseVarsPresence();

    if (!isSupabaseConfigured) {
      if (isProduction) {
        if (!hasLoggedProductionMissingTokenWarning) {
          console.error("================================================================================");
          console.error("CRITICAL SECURITY / CONFIGURATION WARNING: Supabase storage environment variables missing in production!");
          console.error("================================================================================");
          hasLoggedProductionMissingTokenWarning = true;
        }
        return NextResponse.json(
          { error: "Avatar storage is not configured for this environment" },
          { status: 503 }
        );
      }
      console.info("[DEV NOTICE] Local filesystem fallback active for avatar upload (NODE_ENV=development).");
    }

    // Upload re-encoded buffer to Supabase Storage
    if (isSupabaseConfigured) {
      try {
        const { data, error: uploadError } = await supabaseServer.storage
          .from("avatars")
          .upload(serverGeneratedFilename, processedBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.warn("Supabase Storage upload failed:", uploadError.message);
          throw uploadError;
        }

        const { data: publicUrlData } = supabaseServer.storage
          .from("avatars")
          .getPublicUrl(data.path);

        imageUrl = publicUrlData.publicUrl;
      } catch (storageErr: any) {
        console.warn("Supabase Storage upload error:", storageErr);
        if (isProduction) {
          return NextResponse.json(
            { error: "Avatar storage service unavailable" },
            { status: 503 }
          );
        }
      }
    }

    // Local filesystem upload fallback (STRICTLY DEV-ONLY)
    if (!imageUrl && !isProduction) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, serverGeneratedFilename);
      await fs.writeFile(filePath, processedBuffer);
      imageUrl = `/uploads/${serverGeneratedFilename}`;
    }


    if (!imageUrl) {
      return NextResponse.json(
        { error: "Avatar storage is not configured for this environment" },
        { status: 503 }
      );
    }

    // 5. Delete previous avatar file from storage if present (prevents storage bloat / orphaned files)
    const existingUser = await db.user.findUnique({
      where: { username: session.user.name },
      select: { avatarUrl: true },
    });

    if (existingUser?.avatarUrl) {
      try {
        if (existingUser.avatarUrl.includes("/avatars/")) {
          const oldFilename = existingUser.avatarUrl.split("/avatars/").pop();
          if (oldFilename && isSupabaseConfigured) {
            await supabaseServer.storage.from("avatars").remove([oldFilename]);
          }
        } else if (existingUser.avatarUrl.startsWith("/uploads/")) {
          const oldLocalPath = path.join(process.cwd(), "public", existingUser.avatarUrl);
          await fs.unlink(oldLocalPath).catch(() => {});
        }
      } catch (cleanupErr) {
        console.warn("Non-fatal old avatar cleanup error:", cleanupErr);
      }
    }

    // 6. Update user avatarUrl in database
    await db.user.update({
      where: { username: session.user.name },
      data: { avatarUrl: imageUrl },
    });

    return NextResponse.json({
      success: true,
      url: imageUrl,
      contentType: "image/png",
    });
  } catch (error: any) {
    console.error("Avatar upload handler error:", error);
    return NextResponse.json(
      { error: "Internal server error during image upload" },
      { status: 500 }
    );
  }
}
