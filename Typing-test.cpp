/*
 * TypeMaster CLI
 * A terminal-based typing speed and accuracy evaluator.
 * Constraints: no <string>/<cstring>/<string.h>, pointer-driven parsing,
 * raw char arrays, only <iostream>, <fstream>, <ctime>, <chrono> allowed.
 */

#include <iostream>
#include <fstream>
#include <chrono>
#include <ctime>

using namespace std;

// ─── Constants ───────────────────────────────────────────────────────────────
const int MAX_NAME      = 30;
const int MAX_WORDS     = 200;
const int MAX_WORD_LEN  = 15;
const int MAX_ENTRIES   = 500;       // leaderboard cap
const int PARA_LEN      = 3000;      // max chars per paragraph
const int INPUT_BUF     = 3200;      // input capture buffer

// ─── Data Structures ─────────────────────────────────────────────────────────
struct PlayerSession {
    char username[MAX_NAME];
    int  gross_wpm;
    int  net_wpm;
    float accuracy;
    int  time_mode;   // 30, 60, or 120
};

// ─── Text Assets (4 modes × ~200 words) ──────────────────────────────────────
// Each paragraph stored as a raw char array.
// Stored as separate arrays to keep initialisation readable.

const char STANDARD_TEXT[] =
    "The old clock on the wall ticked softly as the afternoon light faded "
    "across the wooden floor. Sarah sat at the desk and opened her notebook "
    "to a fresh page. She had been working on the same chapter for three weeks "
    "and still could not find the right ending. Outside the window the maple "
    "tree swayed in the breeze and a single red leaf broke free and spiralled "
    "down to the ground. She watched it fall and felt something shift inside "
    "her. Sometimes an ending was not a conclusion but simply a pause before "
    "the next beginning. She picked up her pen and wrote the first sentence "
    "that came to mind without stopping to judge it. The words arrived quickly "
    "after that as if they had been waiting behind a door she had forgotten to "
    "open. By the time the clock struck five she had filled four pages and the "
    "chapter was done. She closed the notebook gently and leaned back in her "
    "chair feeling lighter than she had in months. The maple tree stood still "
    "now and the last light of the day settled over everything like a quiet "
    "blessing. She made a cup of tea and sat by the window watching the sky "
    "turn from gold to violet to a deep and restful blue.";

const char PUNCTUATION_TEXT[] =
    "Every morning, without fail, Marcus crossed the bridge at six-thirty; "
    "rain, fog, or shine — it made no difference. He carried a battered "
    "leather satchel, stuffed with notebooks, pens, and a thermos of black "
    "coffee. \"Routine is freedom,\" he often said, half-laughing, half-serious. "
    "The river below was never the same twice: sometimes silver, sometimes "
    "dark as pewter, occasionally lit with pale, golden reflections. Pigeons "
    "clustered on the iron railings; a few pigeons scattered whenever a tram "
    "rattled past. Marcus did not rush — rushing, he believed, was a form of "
    "forgetting. He paused midway across, as always, rested his arms on the "
    "rail, and looked east toward the old mill. It had been empty for years; "
    "its windows were dark, its roof sagged slightly, yet it stood — stubborn, "
    "dignified, oddly beautiful. A cyclist swept by, bell chiming twice. "
    "Marcus straightened, adjusted his satchel strap, and walked on. The far "
    "bank smelled of wet stone and coffee from the bakery on the corner. "
    "Small pleasures, he thought; small, reliable pleasures are the scaffolding "
    "of a well-lived life. He pushed open the bakery door, and the warmth "
    "inside wrapped around him like an old, familiar coat.";

const char NUMBERS_TEXT[] =
    "The engineering report dated 2019-04-17 identified 3 critical faults in "
    "sector 7B. Ambient temperature had reached 42.6 degrees Celsius during "
    "the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. "
    "Component batch A-2204 showed a failure rate of 0.78%, well above the "
    "acceptable ceiling of 0.25%. Total runtime logged was 1,440 hours across "
    "60 test units, and 11 units failed before reaching the 500-hour mark. "
    "Budget allocation for Q3 was 1.2 million, yet actual expenditure hit "
    "1.47 million — a 22.5% overrun. Serial codes F-00812 through F-00819 "
    "were quarantined pending review. The next inspection window opens on "
    "2024-09-01 and must be completed within 14 days. Replacement parts carry "
    "part numbers 77-3310-A and 77-3311-B, each priced at 349.99 per unit "
    "with a minimum order quantity of 50. Lead time is 21 business days from "
    "the date of purchase order issuance. Voltage tolerance is rated at plus "
    "or minus 5%, spanning the range 95V to 105V at 60 Hz. The revised "
    "compliance standard ISO-9001:2015 requires re-certification every 3 years, "
    "and the current certificate expires on 2025-06-30. Data integrity checks "
    "must pass at a confidence level of 99.97% before sign-off.";

