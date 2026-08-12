# Security & Anti-Cheat Architecture

This document describes the security model, identity verification, anti-cheat engine, and guest data isolation implemented in **TypeMaster Web**.

---

## 1. Identity Verification (Issue #1 Resolution)

- **Authentication Source of Truth**: All authenticated session submissions strictly derive user identity via NextAuth's server-side session token (`getServerSession(authOptions)`).
- **Client Body Identification Ignored**: Any `username` or `userId` supplied in request bodies for authenticated sessions is completely ignored.
- **Strict Guest Isolation**: Unauthenticated requests can never attach scores to registered user accounts. If an unauthenticated guest display name collides with a registered username, the guest score is explicitly tagged with `(guest)` and stored without touching the registered `User` table.

---

## 2. Server-Side Score Validation Engine (Issue #2 Resolution)

- **Keystroke Event Capture**: Front-end components log raw per-keystroke events (`char`, `timestamp`, `correct`).
- **Server-Issued Practice Sessions**: Before a typing test begins, the client initializes a `PracticeSession` record server-side (`POST /api/practice-sessions/start`). The server generates and stores the authoritative target text and passage seed.
- **Server Score Recomputation**: Upon submission, the server recomputes `grossWpm`, `netWpm`, `accuracy`, `charsTyped`, `mistakes`, and `timeTakenSeconds` from the raw event log against the server's `PracticeSession.targetText`.
- **Anti-Cheat Validation Pipeline**:
  - **Single-Use Practice Sessions**: Once completed, a `PracticeSession` is marked `completed: true` to prevent replay attacks.
  - **Sanity Bounds Check**: Rejects impossible scores (e.g., `netWpm > grossWpm`, negative values, `accuracy > 100`, `timeTakenSeconds <= 0`).
  - **Mathematical Consistency**: Verifies accuracy matches `(charsTyped - mistakes) / charsTyped` and gross WPM matches `(charsTyped / 5) / timeTaken`.
  - **Human Speed Ceiling**: Enforces a hard speed ceiling (> 250 WPM) and logs suspicious attempts for review.
  - **User & IP Rate Limiting**: Throttles session submissions per user and IP address.

---

## 3. Guest Username Protection (Issue #3 Resolution)

- **No Auto-Created User Records**: Guest play no longer creates permanent placeholder `User` rows in the database (formerly created with `GUEST_USER_NO_PASSWORD`).
- **Nullable User Relationships**: Database `Session` records use a nullable `userId` (for registered users) and a separate `guestDisplayName` field (for guests).
- **Unrestricted Sign-Up**: Guest display names remain available for real users to register at any time.

---

## 4. Avatar Upload Security & Storage Isolation (Issues #4 & #5 Resolution)

- **Magic Byte File Content Inspection**: `POST /api/profile/avatar` reads the raw uploaded buffer and validates magic byte signatures using `sharp` format detection rather than trusting client-reported MIME types or file extensions. Accepted formats are strictly limited to PNG, JPEG, and WEBP.
- **Outright SVG & Script Rejection**: Vector graphics (`.svg`) and XML/script payloads are rejected outright due to stored XSS vectors (`<script>` injection).
- **Server-Side Re-Encoding & Resizing**: Uploaded images are re-encoded fresh to PNG format via `sharp` and constrained to a maximum dimension of 512x512 pixels. This strips all embedded scripts, EXIF metadata, and polyglot container tricks.
- **Server-Generated Filenames & Headers**: Filenames and extensions are generated server-side from session identity and timestamp tokens only. Uploads to Vercel Blob set explicit `Content-Type: image/png` headers.
- **Production Storage Isolation**: In deployed environments (`process.env.VERCEL` or `NODE_ENV === "production"`), uploads strictly require `BLOB_READ_WRITE_TOKEN`. Unconfigured environments fail immediately with status 503 rather than attempting to write to Vercel's read-only serverless filesystem. Local disk fallback operates strictly in offline local development (`NODE_ENV === "development"`).

---

## 7. Authorization & Access Control Model

| Resource / Model | Public / Anon Access | Authenticated User Access | Service Role Access |
|:---|:---|:---|:---|
| `User` (Private details: email, passwordHash) | DENIED | Read self profile, Update own avatar | Full Access |
| `User` (Public fields: username, avatarUrl) | Read-only | Read | Full Access |
| `Session` | Read-only via Leaderboard API | Read own history, Submit own scores | Full Access |
| `Leaderboard` | Read-only (REST & Realtime) | Read-only | Full Access |
| `VerificationCode` | DENIED | DENIED | Full Access (Service Role Only) |
| `PracticeSession` | DENIED | Start practice session | Full Access |

---

## 9. XSS & Rendering Security

