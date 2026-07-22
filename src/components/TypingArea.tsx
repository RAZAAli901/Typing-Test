"use client";

import { useEffect, useRef, useState } from "react";

export interface KeystrokeEvent {
  char: string;
  timestamp: number;
  correct: boolean;
}

interface TypingAreaProps {
  text: string;
  isFinished: boolean;
  onKeyStroke?: (typed: string) => void;
  onKeystrokeEvent?: (event: KeystrokeEvent) => void;
}

export default function TypingArea({ text, isFinished, onKeyStroke, onKeystrokeEvent }: TypingAreaProps) {
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
      const prevLength = typedText.length;
      if (value.length > prevLength) {
        const addedChar = value[value.length - 1];
        const targetChar = text[value.length - 1];
        const isCorrect = addedChar === targetChar;
        if (onKeystrokeEvent) {
          onKeystrokeEvent({
            char: addedChar,
            timestamp: Date.now(),
            correct: isCorrect,
          });
        }
      }
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
      className="relative w-full bg-[#070707] border-2 border-crt-dim/40 rounded-lg p-6 md:p-8 min-h-[180px] cursor-text flex items-center justify-center font-vt323 text-2xl md:text-3xl select-none focus-within:border-crt-primary/60 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] transition-all"
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
      <div className="relative z-10 w-full max-w-4xl leading-relaxed tracking-wide text-crt-dim/50 text-justify flex flex-wrap gap-x-1.5 gap-y-3">
        {text.split(" ").map((word, wordIdx) => {
          // Calculate start and end indices of the word in the original text
          // to render cursor and highlight states correctly.
          const prevWords = text.split(" ").slice(0, wordIdx).join(" ");
          const wordStartIdx = prevWords ? prevWords.length + 1 : 0;
 
          return (
            <div key={wordIdx} className="flex">
              {word.split("").map((char, charIdx) => {
                const globalIdx = wordStartIdx + charIdx;
                let charClass = "char text-crt-dim/50 transition-colors duration-100";
 
                if (globalIdx < charIndex) {
                  const isCorrect = typedText[globalIdx] === text[globalIdx];
                  // If correct, apply primary phosphor glow, else warning red/amber glow
                  charClass = isCorrect
                    ? "char text-crt-primary font-bold drop-shadow-[0_0_8px_var(--color-crt-primary)]"
                    : "char text-red-500 bg-red-950/20 border border-red-500/30 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-shake font-bold";
                } else if (globalIdx === charIndex) {
                  // Apply retro blinking solid block cursor
                  charClass = "char crt-block-cursor";
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
                let spaceClass = "space-char text-crt-dim/30 transition-colors duration-100";
 
                if (spaceGlobalIdx < charIndex) {
                  const isCorrect = typedText[spaceGlobalIdx] === text[spaceGlobalIdx];
                  spaceClass = isCorrect
                    ? "space-char text-crt-primary/40"
                    : "space-char bg-red-950/30 border border-red-500/40";
                } else if (spaceGlobalIdx === charIndex) {
                  spaceClass = "space-char bg-crt-primary/20 crt-block-cursor";
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
        <div className="absolute bottom-3 right-4 text-xs text-crt-dim/50 pointer-events-none animate-pulse">
          Click box & start typing to begin...
        </div>
      )}
    </div>
  );
}