const char QUOTES_TEXT[] =
    "\"In the middle of every difficulty lies opportunity.\" — Albert Einstein. "
    "\"It does not matter how slowly you go as long as you do not stop.\" "
    "— Confucius. \"You have power over your mind, not outside events. "
    "Realize this, and you will find strength.\" — Marcus Aurelius. "
    "\"The only way to do great work is to love what you do.\" — Steve Jobs. "
    "\"Life is what happens when you are busy making other plans.\" "
    "— John Lennon. \"Spread love everywhere you go. Let no one ever come "
    "to you without leaving happier.\" — Mother Teresa. \"When you reach "
    "the end of your rope, tie a knot in it and hang on.\" — Franklin D. "
    "Roosevelt. \"Always remember that you are absolutely unique. Just like "
    "everyone else.\" — Margaret Mead. \"Do not go where the path may lead; "
    "go instead where there is no path and leave a trail.\" — Ralph Waldo "
    "Emerson. \"You will face many defeats in life, but never let yourself "
    "be defeated.\" — Maya Angelou. \"The greatest glory in living lies not "
    "in never falling, but in rising every time we fall.\" — Nelson Mandela.";

// Pointer array to paragraphs (indexed by mode 0-3)
const char* TEXT_ASSETS[4] = {
    STANDARD_TEXT,
    PUNCTUATION_TEXT,
    NUMBERS_TEXT,
    QUOTES_TEXT
};

const char* MODE_NAMES[4] = {
    "Standard",
    "Punctuation",
    "Numbers",
    "Quotes"
};

// ─── Utility: pointer-based char length (no strlen) ──────────────────────────
int ptr_len(const char* s) {
    int n = 0;
    while (*s++) n++;
    return n;
}

// ─── Utility: pointer-based char copy (no strcpy) ────────────────────────────
void ptr_copy(char* dst, const char* src, int max_len) {
    int i = 0;
    while (src[i] != '\0' && i < max_len - 1) {
        dst[i] = src[i];
        i++;
    }
    dst[i] = '\0';
}

// ─── Utility: pointer-based char compare (no strcmp) ─────────────────────────
// Returns 0 if equal, non-zero otherwise
int ptr_cmp(const char* a, const char* b) {
    while (*a && *b && *a == *b) { a++; b++; }
    return (unsigned char)*a - (unsigned char)*b;
}

// ─── Utility: convert int to char buffer ─────────────────────────────────────
void int_to_buf(int val, char* buf, int buf_size) {
    if (buf_size < 2) return;
    if (val == 0) { buf[0] = '0'; buf[1] = '\0'; return; }
    bool neg = (val < 0);
    if (neg) val = -val;
    char tmp[20];
    int i = 0;
    while (val > 0 && i < 19) { tmp[i++] = '0' + (val % 10); val /= 10; }
    if (neg && i < 19) tmp[i++] = '-';
    int j = 0;
    while (i > 0 && j < buf_size - 1) buf[j++] = tmp[--i];
    buf[j] = '\0';
}

// ─── Utility: parse int from char* (no atoi/strtol) ─────────────────────────
int ptr_atoi(const char* s) {
    int result = 0;
    bool neg = false;
    while (*s == ' ' || *s == '\t') s++;
    if (*s == '-') { neg = true; s++; }
    else if (*s == '+') { s++; }
    while (*s >= '0' && *s <= '9') {
        result = result * 10 + (*s - '0');
        s++;
    }
    return neg ? -result : result;
}

// ─── Utility: parse float from char* ─────────────────────────────────────────
float ptr_atof(const char* s) {
    while (*s == ' ' || *s == '\t') s++;
    float result = 0.0f;
    bool neg = false;
    if (*s == '-') { neg = true; s++; }
    while (*s >= '0' && *s <= '9') { result = result * 10 + (*s - '0'); s++; }
    if (*s == '.') {
        s++;
        float frac = 0.1f;
        while (*s >= '0' && *s <= '9') { result += (*s - '0') * frac; frac *= 0.1f; s++; }
    }
    return neg ? -result : result;
}

