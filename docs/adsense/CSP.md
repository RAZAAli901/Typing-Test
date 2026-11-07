# Content Security Policy (CSP) Documentation

This document explains the security architecture of TypeMaster&rsquo;s Content Security Policy, defined in `src/lib/csp.ts` and enforced via HTTP headers in `next.config.ts`.

---

## 1. Directive Breakdown

| Directive | Tokens / Hosts | Technical Justification |
| :--- | :--- | :--- |
| `default-src` | `'self'` | Secure default fallback restricting unlisted resource types to site origin. |
| `connect-src` | `'self'`, `https:`, `wss:` | Enables secure REST calls to Supabase, NextAuth APIs, and WebSocket connections (`wss:`) for live realtime leaderboard presence. |
| `img-src` | `'self'`, `data:`, `blob:`, `https:` | Allows user avatars hosted on Supabase Storage (`avatars` bucket), data URI icons, and external CDNs. |
| `script-src` | `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, AdSense hosts | Required for Next.js client hydration and Google AdSense ad loaders. |
| `frame-src` | `'self'`, AdSense / DoubleClick hosts | Sandboxes third-party display advertisements in isolated `<iframe>` elements. |
| `style-src` | `'self'`, `'unsafe-inline'` | Permits Tailwind CSS utility classes and dynamic CRT theme styling tokens. |
| `frame-ancestors` | `'none'` | Completely blocks clickjacking attacks by forbidding external websites from embedding TypeMaster in frames. |
| `upgrade-insecure-requests` | — | Automatically upgrades any legacy HTTP asset requests to TLS HTTPS. |

---

## 2. Dynamic Execution (`'unsafe-inline'` & `'unsafe-eval'`)

- **`'unsafe-inline'`**: Required for Next.js inline bootstrap state hydration and the pre-paint `data-booted` inline script in `<head>`.
- **`'unsafe-eval'`**: Required by Google AdSense (`adsbygoogle.js`) which dynamically evaluates ad payloads, and development mode source-mapping.

---

## 3. Whitelisted Google & AdSense Hostnames

The following domains are explicitly permitted to ensure Google AdSense operates without browser security blocks:

1. **`pagead2.googlesyndication.com`**:
   - *Directive*: `script-src`
   - *Purpose*: Official distribution endpoint for the core Google AdSense library (`adsbygoogle.js`).
2. **`*.googlesyndication.com`**:
   - *Directives*: `script-src`, `frame-src`
   - *Purpose*: Static asset delivery and telemetry reporting for Google syndicated advertising units.
3. **`googleads.g.doubleclick.net`**:
   - *Directive*: `frame-src`
   - *Purpose*: Google DoubleClick advertising exchange domain hosting rendered ad iframes.
4. **`*.doubleclick.net`**:
   - *Directives*: `script-src`, `frame-src`
   - *Purpose*: Real-time bidding, impression tracking, and creative rendering.
5. **`*.google.com`**:
   - *Directives*: `script-src`, `frame-src`
   - *Purpose*: Google ad preference management, authentication verification, and privacy messaging infrastructure.
6. **`*.googleadservices.com`**:
   - *Directive*: `script-src`
   - *Purpose*: Conversion tracking and ad click verification.
7. **`*.adtrafficquality.google`**:
   - *Directive*: `script-src`
   - *Purpose*: Google invalid traffic (IVT) detection and bot fraud prevention algorithms.
