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

## 6. Secret Rotation Runbook

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