// ─── Utility: write float to buffer (2 decimal places) ───────────────────────
void float_to_buf(float val, char* buf, int buf_size) {
    int whole = (int)val;
    int frac  = (int)((val - whole) * 100 + 0.5f);
    if (frac >= 100) { whole++; frac -= 100; }
    char tmp[30];
    int_to_buf(whole, tmp, 20);
    int i = 0;
    while (tmp[i] && i < buf_size - 5) { buf[i] = tmp[i]; i++; }
    buf[i++] = '.';
    buf[i++] = '0' + (frac / 10);
    buf[i++] = '0' + (frac % 10);
    buf[i]   = '\0';
}

// ─── Metrics Evaluator ───────────────────────────────────────────────────────
void evaluate_input(
    const char* source,
    const char* input,
    int&        correct_chars,
    int&        total_typed,
    int&        uncorrected_errors
) {
    const char* src = source;
    const char* inp = input;
    correct_chars      = 0;
    total_typed        = 0;
    uncorrected_errors = 0;

    while (*inp != '\0') {
        if (*inp == *src) {
            correct_chars++;
        } else {
            uncorrected_errors++;
        }
        inp++;
        if (*src != '\0') src++;
        total_typed++;
    }
}

// ─── Leaderboard File Parser ──────────────────────────────────────────────────
// File format per line (CSV):
//   username,gross_wpm,net_wpm,accuracy,time_mode
// Returns number of entries parsed.
int load_leaderboard(PlayerSession* entries, int max_entries) {
    ifstream fin("leaderboard.txt");
    if (!fin.is_open()) return 0;

    int count = 0;
    char line[256];

    while (count < max_entries && fin.getline(line, 256)) {
        if (line[0] == '\0') continue;

        char* p = line;
        // --- username ---
        char* field_start = p;
        while (*p && *p != ',') p++;
        int flen = (int)(p - field_start);
        if (flen >= MAX_NAME) flen = MAX_NAME - 1;
        int j = 0;
        while (j < flen) { entries[count].username[j] = field_start[j]; j++; }
        entries[count].username[j] = '\0';
        if (*p == ',') p++;

        // --- gross_wpm ---
        field_start = p;
        while (*p && *p != ',') p++;
        *p = '\0'; // temporarily null-terminate for ptr_atoi
        entries[count].gross_wpm = ptr_atoi(field_start);
        p++;

        // --- net_wpm ---
        field_start = p;
        while (*p && *p != ',') p++;
        *p = '\0';
        entries[count].net_wpm = ptr_atoi(field_start);
        p++;

        // --- accuracy ---
        field_start = p;
        while (*p && *p != ',') p++;
        *p = '\0';
        entries[count].accuracy = ptr_atof(field_start);
        p++;

        // --- time_mode ---
        entries[count].time_mode = ptr_atoi(p);

        count++;
    }
    fin.close();
    return count;
}

// ─── Write Leaderboard ────────────────────────────────────────────────────────
void save_leaderboard(const PlayerSession* entries, int count) {
    ofstream fout("leaderboard.txt");
    if (!fout.is_open()) {
        cout << "[Warning] Could not write leaderboard.txt\n";
        return;
    }
    char buf[50];
    for (int i = 0; i < count; i++) {
        fout << entries[i].username << ',';
        int_to_buf(entries[i].gross_wpm, buf, 20); fout << buf << ',';
        int_to_buf(entries[i].net_wpm,   buf, 20); fout << buf << ',';
        float_to_buf(entries[i].accuracy, buf, 20); fout << buf << ',';
        int_to_buf(entries[i].time_mode, buf, 20); fout << buf << '\n';
    }
    fout.close();
}

// ─── Bubble Sort descending by net_wpm ───────────────────────────────────────
void sort_leaderboard(PlayerSession* entries, int count) {
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - 1 - i; j++) {
            if (entries[j].net_wpm < entries[j + 1].net_wpm) {
                // swap via pointer trick
                PlayerSession* a = &entries[j];
                PlayerSession* b = &entries[j + 1];
                PlayerSession  tmp = *a;
                *a = *b;
                *b = tmp;
            }
        }
    }
}

