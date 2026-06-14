/*
 * TypeMaster CLI
 * Only <iostream> and <fstream> used.
 * No ANSI codes. No chrono/ctime. No string/cstring.
 */

#include <iostream>
#include <fstream>





using namespace std;

// --- Constants ---------------------------------------------------------------
const int MAX_NAME    = 30;
const int MAX_ENTRIES = 500;
const int INPUT_BUF   = 3200;

// --- Data Structures ---------------------------------------------------------
struct PlayerSession {
    char  username[MAX_NAME];
    int   gross_wpm;
    int   net_wpm;
    float accuracy;
    int   time_taken;
};

// --- Text Assets -------------------------------------------------------------
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
    "chair feeling lighter than she had in months.";

const char NUMBERS_TEXT[] =
    "The engineering report dated 2019-04-17 identified 3 critical faults in "
    "sector 7B. Ambient temperature had reached 42.6 degrees Celsius during "
    "the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. "
    "Component batch A-2204 showed a failure rate of 0.78%, well above the "
    "acceptable ceiling of 0.25%. Total runtime logged was 1440 hours across "
    "60 test units, and 11 units failed before reaching the 500-hour mark. "
    "Budget allocation for Q3 was 1.2 million, yet actual expenditure hit "
    "1.47 million, a 22.5% overrun. Serial codes F-00812 through F-00819 "
    "were quarantined pending review. The next inspection window opens on "
    "2024-09-01 and must be completed within 14 days.";

const char QUOTES_TEXT[] =
    "In the middle of every difficulty lies opportunity said Albert Einstein. "
    "It does not matter how slowly you go as long as you do not stop said "
    "Confucius. You have power over your mind not outside events realize this "
    "and you will find strength said Marcus Aurelius. The only way to do great "
    "work is to love what you do said Steve Jobs. Life is what happens when "
    "you are busy making other plans said John Lennon. Spread love everywhere "
    "you go and let no one ever come to you without leaving happier said Mother "
    "Teresa. When you reach the end of your rope tie a knot in it and hang on "
    "said Franklin Roosevelt. Always remember that you are absolutely unique "
    "just like everyone else said Margaret Mead.";

const char* TEXT_ASSETS[3] = { STANDARD_TEXT, NUMBERS_TEXT, QUOTES_TEXT };
const char* MODE_NAMES[3]  = { "Standard", "Numbers", "Quotes" };

// --- Utilities ---------------------------------------------------------------
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

void int_to_buf(int val, char* buf, int buf_size) {
    if (buf_size < 2) return;
    if (val == 0) { buf[0]='0'; buf[1]='\0'; return; }
    bool neg = (val < 0); if (neg) val = -val;
    char tmp[20]; int i = 0;
    while (val > 0 && i < 19) { tmp[i++] = '0' + (val % 10); val /= 10; }
    if (neg && i < 19) tmp[i++] = '-';
    int j = 0;
    while (i > 0 && j < buf_size-1) buf[j++] = tmp[--i];
    buf[j] = '\0';
}

int ptr_atoi(const char* s) {
    int r = 0; bool neg = false;
    while (*s==' '||*s=='\t') s++;
    if (*s=='-'){neg=true;s++;} else if(*s=='+') s++;
    while (*s>='0'&&*s<='9'){r=r*10+(*s-'0');s++;}
    return neg?-r:r;
}

float ptr_atof(const char* s) {
    while (*s==' '||*s=='\t') s++;
    float r=0.0f; bool neg=false;
    if(*s=='-'){neg=true;s++;}
    while(*s>='0'&&*s<='9'){r=r*10+(*s-'0');s++;}
    if(*s=='.'){s++;float f=0.1f;while(*s>='0'&&*s<='9'){r+=(*s-'0')*f;f*=0.1f;s++;}}
    return neg?-r:r;
}

void float_to_buf(float val, char* buf, int buf_size) {
    int whole=(int)val;
    int frac=(int)((val-whole)*100+0.5f);
    if(frac>=100){whole++;frac-=100;}
    char tmp[30]; int_to_buf(whole,tmp,20);
    int i=0;
    while(tmp[i]&&i<buf_size-5){buf[i]=tmp[i];i++;}
    buf[i++]='.'; buf[i++]='0'+(frac/10); buf[i++]='0'+(frac%10); buf[i]='\0';
}

