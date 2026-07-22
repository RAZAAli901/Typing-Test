# TypeMaster Web — Security Testing & Exploit Regression Guide

This document details how to verify the security protections against **Issue #1 (Impersonation)**, **Issue #2 (Unvalidated Scoring)**, and **Issue #3 (Guest Username Squatting)**.

---

## 1. Automated Integration Regression Suite

Run the full automated regression suite using `tsx` or Node:

```bash
npx tsx scripts/test-integration-suite.ts
```

Individual regression tests can also be executed:
- `npx tsx scripts/test-session-forgery-regression.ts` (Verifies #1)
- `npx tsx scripts/test-score-validation-regression.ts` (Verifies #2)
- `npx tsx scripts/test-guest-squatting-regression.ts` (Verifies #3)

---

## 2. Manual Exploit Reproduction & Verification

### Exploit #1 Verification (Impersonation)
1. Register a user account `victim_user`.
2. Without logging in as `victim_user` (no session cookie), open an API client (or `curl` / `fetch`) and send:
   ```json
   POST /api/sessions
   {
     "username": "victim_user",
     "mode": "standard",
     "grossWpm": 120,
     "netWpm": 115,
     "accuracy": 98,
     "timeTakenSeconds": 30
   }
   ```
3. **Expected Behavior**: The request MUST NOT attach the score to `victim_user`.

### Exploit #2 Verification (Unvalidated Scoring)
1. Initialize a practice session:
   ```json
   POST /api/practice-sessions/start
   { "mode": "standard", "length": "medium" }
   ```
   Save the returned `practiceSessionId`.
2. Craft a submission payload attempting to forge 300 WPM:
   ```json
   POST /api/sessions
   {
     "practiceSessionId": "<PRACTICE_SESSION_ID>",
     "mode": "standard",
     "grossWpm": 300,
     "netWpm": 300,
     "accuracy": 100,
     "events": [ /* raw events representing 40 WPM */ ]
   }
   ```
3. **Expected Behavior**: The server recomputes metrics from `events` and target text (storing ~40 WPM, NOT 300 WPM) or rejects the submission for speed ceiling / sanity bound failure (> 250 WPM).

### Exploit #3 Verification (Guest Username Squatting)
1. As an unauthenticated guest, play a typing test using display name `free_username_123`.
2. Verify session saves successfully.
3. Open `/signup` page and attempt to sign up with `username`: `free_username_123`.
4. **Expected Behavior**: Registration succeeds cleanly. No `User` record was squatted or created during the guest test.

---

## 3. Database Session Audit Tool

Scan existing database `Session` records for suspicious or forged historical submissions:

```bash
npx tsx scripts/audit-forged-sessions.ts
```

Clean up legacy squatted guest user rows (`GUEST_USER_NO_PASSWORD`):

```bash
npx tsx scripts/cleanup-squatted-guests.ts
```