// ─── Find personal best net_wpm for username ─────────────────────────────────
int personal_best(const PlayerSession* entries, int count, const char* username) {
    int best = -1;
    for (int i = 0; i < count; i++) {
        if (ptr_cmp(entries[i].username, username) == 0) {
            if (entries[i].net_wpm > best) best = entries[i].net_wpm;
        }
    }
    return best;
}

// ─── Display Top-10 Leaderboard ───────────────────────────────────────────────
void display_leaderboard(const PlayerSession* entries, int count, const char* highlight) {
    cout << "\n";
    cout << "  ╔══════════════════════════════════════════════════════════╗\n";
    cout << "  ║              🏆  GLOBAL LEADERBOARD  🏆                  ║\n";
    cout << "  ╠══════╦══════════════════════╦══════╦════════╦══════════╣\n";
    cout << "  ║ Rank ║ Username             ║ NWPM ║   Acc  ║ Time     ║\n";
    cout << "  ╠══════╬══════════════════════╬══════╬════════╬══════════╣\n";

    int top = count < 10 ? count : 10;
    for (int i = 0; i < top; i++) {
        bool is_current = (ptr_cmp(entries[i].username, highlight) == 0);
        char rank_buf[10];
        int_to_buf(i + 1, rank_buf, 10);
        char wpm_buf[10];
        int_to_buf(entries[i].net_wpm, wpm_buf, 10);
        char acc_buf[12];
        float_to_buf(entries[i].accuracy, acc_buf, 12);
        char time_buf[10];
        int_to_buf(entries[i].time_mode, time_buf, 10);

        // pad username to 20 chars
        char uname[22];
        int ul = ptr_len(entries[i].username);
        if (ul > 20) ul = 20;
        int k = 0;
        while (k < ul) { uname[k] = entries[i].username[k]; k++; }
        while (k < 20) { uname[k++] = ' '; }
        uname[20] = '\0';

        if (is_current) cout << "  ║";
        else            cout << "  ║";

        // rank (4 chars)
        cout << "  " << (i < 9 ? " " : "") << rank_buf << "  ║ ";
        cout << uname << " ║ ";
        // wpm (4 chars right-aligned)
        int wl = ptr_len(wpm_buf);
        while (wl++ < 4) cout << ' ';
        cout << wpm_buf << " ║ ";
        // acc (6 chars)
        int al = ptr_len(acc_buf);
        while (al++ < 6) cout << ' ';
        cout << acc_buf << " ║ ";
        // time
        cout << time_buf << "s      ║";

        if (is_current) cout << " ◄ YOU";
        cout << "\n";
    }
    cout << "  ╚══════╩══════════════════════╩══════╩════════╩══════════╝\n";
}

// ─── Clear terminal (portable-ish) ───────────────────────────────────────────
void clear_screen() {
    // ANSI escape — works on Linux, macOS, Windows Terminal
    cout << "\033[2J\033[H";
}

// ─── Draw ASCII banner ────────────────────────────────────────────────────────
void draw_banner() {
    cout << "\033[1;36m"; // bold cyan
    cout << R"(
  ████████╗██╗   ██╗██████╗ ███████╗███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗
     ██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
     ██║    ╚████╔╝ ██████╔╝█████╗  ██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝
     ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
     ██║      ██║   ██║     ███████╗██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║
     ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                   C L I   —   v 1.0
)" << "\033[0m\n";
}

// ─── Print coloured paragraph preview (first 200 chars) ──────────────────────
void preview_text(const char* text) {
    cout << "\033[0;37m  ┌─────────────────────────────────────────────────────────────────┐\n  │ ";
    int i = 0;
    while (text[i] != '\0' && i < 200) {
        cout << text[i];
        i++;
    }
    if (text[i] != '\0') cout << "...";
    cout << "\n  └─────────────────────────────────────────────────────────────────┘\033[0m\n";
}

// ─── Countdown display ────────────────────────────────────────────────────────
void countdown(int secs) {
    for (int i = secs; i >= 1; i--) {
        cout << "\r  \033[1;33mStarting in " << i << "...\033[0m  " << flush;
        // busy-wait 1 second
        auto t0 = chrono::steady_clock::now();
        while (chrono::duration_cast<chrono::seconds>(
            chrono::steady_clock::now() - t0).count() < 1) {}
    }
    cout << "\r  \033[1;32mGO! Start typing now.          \033[0m\n\n";
}

