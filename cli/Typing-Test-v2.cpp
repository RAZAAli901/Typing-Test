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

// --- Live Typing Engine ------------------------------------------------------
PlayerSession run_game(const char* username, int mode_idx) {
    clear_screen();
    draw_banner();

    const char* source = TEXT_ASSETS[mode_idx];
    int source_len = ptr_len(source);

    cout << "\n\n\n\n";

    set_color("\033[90m");
    cout << "  PROMPT:\n";
    cout << "  +-----------------------------------------------------------------+\n";
    
    int col = 0;
    cout << "  | ";
    for (int i = 0; i < source_len; i++) {
        cout << source[i];
        col++;
        if (col >= 64 && source[i] == ' ') {
            cout << "\n  | ";
            col = 0;
        }
    }
    cout << "\n  +-----------------------------------------------------------------+\n";
    reset_color();

    cout << "\n  Press any key to start typing...\n";
    _getch();

    cout << "\033[A\033[2K\r";
    cout << "  TYPE HERE:\n  > ";
    cout.flush();

    auto start_time = chrono::high_resolution_clock::now();

    int typed_count = 0;
    int mistakes = 0;
    int correct = 0;
    char typed_buf[MAX_TEXT_LEN];
    for (int i = 0; i < MAX_TEXT_LEN; i++) typed_buf[i] = '\0';

    auto last_stat_update = chrono::high_resolution_clock::now();

    while (typed_count < source_len) {
        auto now = chrono::high_resolution_clock::now();
        float elapsed = chrono::duration<float>(now - start_time).count();
        if (chrono::duration_cast<chrono::milliseconds>(now - last_stat_update).count() > 200) {
            draw_stats(elapsed, typed_count, mistakes, correct);
            last_stat_update = now;
        }

        if (_kbhit()) {
            int ch = _getch();

            if (ch == 27) {
                PlayerSession empty_session = { "", 0, 0, 0.0f, 0.0f, 0 };
                return empty_session;
            }

            if (ch == 8) {
                if (typed_count > 0) {
                    typed_count--;
                    cout << "\b \b";
                    cout.flush();
                    if (typed_buf[typed_count] == source[typed_count]) {
                        correct--;
                    }
                }
                continue;
            }

            if (ch >= 32 && ch <= 126) {
                typed_buf[typed_count] = (char)ch;
                
                if (ch == source[typed_count]) {
                    set_color("\033[32m");
                    cout << (char)ch;
                    correct++;
                } else {
                    set_color("\033[41;37m");
                    cout << (char)ch;
                    mistakes++;
                }
                reset_color();
                cout.flush();
                typed_count++;
            }
        }
        
        Sleep(5);
    }

    auto end_time = chrono::high_resolution_clock::now();
    float total_seconds = chrono::duration<float>(end_time - start_time).count();
    if (total_seconds < 0.1f) total_seconds = 0.1f;

    draw_stats(total_seconds, typed_count, mistakes, correct);

    float final_minutes = total_seconds / 60.0f;
    float gross_wpm = (typed_count / 5.0f) / final_minutes;
    float net_wpm = gross_wpm - (mistakes / final_minutes);
    if (net_wpm < 0.0f) net_wpm = 0.0f;

    float accuracy = typed_count > 0 ? ((float)correct / typed_count) * 100.0f : 100.0f;

    PlayerSession s;
    ptr_copy(s.username, username, MAX_NAME);
    s.gross_wpm = (int)gross_wpm;
    s.net_wpm = (int)net_wpm;
    s.accuracy = accuracy;
    s.time_taken = total_seconds;
    s.mistakes = mistakes;

    cout << "\n\n";
    set_color("\033[32m\033[1m");
    cout << "  ==================================\n";
    cout << "        SESSION RESULTS (v2.0)      \n";
    cout << "  ==================================\n\n";
    reset_color();
    printf("  Player    : %s\n", username);
    printf("  Mode      : %s\n", MODE_NAMES[mode_idx]);
    printf("  Time      : %.1fs\n", total_seconds);
    printf("  Gross WPM : %d\n", s.gross_wpm);
    printf("  Net WPM   : %d\n", s.net_wpm);
    printf("  Accuracy  : %.1f%%\n", s.accuracy);
    printf("  Mistakes  : %d\n", s.mistakes);
    printf("  Characters: %d\n\n", typed_count);

    return s;
}

