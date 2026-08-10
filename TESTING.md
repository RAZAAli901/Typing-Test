# TypeMaster Web — Verification Flow Manual Testing Checklist

Follow these steps to manually verify the email verification flow:

## Phase 1: Signup and Code Generation
- [ ] **Disposable Domain Block:** Attempt signup with `test@mailinator.com`. The API should return `400` with the message: `"Disposable or throwaway email addresses are not permitted."`
- [ ] **Valid Registration:** Sign up using a clean email domain (e.g. your personal inbox, or `test@example.com` in dev mode).
  - Verify that the browser redirects you automatically to `/verify?email=[email]&t=[timestamp]`.
  - In development mode (missing `RESEND_API_KEY`), confirm that the 6-digit access key is printed to the server terminal console with `[DEV MODE — CODE NOT EMAILED]`.
  - In staging/production, check your inbox (and spam folder) for a green/amber monospace verification message containing the 6-digit code.

## Phase 2: Verification Action Gateway
- [ ] **Verify Page Guard:** Try navigating directly to `/verify` with no query parameters. Confirm you are instantly redirected to `/signup`.
- [ ] **Wrong Code Input:** Type a wrong code (e.g. `000000`) and hit Verify.
  - Verify that the glowing alert displays `[INVALID CODE]`.
  - Check the server logs: a warning log `[SECURITY AUDIT] Mismatch verification attempt` should be printed.
- [ ] **Attempts Limit (Lockout):** Submit incorrect codes 5 times.
  - On the 5th attempt, verify that the API rejects with `"Maximum attempts exceeded. Please request a new code."`.
- [ ] **Resend Cooldown:**
  - Verify that the "REQUEST NEW ACCESS KEY" option displays a countdown showing `RESEND COOLDOWN ACTIVE — WAIT 59s`.
  - Wait 60 seconds. Verify that the button becomes active, and clicking it sends a new code (logs a new code in dev console or sends a new email).
  - Verify that the expiration timer resets back to 10 minutes.
- [ ] **Expiration Check:** Set the expiration countdown helper or wait 10 minutes. Confirm that the input is disabled and displays `CODE EXPIRED — REQUEST A NEW ONE`.

## Phase 3: Login Gating and Activation
- [ ] **Login Blocked Before Verify:** Navigate to `/login` and try logging into the newly created account.
  - Verify that the login is rejected and displays `[ACCESS DENIED: IDENTITY UNVERIFIED]`.
  - Verify that a link is provided: `[CLICK HERE TO ENTER ACCESS CODE]`, which correctly redirects you back to `/verify?email=[email]`.
- [ ] **Correct Code Input:** On the `/verify` page, enter the active 6-digit code.
  - Verify that the success alert `[ACCESS GRANTED — IDENTITY VERIFIED]` flashes.
  - Verify that you are redirected to `/login?verified=true&email=[email]` after 2 seconds.
- [ ] **Login Allowed After Verify:** Enter the password. Verify that access is granted, and you are successfully authenticated and logged in!
- [ ] **Audit Session Payload:** Logged-in verified users should have `emailVerified: true` stored in their NextAuth session JWT, verified by visiting the Profile view (no warning banner should be displayed).

## Phase 4: Supabase Database Migration & Data Parity
- [ ] **Database Connection Check:** Run `npx tsx scripts/test-prisma-supabase-conn.ts` to confirm active connectivity to Supabase via PgBouncer transaction pooler.
- [ ] **Schema Parity Verification:** Run `npx tsx scripts/verify-schema-manifest.ts` to confirm all 4 tables (`User`, `Session`, `PracticeSession`, `VerificationCode`) match expected column definitions.
- [ ] **Data Row Count Parity:** Run `npx tsx scripts/verify-migration-counts.ts` to confirm row counts match exported dumps.
- [ ] **Foreign Key Resolution Check:** Run `npx tsx scripts/verify-no-orphaned-rows.ts` to confirm 0 orphaned session records.
- [ ] **Health Endpoint Smoke Test:** Visit `http://localhost:3000/api/health` and confirm JSON response reads `{ ok: true, database: "connected", supabase: "configured" }`.

## Phase 5: Realtime & Supabase Storage Verification
- [ ] **Avatar Upload Security:** Run `npx tsx scripts/test-supabase-storage-security.ts` to verify magic-byte validation and SVG rejection.
- [ ] **Avatar Storage Upload:** Run `npx tsx scripts/test-supabase-storage-legitimate-upload.ts` to confirm 512x512 PNG re-encoding and Supabase Storage CDN URL generation.
- [ ] **Realtime Mode Subscriptions:** Run `npx tsx scripts/test-realtime-across-modes.ts` to confirm WebSocket channel filters for all practice modes.
- [ ] **Realtime Row Highlight:** Open `/leaderboard` and run `npx tsx scripts/simulate-realtime-score.ts standard 180 test_runner`. Confirm row updates live with CRT phosphor flash highlight.
- [ ] **Realtime Presence Counter:** Open `/play` in two browser windows. Confirm `2 ONLINE` badge displays in Navbar header.
- [ ] **Personal Best Alert Banner:** Run `npx tsx scripts/test-pb-alert-filtering.ts` to verify personal best notification trigger rules.
- [ ] **Master Test Suite Execution:** Run `npx tsx scripts/run-all-tests.ts` to execute all 17 automated test suites end-to-end.


