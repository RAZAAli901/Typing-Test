# Live Typing Test Suite v1.0

Welcome to the **Live Typing Test Suite**, a comprehensive package featuring multiple versions of typing test applications, designed to help you measure and improve your typing speed and accuracy. 

This repository contains both console-based CLI applications (C++) and a high-fidelity web-based application (HTML/CSS/JS) with premium styling, audio feedback, and visual graphs.

---

## 📦 Suite Components & Versions

This project is divided into three distinct versions of the typing test:

| Version | Environment | Key Features | Tech Stack |
|:---|:---|:---|:---|
| **Live Typing Test CLI v1.0** | Terminal | Classic semester-project console application, manual time entry, leaderboard. | C++ (`<iostream>`, `<fstream>`) |
| **Live Typing Test CLI v2.0** | Terminal | Real-time keystroke scanning, character color coding (Green/Red), automatic duration tracking, high-scores database. | C++ (`<conio.h>`, `<chrono>`) |
| **Live Typing Test Web v1.0** | Web Browser | Cyberpunk glassmorphic UI, audio feedback synthesized via Web Audio API, dynamic performance SVG graphs, custom texts, local storage leaderboard. | HTML5, Vanilla CSS, JS |

---

## ⚡ Web App Features (Web v1.0)

The web application is designed to provide a premium, modern, and highly interactive typing experience:
* **Rich Visual Design:** Built using a glowing dark glassmorphic card design.
* **4 Curated Themes:** Cyberpunk Neon, Dark Console (retro green), Ocean Breeze, and Sakura Bloom.
* **Ambient Particles:** Micro-animations and float particles reactive to correct typing keystrokes.
* **Web Audio Synthesis:** Generates click sounds for correct keystrokes, buzzer sounds for mistakes, and success chords upon completion, completely synthesized in-code.
* **Performance Graphs:** Plots your typing speed (WPM) and accuracy curve over the duration of the test using a clean SVG-based charting engine.
* **Persistence:** Keeps track of your top 10 scores using browser `localStorage`.
* **Custom Prompts:** Allows you to paste your own custom paragraphs to practice on.

---

## 🛠️ Installation and Run Instructions

