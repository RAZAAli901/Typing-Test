import crypto from "crypto";
import { db } from "@/lib/db";

/**
 * Generates a cryptographically secure 6-digit verification code.
 * Sourced using secure random bytes.
 */
export function generateVerificationCode(): string {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0);
  const code = (num % 900000) + 100000;
  return code.toString();
}

/**
 * Hashes a verification code using SHA-256 for secure storage.
 */
export function hashVerificationCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/**
 * Checks if email has exceeded 3 verification code sends in the last hour.
 */
export async function isEmailRateLimited(email: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      verificationCodes: {
        where: {
          createdAt: {
            gte: oneHourAgo,
          },
        },
      },
    },
  });

  if (!user) {
    return false;
  }

  return user.verificationCodes.length >= 3;
}