// --- Main Loop ---------------------------------------------------------------
int main() {
    enable_ansi();
    clear_screen();
    draw_banner();

    char username[MAX_NAME];
    cout << "  Enter your username (max 29 chars): ";
    cin.getline(username, MAX_NAME);

    char* p = username;
    while (*p) { if (*p == ',') *p = '_'; p++; }
    if (ptr_len(username) == 0) ptr_copy(username, "Anonymous", MAX_NAME);

    while (true) {
        clear_screen();
        draw_banner();
        cout << "  Welcome, " << username << "\n\n";

        set_color("\033[36m");
        cout << "  +-----------------------------+\n";
        cout << "  |      SELECT A MODE (v2.0)   |\n";
        cout << "  +-----------------------------+\n";
        reset_color();
        cout << "  |  1. Standard                |\n";
        cout << "  |  2. Numbers                 |\n";
        cout << "  |  3. Quotes                  |\n";
        cout << "  |  4. View Leaderboard        |\n";
        cout << "  |  5. Quit                    |\n";
        set_color("\033[36m");
        cout << "  +-----------------------------+\n";
        reset_color();
        cout << "  Choice: ";

        char choice_buf[10];
        cin.getline(choice_buf, 10);
        int choice = ptr_atoi(choice_buf);

        if (choice == 5) {
            cout << "\n  Thanks for playing Live Typing Test CLI. Goodbye!\n\n";
            break;
        }

        if (choice == 4) {
            PlayerSession entries[MAX_ENTRIES];
            int count = load_leaderboard(entries, MAX_ENTRIES);
            sort_leaderboard(entries, count);
            if (count == 0) {
                cout << "\n  No scores yet. Play a game to appear on the board!\n";
            } else {
                display_leaderboard(entries, count, username);
                int pb = personal_best(entries, count, username);
                if (pb >= 0) {
                    cout << "\n  Your personal best Net WPM: " << pb << "\n";
                }
            }
            cout << "\n  Press ENTER to return to menu...";
            cin.ignore(1000, '\n');
            continue;
        }

        if (choice < 1 || choice > 3) {
            cout << "\n  Invalid choice. Press ENTER to try again.";
            cin.ignore(1000, '\n');
            continue;
        }

        PlayerSession session = run_game(username, choice - 1);
        if (ptr_len(session.username) == 0) {
            cout << "  Game aborted. Press ENTER to return to menu...";
            cin.ignore(1000, '\n');
            continue;
        }

        PlayerSession entries[MAX_ENTRIES];
        int count = load_leaderboard(entries, MAX_ENTRIES - 1);
        if (count < MAX_ENTRIES) entries[count++] = session;
        sort_leaderboard(entries, count);
        save_leaderboard(entries, count);

        int rank = -1;
        for (int i = 0; i < count; i++) {
            if (ptr_cmp(entries[i].username, username) == 0
                && entries[i].net_wpm    == session.net_wpm
                && entries[i].time_taken == session.time_taken) {
                rank = i + 1; break;
            }
        }

        display_leaderboard(entries, count, username);

        if (rank > 0) {
            cout << "\n  Your global rank: #" << rank << "\n";
        }
        int pb = personal_best(entries, count, username);
        if (pb >= 0) {
            cout << "  Personal best Net WPM: " << pb << "\n";
        }

        cout << "\n  Press ENTER to return to menu...";
        cin.ignore(1000, '\n');
    }

    return 0;
}
