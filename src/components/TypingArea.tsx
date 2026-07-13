"use client";

import { useEffect, useRef, useState } from "react";

interface TypingAreaProps {
  text: string;
  isFinished: boolean;
  onKeyStroke?: (typed: string) => void;
}

export default function TypingArea({ text, isFinished, onKeyStroke }: TypingAreaProps) {
  const [typedText, setTypedText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount and whenever isFinished changes
  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [isFinished]);

  const handleContainerClick = () => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;
    
    // Limit input length to target text length
    if (value.length <= text.length) {
      setTypedText(value);
      if (onKeyStroke) {
        onKeyStroke(value);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent navigating cursor away from the end of the text
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      e.preventDefault();
    }
  };

  // Reset typed text when prompt changes
  useEffect(() => {
    setTypedText("");
  }, [text]);

  const charIndex = typedText.length;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full glass-panel rounded-2xl p-6 md:p-8 min-h-[180px] cursor-text flex items-center justify-center font-mono text-lg md:text-xl select-none focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all"
    >
      {/* Hidden input to capture keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isFinished}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-0"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Target text display */}
      <div className="relative z-10 w-full max-w-4xl leading-relaxed tracking-wide text-slate-400 text-justify flex flex-wrap gap-x-1.5 gap-y-3">
        {text.split(" ").map((word, wordIdx) => {
          // Calculate start and end indices of the word in the original text
          // to render cursor and highlight states correctly.
          const prevWords = text.split(" ").slice(0, wordIdx).join(" ");
          const wordStartIdx = prevWords ? prevWords.length + 1 : 0;

          return (
            <div key={wordIdx} className="flex">
              {word.split("").map((char, charIdx) => {
                const globalIdx = wordStartIdx + charIdx;
                let charClass = "char text-slate-500 transition-colors duration-100";

                if (globalIdx < charIndex) {
                  const isCorrect = typedText[globalIdx] === text[globalIdx];
                  charClass = isCorrect
                    ? "char text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "char text-rose-500 bg-rose-500/15 border-b-2 border-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-shake";
                } else if (globalIdx === charIndex) {
                  charClass = "char text-cyan-400 bg-cyan-400/10 border-b-2 border-cyan-400 animate-pulse";
                }

                return (
                  <span key={charIdx} className={charClass}>
                    {char}
                  </span>
                );
              })}
              {/* Render space character after each word except the last one */}
              {wordIdx < text.split(" ").length - 1 && (() => {
                const spaceGlobalIdx = wordStartIdx + word.length;
                let spaceClass = "space-char text-slate-500 transition-colors duration-100";

                if (spaceGlobalIdx < charIndex) {
                  const isCorrect = typedText[spaceGlobalIdx] === text[spaceGlobalIdx];
                  spaceClass = isCorrect
                    ? "space-char text-emerald-400/50"
                    : "space-char bg-rose-500/30 border-b-2 border-rose-500";
                } else if (spaceGlobalIdx === charIndex) {
                  spaceClass = "space-char bg-cyan-400/15 border-b-2 border-cyan-400 animate-pulse";
                }

                return (
                  <span className={spaceClass}>
                    &nbsp;
                  </span>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Click placeholder instruction if not active */}
      {!isFinished && charIndex === 0 && (
        <div className="absolute bottom-3 right-4 text-xs text-slate-600 pointer-events-none animate-pulse">
          Click box & start typing to begin...
        </div>
      )}
    </div>
  );
}
