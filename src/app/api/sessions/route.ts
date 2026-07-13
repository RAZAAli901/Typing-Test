import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Basic Zod Schema validation for session results
const SessionPostSchema = z.object({
  username: z.string().min(3).max(20),
  mode: z.string(),
  grossWpm: z.number().int(),
  netWpm: z.number().int(),
  accuracy: z.number(),
  timeTakenSeconds: z.number(),
  charsTyped: z.number().int().optional(),
  mistakes: z.number().int().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = SessionPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid session data", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      username,
      mode,
      grossWpm,
      netWpm,
      accuracy,
      timeTakenSeconds,
      charsTyped = 0,
      mistakes = 0,
    } = result.data;

    // Ensure the User exists in the database
    await db.user.upsert({
      where: { username },
      update: {}, // No-op if user already exists
      create: { username },
    });

    // Write the Session record to the database
    const session = await db.session.create({
      data: {
        username,
        mode,
        grossWpm,
        netWpm,
        accuracy,
        timeTakenSeconds,
        charsTyped,
        mistakes,
      },
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating typing session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
