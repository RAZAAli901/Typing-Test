# Changelog - TypeMaster Web

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-supabase] - 2026-08-10

### Added
- **Supabase Integration & Connection Pooling**:
  - Prisma configured with `url` (port 6543 PgBouncer pooler) and `directUrl` (port 5432 direct connection for migrations).
  - Environment configuration for client (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and server (`SUPABASE_SERVICE_ROLE_KEY`).
  - Added `@supabase/supabase-js` client SDK wrappers in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` with import boundary security guards.
  - Supabase connectivity sub-check added to `/api/health` smoke test endpoint.
  - Automated foreign key, index, and schema manifest audit scripts added in `scripts/`.
  - Comprehensive setup documentation added in `docs/supabase-setup.md`.

### Sub-Milestone
- **Prisma connected to Supabase**: Schema deployed and verified with PgBouncer connection pooling compatibility.
