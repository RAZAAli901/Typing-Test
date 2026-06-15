# TypeMaster CLI

A console-based typing speed test written in C++ for a Semester 2 project. It measures your typing speed (WPM), accuracy, and tracks scores on a persistent local leaderboard.

## Features

- **Three typing modes**
  - **Standard** – a narrative paragraph for general typing practice
  - **Numbers** – a report-style passage with dates, percentages, and figures
  - **Quotes** – a passage made up of famous quotes
- **Performance metrics** after each session:
  - Gross WPM (Words Per Minute)
  - Net WPM (adjusted for errors)
  - Accuracy percentage
  - Character and error counts
- **Persistent leaderboard** stored in `leaderboard.txt`, showing the top 10 scores by Net WPM
- **Personal best tracking** per username
- Built using only `<iostream>` and `<fstream>` — no external libraries, `<string>`, `<chrono>`, or ANSI escape codes, with custom implementations for string handling, number parsing, and formatting

## Requirements

- A C++ compiler supporting C++11 or later (e.g. `g++`)

## Building

```bash
g++ -o typing-test Typing-test.cpp
```

## Running

```bash
./typing-test
```

On Windows (after compiling with `g++` or MSVC):

```bash
typing-test.exe
```

## How It Works

1. Enter a username when prompted.
2. Choose a mode from the menu:
   - `1` – Standard
   - `2` – Numbers
   - `3` – Quotes
   - `4` – View Leaderboard
   - `5` – Quit
3. For typing modes, read the displayed passage, type it out exactly, and press **Enter**.
4. Manually enter how many seconds the attempt took.
5. View your results (Gross WPM, Net WPM, Accuracy, Errors, Characters typed).
6. Your session is saved to the leaderboard automatically, and your rank and personal best are displayed.

## Leaderboard Storage

Scores are saved to a `leaderboard.txt` file in the same directory as the executable, using a simple comma-separated format:

```
username,gross_wpm,net_wpm,accuracy,time_taken
```

This file is created automatically the first time a score is saved.

## Project Structure

| File | Description |
|------|-------------|
| `Typing-test.cpp` | Main program source code |
| `leaderboard.txt` | Auto-generated leaderboard data (created on first run) |

## License

This project was created as a Semester 2 academic project. Feel free to fork and adapt it for your own learning purposes.
