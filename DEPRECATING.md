# Deprecation Schedule & Sunset Notice

## Deprecated Infrastructure & Libraries

### 1. `@vercel/blob` (Vercel Blob Storage)
- **Status**: Deprecated as of `v3.0.0-supabase`.
- **Replacement**: **Supabase Storage** (`avatars` public bucket).
- **Rationale**: Consolidated blob storage into Supabase infrastructure to unify RLS policies, reduce vendor fragmentation, and improve avatar CDN response times.

### 2. Standby Legacy Database
- **Status**: Read-only standby mode (14-day grace period).
- **Replacement**: **Supabase Cloud PostgreSQL** (`DATABASE_URL` port 6543 / `DIRECT_URL` port 5432).
- **Sunset Date**: 14 days post-migration cutover.
