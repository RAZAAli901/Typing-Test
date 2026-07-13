"use client";

import { useEffect, useRef, useState } from "react";
import TypingArea from "@/components/TypingArea";
import StatsHUD from "@/components/StatsHUD";
import ResultsScreen from "@/components/ResultsScreen";

const STANDARD_TEXT =
  "The old clock on the wall ticked softly as the afternoon light faded across the wooden floor. Sarah sat at the desk and opened her notebook to a fresh page. She had been working on the same chapter for three weeks and still could not find the right ending. Outside the window the maple tree swayed in the breeze and a single red leaf broke free and spiralled down to the ground. She watched it fall and felt something shift inside her. Sometimes an ending was not a conclusion but simply a pause before the next beginning.";

interface TimelineDataPoint {
  time: number;
  wpm: number;
  acc: number;
}

type ModeType =
  | "standard"
  | "numbers"
  | "quotes"
  | "code-snippet"
  | "punctuation"
  | "random-words"
  | "daily-challenge";

export default function PlayPage() {
  const [activeMode, setActiveMode] = useState<ModeType>("standard");
  const [text, setText] = useState(STANDARD_TEXT);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

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
    prevTypedLengthRef.current = typed.length;

    // Check if fully typed
    if (typed.length === text.length) {
      finishTest(typed);
    }
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

  const handleReset = (newMode?: ModeType) => {
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
    
    if (newMode) {
      setActiveMode(newMode);
      // Temporary placeholder texts until Step 16 content module is created
      if (newMode === "numbers") {
        setText("123 456 789 0.12 34.56 78-90 2026 07 13 42.6");
      } else if (newMode === "quotes") {
        setText("In the middle of every difficulty lies opportunity said Albert Einstein.");
      } else if (newMode === "code-snippet") {
        setText("const x = () => { return 42; }; console.log(x());");
      } else if (newMode === "punctuation") {
        setText("Hello, world! Can you type: symbols (like @, #, $, and %)? Yes!");
      } else {
        setText(STANDARD_TEXT);
      }
    } else {
      setText(STANDARD_TEXT);
    }
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

  const modesList: { id: ModeType; label: string; icon: string }[] = [
    { id: "standard", label: "Standard", icon: "📝" },
    { id: "numbers", label: "Numbers", icon: "🔢" },
    { id: "quotes", label: "Quotes", icon: "💬" },
    { id: "code-snippet", label: "Code", icon: "💻" },
    { id: "punctuation", label: "Punctuation", icon: "🔣" },
    { id: "random-words", label: "Random Words", icon: "🔀" },
    { id: "daily-challenge", label: "Daily Challenge", icon: "📅" },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 max-w-4xl mx-auto w-full">
      {!isFinished ? (
        <>
          {/* Header Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">⚡ Practice Arena</h1>
            <p className="text-sm text-slate-400 font-light">
              Select a typing mode below to challenge your speed.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="w-full flex flex-wrap gap-2 justify-center bg-slate-950/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
            {modesList.map((m) => {
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleReset(m.id)}
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
            <TypingArea text={text} isFinished={isFinished} onKeyStroke={handleKeyStroke} />
          </div>

          {/* Reset Action */}
          <button
            onClick={() => handleReset(activeMode)}
            className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            Reset Test 🔄
          </button>
        </>
      ) : (
        <ResultsScreen
          grossWpm={grossWpm}
          netWpm={netWpm}
          accuracy={accuracy}
          mistakes={mistakes}
          elapsedTime={elapsedTime}
          timelineData={timelineData}
          onRetry={() => handleReset(activeMode)}
        />
      )}
    </div>
  );
}