// ─── Main Game Loop ───────────────────────────────────────────────────────────
PlayerSession run_game(const char* username, int mode_idx, int time_limit) {
    clear_screen();
    const char* source = TEXT_ASSETS[mode_idx];

    cout << "\033[1;35m\n  ══ " << MODE_NAMES[mode_idx] << " Mode │ "
              << time_limit << "s ══\033[0m\n\n";
    cout << "  Type the following text as accurately and quickly as you can.\n"
              << "  When time is up, press ENTER to submit.\n\n";
    preview_text(source);
    cout << "\n  Press ENTER when you are ready...\n";

    // Flush any lingering input then wait for ENTER
    cin.ignore(1000, '\n');

    countdown(3);

    cout << "  \033[1;37m▶  ";

    // ── Record start time ────
    auto start = chrono::steady_clock::now();

    // ── Capture input ────────
    // We use a fixed-size raw char buffer; cin.getline does the heavy lifting.
    char input_buf[INPUT_BUF];
    for (int i = 0; i < INPUT_BUF; i++) input_buf[i] = '\0';

    cin.getline(input_buf, INPUT_BUF);

    // ── Record end time ──────
    auto end = chrono::steady_clock::now();
    float elapsed_seconds = chrono::duration<float>(end - start).count();
    if (elapsed_seconds < 0.1f) elapsed_seconds = 0.1f; // guard against divide-by-zero

    // Clamp elapsed to time_limit
    if (elapsed_seconds > (float)time_limit) elapsed_seconds = (float)time_limit;

    float elapsed_minutes = elapsed_seconds / 60.0f;

    // ── Evaluate ─────────────
    int correct_chars = 0, total_typed = 0, uncorrected_errors = 0;
    evaluate_input(source, input_buf, correct_chars, total_typed, uncorrected_errors);

    // ── Metrics ──────────────
    float gross_wpm_f = (total_typed / 5.0f) / elapsed_minutes;
    float error_rate  = uncorrected_errors / elapsed_minutes;
    float net_wpm_f   = gross_wpm_f - error_rate;
    if (net_wpm_f < 0.0f) net_wpm_f = 0.0f;

    float accuracy = 0.0f;
    if (total_typed > 0)
        accuracy = ((float)correct_chars / (float)total_typed) * 100.0f;

    // ── Build session ─────────
    PlayerSession s;
    ptr_copy(s.username, username, MAX_NAME);
    s.gross_wpm = (int)gross_wpm_f;
    s.net_wpm   = (int)net_wpm_f;
    s.accuracy  = accuracy;
    s.time_mode = time_limit;

    // ── Display results ───────
    clear_screen();
    char buf[30];
    cout << "\033[1;36m\n  ══════════════════════════════════\n";
    cout << "        SESSION RESULTS\n";
    cout << "  ══════════════════════════════════\033[0m\n\n";

    cout << "  Player    : \033[1;33m" << username << "\033[0m\n";
    cout << "  Mode      : " << MODE_NAMES[mode_idx] << " | " << time_limit << "s\n";

    float_to_buf(elapsed_seconds, buf, 30);
    cout << "  Time Used : " << buf << "s\n\n";

    int_to_buf(s.gross_wpm, buf, 20);
    cout << "  Gross WPM : \033[1;32m" << buf << "\033[0m\n";
    int_to_buf(s.net_wpm, buf, 20);
    cout << "  Net WPM   : \033[1;32m" << buf << "\033[0m\n";
    float_to_buf(s.accuracy, buf, 20);
    cout << "  Accuracy  : \033[1;32m" << buf << "%\033[0m\n";
    int_to_buf(uncorrected_errors, buf, 20);
    cout << "  Errors    : " << buf << "\n";
    int_to_buf(total_typed, buf, 20);
    cout << "  Chars     : " << buf << "\n\n";

    return s;
}

