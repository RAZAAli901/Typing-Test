"use client";

import { useEffect, useRef, useState } from "react";
import TypingArea from "@/components/TypingArea";
import StatsHUD from "@/components/StatsHUD";
import ResultsScreen from "@/components/ResultsScreen";
import {
  TEXT_ASSETS,
  generateRandomWords,
  generateDeterministicRandomWords,
  getDailyChallengeSeed,
  adjustPassageLength,
  ModeType,
  LengthType,
} from "@/content/texts";

// Extend ModeType to support "custom"
type ExtendedModeType = ModeType | "custom";

interface TimelineDataPoint {
  time: number;
  wpm: number;
  acc: number;
}

export default function PlayPage() {
  const [activeMode, setActiveMode] = useState<ExtendedModeType>("standard");
  const [activeLength, setActiveLength] = useState<LengthType>("medium");
  const [text, setText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Custom Text States
  const [customInputText, setCustomInputText] = useState("");
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Live Metrics States
  const [typedText, setTypedText] = useState("");
  const [totalTyped, setTotalTyped] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevTypedLengthRef = useRef(0);

  // Keep refs of live metrics to access inside timer interval closure safely
  const totalTypedRef = useRef(0);
  const mistakesRef = useRef(0);
  const correctCountRef = useRef(0);

  // Load initial settings from localStorage on mount (hydration safe)
  useEffect(() => {
    const savedMode = localStorage.getItem("typemaster_mode") as ExtendedModeType | null;
    const savedLength = localStorage.getItem("typemaster_length") as LengthType | null;

    const mode = savedMode || "standard";
    const len = savedLength || "medium";

    setActiveMode(mode);
    setActiveLength(len);

    if (mode === "custom") {
      setIsEditingCustom(true);
      setText("");
    } else {
      let rawText = "";
      if (mode === "random-words") {
        let wordCount = 30;
        if (len === "short") wordCount = 15;
        if (len === "long") wordCount = 60;
        rawText = generateRandomWords(wordCount);
      } else if (mode === "daily-challenge") {
        const seed = getDailyChallengeSeed();
        let wordCount = 30;
        if (len === "short") wordCount = 15;
        if (len === "long") wordCount = 60;
        rawText = generateDeterministicRandomWords(wordCount, seed);
      } else {
        rawText = TEXT_ASSETS[mode as keyof typeof TEXT_ASSETS] || TEXT_ASSETS.standard;
      }
      setText(adjustPassageLength(rawText, len));
    }
  }, []);

  // Update refs on state changes
  const correctCount = typedText.split("").reduce((acc, char, idx) => {
    return char === text[idx] ? acc + 1 : acc;
  }, 0);

  useEffect(() => {
    totalTypedRef.current = totalTyped;
    mistakesRef.current = mistakes;
    correctCountRef.current = correctCount;
  }, [totalTyped, mistakes, correctCount]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleKeyStroke = (typed: string) => {
    if (isFinished) return;

    setTypedText(typed);

    // Start timer on first keystroke
    if (typed.length === 1 && !isStarted) {
      setIsStarted(true);
      startTimeRef.current = performance.now();
      
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const now = performance.now();
          const elapsed = (now - startTimeRef.current) / 1000;
          setElapsedTime(elapsed);

          // Save timeline data every 2 seconds
          const roundedSeconds = Math.round(elapsed);
          if (roundedSeconds > 0 && roundedSeconds % 2 === 0) {
            setTimelineData((prev) => {
              if (prev.some((pt) => pt.time === roundedSeconds)) return prev;

              const minutes = elapsed / 60;
              const liveGross = Math.round((totalTypedRef.current / 5) / minutes);
              const liveNet = Math.max(
                0,
                Math.round(liveGross - mistakesRef.current / minutes)
              );
              const liveAcc =
                totalTypedRef.current > 0
                  ? (correctCountRef.current / totalTypedRef.current) * 100
                  : 100;

              return [...prev, { time: roundedSeconds, wpm: liveNet, acc: liveAcc }];
            });
          }
        }
      }, 100);
    }

    // Process keystroke metrics on additions
    const prevLength = prevTypedLengthRef.current;
    if (typed.length > prevLength) {
      const addedChar = typed[typed.length - 1];
      const targetChar = text[typed.length - 1];

      setTotalTyped((prev) => prev + 1);

      if (addedChar !== targetChar) {
        setMistakes((prev) => prev + 1);
      }
    }
    prevLengthRefUpdate(typed.length);

    // Check if fully typed
    if (typed.length === text.length && text.length > 0) {
      finishTest(typed);
    }
  };

  const prevLengthRefUpdate = (len: number) => {
    prevTypedLengthRef.current = len;
  };

  const finishTest = (finalTyped: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsFinished(true);
    
    // Final high-resolution duration calculation
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const finalElapsed = (now - startTimeRef.current) / 1000;
      setElapsedTime(finalElapsed);

      // Add final data point to timeline
      const finalMinutes = finalElapsed / 60;
      const finalGross = Math.round((totalTypedRef.current / 5) / finalMinutes);
      const finalNet = Math.max(
        0,
        Math.round(finalGross - mistakesRef.current / finalMinutes)
      );
      const finalAcc =
        totalTypedRef.current > 0
          ? (correctCountRef.current / totalTypedRef.current) * 100
          : 100;

      setTimelineData((prev) => {
        const roundedSeconds = Math.round(finalElapsed);
        if (prev.some((pt) => pt.time === roundedSeconds)) return prev;
        return [...prev, { time: roundedSeconds, wpm: finalNet, acc: finalAcc }];
      });
    }
  };

  const handleReset = (newMode?: ExtendedModeType, newLength?: LengthType) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsStarted(false);
    setIsFinished(false);
    setElapsedTime(0);
    setTypedText("");
    setTotalTyped(0);
    setMistakes(0);
    setTimelineData([]);
    startTimeRef.current = null;
    prevTypedLengthRef.current = 0;
    
    const targetMode = newMode || activeMode;
    const targetLength = newLength || activeLength;

    if (newMode) {
      setActiveMode(newMode);
      localStorage.setItem("typemaster_mode", newMode);
    }
    if (newLength) {
      setActiveLength(newLength);
      localStorage.setItem("typemaster_length", newLength);
    }

    if (targetMode === "custom") {
      setIsEditingCustom(true);
      setText("");
      return;
    } else {
      setIsEditingCustom(false);
    }

    let rawText = "";
    if (targetMode === "random-words") {
      let wordCount = 30;
      if (targetLength === "short") wordCount = 15;
      if (targetLength === "long") wordCount = 60;
      rawText = generateRandomWords(wordCount);
    } else if (targetMode === "daily-challenge") {
      const seed = getDailyChallengeSeed();
      let wordCount = 30;
      if (targetLength === "short") wordCount = 15;
      if (targetLength === "long") wordCount = 60;
      rawText = generateDeterministicRandomWords(wordCount, seed);
    } else {
      rawText = TEXT_ASSETS[targetMode as keyof typeof TEXT_ASSETS] || TEXT_ASSETS.standard;
    }

    const finalPassage = adjustPassageLength(rawText, targetLength);
    setText(finalPassage);
  };

  const handleApplyCustomText = () => {
    if (!customInputText.trim()) return;
    setIsEditingCustom(false);
    
    const finalPassage = adjustPassageLength(customInputText.trim(), activeLength);
    setText(finalPassage);
  };

  // Live calculation of metrics
  const elapsedMinutes = elapsedTime / 60;
  
  const grossWpm =
    elapsedTime > 0 ? Math.round((totalTyped / 5) / elapsedMinutes) : 0;
  
  const netWpm =
    elapsedTime > 0
      ? Math.max(0, Math.round(grossWpm - mistakes / elapsedMinutes))
      : 0;

  const accuracy = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 100;

  const modesList: { id: ExtendedModeType; label: string; icon: string }[] = [
    { id: "standard", label: "Standard", icon: "📝" },
    { id: "numbers", label: "Numbers", icon: "🔢" },
    { id: "quotes", label: "Quotes", icon: "💬" },
    { id: "code-snippet", label: "Code", icon: "💻" },
    { id: "punctuation", label: "Punctuation", icon: "🔣" },
    { id: "random-words", label: "Random", icon: "🔀" },
    { id: "daily-challenge", label: "Daily Challenge", icon: "📅" },
    { id: "custom", label: "Custom Text", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 max-w-4xl mx-auto w-full">
      {!isFinished ? (
        <>
          {/* Header Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">⚡ Practice Arena</h1>
            <p className="text-sm text-slate-400 font-light">
              Select a typing mode and challenge your speed.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="w-full flex flex-wrap gap-2 justify-center bg-slate-950/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
            {modesList.map((m) => {
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleReset(m.id, activeLength)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white bg-white/0 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Length Selector */}
          <div className="flex gap-3 items-center text-sm font-semibold text-slate-400">
            <span>Length:</span>
            <div className="flex bg-slate-950/40 p-1 rounded-xl border border-white/5">
              {(["short", "medium", "long"] as LengthType[]).map((len) => (
                <button
                  key={len}
                  onClick={() => handleReset(activeMode, len)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all duration-200 ${
                    activeLength === len
                      ? "bg-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Editing Area */}
          {activeMode === "custom" && isEditingCustom ? (
            <div className="w-full glass-panel rounded-2xl p-6 md:p-8 flex flex-col space-y-4 border border-white/10 shadow-lg">
              <h3 className="text-base font-bold text-white">Enter Custom Prompt Text</h3>
              <textarea
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="Paste your custom paragraph here to practice typing it..."
                className="w-full min-h-[120px] bg-slate-950/60 border border-white/10 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleApplyCustomText}
                  disabled={!customInputText.trim()}
                  className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Apply Prompt ⚡
                </button>
                <button
                  onClick={() => handleReset("standard", activeLength)}
                  className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white font-semibold text-sm cursor-pointer hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Live Stats HUD */}
              <StatsHUD
                grossWpm={grossWpm}
                netWpm={netWpm}
                accuracy={accuracy}
                mistakes={mistakes}
                elapsedTime={elapsedTime}
              />

              {/* Typing Area */}
              <div className="w-full">
                {text && (
                  <TypingArea text={text} isFinished={isFinished} onKeyStroke={handleKeyStroke} />
                )}
              </div>

              {/* Reset Action */}
              <button
                onClick={() => handleReset(activeMode, activeLength)}
                className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                Reset Test 🔄
              </button>
            </>
          )}
        </>
      ) : (
        <ResultsScreen
          grossWpm={grossWpm}
          netWpm={netWpm}
          accuracy={accuracy}
          mistakes={mistakes}
          elapsedTime={elapsedTime}
          timelineData={timelineData}
          onRetry={() => handleReset(activeMode, activeLength)}
        />
      )}
    </div>
  );
}
