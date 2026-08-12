import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  TEXT_ASSETS,
  generateRandomWords,
  generateDeterministicRandomWords,
  getDailyChallengeSeed,
  adjustPassageLength,
  LengthType,
} from "@/content/texts";

const StartPracticeSessionSchema = z.object({
  mode: z.string().max(50),
  length: z.enum(["short", "medium", "long"]).optional().default("medium"),
  customText: z.string().max(10000, "Custom text cannot exceed 10,000 characters").optional(),
  guestDisplayName: z.string().min(3).max(20).optional(),
});

export async function POST(request: Request) {
  try {
    // SECURITY ENFORCEMENT (Commit 46):
    // Validate request payload via Zod schema BEFORE touching the database.
    // Malformed requests are rejected with 400 Bad Request immediately.
    const body = await request.json();
    const result = StartPracticeSessionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid parameters for practice session start", details: result.error.format() },
        { status: 400 }
      );
    }

    const { mode, length, customText, guestDisplayName } = result.data;
    let targetText = "";

    // Server-authoritative passage generation with HTML sanitization:
    // Strip HTML tags and control characters from custom text input
    if (mode === "custom" && customText && customText.trim()) {
      const sanitizedText = customText.trim().replace(/<[^>]*>?/gm, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
      targetText = adjustPassageLength(sanitizedText, length as LengthType);
    } else if (mode === "random-words") {
      let wordCount = 30;
      if (length === "short") wordCount = 15;
      if (length === "long") wordCount = 60;
      targetText = generateRandomWords(wordCount);
    } else if (mode === "daily-challenge") {
      const seed = getDailyChallengeSeed();
      let wordCount = 30;
      if (length === "short") wordCount = 15;
      if (length === "long") wordCount = 60;
      targetText = generateDeterministicRandomWords(wordCount, seed);
    } else {
      const baseText = TEXT_ASSETS[mode as keyof typeof TEXT_ASSETS] || TEXT_ASSETS.standard;
      targetText = adjustPassageLength(baseText, length as LengthType);
    }

    const authSession = await getServerSession(authOptions);
    const userId = authSession?.user?.name || null;

    // Practice session valid for 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const practiceSession = await db.practiceSession.create({
      data: {
        mode,
        targetText,
        userId,
        guestDisplayName: !userId ? (guestDisplayName || "Guest") : null,
        expiresAt,
      },
    });

    return NextResponse.json(
      {
        practiceSessionId: practiceSession.id,
        targetText,
        mode,
        expiresAt: practiceSession.expiresAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating practice session:", error);
    return NextResponse.json(
      { error: "Failed to initialize practice session" },
      { status: 500 }
    );
  }
}