- **React Default Escaping**: All user-generated strings (usernames, custom practice text, guest display names) render exclusively via standard React JSX text bindings (`{value}`).
- **Zero Inner HTML Injection**: Codebase auditing verifies zero usage of `dangerouslySetInnerHTML` or direct DOM innerHTML assignments for user content.
- **Server HTML Sanitization**: Custom text inputs strip vector tags (`<script>`, `<iframe>`, `<img>`) and control bytes before passage initialization.

---

## 10. CSRF & CORS Security Architecture

- **NextAuth Built-In CSRF Tokens**: Authentication routes (`/api/auth/*`) generate and validate cryptographic CSRF tokens stored in `__Host-next-auth.csrf-token` cookies.
- **Origin & Referer Header Verification**: State-changing endpoints (`POST /api/sessions`, `POST /api/profile/avatar`, `POST /api/auth/logout-all`) validate `Origin` and `Referer` headers against the canonical host and `localhost` dev origins.
- **CORS Header Restrictions**: Preflight `OPTIONS` and API routes constrain `Access-Control-Allow-Methods` to `GET, POST, PUT, DELETE, OPTIONS` and restrict allowed origin headers.
- **Cookie SameSite Policy**: All session cookies explicitly specify `sameSite: "lax"` to prevent cross-site request forgery while preserving top-level navigation flow.

---

## 11. Abuse Prevention & Future Enhancements Roadmap

- **Rate Limit Enforcement**: DB/KV-backed rate limiters enforce route-specific thresholds and a 100 req/min global per-IP ceiling.
- **Temporary IP Bans**: IPs exceeding global limit ceilings >3 times within 5 minutes trigger an automated 30-minute temporary ban.
- **CAPTCHA-on-Abuse Roadmap**: If repeated signup or verification code abuse is detected in production monitoring, an invisible CAPTCHA challenge (Cloudflare Turnstile or hCaptcha) will be conditionally rendered on `/signup` and `/api/auth/reset-password` for flagged IP addresses.

---

## 12. Configured Rate Limits Reference Table

| Target Route / Endpoint | Rate Limit Threshold | Time Window | Violation Action / Penalty |
|:---|:---|:---|:---|
| `POST /api/auth/signup` | 3 requests | 60 seconds | HTTP 429 Retry-After: 60s |
| `POST /api/auth/reset-password` | 3 requests | 60 seconds | HTTP 429 Retry-After: 60s |
| `POST /api/auth/verify` | 5 requests | 60 seconds | HTTP 429 Retry-After: 60s |
| `POST /api/auth/resend-code` | 3 requests | 3600 seconds (1 hour) | HTTP 429 Retry-After: 3600s |
| `POST /api/sessions` | 10 requests | 60 seconds | HTTP 429 Retry-After: 60s |
| `POST /api/profile/avatar` | 5 requests | 60 seconds | HTTP 429 Retry-After: 60s |
| **Global Per-IP Ceiling** | 100 requests (all combined) | 60 seconds | HTTP 429 + IP Ban Warning |
| **Temporary IP Ban** | > 3 global ceiling breaches | 300 seconds (5 min) | **30-Minute IP Ban** |

---

## 13. HTTP Security Headers Reference Table

| Security Header Name | Configured Value / Directive | Protection Goal / Attack Defended |
|:---|:---|:---|
| `Content-Security-Policy` | `default-src 'self'; connect-src 'self' https: wss:; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; upgrade-insecure-requests;` | Restricts script sources, socket endpoints, and enforces HTTPS upgrades |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing attacks across all routes |
| `X-Frame-Options` | `DENY` | Prevents UI framing and clickjacking attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits cross-origin referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Disables sensitive browser hardware APIs |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HSTS TLS encryption for 2 years |

---

## 14. Dependency & Supply Chain Security Policy

1. **Automated Scanning**: Dependabot checks weekly for known vulnerabilities in `package.json` dependencies.
2. **Lockfile Enforcement**: Production builds and CI environments strictly run `npm ci` to guarantee deterministic, exact lockfile installation without unvetted sub-dependency floating.
3. **Pre-Merge Review**: Every proposed dependency update must be audited using `npm audit` and inspected for unexpected postinstall lifecycle scripts.
4. **Lockfile Synchronization**: `package-lock.json` is strictly tracked in git and synchronized across all local, preview, and production deployment runtimes.
5. **Security-Critical Package Pinning**: Auth and crypto packages (`bcryptjs`, `next-auth`, `zod`, `sharp`) must be strictly version-pinned.

---

## 15. Logging & Sensitive Data Privacy Policy

- **Structured JSON Security Audit Logs**: All authentication failures, account lockouts, rate limit violations, and session rejections write structured JSON logs (`SECURITY_AUDIT_LOG`).
- **Zero Sensitive Data Leakage**: Audit log review verifies zero inclusion of plain-text passwords, password hashes (`passwordHash`), verification codes (`codeHash`), or full JWT/session tokens.
- **Log Sanitation Rule**: Only user identity boundaries (`username`, `email`), client IP addresses (`x-forwarded-for`), and generic status reasons are logged.

