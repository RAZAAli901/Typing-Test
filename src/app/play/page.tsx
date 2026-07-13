"use client";

import { useEffect, useRef, useState } from "react";
import TypingArea from "@/components/TypingArea";

const STANDARD_TEXT =
  "The old clock on the wall ticked softly as the afternoon light faded across the wooden floor. Sarah sat at the desk and opened her notebook to a fresh page. She had been working on the same chapter for three weeks and still could not find the right ending. Outside the window the maple tree swayed in the breeze and a single red leaf broke free and spiralled down to the ground. She watched it fall and felt something shift inside her. Sometimes an ending was not a conclusion but simply a pause before the next beginning.";

export default function PlayPage() {
  const [text, setText] = useState(STANDARD_TEXT);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleKeyStroke = (typed: string) => {
    if (isFinished) return;

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

    // Check if fully typed
    if (typed.length === text.length) {
      finishTest();
    }
  };

  const finishTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsFinished(true);
    // Final high-resolution duration calculation
    if (startTimeRef.current !== null) {
      const now = performance.now();
      setElapsedTime((now - startTimeRef.current) / 1000);
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsStarted(false);
    setIsFinished(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    // Force target text update if we need to reset the text
    setText(STANDARD_TEXT);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 max-w-4xl mx-auto w-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">⚡ Practice Arena</h1>
        <p className="text-sm text-slate-400 font-light">
          Type the text below. The timer will start automatically on your first keystroke.
        </p>
      </div>

      {/* Typing Area */}
      <div className="w-full">
        <TypingArea text={text} isFinished={isFinished} onKeyStroke={handleKeyStroke} />
      </div>

      {/* High-Resolution Timer Output for Step 8 verification */}
      <div className="flex items-center gap-4 bg-slate-900 border border-white/5 rounded-xl px-6 py-3">
        <span className="text-sm text-slate-400">Elapsed Time:</span>
        <span className="text-xl font-mono font-bold text-cyan-400">
          {elapsedTime.toFixed(2)}s
        </span>
      </div>

      {/* Reset Action */}
      <button
        onClick={handleReset}
        className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all"
      >
        Reset Test 🔄
      </button>
    </div>
  );
}
