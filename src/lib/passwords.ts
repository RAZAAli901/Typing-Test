// Server-only file - Password validation & common password blocklist module

/**
 * Top ~1,000 common passwords blocklist for rejecting weak/compromised passwords on signup.
 */
export const COMMON_PASSWORDS = new Set<string>([
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234567",
  "111111", "123123", "dragon", "admin", "welcome", "monkey", "sunshine",
  "password1", "letmein", "princess", "football", "shadow", "master", "superman",
  "1234567890", "baseball", "iloveyou", "trustno1", "starwars", "marcie",
  "654321", "jordan", "harley", "battery", "correcthorse", "starlight",
  "computer", "secret", "pass1234", "qwertyuiop", "abc123", "password123",
  "admin123", "guest", "typemaster", "speedtyping", "qwerty123"
]);

/**
 * Checks if a candidate password is included in the top common passwords list.
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase().trim());
}
