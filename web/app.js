/*
 * TypeMaster Live Application Logic
 * Core engine featuring character validation, stats calculation, local storage saving,
 * Web Audio API synthesizer, Canvas particle animation, and SVG line chart rendering.
 */

// --- Constants & Text Assets (Aligned with C++ versions) ---
const TEXT_ASSETS = {
    standard: "The old clock on the wall ticked softly as the afternoon light faded across the wooden floor. Sarah sat at the desk and opened her notebook to a fresh page. She had been working on the same chapter for three weeks and still could not find the right ending. Outside the window the maple tree swayed in the breeze and a single red leaf broke free and spiralled down to the ground. She watched it fall and felt something shift inside her. Sometimes an ending was not a conclusion but simply a pause before the next beginning.",
    numbers: "The engineering report dated 2019-04-17 identified 3 critical faults in sector 7B. Ambient temperature had reached 42.6 degrees Celsius during the test cycle, exceeding the rated threshold of 38.0 by 4.6 degrees. Component batch A-2204 showed a failure rate of 0.78%, well above the acceptable ceiling of 0.25%. Total runtime logged was 1440 hours across 60 test units, and 11 units failed before reaching the 500-hour mark.",
    quotes: "In the middle of every difficulty lies opportunity said Albert Einstein. It does not matter how slowly you go as long as you do not stop said Confucius. You have power over your mind not outside events realize this and you will find strength said Marcus Aurelius. The only way to do great work is to love what you do said Steve Jobs. Life is what happens when you are busy making other plans said John Lennon."
};

// --- Application State ---
let state = {
    username: "Anonymous",
    activeMode: "standard",
    customText: "",
    activePrompt: "",
    
    // Typing session variables
    isRunning: false,
    isFinished: false,
    startTime: null,
    timerInterval: null,
    
    // Keystroke analysis variables
    charIndex: 0,
    mistakes: 0,
    correctCount: 0,
    totalTyped: 0,
    
    // Live charts variables
    timelineData: [], // Array of objects: { time: N, wpm: W, acc: A }
    
    // User configuration
    soundEnabled: true,
    activeTheme: "cyberpunk",
    
    // Web Audio Context reference
    audioCtx: null
};

// --- Element Cache ---
const elements = {
    body: document.body,
    wordsContainer: document.getElementById("words-container"),
    hiddenInput: document.getElementById("hidden-input"),
    startOverlay: document.getElementById("start-overlay"),
    
    // Stats elements
    statWpm: document.getElementById("stat-wpm"),
    statWpmSub: document.getElementById("stat-wpm-sub"),
    statAccuracy: document.getElementById("stat-accuracy"),
    statAccuracySub: document.getElementById("stat-accuracy-sub"),
    statTime: document.getElementById("stat-time"),
    
    // Action elements
    soundBtn: document.getElementById("sound-btn"),
    themeBtn: document.getElementById("theme-btn"),
    themeDropdown: document.getElementById("theme-dropdown"),
    changeUserBtn: document.getElementById("change-user-btn"),
    displayUsername: document.getElementById("display-username"),
    
    // Panels
    customTextPanel: document.getElementById("custom-text-panel"),
    customTextInput: document.getElementById("custom-text-input"),
    applyCustomBtn: document.getElementById("apply-custom-btn"),
    cancelCustomBtn: document.getElementById("cancel-custom-btn"),
    
    resultsPanel: document.getElementById("results-panel"),
    resNetWpm: document.getElementById("res-net-wpm"),
    resAccuracy: document.getElementById("res-accuracy"),
    resTime: document.getElementById("res-time"),
    resMistakes: document.getElementById("res-mistakes"),
    resTimestamp: document.getElementById("result-timestamp"),
    retryBtn: document.getElementById("retry-btn"),
    nextTestBtn: document.getElementById("next-test-btn"),
    
    // Leaderboard
    leaderboardTable: document.getElementById("leaderboard-table").querySelector("tbody"),
    clearLeaderboardBtn: document.getElementById("clear-leaderboard-btn"),
    
    // Username selection modal
    usernameModal: document.getElementById("username-modal"),
    usernameInput: document.getElementById("username-input"),
    saveUsernameBtn: document.getElementById("save-username-btn"),
    
    // Canvas & SVG
    particleCanvas: document.getElementById("particle-canvas"),
    timelineChart: document.getElementById("timeline-chart")
};

// ==========================================================================
// Web Audio API Synthesizer (Zero External Assets Required)
// ==========================================================================
function initAudio() {
    if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === "suspended") {
        state.audioCtx.resume();
    }
}

function playKeySound(isCorrect = true) {
    if (!state.soundEnabled) return;
    initAudio();
    const ctx = state.audioCtx;
    
    if (isCorrect) {
        // High-frequency tactile typewriter noise burst
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } else {
        // Low frequency buzz error sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }
}

function playSuccessSound() {
    if (!state.soundEnabled) return;
    initAudio();
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    
    // Retro chime: C5 and E5 notes sequentially
    const playNote = (freq, delay, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0.0, now + delay);
        gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.05);
    };
    
    playNote(523.25, 0.0, 0.25); // C5
    playNote(659.25, 0.12, 0.35); // E5
}