// --- Metrics -----------------------------------------------------------------
void evaluate_input(const char* source, const char* input,
    int& correct_chars, int& total_typed, int& uncorrected_errors) {
    const char* src = source;
    const char* inp = input;
    correct_chars = total_typed = uncorrected_errors = 0;
    while (*inp != '\0') {
        if (*src == '\0') {
            // typed past end of source — count as errors
            uncorrected_errors++;
        } else if (*inp == *src) {
            correct_chars++;
        } else {
            uncorrected_errors++;
        }
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
        char* fs = p; while (*p && *p != ',') p++;
        int flen = (int)(p - fs); if (flen >= MAX_NAME) flen = MAX_NAME-1;
        int j = 0; while (j < flen) { entries[count].username[j] = fs[j]; j++; }
        entries[count].username[j] = '\0';
        if (*p == ',') p++;
        // gross_wpm
        fs=p; while(*p&&*p!=',') p++; *p='\0'; entries[count].gross_wpm=ptr_atoi(fs); p++;
        // net_wpm
        fs=p; while(*p&&*p!=',') p++; *p='\0'; entries[count].net_wpm=ptr_atoi(fs); p++;
        // accuracy
        fs=p; while(*p&&*p!=',') p++; *p='\0'; entries[count].accuracy=ptr_atof(fs); p++;
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
    for (int i = 0; i < count-1; i++)
        for (int j = 0; j < count-1-i; j++)
            if (entries[j].net_wpm < entries[j+1].net_wpm) {
                PlayerSession tmp = entries[j];
                entries[j] = entries[j+1];
                entries[j+1] = tmp;
            }
}

int personal_best(const PlayerSession* entries, int count, const char* username) {
    int best = -1;
    for (int i = 0; i < count; i++)
        if (ptr_cmp(entries[i].username, username)==0 && entries[i].net_wpm > best)
            best = entries[i].net_wpm;
    return best;
}

// --- Display -----------------------------------------------------------------
void clear_screen() { for (int i = 0; i < 50; i++) cout << "\n"; }

void draw_banner() {
    cout << "\n";
    cout << "  +---------------------------------------------------------------+\n";
    cout << "  |                                                               |\n";
    cout << "  |  _____ _   _ ____  ___ __  __    _    ____ _____ _____ ____  |\n";
    cout << "  | |_   _| | | |  _ \\| __|  \\/  |  / \\  / ___|_   _| ____|  _ \\ |\n";
    cout << "  |   | | | |_| | |_) | _|| |\\/| | / _ \\ \\___ \\ | | |  _| | |_) ||\n";
    cout << "  |   | | |  _  |  __/| |_| |  | |/ ___ \\ ___) || | | |___|  _ < |\n";
    cout << "  |   |_| |_| |_|_|   |___|_|  |_/_/   \\_\\____/ |_| |_____|_| \\_\\|\n";
    cout << "  |                                                               |\n";
    cout << "  |                    C L I  --  v 1.0                          |\n";
    cout << "  |                                                               |\n";
    cout << "  +---------------------------------------------------------------+\n";
    cout << "\n";
}

void print_text(const char* text) {
    cout << "  +---------------------------------------------------------------+\n";
    // print full text wrapped at ~67 chars per line
    int col = 0;
    const char* t = text;
    cout << "  | ";
    while (*t != '\0') {
        cout << *t;
        col++;
        if (col >= 67 && *t == ' ') {
            cout << "\n  | ";
            col = 0;
        }
        t++;
    }
    cout << "\n  +---------------------------------------------------------------+\n";
}

void display_leaderboard(const PlayerSession* entries, int count, const char* highlight) {
    cout << "\n";
    cout << "  +------+----------------------+------+--------+----------+\n";
    cout << "  |           *** GLOBAL LEADERBOARD ***                   |\n";
    cout << "  +------+----------------------+------+--------+----------+\n";
    cout << "  | Rank | Username             | NWPM |  Acc   | Time (s) |\n";
    cout << "  +------+----------------------+------+--------+----------+\n";

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

        int sp = 4 - ptr_len(rank_buf);
        cout << "  |"; while(sp-->0) cout<<' '; cout << rank_buf << "  | ";
        cout << uname << " | ";
        sp = 4 - ptr_len(wpm_buf);  while(sp-->0) cout<<' '; cout << wpm_buf << " | ";
        sp = 6 - ptr_len(acc_buf);  while(sp-->0) cout<<' '; cout << acc_buf << " | ";
        sp = 8 - ptr_len(time_buf); while(sp-->0) cout<<' '; cout << time_buf << " |";
        if (me) cout << " << YOU";
        cout << "\n";
    }
    cout << "  +------+----------------------+------+--------+----------+\n";
}

