# Security Testing Guide — Security Hardening Test Suite

This document details how to run, audit, and maintain the comprehensive security regression test suite for TypeMaster Web.

---

## 🚀 Running the Security Test Suite

Run the master security test suite via `npm`:

```bash
npm run test:security
```

Or execute individual security test modules directly using `tsx`:

```bash
npx tsx scripts/test-account-lockout.ts
npx tsx scripts/test-session-invalidation.ts
npx tsx scripts/test-rls-anon-write.ts
npx tsx scripts/test-rls-verification-code.ts
npx tsx scripts/test-profile-authorization.ts
npx tsx scripts/test-private-data-leakage.ts
npx tsx scripts/test-input-validation.ts
npx tsx scripts/test-custom-text-xss.ts
npx tsx scripts/test-cors-forged-origin.ts
npx tsx scripts/test-cors-legitimate-origin.ts
npx tsx scripts/test-global-rate-limit.ts
npx tsx scripts/test-legitimate-rate-limit.ts
npx tsx scripts/test-security-headers.ts
npx tsx scripts/test-health-degraded.ts
npx tsx scripts/test-path-traversal-upload.ts
npx tsx scripts/test-avatar-cleanup.ts
```

---

## 🛡️ Covered Vulnerability Areas

| Test Module Script | Target Vulnerability Vector | Expected Outcome |
|:---|:---|:---|
| `test-account-lockout.ts` | Brute-force credentials attack | Lockout triggered after 5 failures |
| `test-session-invalidation.ts` | Stale session token reuse | Token rejected after password change / logout |
| `test-rls-anon-write.ts` | Supabase RLS bypass | Anon write attempts denied |
| `test-rls-verification-code.ts` | Supabase verification code leak | Anon read denied |
| `test-profile-authorization.ts` | Cross-user profile edit | Cross-user profile modifications blocked |
| `test-private-data-leakage.ts` | Sensitive field exposure | `passwordHash` and `email` stripped from public API |
| `test-input-validation.ts` | Payload bounds breach | Oversized strings and numbers rejected |
| `test-custom-text-xss.ts` | Stored XSS injection | HTML tags stripped server-side |
| `test-cors-forged-origin.ts` | Forged cross-origin CSRF | Mismatched origin rejected with HTTP 403 |
| `test-cors-legitimate-origin.ts` | Legitimate CORS navigation | Same-origin requests permitted |
| `test-global-rate-limit.ts` | Endpoint abuse burst | 100 req/min global ceiling enforced |
| `test-legitimate-rate-limit.ts` | Gameplay false positives | Legitimate gameplay uninterrupted |
| `test-security-headers.ts` | Missing HTTP security headers | All 6 mandatory headers verified |
| `test-health-degraded.ts` | Diagnostic reporting failure | Degraded DB triggers HTTP 503 |
| `test-path-traversal-upload.ts` | Path-traversal file upload | Filename sanitized to server UUID |
| `test-avatar-cleanup.ts` | Orphaned file storage bloat | Previous avatar deleted on replacement |
