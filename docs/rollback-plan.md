# Database Migration Rollback Playbook

This document details the emergency rollback procedures to restore application traffic to the legacy database provider if unexpected issues arise during or after the Supabase migration.

---

## Step 1: Revert Environment Variables
1. In Vercel Project Settings (or local `.env`), revert `DATABASE_URL` and `DIRECT_URL` to point to the original database connection strings:
   ```env
   DATABASE_URL="postgresql://[legacy-user]:[legacy-password]@[legacy-host]:5432/[legacy-db]?schema=public"
   DIRECT_URL="postgresql://[legacy-user]:[legacy-password]@[legacy-host]:5432/[legacy-db]?schema=public"
   ```
2. Save changes and trigger a Vercel redeployment.

---

## Step 2: Regenerate Prisma Client
1. In your local development/CI environment:
   ```bash
   npx prisma generate
   ```
2. Verify local connectivity to legacy provider:
   ```bash
   npx tsx scripts/test-prisma-supabase-conn.ts
   ```

---

## Step 3: Verify Application Health
1. Request the health endpoint: `GET /api/health`
2. Confirm output status reads:
   ```json
   {
     "ok": true,
     "database": "connected"
   }
   ```
3. Test User Login and Leaderboard queries to confirm normal operation against legacy database.
