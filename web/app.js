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
    testDuration: 30,
    
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
    timelineChart: document.getElementById("timeline-chart"),
    
    // Ranking Modal Elements
    rankModal: document.getElementById("rank-modal"),
    rankNumberLoader: document.getElementById("rank-number-loader"),
    rankBadgeContainer: document.getElementById("rank-badge-container"),
    rankEmoji: document.getElementById("rank-emoji"),
    rankBadgeText: document.getElementById("rank-badge-text"),
    rankDetailName: document.getElementById("rank-detail-name"),
    rankDetailWpm: document.getElementById("rank-detail-wpm"),
    rankDetailPlaced: document.getElementById("rank-detail-placed"),
    rankContinueBtn: document.getElementById("rank-continue-btn")
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

function playSuccessSound(tier = 'apprentice') {
    if (!state.soundEnabled) return;
    initAudio();
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    
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
    
    if (tier === 'grandmaster') {
        playNote(523.25, 0.0, 0.2);
        playNote(659.25, 0.08, 0.2);
        playNote(783.99, 0.16, 0.2);
        playNote(1046.50, 0.24, 0.4);
    } else if (tier === 'master') {
        playNote(523.25, 0.0, 0.2);
        playNote(698.46, 0.08, 0.2);
        playNote(880.00, 0.16, 0.2);
        playNote(1046.50, 0.24, 0.4);
    } else if (tier === 'elite') {
        playNote(523.25, 0.0, 0.25);
        playNote(783.99, 0.12, 0.35);
    } else if (tier === 'pro') {
        playNote(523.25, 0.0, 0.25);
        playNote(659.25, 0.12, 0.35);
    } else {
        playNote(523.25, 0.0, 0.3);
    }
}

// ==========================================================================
// Canvas Neon Particles Background System
// ==========================================================================
let particles = [];
const particleCtx = elements.particleCanvas.getContext("2d");

function resizeCanvas() {
    elements.particleCanvas.width = window.innerWidth;
    elements.particleCanvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, spawnFromKey = false) {
        this.x = x || Math.random() * elements.particleCanvas.width;
        this.y = y || Math.random() * elements.particleCanvas.height;
        this.size = Math.random() * (spawnFromKey ? 4 : 2) + 1;
        this.speedX = spawnFromKey ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.8;
        this.speedY = spawnFromKey ? -Math.random() * 4 - 1 : (Math.random() - 0.5) * 0.8;
        this.color = getThemeParticleColor();
        this.alpha = 1;
        this.fade = spawnFromKey ? 0.03 : 0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.fade > 0) {
            this.alpha -= this.fade;
        }
    }
    
    draw() {
        particleCtx.save();
        particleCtx.globalAlpha = this.alpha;
        particleCtx.shadowBlur = 8;
        particleCtx.shadowColor = this.color;
        particleCtx.fillStyle = this.color;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();
        particleCtx.restore();
    }
}

function getThemeParticleColor() {
    switch (state.activeTheme) {
        case "cyberpunk": return "#00f2fe";
        case "dark-console": return "#00ff66";
        case "ocean": return "#38bdf8";
        case "sakura": return "#fda4af";
        default: return "#00f2fe";
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }
}

function triggerKeyParticles() {
    const activeCharSpan = document.querySelector(".current-char");
    if (!activeCharSpan) return;
    
    const rect = activeCharSpan.getBoundingClientRect();
    const x = rect.left + window.scrollX + rect.width / 2;
    const y = rect.top + window.scrollY + rect.height;
    
    for (let i = 0; i < 6; i++) {
        particles.push(new Particle(x, y, true));
    }
}

