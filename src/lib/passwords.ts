// Server-only file - Password validation, account lockout & timing defense module

export const COMMON_PASSWORDS = new Set<string>([
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234567",
  "111111", "123123", "dragon", "admin", "welcome", "monkey", "sunshine",
  "password1", "letmein", "princess", "football", "shadow", "master", "superman",
  "1234567890", "baseball", "iloveyou", "trustno1", "starwars", "marcie",
  "654321", "jordan", "harley", "battery", "correcthorse", "starlight",
  "computer", "secret", "pass1234", "qwertyuiop", "abc123", "password123",
  "admin123", "guest", "typemaster", "speedtyping", "qwerty123"
]);

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase().trim());
}

/**
 * In-memory Account Lockout Store
 * Key: Lowercase email / username identifier
 */
interface LockoutEntry {
  attempts: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const lockoutStore = new Map<string, LockoutEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout duration

export function checkAccountLockout(identifier: string): { isLocked: boolean; remainingMinutes: number } {
  const key = identifier.toLowerCase().trim();
  const entry = lockoutStore.get(key);

  if (!entry) {
    return { isLocked: false, remainingMinutes: 0 };
  }

  const now = Date.now();

  if (entry.lockedUntil && now < entry.lockedUntil) {
    const remainingMs = entry.lockedUntil - now;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    return { isLocked: true, remainingMinutes };
  }

  if (entry.lockedUntil && now >= entry.lockedUntil) {
    lockoutStore.delete(key);
    return { isLocked: false, remainingMinutes: 0 };
  }

  return { isLocked: false, remainingMinutes: 0 };
}

export function recordFailedLoginAttempt(identifier: string): { isLocked: boolean; remainingMinutes: number } {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  let entry = lockoutStore.get(key);

  if (!entry || now - entry.firstAttempt > LOCKOUT_WINDOW_MS) {
    entry = { attempts: 1, firstAttempt: now, lockedUntil: null };
  } else {
    entry.attempts += 1;
  }

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    lockoutStore.set(key, entry);
    return { isLocked: true, remainingMinutes: 15 };
  }

  lockoutStore.set(key, entry);
  return { isLocked: false, remainingMinutes: 0 };
}

export function resetAccountLockout(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  lockoutStore.delete(key);
}