// --- Game Loop ---------------------------------------------------------------
PlayerSession run_game(const char* username, int mode_idx) {
    clear_screen();
    const char* source = TEXT_ASSETS[mode_idx];

    cout << "\n  == " << MODE_NAMES[mode_idx] << " Mode ==\n\n";
    cout << "  Type the text below EXACTLY as shown, then press ENTER.\n";
    cout << "  Afterwards you will be asked how many seconds it took.\n\n";
    print_text(source);
    cout << "\n  Press ENTER when ready...\n";

    // Wait for ENTER cleanly
    char dummy[10];
    cin.getline(dummy, 10);

    cout << "\n  > ";

    char input_buf[INPUT_BUF];
    for (int i = 0; i < INPUT_BUF; i++) input_buf[i] = '\0';
    cin.getline(input_buf, INPUT_BUF);

    // Get time
    int elapsed_seconds = 0;
    while (elapsed_seconds < 1) {
        cout << "\n  How many seconds did that take? ";
        char time_buf[20];
        for (int i = 0; i < 20; i++) time_buf[i] = '\0';
        cin.getline(time_buf, 20);
        elapsed_seconds = ptr_atoi(time_buf);
        if (elapsed_seconds < 1)
            cout << "  Please enter a number greater than 0.\n";
    }

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

    // Results
    clear_screen();
    char buf[30];
    cout << "\n  ==================================\n";
    cout << "         SESSION RESULTS\n";
    cout << "  ==================================\n\n";
    cout << "  Player    : " << username << "\n";
    cout << "  Mode      : " << MODE_NAMES[mode_idx] << "\n";
    int_to_buf(elapsed_seconds, buf, 20);
    cout << "  Time      : " << buf << "s\n\n";
    int_to_buf(s.gross_wpm, buf, 20);
    cout << "  Gross WPM : " << buf << "\n";
    int_to_buf(s.net_wpm, buf, 20);
    cout << "  Net WPM   : " << buf << "\n";
    float_to_buf(s.accuracy, buf, 20);
    cout << "  Accuracy  : " << buf << "%\n";
    int_to_buf(uncorrected_errors, buf, 20);
    cout << "  Errors    : " << buf << "\n";
    int_to_buf(total_typed, buf, 20);
    cout << "  Chars     : " << buf << "\n\n";

    return s;
}

// --- Main --------------------------------------------------------------------
int main() {
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

        cout << "  +-----------------------------+\n";
        cout << "  |      SELECT A MODE          |\n";
        cout << "  +-----------------------------+\n";
        cout << "  |  1. Standard                |\n";
        cout << "  |  2. Numbers                 |\n";
        cout << "  |  3. Quotes                  |\n";
        cout << "  |  4. View Leaderboard        |\n";
        cout << "  |  5. Quit                    |\n";
        cout << "  +-----------------------------+\n";
        cout << "  Choice: ";

        char choice_buf[10];
        cin.getline(choice_buf, 10);
        int choice = ptr_atoi(choice_buf);

        if (choice == 5) {
            cout << "\n  Thanks for playing TypeMaster CLI. Goodbye!\n\n";
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
                    cout << "\n  Your personal best Net WPM: " << pb_buf << "\n";
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
            cout << "\n  Your global rank: #" << rank_buf << "\n";
        }
        int pb = personal_best(entries, count, username);
        if (pb >= 0) {
            int_to_buf(pb, rank_buf, 20);
            cout << "  Personal best Net WPM: " << rank_buf << "\n";
        }

        cout << "\n  Press ENTER to return to menu...";
        cin.ignore(1000, '\n');
    }

    return 0;
}
