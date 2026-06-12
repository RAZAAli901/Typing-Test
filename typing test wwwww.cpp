#include <iostream>
#include <fstream>
#include <ctime>

using namespace std;

// get length of a string
int mylen(const char* txt)
{
    int len = 0;
    while (*(txt + len) != '\0')
        len++;
    return len;
}

// copy src into dest
void mycopy(char* dest, const char* src)
{
    int i = 0;
    while (*(src + i) != '\0')
    {
        *(dest + i) = *(src + i);
        i++;
    }
    *(dest + i) = '\0';
}

// count words in text
int wordcount(const char* txt)
{
    int i = 0;
    int words = 0;
    bool inword = false;

    while (*(txt + i) != '\0')
    {
        char ch = *(txt + i);
        if (ch != ' ' && ch != '\t' && ch != '\n' && ch != '\r')
        {
            if (inword == false)
            {
                words++;
                inword = true;
            }
        }
        else
        {
            inword = false;
        }
        i++;
    }
    return words;
}

// compare typed text with target character by character
double accuracy(const char* target, const char* typed)
{
    int len1 = mylen(target);
    int len2 = mylen(typed);
    int maxlen = (len1 > len2) ? len1 : len2;

    if (maxlen == 0)
        return 0.0;

    int same = 0;
    int i = 0;
    while (i < maxlen)
    {
        char a = (i < len1) ? *(target + i) : '\0';
        char b = (i < len2) ? *(typed + i) : '\0';
        if (a == b)
            same++;
        i++;
    }

    return (same * 100.0) / maxlen;
}

// calculate wpm from word count and seconds
double calcwpm(const char* typed, double sec)
{
    if (sec <= 0.0)
        return 0.0;
    int words = wordcount(typed);
    return (words * 60.0) / sec;
}

// grow parallel arrays when full
void grow(double*& arr1, double*& arr2, int& cap)
{
    int newcap = cap * 2;
    if (newcap < 2)
        newcap = 2;

    double* tmp1 = new double[newcap];
    double* tmp2 = new double[newcap];

    int i = 0;
    while (i < cap)
    {
        *(tmp1 + i) = *(arr1 + i);
        *(tmp2 + i) = *(arr2 + i);
        i++;
    }

    delete[] arr1;
    delete[] arr2;

    arr1 = tmp1;
    arr2 = tmp2;
    cap = newcap;
}

// shrink arrays when mostly empty
void shrink(double*& arr1, double*& arr2, int& cap, int size)
{
    if (cap <= 2)
        return;
    if (size > cap / 4)
        return;

    int newcap = cap / 2;
    if (newcap < 2)
        newcap = 2;
    if (newcap < size)
        newcap = size;
    if (newcap == cap)
        return;

    double* tmp1 = new double[newcap];
    double* tmp2 = new double[newcap];

    int i = 0;
    while (i < size)
    {
        *(tmp1 + i) = *(arr1 + i);
        *(tmp2 + i) = *(arr2 + i);
        i++;
    }

    delete[] arr1;
    delete[] arr2;

    arr1 = tmp1;
    arr2 = tmp2;
    cap = newcap;
}

// add one entry to history
void addrecord(double*& speed, double*& acc, int& size, int& cap, double s, double a)
{
    if (size >= cap)
        grow(speed, acc, cap);

    *(speed + size) = s;
    *(acc + size) = a;
    size++;
}

// remove last entry
void removerecord(double*& speed, double*& acc, int& size, int& cap)
{
    if (size == 0)
    {
        cout << "history is empty." << endl;
        return;
    }
    size--;
    shrink(speed, acc, cap, size);
    cout << "last record removed." << endl;
}

// delete all history
void clearhistory(double*& speed, double*& acc, int& size, int& cap)
{
    delete[] speed;
    delete[] acc;

    cap = 2;
    size = 0;

    speed = new double[cap];
    acc = new double[cap];

    cout << "history cleared." << endl;
}

// print history to screen
void showhistory(const double* speed, const double* acc, int size)
{
    if (size == 0)
    {
        cout << "no history yet." << endl;
        return;
    }

    cout << endl;
    cout << "score history" << endl;

    int i = 0;
    while (i < size)
    {
        cout << "attempt " << (i + 1) << endl;
        cout << "wpm      = " << *(speed + i) << endl;
        cout << "accuracy = " << *(acc + i) << "%" << endl;
        i++;
    }
}

