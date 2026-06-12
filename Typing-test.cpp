/*
 * TypeMaster CLI
 * A terminal-based typing speed and accuracy evaluator.
 * Constraints: no <string>/<cstring>/<string.h>/<chrono>/<ctime>,
 * pointer-driven parsing, raw char arrays,
 * only <iostream> and <fstream> allowed.
 */

#include <iostream>
#include <fstream>

using namespace std;

// --- Constants ---------------------------------------------------------------
const int MAX_NAME      = 30;
const int MAX_ENTRIES   = 500;
const int INPUT_BUF     = 3200;

// --- Data Structures ---------------------------------------------------------
struct PlayerSession {
    char  username[MAX_NAME];
    int   gross_wpm;
    int   net_wpm;
    float accuracy;
    int   time_taken;   // seconds entered by user
};



// --- Text Assets (3 modes) ---------------------------------------------------
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

const char NUMBERS_TEXT[] =
    "The engineering report dated 2019-04-17 identified 3 critical faults in "
    "Sector 7 B. Ambient temperature had reached 42.6 degrees Celsius during "
    "the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. "
    "Component batch A-2204 showed a failure rate of 0.78%, well above the."
    "acceptable ceiling of 0.25%. Total runtime logged was 1440 hours across."
    "60 test units, and 11 units failed before reaching the 500-hour mark. "
    "Budget allocation for Q3 was 1.2 million, yet actual expenditure hit "
    "1.47 million, a 22.5% overrun. Serial codes F-00812 through F-00819 "
    "were quarantined pending review. The next inspection window opens on "
    "2024-09-01 and must be completed within 14 days. Replacement parts carry."
    "part numbers 77-3310-A and 77-3311-B, each priced at 349.99 per unit "
    "with a minimum order quantity of 50. Lead time is 21 business days from "
    "the date of purchase order issuance. Voltage tolerance is rated at plus "
    "or minus 5%, spanning the range 95V to 105V at 60 Hz. The revised "
    "compliance standard ISO-9001:2015 requires re-certification every 3 years "
    "and the current certificate expires on 2025-06-30.";

const char QUOTES_TEXT[] =
    "In the middle of every difficulty lies opportunity said Albert Einstein. "
    "It does not matter how slowly you go as long as you do not stop said "
    "Confucius. You have power over your mind not outside events realize this "
    "and you will find strength said Marcus Aurelius. The only way to do great "
    "work is to love what you do said Steve Jobs. Life is what happens when "
    "you are busy making other plans said John Lennon. Spread love everywhere "
    "you go and let no one ever come to you without leaving happier said Mother "
    "Teresa. When you reach the end of your rope tie a knot in it and hang on "
    "said Franklin D Roosevelt. Always remember that you are absolutely unique "
    "just like everyone else said Margaret Mead. Do not go where the path may "
    "lead go instead where there is no path and leave a trail said Ralph Waldo "
    "Emerson. You will face many defeats in life but never let yourself be "
    "defeated said Maya Angelou. The greatest glory in living lies not in never "
    "falling but in rising every time we fall said Nelson Mandela.";

const char* TEXT_ASSETS[3] = {
    STANDARD_TEXT,
    NUMBERS_TEXT,
    QUOTES_TEXT
};

const char* MODE_NAMES[3] = {
    "Standard",
    "Numbers",
    "Quotes"
};

// --- ANSI color helpers ------------------------------------------------------
const char* CYN = "\033[1;36m";
const char* YLW = "\033[1;33m";
const char* GRN = "\033[1;32m";
const char* MAG = "\033[1;35m";
const char* WHT = "\033[1;37m";
const char* RST = "\033[0m";

