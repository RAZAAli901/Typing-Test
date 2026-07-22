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

## 4. Reporting Security Vulnerabilities

To report a security vulnerability or exploit attempt, please consult [SECURITY_TESTING.md](./SECURITY_TESTING.md) or open an issue on GitHub.
