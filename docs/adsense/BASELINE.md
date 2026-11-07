# Baseline Build, Lint, and Typecheck Results

- **Date**: 2026-11-07
- **Starting Commit**: `7e417ccd829ff3086bff220ce840e7d092f8c4fc`
- **Branch**: `feat/adsense-readiness`

---

## 1. Typecheck (`npx tsc --noEmit`)
- **Status**: PASSED (Exit code 0)
- **Output**: Clean, 0 type errors.

---

## 2. Lint (`npm run lint`)
- **Status**: FAILED (Exit code 1)
- **Summary**: 117 problems (86 errors, 31 warnings)
- **Details**: Pre-existing lint errors primarily from `@typescript-eslint/no-explicit-any` across scripts (`scripts/*.ts`), `web/app.js`, and `react-hooks/set-state-in-effect` in existing client hooks (`useRealtimePresence.ts`, `usePersonalBestAlert.ts`, `CrtSettingsContext.tsx`).

---

## 3. Build (`npm run build`)
- **Status**: PASSED (Exit code 0)
- **Output**:
  - Prisma client generated successfully (v7.8.0).
  - Next.js 16.2.10 (Turbopack) production build completed.
  - TypeScript check passed in 6.4s.
  - Static pages generated: 24/24.
