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

// --- Custom String Utilities -------------------------------------------------
int ptr_len(const char* s) {
    int n = 0; while (*s++) n++; return n;
}

void ptr_copy(char* dst, const char* src, int max_len) {
    int i = 0;
    while (src[i] != '\0' && i < max_len - 1) { dst[i] = src[i]; i++; }
    dst[i] = '\0';
}

int ptr_cmp(const char* a, const char* b) {
    while (*a && *b && *a == *b) { a++; b++; }
    return (unsigned char)*a - (unsigned char)*b;
}

int ptr_atoi(const char* s) {
    int r = 0; bool neg = false;
    while (*s == ' ' || *s == '\t') s++;
    if (*s == '-') { neg = true; s++; }
    else if (*s == '+') s++;
    while (*s >= '0' && *s <= '9') { r = r * 10 + (*s - '0'); s++; }
    return neg ? -r : r;
}

float ptr_atof(const char* s) {
    while (*s == ' ' || *s == '\t') s++;
    float r = 0.0f; bool neg = false;
    if (*s == '-') { neg = true; s++; }
    while (*s >= '0' && *s <= '9') { r = r * 10 + (*s - '0'); s++; }
    if (*s == '.') {
        s++; float f = 0.1f;
        while (*s >= '0' && *s <= '9') { r += (*s - '0') * f; f *= 0.1f; s++; }
    }
    return neg ? -r : r;
}

// --- Leaderboard I/O ---------------------------------------------------------
int load_leaderboard(PlayerSession* entries, int max_entries) {
    ifstream fin("leaderboard_v2.txt");
    if (!fin.is_open()) return 0;
    int count = 0;
    char line[256];
    while (count < max_entries && fin.getline(line, 256)) {
        if (line[0] == '\0') continue;
        char* p = line;
        
        // username
        char* fs = p; while (*p && *p != ',') p++;
        int flen = (int)(p - fs); if (flen >= MAX_NAME) flen = MAX_NAME - 1;
        int j = 0; while (j < flen) { entries[count].username[j] = fs[j]; j++; }
        entries[count].username[j] = '\0';
        if (*p == ',') p++;
        
        // gross_wpm
        fs = p; while (*p && *p != ',') p++; *p = '\0'; entries[count].gross_wpm = ptr_atoi(fs); p++;
        
        // net_wpm
        fs = p; while (*p && *p != ',') p++; *p = '\0'; entries[count].net_wpm = ptr_atoi(fs); p++;
        
        // accuracy
        fs = p; while (*p && *p != ',') p++; *p = '\0'; entries[count].accuracy = ptr_atof(fs); p++;
        
        // time_taken
        fs = p; while (*p && *p != ',') p++; *p = '\0'; entries[count].time_taken = ptr_atof(fs); p++;
        
        // mistakes
        entries[count].mistakes = ptr_atoi(p);
        count++;
    }
    fin.close();
    return count;
}

void save_leaderboard(const PlayerSession* entries, int count) {
    ofstream fout("leaderboard_v2.txt");
    if (!fout.is_open()) { cout << "[Warning] Could not write leaderboard_v2.txt\n"; return; }
    for (int i = 0; i < count; i++) {
        fout << entries[i].username << ','
             << entries[i].gross_wpm << ','
             << entries[i].net_wpm << ','
             << entries[i].accuracy << ','
             << entries[i].time_taken << ','
             << entries[i].mistakes << '\n';
    }
    fout.close();
}

void sort_leaderboard(PlayerSession* entries, int count) {
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - 1 - i; j++) {
            if (entries[j].net_wpm < entries[j + 1].net_wpm) {
                PlayerSession tmp = entries[j];
                entries[j] = entries[j + 1];
                entries[j + 1] = tmp;
            }
        }
    }
}

int personal_best(const PlayerSession* entries, int count, const char* username) {
    int best = -1;
    for (int i = 0; i < count; i++) {
        if (ptr_cmp(entries[i].username, username) == 0 && entries[i].net_wpm > best) {
            best = entries[i].net_wpm;
        }
    }
    return best;
}
