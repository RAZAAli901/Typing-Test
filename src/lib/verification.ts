import crypto from "crypto";

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