### 1. Web Version (Web v1.0)
The web version is fully serverless and runs directly in any modern browser without installation:
1. Navigate to the `web/` folder.
2. Double-click [index.html](file:///c:/Users/lenovo/Desktop/Typing-Test/web/index.html) to open it in your web browser (Chrome, Edge, Firefox, or Safari).
3. Enter your username and start typing!

---

### 2. C++ CLI v1.0 (Classic CLI)
A retro console typing test where you read the text, type it, and manually enter how many seconds it took:
* **File Location:** [cli/Typing-Test-v1.cpp](file:///c:/Users/lenovo/Desktop/Typing-Test/cli/Typing-Test-v1.cpp)
* **Compile (Windows / PowerShell):**
  ```powershell
  g++ -o typing-test-v1 cli/Typing-Test-v1.cpp
  ```
* **Run:**
  ```powershell
  ./typing-test-v1
  ```

---

### 3. C++ CLI v2.0 (Live Retro Terminal)
An advanced console typing test featuring real-time, character-by-character color highlighting (green for correct, red background for mistakes), automated timing, and real-time statistics updating on the screen as you type:
* **File Location:** [cli/Typing-Test-v2.cpp](file:///c:/Users/lenovo/Desktop/Typing-Test/cli/Typing-Test-v2.cpp)
* **Compile (Windows / PowerShell):**
  ```powershell
  g++ -o typing-test-v2 cli/Typing-Test-v2.cpp
  ```
* **Run:**
  ```powershell
  ./typing-test-v2
  ```

---

## 🏆 Leaderboard Storage formats

* **CLI v1.0:** Stores records in `leaderboard.txt` in the format: `username,gross_wpm,net_wpm,accuracy,time_taken`
* **CLI v2.0:** Stores records in `leaderboard_v2.txt` in the format: `username,gross_wpm,net_wpm,accuracy,time_taken,mistakes`
* **Web v1.0:** Stores records inside the browser's `localStorage` (key: `typemaster_scores`).

---

## 🎨 Theme Visual Previews (Web App)
You can toggle between different layouts instantly using the theme palette button in the upper-right corner of the web interface:
1. **Cyberpunk Neon:** Vibrant cyan and pink glows against a deep violet sky backdrop.
2. **Dark Console:** Terminal-green monospaced retro computer design.
3. **Ocean Breeze:** Smooth dark blue card layouts with light sky accents.
4. **Sakura Bloom:** Peaceful blossom cherry pink tones combined with dark plum gradients.

Enjoy typing!

---

## 🗄️ Next.js Web App Rebuild (TypeMaster Web v2.0)

This repository has been upgraded with a high-fidelity **Next.js 14+ (App Router)** web rebuild, designed for deployment on Vercel with a global PostgreSQL-backed leaderboard.

### Key Features
* **Advanced Typing Engine:** Captures keystrokes with high-resolution timers (`performance.now()`), handles mistake highlights with pure CSS key-shakes, and provides full backspace support.
* **8 Practice Modes:** Standard, Numbers, Quotes, Code Snippet, Punctuation, Random Words (crypto-shuffled), Daily Challenge (UTC-seeded deterministic prompt), and Custom Text.
* **Passage Length Adjuster:** Trim or repeat prompts to match **Short** (~15 words), **Medium** (~30 words), or **Long** (~60 words) parameters.
* **SVG Timeline Curves:** Self-calculating, responsive charts tracing speed and accuracy throughout typing sessions.
* **Global Leaderboards:** Dynamically filters rankings per mode, sorts by speed or accuracy, and highlights your active session.
* **User Profile Statistics:** Displays total sessions completed, lifetime averages (speed/accuracy), top WPM speed records, and cumulative practice minutes.
* **API Security & Resiliency:** Integrated in-memory IP-based rate limiting, offensive username filters, custom 404 pages, and global client-side error boundaries.

---

## 📺 Retro CRT TV UI Overhaul (Web v2.0)

The entire user interface of TypeMaster Web has been overhauled to emulate typing on an old phosphor-glow CRT computer terminal / television screen:

* **Phosphor Display Aesthetics:** Curved glass screen curvature, scanline overlays, moving static lines, low-frequency screen flicker, and faint RGB chromatic aberration.
* **Chunky Monitor Bezel Casing:** A heavy plastic monitor casing wrapping the screen, complete with PAL system badges, a red power LED, and functional dial knobs.
* **Hardware Bezel Dials:**
  * `COLOR (GRN/AMB)`: Dynamically swaps the screen phosphor between classic green-on-black and retro amber-on-black.
  * `EFFECTS (ON/OFF)`: Toggles scanlines, curvature vignette, tracking static, and screen flicker on/off.
  * `AUDIO (ON/OFF)`: Toggles synthesized key-click sounds and mistake buzzer sound effects.
* **Web Audio Synthesis:** zero asset downloads! Click and buzzer sounds are synthesized dynamically on-the-fly using the HTML5 Web Audio API.
* **Accessibility / Reduced Motion:** Rolling static lines, screen flicker, and randomized scanline roll glitching automatically disable if the browser/OS has `prefers-reduced-motion: reduce` enabled, or if disabled via the settings toggle.
* **Print Stylesheet Overrides:** Media print queries completely strip background gradients, CRT overlay classes, glow text shadows, and headers/footers to produce clean black-on-white text for printing.

---

---

### 🛠️ Local Development & Scaffolding

#### 1. Install Dependencies
Ensure you have Node.js 18+ installed, then install all project packages:
```bash
npm install
```

#### 2. Configure Database Environment
Create a `.env` file in the root directory (based on `.env.example`) with your PostgreSQL connection strings:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/typemaster?schema=public"
POSTGRES_PRISMA_URL="postgresql://postgres:postgres@localhost:5432/typemaster?schema=public"
```

#### 3. Database Migration & Scaffolding (Prisma 7)
Prisma 7 removes datasource URLs from `schema.prisma`. Connections are managed dynamically at runtime via pg driver adapters inside `src/lib/db.ts` and for CLI operations via `prisma.config.ts`.
* Generate the Prisma Client wrapper:
  ```bash
  npx prisma generate
  ```
* Apply migrations to setup tables:
  ```bash
  npx prisma db push
  ```
* Seed the database with 16 demo sessions for local testing:
  ```bash
  npm run seed
  ```

#### 4. Run Scripts
* **Dev Server:** `npm run dev` (starts on `http://localhost:3000`)
* **Production Build:** `npm run build`
* **Prisma Studio (Db Inspector):** `npx prisma studio`

---

### 🚀 Deploying to Vercel

1. Push your repository changes to GitHub.
2. In your Vercel Dashboard, select **Add New Project** and import your repository.
3. Add a **Postgres Storage** database to your project via the Vercel dashboard's **Storage** tab. This will automatically inject the database connection environment variables (`POSTGRES_PRISMA_URL`, etc.).
4. Vercel will automatically build and deploy the Next.js production server. Your global leaderboard is now live!

---

## 🔒 User Accounts, Authentication & Blob Storage

TypeMaster Web v2.0 includes a comprehensive, secure authentication and persistent profile system:

### 1. User Authentication (NextAuth & Credentials Provider)
- **Identity Registration (/signup):** Users can build a custom cognitive identity profile. Form registration enforces real-time client-side format checks (unique email structure, minimum 6 characters with at least one digit password checks, password strength meter).
- **Secure Password Hashing:** Uses `bcryptjs` on the server-side to hash passwords securely before database persistence.
- **Terminal Access Console (/login):** Authenticates users via NextAuth credentials flow. Users can check **Remember Me** to flag persistent session storage (using a 30-day session caching token).
- **Guest Fallback Mode:** Allows users to "Continue as Guest" to practice anonymously. Guest sessions use standard local browser storage keys (`typemaster_username`) and bind session submissions to the database under virtual guest identities, preserving data format consistency.

### 2. Profile Avatar Uploads (Vercel Blob Storage)
- **Profile Dossier View (/profile):** Displays restricting classified dossier details, clearance levels, active typing stats grids, and user avatar.
- **Vercel Blob Integration:** Users can click and upload JPEG/PNG images (under 2MB size) directly to Vercel's global blob database via `@vercel/blob` SDK.
- **Resilient Fallback placeholders:** If Vercel Blob storage token (`BLOB_READ_WRITE_TOKEN`) is not configured, the application falls back automatically to generating responsive retro pixel-art placeholder SVGs containing unique alphanumeric color matrices.
- **Public Leaderboard Integration:** The global leaderboard queries (`/api/leaderboard`) retrieve and render user avatar thumbnails for high-ranking competitors, sanitizing output objects to prevent leaking email addresses or password hashes.

### 3. CRT Terminal Component Structure
- **Screen Filter Wrapper:** Next.js global layouts are wrapped in visual viewport scanlines and noise filters to capture CRT aesthetic styles.
- **Interactable Dial Controls:** Nav bar badges and bezel toggles trigger CRT screen effects, amber/green phosphor phosphor switching, and Web Audio API synthesized audio clicks.
