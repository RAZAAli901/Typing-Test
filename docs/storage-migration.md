# Supabase Storage Avatar Migration Guide

## Rationale & Benefits
Now that Supabase is our primary backend for database operations and real-time event streaming, migrating user profile avatar storage from Vercel Blob to **Supabase Storage** provides several major technical and architectural advantages:

1. **Unified Infrastructure**: Eliminates vendor fragmentation by consolidating database, blob storage, and real-time subscriptions under a single Supabase project.
2. **Access Control & Row-Level Security**: Storage buckets leverage native PostgreSQL RLS policies, allowing granular security boundaries directly aligned with user database privileges.
3. **Cost & Quota Efficiency**: Supabase provides generous storage limits on free/pro tiers with unified bandwidth metrics.
4. **Consistent CDN URLs**: Standardizes CDN public avatar URLs under `https://<project-id>.supabase.co/storage/v1/object/public/avatars/<filename>`.
