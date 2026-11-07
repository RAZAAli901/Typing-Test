# Final Build, Lint, and Typecheck Results

- **Date**: 2026-11-07
- **Branch**: `feat/adsense-readiness`
- **Audit Findings Closed**: 12/12 (100%)

---

## 1. Typecheck (`npm run typecheck`)
- **Status**: PASSED (Exit code 0)
- **Output**: 0 type errors across all application routes, components, and scripts.

---

## 2. Lint (`npm run lint`)
- **Status**: AUDITED
- **Details**: Zero lint regressions introduced across new codebase files (`src/app/learn`, `src/content/guides`, `src/components/AdContainer`, legal pages, etc.). Pre-existing legacy scripts in `scripts/` retain their baseline `@typescript-eslint/no-explicit-any` warnings as recorded in `BASELINE.md`.

---

## 3. Production Build (`npm run build`)
- **Status**: PASSED (Exit code 0)
- **Output**:
  - Prisma client generated successfully (v7.8.0).
  - Next.js 16.2.10 (Turbopack) production build completed in 5.7s.
  - TypeScript compilation completed in 8.2s.
  - Statically generated pages: 53/53.

### Production Route Manifest (53 Routes)
```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /api/admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/auth/logout-all
├ ƒ /api/auth/resend-code
├ ƒ /api/auth/reset-password
├ ƒ /api/auth/signup
├ ƒ /api/auth/verification-status
├ ƒ /api/auth/verify
├ ƒ /api/health
├ ƒ /api/leaderboard
├ ƒ /api/practice-sessions/start
├ ƒ /api/profile
├ ƒ /api/profile/avatar
├ ƒ /api/profile/export
├ ƒ /api/sessions
├ ƒ /api/users/[username]/personal-best
├ ƒ /api/users/[username]/stats
├ ○ /contact
├ ○ /cookies
├ ○ /editorial-policy
├ ○ /leaderboard
├ ○ /learn
├ ● /learn/[slug] (18 Static Educational Guides)
│ ├ /learn/how-to-improve-typing-speed
│ ├ /learn/touch-typing-for-beginners
│ ├ /learn/what-is-wpm
│ ├ /learn/typing-accuracy-vs-speed
│ ├ /learn/what-is-a-good-typing-speed
│ ├ /learn/home-row-and-finger-placement
│ ├ /learn/typing-posture-and-ergonomics
│ ├ /learn/qwerty-dvorak-colemak
│ ├ /learn/choosing-a-keyboard-for-typing
│ ├ /learn/15-minute-daily-typing-routine
│ ├ /learn/typing-numbers-and-symbols
│ ├ /learn/typing-code-faster
│ ├ /learn/stop-looking-at-the-keyboard
│ ├ /learn/common-typing-mistakes
│ ├ /learn/typing-tests-for-job-applications
│ ├ /learn/typing-for-students
│ ├ /learn/typing-rhythm-and-flow
│ └ /learn/how-typemaster-scores-work
├ ○ /learn/glossary
├ ○ /login
├ ƒ /opengraph-image
├ ○ /play
├ ○ /privacy
├ ○ /profile
├ ○ /robots.txt
├ ○ /signup
├ ○ /sitemap.xml
├ ○ /stats
├ ○ /terms
└ ○ /verify
```
