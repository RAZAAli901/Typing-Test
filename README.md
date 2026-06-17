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