function animateParticles() {
    particleCtx.clearRect(0, 0, elements.particleCanvas.width, elements.particleCanvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
        }
        
        if (particles[i].fade === 0) {
            if (particles[i].x < 0 || particles[i].x > elements.particleCanvas.width ||
                particles[i].y < 0 || particles[i].y > elements.particleCanvas.height) {
                particles[i].x = Math.random() * elements.particleCanvas.width;
                particles[i].y = Math.random() * elements.particleCanvas.height;
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// ==========================================================================
// Typing Core Engine & Calculations
// ==========================================================================
function selectPrompt() {
    if (state.activeMode === "custom") {
        state.activePrompt = state.customText || "Paste your custom text in the box above to begin.";
    } else {
        state.activePrompt = TEXT_ASSETS[state.activeMode];
    }
    resetGame();
}

function renderPrompt() {
    elements.wordsContainer.innerHTML = "";
    
    let currentWordDiv = null;
    let globalIdx = 0;
    const chars = state.activePrompt.split("");
    
    chars.forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char;
        if (globalIdx === 0) {
            span.className = "current-char";
        }
        
        if (char === " ") {
            span.classList.add("space-char");
            elements.wordsContainer.appendChild(span);
            currentWordDiv = null;
        } else {
            if (!currentWordDiv) {
                currentWordDiv = document.createElement("div");
                currentWordDiv.className = "word";
                elements.wordsContainer.appendChild(currentWordDiv);
            }
            span.classList.add("char");
            currentWordDiv.appendChild(span);
        }
        globalIdx++;
    });
}

function alignWordsScroll() {
    const activeChar = elements.wordsContainer.querySelector(".current-char");
    if (!activeChar) return;
    
    const charTop = activeChar.offsetTop;
    if (charTop > 40) {
        elements.wordsContainer.scrollTop = charTop - 40;
    } else {
        elements.wordsContainer.scrollTop = 0;
    }
}

function focusInput() {
    if (!state.isFinished) {
        elements.hiddenInput.focus();
    }
}

function startTimer() {
    state.isRunning = true;
    state.startTime = new Date();
    elements.statTime.innerText = `${state.testDuration}s`;
    elements.startOverlay.style.opacity = "0";
    setTimeout(() => elements.startOverlay.classList.add("hidden"), 300);
    
    state.timerInterval = setInterval(() => {
        const elapsed = (new Date() - state.startTime) / 1000;
        updateStats(elapsed);
    }, 500);
}

function updateStats(elapsed) {
    if (elapsed <= 0) return;
    const minutes = elapsed / 60;
    const grossWpm = Math.round((state.totalTyped / 5) / minutes);
    const netWpm = Math.max(0, Math.round(grossWpm - (state.mistakes / minutes)));
    const accuracy = state.totalTyped > 0 
        ? Math.round((state.correctCount / state.totalTyped) * 100) 
        : 100;
        
    elements.statWpm.innerText = String(netWpm).padStart(2, '0');
    elements.statWpmSub.innerText = `gross: ${grossWpm}`;
    elements.statAccuracy.innerText = `${accuracy}%`;
    elements.statAccuracySub.innerText = `${state.mistakes} mistakes`;
    
    const remaining = Math.max(0, state.testDuration - elapsed);
    elements.statTime.innerText = `${Math.ceil(remaining)}s`;
    
    if (remaining <= 0) {
        finishGame();
        return;
    }
    
    if (Math.round(elapsed) > 0 && Math.round(elapsed) % 2 === 0) {
        const roundedTime = Math.round(elapsed);
        if (!state.timelineData.some(d => d.time === roundedTime)) {
            state.timelineData.push({
                time: roundedTime,
                wpm: netWpm,
                acc: accuracy
            });
        }
    }
}

function processTyping(e) {
    const inputVal = elements.hiddenInput.value;
    const promptLen = state.activePrompt.length;
    
    if (!state.isRunning && !state.isFinished && inputVal.length > 0) {
        startTimer();
    }
    
    const letterSpans = elements.wordsContainer.querySelectorAll("span");
    const inputLen = inputVal.length;
    
    if (inputLen < state.charIndex) {
        for (let i = inputLen; i < state.charIndex; i++) {
            letterSpans[i].className = "";
        }
        state.charIndex = inputLen;
        letterSpans[state.charIndex].className = "current-char";
        playKeySound(true);
        alignWordsScroll();
        return;
    }
    
    while (state.charIndex < inputLen && state.charIndex < promptLen) {
        const typedChar = inputVal[state.charIndex];
        const targetChar = state.activePrompt[state.charIndex];
        state.totalTyped++;
        
        if (typedChar === targetChar) {
            letterSpans[state.charIndex].className = "correct";
            state.correctCount++;
            playKeySound(true);
            triggerKeyParticles();
        } else {
            letterSpans[state.charIndex].className = "incorrect";
            state.mistakes++;
            playKeySound(false);
            elements.wordsContainer.classList.add("shake");
            setTimeout(() => elements.wordsContainer.classList.remove("shake"), 250);
        }
        
        state.charIndex++;
        if (state.charIndex < promptLen) {
            letterSpans[state.charIndex].className = "current-char";
        }
    }
    
    alignWordsScroll();
    
    if (state.charIndex >= promptLen) {
        finishGame();
    }
}

function finishGame() {
    clearInterval(state.timerInterval);
    state.isFinished = true;
    state.isRunning = false;
    elements.hiddenInput.blur();
    
    const elapsed = Math.max(0.1, (new Date() - state.startTime) / 1000);
    const minutes = elapsed / 60;
    
    const grossWpm = Math.round((state.totalTyped / 5) / minutes);
    const netWpm = Math.max(0, Math.round(grossWpm - (state.mistakes / minutes)));
    const accuracy = state.totalTyped > 0 
        ? Math.round((state.correctCount / state.totalTyped) * 100) 
        : 100;
        
    playSuccessSound();
    saveSession(state.username, netWpm, accuracy, elapsed, state.mistakes);
    
    elements.resNetWpm.innerText = netWpm;
    elements.resAccuracy.innerText = `${accuracy}%`;
    elements.resTime.innerText = elapsed.toFixed(1);
    elements.resMistakes.innerText = state.mistakes;
    elements.resTimestamp.innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (state.timelineData.length === 0 || state.timelineData[state.timelineData.length - 1].time !== Math.round(elapsed)) {
        state.timelineData.push({
            time: Math.round(elapsed),
            wpm: netWpm,
            acc: accuracy
        });
    }
    drawChart(state.timelineData);
    
    // Calculate ranking position from saved scores
    const scores = JSON.parse(localStorage.getItem("typemaster_scores") || "[]");
    let currentRank = 11; // default to unranked if not in top 10
    const matchedIndex = scores.findIndex(s => s.netWpm === netWpm && s.accuracy === accuracy && s.mistakes === state.mistakes);
    if (matchedIndex !== -1) {
        currentRank = matchedIndex + 1;
    }
    
    showRankingAnimation(currentRank, netWpm);
}

function showRankingAnimation(rank, wpm) {
    elements.rankModal.classList.remove("hidden");
    
    const scanLine = elements.rankModal.querySelector(".rank-scan-line");
    if (scanLine) {
        scanLine.style.display = "block";
        scanLine.style.opacity = "1";
    }
    
    elements.rankNumberLoader.classList.remove("hidden");
    elements.rankBadgeContainer.classList.add("hidden");
    elements.rankContinueBtn.classList.add("hidden");
    elements.rankNumberLoader.innerText = "#10";
    
    elements.rankDetailName.innerText = state.username;
    elements.rankDetailWpm.innerText = `${wpm} WPM`;
    elements.rankDetailPlaced.innerText = "Calculating...";
    
    let currentTicker = 10;
    const isRanked = rank <= 10;
    
    const tickerInterval = setInterval(() => {
        if (currentTicker > 1 && (isRanked ? currentTicker > rank : currentTicker > 1)) {
            currentTicker--;
            elements.rankNumberLoader.innerText = `#${currentTicker}`;
            playKeySound(true);
        } else {
            clearInterval(tickerInterval);
            revealFinalRank(rank);
        }
    }, 180);
}

function revealFinalRank(rank) {
    const scanLine = elements.rankModal.querySelector(".rank-scan-line");
    if (scanLine) {
        scanLine.style.opacity = "0";
        setTimeout(() => scanLine.style.display = "none", 400);
    }
    
    elements.rankNumberLoader.classList.add("hidden");
    elements.rankBadgeContainer.className = "rank-badge-container rank-badge-reveal";
    
    let emoji = "📋";
    let tierText = "APPRENTICE";
    let tierClass = "tier-apprentice";
    let placementText = "Unranked (Out of Top 10)";
    
    if (rank === 1) {
        emoji = "🏆";
        tierText = "GRANDMASTER";
        tierClass = "tier-grandmaster";
        placementText = "Rank #1 (Leader!)";
    } else if (rank === 2) {
        emoji = "🥈";
        tierText = "MASTER";
        tierClass = "tier-master";
        placementText = "Rank #2";
    } else if (rank === 3) {
        emoji = "🥉";
        tierText = "ELITE";
        tierClass = "tier-elite";
        placementText = "Rank #3";
    } else if (rank >= 4 && rank <= 10) {
        emoji = "🎖️";
        tierText = "PRO";
        tierClass = "tier-pro";
        placementText = `Rank #${rank}`;
    }
    
    elements.rankEmoji.innerText = emoji;
    elements.rankBadgeText.innerText = tierText;
    elements.rankBadgeContainer.classList.add(tierClass);
    elements.rankDetailPlaced.innerText = placementText;
    
    elements.rankBadgeContainer.classList.remove("hidden");
    elements.rankContinueBtn.classList.remove("hidden");
    
    // Play success chime
    playSuccessSound(tierClass.replace('tier-', ''));
    
    // Confetti particles explosion if top 3 placement
    if (rank <= 3) {
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(window.innerWidth / 2, window.innerHeight / 2, true));
        }
    }
}

