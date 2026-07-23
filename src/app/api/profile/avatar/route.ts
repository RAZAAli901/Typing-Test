import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

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
    if ((metadata.format === "jpeg" || metadata.format === "jpg") && isJpegMagic) return "jpeg";
    if (metadata.format === "webp" && isWebpMagic) return "webp";
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 2MB limit" },
        { status: 400 }
      );
    }

    // Read uploaded file buffer for inspection
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // 3. Validate file type (JPEG or PNG)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG and PNG are allowed" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    // 4. Upload to Vercel Blob (or fallback to local file system in development/local mode)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`avatars/${session.user.name}-${Date.now()}-${file.name}`, file, {
          access: "public",
        });
        imageUrl = blob.url;
      } catch (blobErr) {
        console.warn("Vercel Blob upload failed, falling back to local filesystem:", blobErr);
      }
    }

    // Local filesystem upload fallback
    if (!imageUrl) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const cleanFilename = `${session.user.name}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Ensure local upload folder exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, cleanFilename);
      await fs.writeFile(filePath, buffer);
      
      imageUrl = `/uploads/${cleanFilename}`;
    }

    // 5. Update user avatarUrl in database
    await db.user.update({
      where: { username: session.user.name },
      data: { avatarUrl: imageUrl },
    });

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error("Avatar upload handler error:", error);
    return NextResponse.json(
      { error: "Internal server error during image upload" },
      { status: 500 }
    );
  }
}
