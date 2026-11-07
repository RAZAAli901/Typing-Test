# Route Classification & AdSense Eligibility

Every route in TypeMaster is categorized by function and whether advertisements may ever appear on that route, ensuring full compliance with Google AdSense Publisher Policies.

| Route | Category | Purpose | AdSense Eligible? | Policy Reason |
| :--- | :--- | :--- | :---: | :--- |
| `/` | Content | Landing page & feature overview | **Yes** (Controlled) | Publisher content present; ads allowed only below primary hero/content with clear label. |
| `/about` | Content | Project background, scoring specs, operator info | **Yes** | Substantive publisher text and educational reference. |
| `/learn` | Content | Educational hub for typing guides and tutorials | **Yes** | High-value publisher content repository. |
| `/learn/[slug]` | Content | In-depth typing guides and ergonomics articles | **Yes** | Primary publisher editorial content (700–1,000+ words per article). |
| `/learn/glossary` | Content | Reference glossary of typing and ergonomic terms | **Yes** | High-value educational reference content. |
| `/play` | Utility | Interactive typing speed test and game controls | **NO** | Interactive game canvas; ads near active typing inputs or controls violate Google policy (accidental clicks). |
| `/leaderboard` | Data View | Dynamic user score rankings and leaderboards | **NO** | Pure data view with minimal text; ads on dynamic data tables risk low-value classification. |
| `/stats` | Data View | Personal user metrics, charts, and history | **NO** | User dashboard data view; ads prohibited. |
| `/login` | Transactional | User authentication | **NO** | Auth page with no publisher content; violates AdSense placement policies. |
| `/signup` | Transactional | User registration | **NO** | Registration form without publisher content. |
| `/verify` | Transactional | 6-digit email OTP verification | **NO** | Sensitive transactional state with no publisher content. |
| `/profile` | Utility | User settings, avatar upload, data export & deletion | **NO** | Account settings area; ads prohibited. |
| `/privacy` | Legal | Privacy policy and data disclosures | **NO** | Legal document; advertising on trust/legal pages is strictly prohibited. |
| `/terms` | Legal | Terms of service and user agreements | **NO** | Legal document; advertising prohibited. |
| `/cookies` | Legal | Storage registry and consent preferences | **NO** | Legal/compliance page; advertising prohibited. |
| `/contact` | Utility | Support inquiry links and issue reporting | **NO** | Support directory without publisher article content. |
| `/editorial-policy` | Legal | Content standards and corrections policy | **NO** | Trust/policy document; advertising prohibited. |
| `/_not-found` (404) | Error | Page not found handler | **NO** | Error pages have zero publisher content; Google AdSense explicitly bans ads on 404s. |
| `/api/*` | API | Backend REST endpoints (JSON responses) | **NO** | Machine-to-machine data endpoints. |
