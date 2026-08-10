# Supabase Project Setup Guide

This document provides a step-by-step walkthrough to reproduce the exact Supabase infrastructure setup for TypeMaster Web.

---

## Step 1: Create Supabase Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New Project** and select your organization.
3. Name: `typemaster-web`
4. Set a strong Database Password (store securely).
5. Select Region (e.g., `us-east-1` or nearest region).
6. Click **Create new project**.

---

## Step 2: Obtain Database Connection URIs
1. Navigate to **Project Settings → Database**.
2. Scroll to **Connection Strings**:
   - Select tab **Connection Pooling** (Port 6543, Mode: Transaction).
     Copy URI → `DATABASE_URL`
     Append: `?pgbouncer=true&connection_limit=1`
   - Select tab **Direct Connection** (Port 5432).
     Copy URI → `DIRECT_URL`

---

## Step 3: Obtain API Credentials
1. Navigate to **Project Settings → API**.
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` & `SUPABASE_URL`.
3. Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` & `SUPABASE_ANON_KEY`.
4. Copy **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY` (Server-only).

---

## Step 4: Configure Storage Bucket for Avatars
1. Navigate to **Storage** in the left menu.
2. Click **Create a new bucket**:
   - Bucket Name: `avatars`
   - Public Bucket: **YES** (Enabled)
3. Under **Policies**:
   - Allow public SELECT reads for anyone.
   - Restrict INSERT / UPDATE / DELETE writes to authenticated server functions via service role.

---

## Step 5: Enable Realtime Replication
1. Navigate to **Database → Realtime**.
2. Select table `Leaderboard` (or run SQL editor command):
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE "Leaderboard";
   ```
3. Save changes.

---

## Step 6: Deploy Database Schema via Prisma
1. In your local terminal:
   ```bash
   npx prisma migrate deploy
   ```
2. Verify tables (`User`, `Session`, `PracticeSession`, `VerificationCode`) appear in Supabase **Table Editor**.
