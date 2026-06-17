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
