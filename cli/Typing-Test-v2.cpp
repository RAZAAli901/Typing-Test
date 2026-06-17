/*
 * Live Typing Test v2.0 - Retro Terminal
 * An interactive, real-time typing speed test with live color highlighting,
 * automatic timer, and instant WPM/accuracy feedback.
 * Designed for Windows CLI using ANSI escape codes and <conio.h>.
 */

#include <iostream>
#include <fstream>
#include <chrono>
#include <conio.h>
#include <windows.h>
#include <cstdio>

using namespace std;

// --- Constants ---------------------------------------------------------------
const int MAX_NAME = 30;
const int MAX_ENTRIES = 500;
const int MAX_TEXT_LEN = 2000;

// --- Structures --------------------------------------------------------------
struct PlayerSession {
    char username[MAX_NAME];
    int gross_wpm;
    int net_wpm;
    float accuracy;
    float time_taken;
    int mistakes;
};

// --- ANSI Escape Code Utilities ----------------------------------------------
void enable_ansi() {
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        DWORD dwMode = 0;
        if (GetConsoleMode(hOut, &dwMode)) {
            dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
            SetConsoleMode(hOut, dwMode);
        }
    }
}

void clear_screen() {
    cout << "\033[2J\033[H";
}

void set_color(const char* ansi_code) {
    cout << ansi_code;
}

void reset_color() {
    cout << "\033[0m";
}