// --- Utilities ---------------------------------------------------------------
int ptr_len(const char* s) {
    int n = 0;
    while (*s++) n++;
    return n;
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

void int_to_buf(int val, char* buf, int buf_size) {
    if (buf_size < 2) return;
    if (val == 0) { buf[0] = '0'; buf[1] = '\0'; return; }
    bool neg = (val < 0);
    if (neg) val = -val;
    char tmp[20]; int i = 0;
    while (val > 0 && i < 19) { tmp[i++] = '0' + (val % 10); val /= 10; }
    if (neg && i < 19) tmp[i++] = '-';
    int j = 0;
    while (i > 0 && j < buf_size - 1) buf[j++] = tmp[--i];
    buf[j] = '\0';
}

int ptr_atoi(const char* s) {
    int result = 0; bool neg = false;
    while (*s == ' ' || *s == '\t') s++;
    if (*s == '-') { neg = true; s++; } else if (*s == '+') s++;
    while (*s >= '0' && *s <= '9') { result = result * 10 + (*s - '0'); s++; }
    return neg ? -result : result;
}

float ptr_atof(const char* s) {
    while (*s == ' ' || *s == '\t') s++;
    float result = 0.0f; bool neg = false;
    if (*s == '-') { neg = true; s++; }
    while (*s >= '0' && *s <= '9') { result = result * 10 + (*s - '0'); s++; }
    if (*s == '.') {
        s++; float frac = 0.1f;
        while (*s >= '0' && *s <= '9') { result += (*s - '0') * frac; frac *= 0.1f; s++; }
    }
    return neg ? -result : result;
}

void float_to_buf(float val, char* buf, int buf_size) {
    int whole = (int)val;
    int frac  = (int)((val - whole) * 100 + 0.5f);
    if (frac >= 100) { whole++; frac -= 100; }
    char tmp[30]; int_to_buf(whole, tmp, 20);
    int i = 0;
    while (tmp[i] && i < buf_size - 5) { buf[i] = tmp[i]; i++; }
    buf[i++] = '.';
    buf[i++] = '0' + (frac / 10);
    buf[i++] = '0' + (frac % 10);
    buf[i]   = '\0';
}

// --- Metrics -----------------------------------------------------------------
void evaluate_input(
    const char* source, const char* input,
    int& correct_chars, int& total_typed, int& uncorrected_errors
) {
    const char* src = source;
    const char* inp = input;
    correct_chars = total_typed = uncorrected_errors = 0;
    while (*inp != '\0') {
        if (*inp == *src) correct_chars++;
        else              uncorrected_errors++;
        inp++;
        if (*src != '\0') src++;
        total_typed++;
    }
}

// --- Leaderboard I/O ---------------------------------------------------------
int load_leaderboard(PlayerSession* entries, int max_entries) {
    ifstream fin("leaderboard.txt");
    if (!fin.is_open()) return 0;
    int count = 0;
    char line[256];
    while (count < max_entries && fin.getline(line, 256)) {
        if (line[0] == '\0') continue;
        char* p = line;
        // username
        char* fs = p;
        while (*p && *p != ',') p++;
        int flen = (int)(p - fs); if (flen >= MAX_NAME) flen = MAX_NAME - 1;
        int j = 0;
        while (j < flen) { entries[count].username[j] = fs[j]; j++; }
        entries[count].username[j] = '\0';
        if (*p == ',') p++;
        // gross_wpm
        fs = p; while (*p && *p != ',') p++; *p = '\0';
        entries[count].gross_wpm = ptr_atoi(fs); p++;
        // net_wpm
        fs = p; while (*p && *p != ',') p++; *p = '\0';
        entries[count].net_wpm = ptr_atoi(fs); p++;
        // accuracy
        fs = p; while (*p && *p != ',') p++; *p = '\0';
        entries[count].accuracy = ptr_atof(fs); p++;
        // time_taken
        entries[count].time_taken = ptr_atoi(p);
        count++;
    }
    fin.close();
    return count;
}

void save_leaderboard(const PlayerSession* entries, int count) {
    ofstream fout("leaderboard.txt");
    if (!fout.is_open()) { cout << "[Warning] Could not write leaderboard.txt\n"; return; }
    char buf[50];
    for (int i = 0; i < count; i++) {
        fout << entries[i].username << ',';
        int_to_buf(entries[i].gross_wpm,  buf, 20); fout << buf << ',';
        int_to_buf(entries[i].net_wpm,    buf, 20); fout << buf << ',';
        float_to_buf(entries[i].accuracy, buf, 20); fout << buf << ',';
        int_to_buf(entries[i].time_taken, buf, 20); fout << buf << '\n';
    }
    fout.close();
}

void sort_leaderboard(PlayerSession* entries, int count) {
    for (int i = 0; i < count - 1; i++)
        for (int j = 0; j < count - 1 - i; j++)
            if (entries[j].net_wpm < entries[j+1].net_wpm) {
                PlayerSession tmp = entries[j];
                entries[j] = entries[j+1];
                entries[j+1] = tmp;
            }
}

int personal_best(const PlayerSession* entries, int count, const char* username) {
    int best = -1;
    for (int i = 0; i < count; i++)
        if (ptr_cmp(entries[i].username, username) == 0 && entries[i].net_wpm > best)
            best = entries[i].net_wpm;
    return best;
}

// --- Display -----------------------------------------------------------------
void display_leaderboard(const PlayerSession* entries, int count, const char* highlight) {
    cout << "\n";
    cout << CYN << "  +------+----------------------+------+--------+----------+\n";
    cout <<        "  |           *** GLOBAL LEADERBOARD ***                   |\n";
    cout <<        "  +------+----------------------+------+--------+----------+\n";
    cout <<        "  | Rank | Username             | NWPM |  Acc   | Time (s) |\n";
    cout <<        "  +------+----------------------+------+--------+----------+" << RST << "\n";

    int top = count < 10 ? count : 10;
    for (int i = 0; i < top; i++) {
        bool me = (ptr_cmp(entries[i].username, highlight) == 0);
        char rank_buf[10]; int_to_buf(i+1, rank_buf, 10);
        char wpm_buf[10];  int_to_buf(entries[i].net_wpm, wpm_buf, 10);
        char acc_buf[12];  float_to_buf(entries[i].accuracy, acc_buf, 12);
        char time_buf[10]; int_to_buf(entries[i].time_taken, time_buf, 10);

        char uname[22];
        int ul = ptr_len(entries[i].username); if (ul > 20) ul = 20;
        int k = 0;
        while (k < ul) { uname[k] = entries[i].username[k]; k++; }
        while (k < 20) { uname[k++] = ' '; }
        uname[20] = '\0';

        if (me) cout << YLW;

        int sp = 4 - ptr_len(rank_buf);
        cout << "  |"; while (sp-- > 0) cout << ' '; cout << rank_buf << "  | ";
        cout << uname << " | ";
        sp = 4 - ptr_len(wpm_buf);  while (sp-- > 0) cout << ' '; cout << wpm_buf << " | ";
        sp = 6 - ptr_len(acc_buf);  while (sp-- > 0) cout << ' '; cout << acc_buf << " | ";
        sp = 8 - ptr_len(time_buf); while (sp-- > 0) cout << ' '; cout << time_buf << " |";

        if (me) cout << RST << " << YOU";
        else    cout << RST;
        cout << "\n";
    }
    cout << CYN << "  +------+----------------------+------+--------+----------+" << RST << "\n";
}

void clear_screen() { for (int i = 0; i < 50; i++) cout << "\n"; }

void draw_banner() {
    cout << CYN;
    cout << "\n";
    cout << "  +-------------------------------------------------------------+\n";
    cout << "  |                                                             |\n";
    cout << "  |  _____ _   _ ____  ___ __  __    _    ____ _____ _____ ____|\n";
    cout << "  | |_   _| | | |  _ \\| _ \\  \\/  |  / \\  / ___|_   _| ____|  _ \\ |\n";
    cout << "  |   | | | |_| | |_) |  __/ |\\/| | / _ \\ \\___ \\ | | |  _| | |_) ||\n";
    cout << "  |   | | |  _  |  __/| |  | |  | |/ ___ \\ ___) || | | |___|  _ < |\n";
    cout << "  |   |_| |_| |_|_|   |_|  |_|  |_/_/   \\_\\____/ |_| |_____|_| \\_\\|\n";
    cout << "  |                                                             |\n";
    cout << "  |                   C L I  --  v 1.0                         |\n";
    cout << "  |                                                             |\n";
    cout << "  +-------------------------------------------------------------+\n";
    cout << RST << "\n";
}

void preview_text(const char* text) {
    cout << "  +--------------------------------------------------------------------+\n  | ";
    int i = 0;
    while (text[i] != '\0' && i < 200) { cout << text[i]; i++; }
    if (text[i] != '\0') cout << "...";
    cout << "\n  +--------------------------------------------------------------------+\n";
}

// --- Game Loop ---------------------------------------------------------------
PlayerSession run_game(const char* username, int mode_idx) {
    clear_screen();
    const char* source = TEXT_ASSETS[mode_idx];

    cout << MAG << "\n  == " << MODE_NAMES[mode_idx] << " Mode ==" << RST << "\n\n";
    cout << "  Read the text below, then type it as fast and accurately as you can.\n";
    cout << "  When done, press ENTER, then enter how many seconds you took.\n\n";
    preview_text(source);
    cout << "\n  Press ENTER when you are ready to start...\n";
    cin.ignore(1000, '\n');

    cout << "\n" << WHT << "  > " << RST;

    char input_buf[INPUT_BUF];
    for (int i = 0; i < INPUT_BUF; i++) input_buf[i] = '\0';
    cin.getline(input_buf, INPUT_BUF);

    // Ask user how long they took
    cout << "\n  How many seconds did that take you? ";
    char time_buf[20];
    cin.getline(time_buf, 20);
    int elapsed_seconds = ptr_atoi(time_buf);
    if (elapsed_seconds < 1) elapsed_seconds = 1;

    float elapsed_minutes = elapsed_seconds / 60.0f;

    int correct_chars = 0, total_typed = 0, uncorrected_errors = 0;
    evaluate_input(source, input_buf, correct_chars, total_typed, uncorrected_errors);

    float gross_wpm_f = (total_typed / 5.0f) / elapsed_minutes;
    float error_rate  = uncorrected_errors / elapsed_minutes;
    float net_wpm_f   = gross_wpm_f - error_rate;
    if (net_wpm_f < 0.0f) net_wpm_f = 0.0f;

    float accuracy = 0.0f;
    if (total_typed > 0)
        accuracy = ((float)correct_chars / (float)total_typed) * 100.0f;

    PlayerSession s;
    ptr_copy(s.username, username, MAX_NAME);
    s.gross_wpm  = (int)gross_wpm_f;
    s.net_wpm    = (int)net_wpm_f;
    s.accuracy   = accuracy;
    s.time_taken = elapsed_seconds;

    // Display results
    clear_screen();
    char buf[30];
    cout << CYN << "\n  ==================================\n";
    cout <<        "         SESSION RESULTS\n";
    cout <<        "  ==================================" << RST << "\n\n";
    cout << "  Player    : " << YLW << username << RST << "\n";
    cout << "  Mode      : " << MODE_NAMES[mode_idx] << "\n";
    int_to_buf(elapsed_seconds, buf, 20);
    cout << "  Time      : " << buf << "s\n\n";
    int_to_buf(s.gross_wpm, buf, 20);
    cout << "  Gross WPM : " << GRN << buf << RST << "\n";
    int_to_buf(s.net_wpm, buf, 20);
    cout << "  Net WPM   : " << GRN << buf << RST << "\n";
    float_to_buf(s.accuracy, buf, 20);
    cout << "  Accuracy  : " << GRN << buf << "%" << RST << "\n";
    int_to_buf(uncorrected_errors, buf, 20);
    cout << "  Errors    : " << buf << "\n";
    int_to_buf(total_typed, buf, 20);
    cout << "  Chars     : " << buf << "\n\n";

    return s;
}

// --- Main --------------------------------------------------------------------
int main() {
    cout << "\033[0m";
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
        cout << "  Welcome, " << YLW << username << RST << "\n\n";

        cout << CYN << "  +-----------------------------+\n";
        cout <<        "  |      SELECT A MODE          |\n";
        cout <<        "  +-----------------------------+" << RST << "\n";
        cout <<        "  |  1. Standard                |\n";
        cout <<        "  |  2. Numbers                 |\n";
        cout <<        "  |  3. Quotes                  |\n";
        cout <<        "  |  4. View Leaderboard        |\n";
        cout <<        "  |  5. Quit                    |\n";
        cout << CYN << "  +-----------------------------+" << RST << "\n";
        cout << "  Choice: ";

        char choice_buf[10];
        cin.getline(choice_buf, 10);
        int choice = ptr_atoi(choice_buf);

        if (choice == 5) {
            cout << "\n  " << CYN << "Thanks for playing TypeMaster CLI. Goodbye!" << RST << "\n\n";
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
                    char pb_buf[20]; int_to_buf(pb, pb_buf, 20);
                    cout << "\n  Your personal best Net WPM: " << YLW << pb_buf << RST << "\n";
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

        int mode_idx = choice - 1;
        PlayerSession session = run_game(username, mode_idx);

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

        char rank_buf[20];
        if (rank > 0) {
            int_to_buf(rank, rank_buf, 20);
            cout << "\n  " << YLW << "Your global rank: #" << rank_buf << RST << "\n";
        }
        int pb = personal_best(entries, count, username);
        if (pb >= 0) {
            int_to_buf(pb, rank_buf, 20);
            cout << "  Personal best Net WPM: " << YLW << rank_buf << RST << "\n";
        }

        cout << "\n  Press ENTER to return to menu...";
        cin.ignore(1000, '\n');
    }

    return 0;
}