function resetGame() {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    state.isFinished = false;
    state.charIndex = 0;
    state.mistakes = 0;
    state.correctCount = 0;
    state.totalTyped = 0;
    state.timelineData = [];
    
    elements.hiddenInput.value = "";
    elements.startOverlay.style.opacity = "1";
    elements.startOverlay.classList.remove("hidden");
    elements.resultsPanel.classList.add("hidden");
    
    elements.statWpm.innerText = "00";
    elements.statWpmSub.innerText = "gross: 00";
    elements.statAccuracy.innerText = "100%";
    elements.statAccuracySub.innerText = "0 mistakes";
    elements.statTime.innerText = `${state.testDuration}s`;
    
    elements.wordsContainer.scrollTop = 0;
    renderPrompt();
}

// ==========================================================================
// Performance Chart Drawer (Pure Dynamic SVG)
// ==========================================================================
function drawChart(dataPoints) {
    const svg = elements.timelineChart;
    svg.innerHTML = "";
    
    if (dataPoints.length === 0) return;
    
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const maxTime = Math.max(...dataPoints.map(d => d.time));
    const maxWpm = Math.max(60, ...dataPoints.map(d => d.wpm));
    
    const getX = (t) => padding + ((t / maxTime) * (width - 2 * padding));
    const getY_wpm = (w) => (height - padding) - ((w / maxWpm) * (height - 2 * padding));
    const getY_acc = (a) => (height - padding) - ((a / 100) * (height - 2 * padding));
    
    for (let i = 1; i <= 3; i++) {
        const y = padding + (i * (height - 2 * padding) / 4);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - padding);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "rgba(255,255,255,0.06)");
        line.setAttribute("stroke-dasharray", "4,4");
        svg.appendChild(line);
    }
    
    let wpmPath = `M ${getX(0)} ${getY_wpm(0)}`;
    let accPath = `M ${getX(0)} ${getY_acc(100)}`;
    
    dataPoints.forEach(pt => {
        wpmPath += ` L ${getX(pt.time)} ${getY_wpm(pt.wpm)}`;
        accPath += ` L ${getX(pt.time)} ${getY_acc(pt.acc)}`;
    });
    
    const wpmPolyline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wpmPolyline.setAttribute("d", wpmPath);
    wpmPolyline.setAttribute("fill", "none");
    wpmPolyline.setAttribute("stroke", getThemeParticleColor());
    wpmPolyline.setAttribute("stroke-width", "3");
    wpmPolyline.setAttribute("stroke-linecap", "round");
    wpmPolyline.setAttribute("stroke-linejoin", "round");
    svg.appendChild(wpmPolyline);
    
    const accPolyline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    accPolyline.setAttribute("d", accPath);
    accPolyline.setAttribute("fill", "none");
    accPolyline.setAttribute("stroke", "var(--accent-color)");
    accPolyline.setAttribute("stroke-width", "2");
    accPolyline.setAttribute("stroke-dasharray", "2,2");
    accPolyline.setAttribute("stroke-linecap", "round");
    accPolyline.setAttribute("stroke-linejoin", "round");
    svg.appendChild(accPolyline);
    
    dataPoints.forEach(pt => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", getX(pt.time));
        circle.setAttribute("cy", getY_wpm(pt.wpm));
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#0b071e");
        circle.setAttribute("stroke", getThemeParticleColor());
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
    });
}