// write history to file
void savehistory(const char* filename, const double* speed, const double* acc, int size)
{
    ofstream fout(filename);
    if (!fout)
    {
        cout << "could not save file." << endl;
        return;
    }

    int i = 0;
    while (i < size)
    {
        fout << *(speed + i) << ' ' << *(acc + i) << endl;
        i++;
    }

    fout.close();
}

// read history from file
void loadhistory(const char* filename, double*& speed, double*& acc, int& size, int& cap)
{
    ifstream fin(filename);
    if (!fin)
        return;

    double s = 0.0;
    double a = 0.0;

    while (fin >> s >> a)
        addrecord(speed, acc, size, cap, s, a);

    fin.close();
}

// returns one of 5 sentences as a new dynamic char array
char* getsentence(int idx)
{
    // fixed array with initializer so no uninitialized memory warning
    const char* list[5] = {
        "practice makes a programmer better every day",
        "typing speed improves with regular practice",
        "dynamic memory helps build flexible programs",
        "pointer arithmetic is used in low level code",
        "success comes from effort patience and consistency"
    };

    int pick = idx % 5;
    const char* src = *(list + pick);
    int len = mylen(src);

    char* sent = new char[len + 1];
    mycopy(sent, src);
    return sent;
}

// clear leftover newline from cin
void flushinput()
{
    cin.clear();
    cin.ignore(10000, '\n');
}

// run one typing test and auto measure time
void runtest(double*& speed, double*& acc, int& size, int& cap, int testnum)
{
    char* sent = getsentence(testnum);
    int bufsize = mylen(sent) + 200;
    char* typed = new char[bufsize];

    cout << endl;
    cout << "type this sentence:" << endl;
    cout << sent << endl;
    cout << "press enter when ready..." << endl;

    // wait for enter to start timer
    cin.getline(typed, bufsize);

    cout << "your input: ";

    // start timer right before user types
    clock_t starttime = clock();

    cin.getline(typed, bufsize);

    // stop timer right after user finishes
    clock_t endtime = clock();

    // calculate seconds taken
    double sec = (double)(endtime - starttime) / CLOCKS_PER_SEC;

    if (sec <= 0.0)
        sec = 0.01;

    cout << "time taken = " << sec << " seconds" << endl;

    double mywpm = calcwpm(typed, sec);
    double myacc = accuracy(sent, typed);

    addrecord(speed, acc, size, cap, mywpm, myacc);

    cout << "wpm      = " << mywpm << endl;
    cout << "accuracy = " << myacc << "%" << endl;

    delete[] sent;
    delete[] typed;
}

int main()
{
    const char* filename = "typing_history.txt";

    double* speed = new double[2];
    double* acc = new double[2];
    int size = 0;
    int cap = 2;

    loadhistory(filename, speed, acc, size, cap);

    int testnum = 0;
    int choice = 0;

    while (true)
    {
        cout << endl;
        cout << "typing speed test" << endl;
        cout << "1. start test" << endl;
        cout << "2. show history" << endl;
        cout << "3. remove last record" << endl;
        cout << "4. clear history" << endl;
        cout << "5. save and exit" << endl;
        cout << "choice: ";

        cin >> choice;

        if (!cin)
        {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "invalid input." << endl;
            continue;
        }

        flushinput();

        if (choice == 1)
        {
            runtest(speed, acc, size, cap, testnum);
            testnum++;
        }
        else if (choice == 2)
        {
            showhistory(speed, acc, size);
        }
        else if (choice == 3)
        {
            removerecord(speed, acc, size, cap);
        }
        else if (choice == 4)
        {
            clearhistory(speed, acc, size, cap);
            testnum = 0;
        }
        else if (choice == 5)
        {
            savehistory(filename, speed, acc, size);
            cout << "saved. goodbye." << endl;
            break;
        }
        else
        {
            cout << "wrong choice." << endl;
        }
    }

    delete[] speed;
    delete[] acc;

    return 0;
}
