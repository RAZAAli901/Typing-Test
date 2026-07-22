"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/8bit/button";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { useSession } from "next-auth/react";
import TypingArea, { KeystrokeEvent } from "@/components/TypingArea";
import StatsHUD from "@/components/StatsHUD";
import ResultsScreen from "@/components/ResultsScreen";
import { useCrtSettings } from "@/lib/CrtSettingsContext";
import { playKeystrokeClick, playErrorBuzz } from "@/lib/audio";
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
  const { data: session } = useSession();
  const { settings } = useCrtSettings();
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
  const keystrokeEventsRef = useRef<KeystrokeEvent[]>([]);

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
        if (settings.soundEnabled) {
          playErrorBuzz();
        }
      } else {
        if (settings.soundEnabled) {
          playKeystrokeClick();
        }
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

  const finishTest = async (finalTyped: string) => {
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

      // Save results locally to localStorage as a fallback / local history
      if (typeof window !== "undefined") {
        const isLoggedIn = !!session?.user?.name;
        const currentUsername = session?.user?.name || localStorage.getItem("typemaster_username") || "Anonymous";
        try {
          const localSessionsStr = localStorage.getItem("typemaster_local_sessions") || "[]";
          const localSessions = JSON.parse(localSessionsStr);
          const newSession = {
            id: Math.random().toString(36).substring(2, 9),
            username: currentUsername,
            mode: activeMode,
            grossWpm: Math.round(finalGross),
            netWpm: Math.round(finalNet),
            accuracy: Number(finalAcc.toFixed(1)),
            timeTakenSeconds: Number(finalElapsed.toFixed(1)),
            charsTyped: totalTypedRef.current,
            mistakes: mistakesRef.current,
            createdAt: new Date().toISOString(),
          };
          localSessions.push(newSession);
          localStorage.setItem("typemaster_local_sessions", JSON.stringify(localSessions));
        } catch (e) {
          console.error("Error saving local session:", e);
        }

        // Post results to database leaderboard if logged in OR username is claimed
        const shouldSaveToDb = isLoggedIn || (currentUsername && currentUsername !== "Anonymous" && currentUsername.trim().length >= 3);
        if (shouldSaveToDb) {
          try {
            await fetch("/api/sessions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: currentUsername.trim(),
                mode: activeMode,
                grossWpm: Math.round(finalGross),
                netWpm: Math.round(finalNet),
                accuracy: Number(finalAcc.toFixed(1)),
                timeTakenSeconds: Number(finalElapsed.toFixed(1)),
                charsTyped: totalTypedRef.current,
                mistakes: mistakesRef.current,
              }),
            });
          } catch (err) {
            console.error("Error saving typing session to leaderboard:", err);
          }
        }
      }
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
    keystrokeEventsRef.current = [];
    
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

  const modesList: { id: ExtendedModeType; label: string; icon: any; desc: string }[] = [
    {
      id: "standard",
      label: "Standard",
      icon: "standard",
      desc: "Standard — practice classic prose with balanced sentences to find your baseline rhythm.",
    },
    {
      id: "numbers",
      label: "Numbers",
      icon: "numbers",
      desc: "Numbers — practice reports, figures, decimal coordinates, and technical data entry.",
    },
    {
      id: "quotes",
      label: "Quotes",
      icon: "quotes",
      desc: "Quotes — type famous quotes and philosophy from historic writers.",
    },
    {
      id: "code-snippet",
      label: "Code",
      icon: "code",
      desc: "Code Snippet — practice programming structures, braces, syntax, and semicolons.",
    },
    {
      id: "punctuation",
      label: "Punctuation",
      icon: "punctuation",
      desc: "Punctuation — challenge yourself with brackets, dashes, quotes, and symbols.",
    },
    {
      id: "random-words",
      label: "Random",
      icon: "random",
      desc: "Random Words — type shuffled common words to train visual reflex and speed.",
    },
    {
      id: "daily-challenge",
      label: "Daily Challenge",
      icon: "daily",
      desc: "Daily Challenge — a seed-driven challenge shared by all visitors globally, refreshed daily.",
    },
    {
      id: "custom",
      label: "Custom Text",
      icon: "custom",
      desc: "Custom Text — practice with paragraphs pasted directly from your clipboard.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-6 max-w-4xl mx-auto w-full relative">
      {/* Decorative CRT Channel Indicator overlay */}
      <div className="absolute top-2 right-4 bg-[#070707] border border-crt-dim/50 px-2 py-0.5 rounded text-[10px] font-bold text-crt-primary tracking-widest uppercase shadow-[0_0_8px_rgba(57,255,20,0.1)] select-none z-10">
        CH 04 — {activeMode.replace("-", " ")}
      </div>

      {!isFinished ? (
        <>
          {/* Header Title */}
          <div className="text-center space-y-2 select-none">
            <h1 className="text-3xl md:text-4xl font-extrabold text-crt-primary flex items-center justify-center gap-2 font-vt323 uppercase tracking-widest drop-shadow-[0_0_6px_var(--color-crt-primary)]">
              <Icon name="play" size={24} className="text-crt-primary animate-pulse" />
              <span>Practice Arena</span>
            </h1>
            <p className="text-sm text-crt-dim font-bold font-vt323 uppercase tracking-widest">
              Select a typing mode and challenge your typing speed.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <Tabs value={activeMode} onValueChange={(val: string) => handleReset(val as ModeType, activeLength)}>
            <TabsList className="w-full flex flex-wrap gap-2 justify-center">
              {modesList.map((m) => (
                <TabsTrigger key={m.id} value={m.id}>
                  <Icon name={m.icon} size={16} className={activeMode === m.id ? "text-crt-primary" : "text-crt-dim"} />
                  <span>{m.label.toUpperCase()}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Mode Selector Description */}
          <div className="text-center text-sm text-crt-dim font-bold tracking-wider uppercase max-w-lg leading-relaxed bg-zinc-950/40 border border-crt-dim/20 px-4 py-2.5 rounded font-vt323">
            {modesList.find((m) => m.id === activeMode)?.desc.toUpperCase()}
          </div>

          {/* Length Selector */}
          <div className="flex gap-3 items-center text-sm font-bold text-crt-dim uppercase tracking-wider font-vt323">
            <span>SELECT LENGTH:</span>
            <div className="flex gap-1 bg-[#070707] p-0.5 rounded border border-crt-dim/20">
              {(["short", "medium", "long"] as LengthType[]).map((len) => (
                <Button
                  key={len}
                  onClick={() => handleReset(activeMode, len)}
                  variant={activeLength === len ? "default" : "ghost"}
                  size="sm"
                >
                  {len}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Text Editing Area */}
          {activeMode === "custom" && isEditingCustom ? (
            <div className="w-full bg-[#080808] border-2 border-crt-dim/40 rounded p-6 md:p-8 flex flex-col space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.9)] font-vt323 text-lg text-crt-dim">
              <h3 className="text-xl font-black text-crt-primary uppercase">ENTER CUSTOM PROMPT TEXT</h3>
              <Textarea
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="PASTE YOUR CUSTOM PARAGRAPH HERE TO PRACTICE TYPING IT..."
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApplyCustomText}
                  disabled={!customInputText.trim()}
                  size="sm"
                >
                  <span>Apply Prompt</span>
                  <Icon name="play" size={14} />
                </Button>
                <Button
                  onClick={() => handleReset("standard", activeLength)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
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
                  <TypingArea
                    text={text}
                    isFinished={isFinished}
                    onKeyStroke={handleKeyStroke}
                    onKeystrokeEvent={(evt) => keystrokeEventsRef.current.push(evt)}
                  />
                )}
              </div>

              {/* Reset Action */}
              <Button
                onClick={() => handleReset(activeMode, activeLength)}
                size="sm"
              >
                <span>Reset Test</span>
                <Icon name="play" size={14} />
              </Button>
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
