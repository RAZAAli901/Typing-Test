# Changelog - TypeMaster Web

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-supabase] - 2026-08-10

### Added
- **Supabase Cloud Database Migration**:
  - Full migration from legacy database to Supabase PostgreSQL with PgBouncer connection pooling.
  - Zero data loss migration verified via row-count parity checkers (`scripts/verify-migration-counts.ts`) and foreign key resolution tools.
  - Prisma 7 adapter dynamic configuration in `src/lib/db.ts`.

- **Supabase Storage Avatar Provider**:
  - Replaced Vercel Blob with Supabase Storage `avatars` bucket.
  - Added magic-byte validation, SVG vector script rejection, and 512x512 PNG raster re-encoding pipeline.

- **Realtime WebSocket Leaderboard & Presence**:
  - Real-time Change Data Capture (CDC) streaming via `useLeaderboardRealtime` hook.
  - CRT phosphor row flash highlight animation and new #1 highscore alert banners.
  - Live active typist presence count (`useRealtimePresence`) with `X ONLINE` HUD badge.
  - Personal Best beat live notification system (`usePersonalBestAlert`).
  - 10-second polling fallback for offline socket resilience.

- **Automated Verification Suite**:
  - 17 automated test suites executed via `scripts/run-all-tests.ts`.

