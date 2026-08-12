# Changelog — TypeMaster Web

All notable changes to **TypeMaster Web** are documented in this file.

---

## [3.1.0-security-hardening] — 2026-08-12

### 🔒 Comprehensive Security Hardening Pass (130 Incremental Commits)

#### 1. Secrets & Key Management (Commits 1–10)
- Enforced strict server-only boundaries for `NEXTAUTH_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`, and Supabase service role keys.
- Implemented Zod schema startup validation (`validateEnvOrThrow()`) to fail fast on missing environment variables.
- Added pre-commit secret checking script (`scripts/check-secrets-precommit.ts`).
- Created Secret Rotation Runbook in `SECURITY.md`.

#### 2. Authentication Hardening (Commits 11–25)
- Server-side password strength rules (8+ chars, non-numeric) and 1,000 common passwords blocklist.
- Account lockout logic (5 failed attempts within 15 mins -> 15 min cooldown) and structured JSON security logging.
- Constant-time dummy hash comparison (`DUMMY_BCRYPT_HASH`) for non-existent emails (timing attack defense).
- NextAuth JWT session invalidation (`sessionInvalidatedAt` & `passwordChangedAt` timestamps) on password change or logout-all.
- New device login email notifications via Resend.

#### 3. Session & Cookie Security (Commits 26–33)
- Enforced `httpOnly: true`, `secure: true` (in production), and `sameSite: "lax"` across all NextAuth cookies.
- Added "Log out of all devices" API endpoint (`POST /api/auth/logout-all`).
- Enforced absolute 90-day maximum session lifetime ceiling.

#### 4. Authorization & Access Control (Commits 34–45)
- Enabled Row Level Security (RLS) on all Supabase tables with default-deny policies for `anon` role.
- Verified identity checks across API routes preventing cross-user data manipulation.
- Stripped private fields (`email`, `passwordHash`) from public display endpoints.

#### 5. Input Validation & Injection Prevention (Commits 46–57)
- Strict Zod schema input validation across every API endpoint rejecting malformed payloads with 400 Bad Request.
- Replaced raw SQL concatenation with parameterized Prisma queries (`$queryRaw`).
- Added character-set validation on username field preventing XSS/script injection.
- Added server-side HTML tag stripping for Custom Text mode and null-byte (`\0`) control byte rejection.
- Standardized numeric field bounds (WPM, accuracy, time).

#### 6. CSRF & CORS Security (Commits 58–65)
- Verified NextAuth built-in CSRF token handling.
- Added Origin & Referer header checks on state-changing API endpoints (`POST /api/sessions`, `POST /api/profile/avatar`).
- Explicit CORS header configuration restricting allowed methods and headers.

#### 7. Rate Limiting & Abuse Prevention (Commits 66–77)
- DB/KV-backed rate limiters on all sensitive endpoints (signup, login, reset, session submit, avatar upload).
- Enforced 100 req/min global per-IP ceiling and 30-minute temporary IP ban mechanism for repeated abuse.
- Standardized HTTP 429 Too Many Requests responses with `Retry-After` headers.
- Developer IP allowlisting mechanism (`ALLOWLISTED_IPS`).

#### 8. Security Headers & Transport (Commits 78–87)
- Configured 6 mandatory HTTP security headers in `next.config.ts`: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Created RFC 9116 `security.txt` at `public/.well-known/security.txt`.

#### 9. Dependency & Supply Chain Hygiene (Commits 88–97)
- Added `.github/dependabot.yml` and `package.json` `engines` pinning Node.js `>=20.0.0`.
- Strictly pinned security-sensitive dependencies (`bcryptjs`, `next-auth`).
- Enforced `npm ci` lockfile-exact installation requirement for CI/CD environments.

#### 10. Logging, Monitoring & Incident Response (Commits 98–107)
- Structured JSON security logging (`logSecurityEvent`) with zero sensitive data/token leakage.
- Added Incident Response Checklist & Breach Protocol in `SECURITY.md`.
- Enhanced `/api/health` to report operational status for DB, Storage, and Realtime.

#### 11. File Upload Security (Commits 108–115)
- Magic-byte file validation and Sharp 512x512 PNG re-encoding pipeline.
- Random UUID filename generation (`crypto.randomUUID()`) neutralizing path-traversal attacks.
- Daily avatar upload limit (5 uploads/day) and automated old avatar file cleanup on replacement.

#### 12. Testing & QA (Commits 116–125)
- Created master test runner `scripts/run-all-security-tests.ts` (16 test modules, 100% pass rate).
- Production build compilation verified without TypeScript or ESLint errors.
- Verified existing user login compatibility and QuantumBreakz issues #1–#5 regressions.

#### 13. Docs & Policy (Commits 126–130)
- Consolidated comprehensive security policies into `SECURITY.md`, `SECURITY_TESTING.md`, and `CHANGELOG.md`.
