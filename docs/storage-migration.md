# Supabase Storage Avatar Migration Guide

## Rationale & Benefits
Now that Supabase is our primary backend for database operations and real-time event streaming, migrating user profile avatar storage from Vercel Blob to **Supabase Storage** provides several major technical and architectural advantages:

1. **Unified Infrastructure**: Eliminates vendor fragmentation by consolidating database, blob storage, and real-time subscriptions under a single Supabase project.
2. **Access Control & Row-Level Security**: Storage buckets leverage native PostgreSQL RLS policies, allowing granular security boundaries directly aligned with user database privileges.
3. **Cost & Quota Efficiency**: Supabase provides generous storage limits on free/pro tiers with unified bandwidth metrics.
4. **Consistent CDN URLs**: Standardizes CDN public avatar URLs under `https://<project-id>.supabase.co/storage/v1/object/public/avatars/<filename>`.

---

## Storage Bucket Configuration & Access Policies
- **Bucket Name**: `avatars`
- **Public Read Access**: Public (allows serving images on Leaderboard & Profile HUD without authorization tokens).
- **Write Policy**: Restrict write mutations to server-side executions via `SUPABASE_SERVICE_ROLE_KEY`.
- **Policy Definition**: Managed in `supabase/policies/storage_avatars.sql`.

---

## Avatar Processing & Security Pipeline
All user-uploaded avatar files undergo server-side validation in `POST /api/profile/avatar`:
1. **Size Guard**: Immediate 5MB payload limit enforcement prior to buffer processing.
2. **Script Scan**: Inspection of headers to reject SVG/XML vector script payloads.
3. **Magic Byte Verification**: Sharp inspection verifying real binary header match for PNG, JPEG, or WEBP.
4. **Raster Re-Encoding**: Sharp raster re-encoding to clean 512x512 PNG, stripping comments and metadata.

---

## Verification & Automated Regression Tests
- **Invalid File Rejection**: `npx tsx scripts/test-supabase-storage-security.ts`
- **Legitimate Upload Processing**: `npx tsx scripts/test-supabase-storage-legitimate-upload.ts`
- **Asset Migration Script**: `npx tsx scripts/migrate-avatars.ts`

