"use client";

import { useEffect, useRef, useState } from "react";
import TypingArea from "@/components/TypingArea";
import StatsHUD from "@/components/StatsHUD";

const STANDARD_TEXT =
  "The old clock on the wall ticked softly as the afternoon light faded across the wooden floor. Sarah sat at the desk and opened her notebook to a fresh page. She had been working on the same chapter for three weeks and still could not find the right ending. Outside the window the maple tree swayed in the breeze and a single red leaf broke free and spiralled down to the ground. She watched it fall and felt something shift inside her. Sometimes an ending was not a conclusion but simply a pause before the next beginning.";

export default function PlayPage() {
  const [text, setText] = useState(STANDARD_TEXT);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Live Metrics States
  const [typedText, setTypedText] = useState("");
  const [totalTyped, setTotalTyped] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevTypedLengthRef = useRef(0);

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
        }
      }, 100);
    }

    // Process keystroke metrics on additions
    const prevLength = prevTypedLengthRef.current;
    if (typed.length > prevLength) {
      // User typed a new character
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
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsStarted(false);
    setIsFinished(false);
    setElapsedTime(0);
    setTypedText("");
    setTotalTyped(0);
    setMistakes(0);
    startTimeRef.current = null;
    prevTypedLengthRef.current = 0;
    setText(STANDARD_TEXT);
  };

  // Live calculation of metrics
  const elapsedMinutes = elapsedTime / 60;
  
  const correctCount = typedText.split("").reduce((acc, char, idx) => {
    return char === text[idx] ? acc + 1 : acc;
  }, 0);

  const grossWpm =
    elapsedTime > 0 ? Math.round((totalTyped / 5) / elapsedMinutes) : 0;
  
  const netWpm =
    elapsedTime > 0
      ? Math.max(0, Math.round(grossWpm - mistakes / elapsedMinutes))
      : 0;

  const accuracy = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 max-w-4xl mx-auto w-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">⚡ Practice Arena</h1>
        <p className="text-sm text-slate-400 font-light">
          Type the text below. The timer and metrics will update live.
        </p>
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
        onClick={handleReset}
        className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
      >
        Reset Test 🔄
      </button>
    </div>
  );
}