// ─── Main Menu ────────────────────────────────────────────────────────────────
int main() {
    clear_screen();
    draw_banner();

    // ── Username Entry ───────────────────────────────────────────────────────
    char username[MAX_NAME];
    cout << "  Enter your username (max 29 chars): ";
    cin.getline(username, MAX_NAME);

    // Sanitise: replace commas with underscores (CSV delimiter conflict)
    char* p = username;
    while (*p) {
        if (*p == ',') *p = '_';
        p++;
    }
    if (ptr_len(username) == 0) {
        ptr_copy(username, "Anonymous", MAX_NAME);
    }

    bool quit = false;
    while (!quit) {
        clear_screen();
        draw_banner();
        cout << "  Welcome, \033[1;33m" << username << "\033[0m\n\n";

        // ── Mode Selection ───────────────────────────────────────────────────
        cout << "  ┌─────────────────────────────────┐\n";
        cout << "  │   SELECT A MODE                 │\n";
        cout << "  ├─────────────────────────────────┤\n";
        cout << "  │  1. Standard  (a-z / A-Z only)  │\n";
        cout << "  │  2. Punctuation                 │\n";
        cout << "  │  3. Numbers                     │\n";
        cout << "  │  4. Quotes                      │\n";
        cout << "  │  5. View Leaderboard            │\n";
        cout << "  │  6. Quit                        │\n";
        cout << "  └─────────────────────────────────┘\n";
        cout << "  Choice: ";

        char choice_buf[10];
        cin.getline(choice_buf, 10);
        int choice = ptr_atoi(choice_buf);

        if (choice == 6) {
            cout << "\n  \033[1;36mThanks for playing TypeMaster CLI. Goodbye!\033[0m\n\n";
            break;
        }

        if (choice == 5) {
            // Show leaderboard only
            PlayerSession entries[MAX_ENTRIES];
            int count = load_leaderboard(entries, MAX_ENTRIES);
            sort_leaderboard(entries, count);

            if (count == 0) {
                cout << "\n  No scores yet. Play a game to appear on the board!\n";
            } else {
                display_leaderboard(entries, count, username);
                int pb = personal_best(entries, count, username);
                if (pb >= 0) {
                    char pb_buf[20];
                    int_to_buf(pb, pb_buf, 20);
                    cout << "\n  Your personal best Net WPM: \033[1;33m" << pb_buf << "\033[0m\n";
                }
            }
            cout << "\n  Press ENTER to return to menu...";
            cin.ignore(1000, '\n');
            continue;
        }

        if (choice < 1 || choice > 4) {
            cout << "\n  Invalid choice. Press ENTER to try again.";
            cin.ignore(1000, '\n');
            continue;
        }

        int mode_idx = choice - 1;

        // ── Time Selection ───────────────────────────────────────────────────
        clear_screen();
        cout << "\n  \033[1;35m── TIME LIMIT ──\033[0m\n\n";
        cout << "  1.  30 seconds  (Sprint)\n";
        cout << "  2.  60 seconds  (Standard Blitz)\n";
        cout << "  3. 120 seconds  (Endurance)\n\n";
        cout << "  Choice: ";

        char time_buf[10];
        cin.getline(time_buf, 10);
        int tc = ptr_atoi(time_buf);

        int time_limits[3] = {30, 60, 120};
        if (tc < 1 || tc > 3) {
            cout << "\n  Invalid choice. Press ENTER to return to menu.";
            cin.ignore(1000, '\n');
            continue;
        }
        int time_limit = time_limits[tc - 1];

        // ── Run Game ─────────────────────────────────────────────────────────
        PlayerSession session = run_game(username, mode_idx, time_limit);

        // ── Persist & Rank ────────────────────────────────────────────────────
        PlayerSession entries[MAX_ENTRIES];
        int count = load_leaderboard(entries, MAX_ENTRIES - 1);

        // Append new session
        if (count < MAX_ENTRIES) {
            entries[count++] = session;
        }

        sort_leaderboard(entries, count);
        save_leaderboard(entries, count);

        // Find rank of current session (first occurrence of username at this score)
        int rank = -1;
        for (int i = 0; i < count; i++) {
            if (ptr_cmp(entries[i].username, username) == 0
                && entries[i].net_wpm == session.net_wpm
                && entries[i].time_mode == session.time_mode) {
                rank = i + 1;
                break;
            }
        }

        display_leaderboard(entries, count, username);

        char rank_buf[20];
        if (rank > 0) {
            int_to_buf(rank, rank_buf, 20);
            cout << "\n  \033[1;33mYour global rank: #" << rank_buf << "\033[0m\n";
        }

        int pb = personal_best(entries, count, username);
        if (pb >= 0) {
            int_to_buf(pb, rank_buf, 20);
            cout << "  Personal best Net WPM: \033[1;33m" << rank_buf << "\033[0m\n";
        }

        cout << "\n  Press ENTER to return to menu...";
        cin.ignore(1000, '\n');
    }

    return 0;
}
