# Data Collection & Privacy Inventory

This inventory documents all categories of data processed by TypeMaster, derived directly from `prisma/schema.prisma`, `src/lib/rateLimit.ts`, client-side storage keys, authentication cookies, and third-party integrations. The Privacy Policy (`/privacy`) and Cookie Registry (`/cookies`) are authored strictly based on this document.

---

## 1. User Account & Authentication Data

| Data Field | Storage Location | Retention / Lifecycle | Purpose & Legal Basis |
| :--- | :--- | :--- | :--- |
| **Username** (`username`) | PostgreSQL (`User` table) | Retained until account deletion | Account identifier; publicly displayed on leaderboards and profile page. Contractual necessity. |
| **Email Address** (`email`) | PostgreSQL (`User` table) | Retained until account deletion | Account recovery, security notifications, 6-digit email verification. Never sold or shared for marketing. |
| **Password Hash** (`passwordHash`) | PostgreSQL (`User` table) | Overwritten on password change; deleted on account removal | Salted bcrypt hash; plain-text passwords are never logged, transmitted in cleartext, or persisted. |
| **Avatar Image** (`avatarUrl`) | Supabase Storage (`avatars` bucket) | Deleted on avatar change or account deletion | User profile picture. Uploaded as WebP/PNG/JPEG, sanitized and resized server-side. |
| **Email Verification Status** (`emailVerified`) | PostgreSQL (`User` table) | Retained with account | Boolean flag indicating confirmed email ownership. |
| **Verification Code Hash** (`codeHash`) | PostgreSQL (`VerificationCode` table) | Automatically expires in 10 minutes; deleted upon verification | SHA-256 hash of temporary 6-digit one-time passcode. Plain code is never stored. |
| **Session Invalidation Timestamps** | PostgreSQL (`User` table) | Retained with account | `passwordChangedAt` and `sessionInvalidatedAt` ensure revocation of outdated JWTs upon credential change. |

---

## 2. Gameplay & Leaderboard Data

| Data Field | Storage Location | Retention / Lifecycle | Purpose & Legal Basis |
| :--- | :--- | :--- | :--- |
| **Completed Typing Tests** (`Session`) | PostgreSQL (`Session` table) | Permanent (unless deleted via user data removal) | Net WPM, Gross WPM, accuracy %, elapsed seconds, mistakes count, characters typed, test mode, and timestamp. Used for personal analytics and global leaderboards. |
| **Guest Display Name** (`guestDisplayName`) | PostgreSQL (`Session` table) | Permanent | Optional nickname entered by unauthenticated guests to identify scores on the public leaderboard. |
| **Anti-Cheat Practice Sessions** (`PracticeSession`) | PostgreSQL (`PracticeSession` table) | Ephemeral (expires within 15 minutes of test initiation) | Cryptographically links the randomized target text to the submitted score payload to verify test validity. |

---

## 3. Browser Storage & Cookies

### A. HTTP Cookies
| Cookie Name | Provider | Lifetime | Category | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `next-auth.session-token` / `__Secure-next-auth.session-token` | TypeMaster (NextAuth) | 30 days (rolling) | Strictly Necessary | Encrypted JWT maintaining user authentication session. |
| `next-auth.csrf-token` / `__Host-next-auth.csrf-token` | TypeMaster (NextAuth) | Session | Strictly Necessary | CSRF protection token verifying authenticity of auth requests. |
| `next-auth.callback-url` / `__Secure-next-auth.callback-url` | TypeMaster (NextAuth) | Session | Strictly Necessary | Stores return URL for post-authentication redirection. |

### B. LocalStorage Keys
| Storage Key | Lifetime | Category | Purpose |
| :--- | :--- | :--- | :--- |
| `typemaster_username` | Persistent | Functional | Caches the guest or authenticated username for UI greeting and quick form population. |
| `typemaster_crt_theme` | Persistent | Functional | Saves user's CRT monitor color theme preference (`amber`, `green`, `cyan`, `classic`). |
| `typemaster_crt_effects` | Persistent | Functional | Stores boolean preference enabling or disabling CRT scanline and curvature overlay effects. |
| `typemaster_crt_sound` | Persistent | Functional | Stores boolean preference enabling or disabling typewriter sound effects. |
| `typemaster_crt_live_flash` | Persistent | Functional | Stores boolean preference for live score alert flash animations on the leaderboard. |
| `typemaster_consent_v1` | 12 months | Strictly Necessary | Records user's advertising and analytics consent status (`granted` or `denied`), timestamp, and consent schema version. |

### C. SessionStorage Keys
| Storage Key | Lifetime | Category | Purpose |
| :--- | :--- | :--- | :--- |
| `typemaster_booted` | Browser Tab Session | Functional | Prevents the retro terminal boot animation from repeating on every internal page navigation within the same session. |

---

## 4. Technical Logs & Network Security

| Data Field | System / Module | Retention | Purpose |
| :--- | :--- | :--- | :--- |
| **Client IP Address** | Memory cache (`src/lib/rateLimit.ts`) | Sliding window (60s to 15m) | Rate limiting abuse prevention, DDoS mitigation, and brute-force protection. Never written to the database or long-term storage. |
| **HTTP Request Headers** | Vercel / Edge Runtime | Standard cloud retention (typically ≤ 30 days) | Operational routing, security auditing, and TLS termination. |

---

## 5. Third-Party Service Providers (Subprocessors)

1. **Supabase Inc.**
   - *Role*: Managed PostgreSQL Database & Object Storage.
   - *Data Shared*: Encrypted user records, typing scores, avatars.
   - *Location*: AWS Cloud Infrastructure (hosted in region configured by deployment).
2. **Resend Inc.**
   - *Role*: Transactional Email Delivery.
   - *Data Shared*: User email address and 6-digit verification code.
   - *Location*: United States.
3. **Vercel Inc.**
   - *Role*: Cloud Hosting & Serverless Execution.
   - *Data Shared*: Transient HTTP requests, IP addresses for edge routing.
   - *Location*: Global edge network.
4. **Google LLC (Google AdSense)** *(Only upon explicit consent)*
   - *Role*: Digital Advertising Network.
   - *Data Shared*: Cookie IDs, advertising identifiers, device characteristics for ad personalization and fraud detection.
   - *Location*: Global.
