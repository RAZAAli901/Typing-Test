# Data Migration Architectural Decisions

## Decision 1: Handling Ephemeral `VerificationCode` Data

### Context
The `VerificationCode` table stores 6-digit access codes sent to users during email verification.
Each code hash expires after 10 minutes (`expiresAt`).

### Decision
- **Historical `VerificationCode` records WILL NOT be migrated** to the new Supabase database.
- **Rationale**:
  1. Verification codes have a 10-minute expiration window. All past codes stored in the source database are already expired.
  2. Migrating expired code hashes adds unnecessary database noise and row bloat with zero user benefit.
  3. Active unverified users who log in post-migration will automatically trigger a fresh access code via the `Resend` API flow (`/api/auth/resend-code`).
- **Tooling Support**: Export (`scripts/export-verification-codes.ts`) and import scripts are maintained for completeness, but `VerificationCode` migration will be skipped during production execution.
