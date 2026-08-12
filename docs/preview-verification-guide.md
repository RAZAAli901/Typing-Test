# Preview Environment Deployment Verification Procedure

This guide outlines the step-by-step checklist to verify security posture and operational health when deploying TypeMaster Web to a Vercel Preview or Staging environment.

---

## 📋 Pre-Flight Verification Checklist

1. **Environment Variables Audit**:
   - Verify `NEXTAUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `RESEND_API_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are defined in Vercel project environment settings.
   - Confirm zero secret variables contain `NEXT_PUBLIC_` prefixes.

2. **Automated Security Suite Run**:
   ```bash
   npm run test:security
   ```

3. **HTTP Security Headers Inspection**:
   - Execute curl or inspect Response Headers on preview deployment URL:
     ```bash
     curl -I https://<preview-domain>.vercel.app/api/health
     ```
   - Confirm presence of:
     - `Content-Security-Policy`
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy`
     - `Strict-Transport-Security`

4. **Authentication & Session Test**:
   - Test user signup with strong password.
   - Test login and verify NextAuth session cookies (`httpOnly`, `sameSite=lax`).
   - Test "Log out of all devices" flow.

5. **Realtime Leaderboard & WebSocket Test**:
   - Open `/play` on two browser windows.
   - Submit a practice session and verify real-time CRT leaderboard update over Supabase WebSockets (`wss://`).