// ==========================================================================
// Leaderboard Management (Local Storage)
// ==========================================================================
function saveSession(username, netWpm, accuracy, timeTaken, mistakes) {
    const scores = JSON.parse(localStorage.getItem("typemaster_scores") || "[]");
    const entry = {
        username,
        netWpm,
        accuracy,
        timeTaken: parseFloat(timeTaken.toFixed(1)),
        mistakes,
        date: new Date().toLocaleDateString()
    };
    
    scores.push(entry);
    scores.sort((a, b) => b.netWpm - a.netWpm || a.mistakes - b.mistakes);
    const topScores = scores.slice(0, 10);
    localStorage.setItem("typemaster_scores", JSON.stringify(topScores));
    renderLeaderboard(entry);
}

function renderLeaderboard(newEntry = null) {
    elements.leaderboardTable.innerHTML = "";
    const scores = JSON.parse(localStorage.getItem("typemaster_scores") || "[]");
    
    if (scores.length === 0) {
        elements.leaderboardTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted);">
                    No scores logged yet. Be the first to type!
                </td>
            </tr>
        `;
        return;
    }
    
    scores.forEach((score, index) => {
        const tr = document.createElement("tr");
        const isNewScore = newEntry && 
                           score.username === newEntry.username && 
                           score.netWpm === newEntry.netWpm && 
                           score.accuracy === newEntry.accuracy &&
                           score.timeTaken === newEntry.timeTaken &&
                           score.mistakes === newEntry.mistakes;
                           
        if (isNewScore) {
            tr.className = "highlighted leaderboard-row-glow";
            tr.id = "new-score-row";
        } else if (score.username === state.username) {
            tr.className = "highlighted";
        }
        
        tr.innerHTML = `
            <td>#${index + 1}</td>
            <td>${score.username}</td>
            <td><strong>${score.netWpm}</strong></td>
            <td>${score.accuracy}%</td>
            <td>${score.timeTaken}s</td>
            <td>${score.mistakes}</td>
            <td>${score.date}</td>
        `;
        elements.leaderboardTable.appendChild(tr);
    });
}

// ==========================================================================
// Configuration & UI Event Bindings
// ==========================================================================
function loadSettings() {
    const savedTheme = localStorage.getItem("typemaster_theme") || "cyberpunk";
    const savedUser = localStorage.getItem("typemaster_user");
    const savedSound = localStorage.getItem("typemaster_sound");
    
    if (savedTheme) {
        state.activeTheme = savedTheme;
        applyTheme(savedTheme);
    }
    
    if (savedSound !== null) {
        state.soundEnabled = savedSound === "true";
        updateSoundBtnUI();
    }
    
    if (savedUser) {
        state.username = savedUser;
        elements.displayUsername.innerText = savedUser;
    } else {
        elements.usernameModal.classList.remove("hidden");
    }
}

function applyTheme(themeName) {
    elements.body.className = "";
    elements.body.classList.add(`theme-${themeName}`);
    state.activeTheme = themeName;
    localStorage.setItem("typemaster_theme", themeName);
}

function updateSoundBtnUI() {
    elements.soundBtn.querySelector(".btn-icon").innerText = state.soundEnabled ? "🔊" : "🔇";
    elements.soundBtn.setAttribute("title", state.soundEnabled ? "Sound Enabled" : "Sound Muted");
}

function registerEventListeners() {
    window.addEventListener("resize", resizeCanvas);
    elements.wordsContainer.addEventListener("click", focusInput);
    elements.startOverlay.addEventListener("click", focusInput);
    elements.hiddenInput.addEventListener("input", processTyping);
    elements.hiddenInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (state.isRunning) {
                finishGame();
            }
        }
    });
    
    elements.soundBtn.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem("typemaster_sound", state.soundEnabled);
        updateSoundBtnUI();
        initAudio();
        playKeySound(true);
    });
    
    elements.themeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        elements.themeDropdown.classList.toggle("show");
    });
    
    document.addEventListener("click", () => {
        elements.themeDropdown.classList.remove("show");
    });
    
    elements.themeDropdown.querySelectorAll(".theme-opt").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const theme = e.target.dataset.theme;
            applyTheme(theme);
        });
    });
    
    elements.changeUserBtn.addEventListener("click", () => {
        elements.usernameInput.value = state.username;
        elements.usernameModal.classList.remove("hidden");
    });
    
    elements.saveUsernameBtn.addEventListener("click", () => {
        const nameInput = elements.usernameInput.value.trim();
        if (nameInput.length > 0) {
            state.username = nameInput;
            localStorage.setItem("typemaster_user", nameInput);
            elements.displayUsername.innerText = nameInput;
            elements.usernameModal.classList.add("hidden");
            renderLeaderboard();
            focusInput();
        }
    });
    
    elements.usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            elements.saveUsernameBtn.click();
        }
    });
    
    document.querySelectorAll(".mode-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
            document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");
            
            const mode = e.target.dataset.mode;
            state.activeMode = mode;
            
            if (mode === "custom") {
                elements.customTextPanel.classList.remove("hidden");
                elements.customTextInput.focus();
            } else {
                elements.customTextPanel.classList.add("hidden");
                selectPrompt();
            }
        });
    });
    
    elements.applyCustomBtn.addEventListener("click", () => {
        const customVal = elements.customTextInput.value.trim();
        if (customVal.length > 0) {
            state.customText = customVal;
            elements.customTextPanel.classList.add("hidden");
            selectPrompt();
        }
    });
    
    elements.cancelCustomBtn.addEventListener("click", () => {
        elements.customTextPanel.classList.add("hidden");
        document.querySelectorAll(".mode-tab").forEach(t => {
            if (t.dataset.mode === "standard") t.click();
        });
    });
    
    elements.retryBtn.addEventListener("click", () => {
        resetGame();
        focusInput();
    });
    
    elements.nextTestBtn.addEventListener("click", () => {
        const modeCycle = ["standard", "numbers", "quotes"];
        let nextIdx = (modeCycle.indexOf(state.activeMode) + 1) % modeCycle.length;
        if (nextIdx < 0) nextIdx = 0;
        
        const targetMode = modeCycle[nextIdx];
        document.querySelectorAll(".mode-tab").forEach(tab => {
            if (tab.dataset.mode === targetMode) {
                tab.click();
            }
        });
    });
    
    elements.clearLeaderboardBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all scores?")) {
            localStorage.removeItem("typemaster_scores");
            renderLeaderboard();
        }
    });
    
    elements.rankContinueBtn.addEventListener("click", () => {
        elements.rankModal.classList.add("hidden");
        elements.resultsPanel.classList.remove("hidden");
        
        const newRow = document.getElementById("new-score-row");
        if (newRow) {
            newRow.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}

// ==========================================================================
// Initialization Point
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    initParticles();
    animateParticles();
    loadSettings();
    registerEventListeners();
    selectPrompt();
    renderLeaderboard();
});