---

## 16. Incident Response Checklist & Breach Protocol

In the event of a suspected security breach, credential leakage, or unauthorized system access:

1. **Step 1: Immediate Triage & Isolation**
   - Identify affected components (Database, Storage, NextAuth, Resend).
   - If session compromise is suspected, execute global session invalidation by bumping `sessionInvalidatedAt` for affected accounts.
2. **Step 2: Emergency Secret Rotation**
   - Follow the [Secret Rotation Runbook](#secret-rotation-runbook) to immediately rotate `NEXTAUTH_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`, and Supabase Service Role keys.
   - Redeploy production build with clean environment variables.
3. **Step 3: Audit Log Investigation**
   - Search Vercel / application logs for `SECURITY_AUDIT_LOG` events around the incident window.
   - Analyze IP addresses, failed login spikes, and rate-limit breach bursts.
4. **Step 4: User Notification & Containment**
   - If user credentials or personal data may have been exposed, send an automated security advisory email notifying users to update passwords.
   - Post incident summary and mitigation steps in `SECURITY.md` changelog.

---

## 17. Security Events Worth Watching (SIEM & Log Alerting)

Configure alerts on your log aggregation platform for the following security events:

| Log Event Type | Threshold / Trigger Condition | Threat Indicator / Security Meaning | Recommended Action |
|:---|:---|:---|:---|
| `LOGIN_FAILED` | > 5 attempts in 15 mins (same IP/email) | Brute-force credentials attack | Verify account lockout trigger; block IP if persistent |
| `ACCOUNT_LOCKED` | Single trigger event | Account lockout activated | Notify user of suspicious login activity |
| `RATE_LIMIT_TRIGGERED` | > 10 events in 5 minutes | Endpoint abuse or bot scan | Check target IP; verify temporary IP ban status |
| `SESSION_REJECTED` | > 5 events in 10 minutes | Score spoofing or session replay | Audit IP for automated bot submission |
| `PASSWORD_RESET` | > 3 requests in 1 hour (same target email) | Email bombing / reset abuse | Verify password reset rate limiter enforcement |

---

## 18. Secret Rotation Runbook

### Active Secrets Inventory

| Secret Variable Name | Service Platform / Location | Purpose | Recommended Rotation Frequency |
|:---|:---|:---|:---|
| `NEXTAUTH_SECRET` | Vercel Environment / `.env.local` | Session JWT signing & encryption key | Semi-annually / On exposure |
| `DATABASE_URL` | Supabase DB Settings -> Connection Pooler | Transaction pooler DB connection string | Annually / On exposure |
| `DIRECT_URL` | Supabase DB Settings -> Database Keys | Direct migration DB connection string | Annually / On exposure |
| `RESEND_API_KEY` | Resend Dashboard -> API Keys | Transactional email dispatch key | Semi-annually / On exposure |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings -> API Keys | Storage & admin service role bypass key | Quarterly / On exposure |

---

### Step-by-Step Secret Rotation Procedures

#### A. Rotating `NEXTAUTH_SECRET`
1. Generate a strong 32-character random string (e.g. `openssl rand -hex 32`).
2. Update `NEXTAUTH_SECRET` in the Vercel Production and Preview project environment settings.
3. Redeploy the application.
4. *Impact*: Active sessions will gracefully expire and require re-authentication.

#### B. Rotating Database Connection Strings (`DATABASE_URL` / `DIRECT_URL`)
1. Reset database password in Supabase Dashboard (`Database` -> `Database Settings`).
2. Copy new transaction pooler string (port 6543) into `DATABASE_URL` and direct string (port 5432) into `DIRECT_URL` in Vercel.
3. Run `npx tsx scripts/test-prisma-supabase-conn.ts` to verify database connectivity.
4. Redeploy Vercel application.

#### C. Rotating `SUPABASE_SERVICE_ROLE_KEY`
1. In Supabase Dashboard, navigate to `Project Settings` -> `API`.
2. Click **Rotate Service Role Key** and confirm rotation.
3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
4. Run `npx tsx scripts/test-supabase-storage-config.ts` to verify storage operations.

#### D. Rotating `RESEND_API_KEY`
1. Log into [Resend Console](https://resend.com), create a new API Key with Send permissions.
2. Replace `RESEND_API_KEY` in Vercel environment variables.
3. Revoke the previous API Key in Resend console.

---

## 7. Reporting Security Vulnerabilities

To report a security vulnerability or exploit attempt, please consult [SECURITY_TESTING.md](./SECURITY_TESTING.md) or open an issue on GitHub.

