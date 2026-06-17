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

// --- Text Assets -------------------------------------------------------------
const char STANDARD_TEXT[] =
    "The old clock on the wall ticked softly as the afternoon light faded "
    "across the wooden floor. Sarah sat at the desk and opened her notebook "
    "to a fresh page. She had been working on the same chapter for three weeks "
    "and still could not find the right ending. Outside the window the maple "
    "tree swayed in the breeze and a single red leaf broke free and spiralled "
    "down to the ground. She watched it fall and felt something shift inside "
    "her. Sometimes an ending was not a conclusion but simply a pause before "
    "the next beginning.";

const char NUMBERS_TEXT[] =
    "The engineering report dated 2019-04-17 identified 3 critical faults in "
    "sector 7B. Ambient temperature had reached 42.6 degrees Celsius during "
    "the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. "
    "Component batch A-2204 showed a failure rate of 0.78%, well above the "
    "acceptable ceiling of 0.25%. Total runtime logged was 1440 hours across "
    "60 test units, and 11 units failed before reaching the 500-hour mark.";

const char QUOTES_TEXT[] =
    "In the middle of every difficulty lies opportunity said Albert Einstein. "
    "It does not matter how slowly you go as long as you do not stop said "
    "Confucius. You have power over your mind not outside events realize this "
    "and you will find strength said Marcus Aurelius. The only way to do great "
    "work is to love what you do said Steve Jobs. Life is what happens when "
    "you are busy making other plans said John Lennon.";

const char* TEXT_ASSETS[3] = { STANDARD_TEXT, NUMBERS_TEXT, QUOTES_TEXT };
const char* MODE_NAMES[3]  = { "Standard", "Numbers", "Quotes" };

// --- Visual Elements ---------------------------------------------------------
void draw_banner() {
    set_color("\033[36m"); // Cyan
    cout << "  ===================================================================\n";
    cout << "  *       __    _            _____                 _  _   ___       *\n";
    cout << "  *      / /   (_)__  __ ___|_   _|__  ___  ___  _| |/ | / _ \\      *\n";
    cout << "  *     / /__ / / _ \\/ // / -_) | |/ -_)(_-</ _ \\(_     || (_) |     *\n";
    cout << "  *    /____//_/[_  /\\_,_/\\___| |_|\\___//___/ .__//_/|_| \\___/      *\n";
    cout << "  *             [___/                       |_|                     *\n";
    cout << "  *                     L I V E   C L I  -  v 2.0                   *\n";
    cout << "  ===================================================================\n";
    reset_color();
    cout << "\n";
}

void draw_stats(float elapsed, int typed, int mistakes, int correct) {
    float minutes = elapsed > 0 ? (elapsed / 60.0f) : 0.0167f;
    float gross_wpm = (typed / 5.0f) / minutes;
    float net_wpm = gross_wpm - (mistakes / minutes);
    if (net_wpm < 0.0f) net_wpm = 0.0f;
    float accuracy = typed > 0 ? ((float)correct / typed) * 100.0f : 100.0f;

    cout << "\033[s"; // Save cursor position
    cout << "\033[5;1H"; // Move cursor to Row 5, Column 1 (below banner)
    
    set_color("\033[33m"); // Yellow
    cout << "  +-----------------------------------------------------------------+\n";
    printf("  | Time: %5.1fs  |  WPM: %3.0f  |  Accuracy: %5.1f%%  |  Mistakes: %2d  |\n", 
           elapsed, net_wpm, accuracy, mistakes);
    cout << "  +-----------------------------------------------------------------+\n";
    reset_color();
    
    cout << "\033[u"; // Restore cursor position
    cout.flush();
}

void display_leaderboard(const PlayerSession* entries, int count, const char* highlight) {
    cout << "\n";
    set_color("\033[36m");
    cout << "  +------+----------------------+------+--------+----------+----------+\n";
    cout << "  |                     *** GLOBAL LEADERBOARD ***                    |\n";
    cout << "  +------+----------------------+------+--------+----------+----------+\n";
    cout << "  | Rank | Username             | NWPM |  Acc   | Time (s) | Mistakes |\n";
    cout << "  +------+----------------------+------+--------+----------+----------+\n";
    reset_color();

    int top = count < 10 ? count : 10;
    for (int i = 0; i < top; i++) {
        bool me = (ptr_cmp(entries[i].username, highlight) == 0);
        if (me) {
            set_color("\033[32m\033[1m"); // Bold Green
        }
        
        char rank_str[10]; sprintf(rank_str, "#%d", i + 1);
        char uname[22];
        ptr_copy(uname, entries[i].username, 21);
        int spaces = 20 - ptr_len(uname);
        
        printf("  | %-4s | %s", rank_str, uname);
        for (int s = 0; s < spaces; s++) cout << " ";
        printf(" | %4d | %5.1f%% | %8.1fs | %8d |", 
               entries[i].net_wpm, entries[i].accuracy, entries[i].time_taken, entries[i].mistakes);
        
        if (me) {
            cout << " << YOU";
            reset_color();
        }
        cout << "\n";
    }
    set_color("\033[36m");
    cout << "  +------+----------------------+------+--------+----------+----------+\n";
    reset_color();
}
