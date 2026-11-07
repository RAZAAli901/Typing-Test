# AdSense Compliance Checklist

This checklist tracks the resolution of the 12 audit findings identified for AdSense readiness.

- [x] **Finding 1**: AdSense script (`ca-pub-6696399034620004`) loads on every page, before any consent
  - *Closing Commits*: 23, 26 (Phase 2 - removal: STARTED), 73–88 (Phase 6 - consent-gated loader)
- [x] **Finding 2**: Server render shows the boot screen, not the page (`booting` starts true)
  - *Closing Commits*: 17–21, 25, 26 (Phase 2)
- [x] **Finding 3**: A timer rewrites `document.title` to `TYPEMASTER_v1 ▮` every 850 ms
  - *Closing Commits*: 22, 26 (Phase 2)
- [x] **Finding 4**: No privacy policy, terms, contact page, cookie notice or footer links
  - *Closing Commits*: 47–49 (Phase 4), 55–72 (Phase 5)
- [x] **Finding 5**: No `ads.txt`, `robots.txt`, `sitemap.xml`, canonical URL, Open Graph tags or `google-adsense-account` meta
  - *Closing Commits*: 24, 27–32, 39–43, 46 (Phases 2 & 3)
- [x] **Finding 6**: Home and About are feature blurbs; Leaderboard and Stats are data views ("Low value content")
  - *Closing Commits*: 89–116 (Phase 7 - 18 guides, learn hub & glossary), 117–127 (Phase 8 - substantive content improvements)
- [x] **Finding 7**: Most pages are `"use client"`, so they cannot export metadata
  - *Closing Commits*: 33–38, 46 (Phase 3)
- [x] **Finding 8**: No rule keeps ads off login, signup, verify, profile, 404, error and play
  - *Closing Commits*: 79–82, 86–88 (Phase 6), 136–137 (Phase 10)
- [x] **Finding 9**: Data collected is undocumented (email, password hash, avatar, scores, IPs, cookies, Supabase, Resend)
  - *Closing Commits*: 8 (Phase 0), 55–65, 72 (Phase 5)
- [ ] **Finding 10**: No self-serve account deletion or data export (only admin scripts)
  - *Closing Commits*: 128–135 (Phase 9)
- [ ] **Finding 11**: Production domain and contact address are not configured
  - *Closing Commits*: 9–16 (Phase 1)
- [ ] **Finding 12**: Copy contradicts itself (layout comment, 7 vs 8 modes, Vercel Postgres vs Supabase)
  - *Closing Commits*: 53–54 (Phase 4), 117–122, 127 (Phase 8)
