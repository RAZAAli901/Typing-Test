"use client";

import { useEffect, useState } from "react";
import { useCrtSettings } from "@/lib/CrtSettingsContext";

interface RetroBootScreenProps {
  onComplete: () => void;
}

export default function RetroBootScreen({ onComplete }: RetroBootScreenProps) {
  const { settings } = useCrtSettings();
  const [phase, setPhase] = useState<"on-anim" | "booting" | "off-anim">("on-anim");
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLines = [
    { text: "CONNECTING TO HOST...", delay: 200 },
    { text: "CONNECTION SECURE. LINK ESTABLISHED.", delay: 550 },
    { text: "LOADING TYPEMASTER SYSTEM CONFIG v1.0.0...", delay: 900 },
    { text: "640KB RAM SYSTEM CHECK - OK", delay: 1250 },
    { text: "CALIBRATING TIME & WORD DATABASE CORE... OK", delay: 1550 },
    { text: "INITIALIZING WPM GRAPHICS HUD SYSTEM... OK", delay: 1850 },
    { text: "PREPARING OPERATING ENVIRONMENT...", delay: 2150 },
  ];

  useEffect(() => {
    if (settings.reducedMotion) {
      setPhase("booting");
      return;
    }

    const timer1 = setTimeout(() => {
      setPhase("booting");
    }, 600);

    return () => clearTimeout(timer1);
  }, [settings.reducedMotion]);

  useEffect(() => {
    if (phase !== "booting") return;

    const timers: NodeJS.Timeout[] = [];

    bootLines.forEach((line) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
      }, line.delay);
      timers.push(t);
    });

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    const completeTimer = setTimeout(() => {
      if (settings.reducedMotion) {
        onComplete();
      } else {
        setPhase("off-anim");
      }
    }, 3600);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [phase, settings.reducedMotion, onComplete]);

  useEffect(() => {
    if (phase === "off-anim") {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 550);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, onComplete]);

  const getProgressBar = () => {
    const totalBlocks = 20;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const bar = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
    return `┌──────────────────────┐\n│ ${bar} ${String(progress).padStart(3)}% │\n└──────────────────────┘`;
  };

  let animClass = "";
  if (phase === "on-anim") {
    animClass = "animate-crt-power-on";
  } else if (phase === "off-anim") {
    animClass = "animate-crt-power-off";
  }

  return (
    <div className={`fixed inset-0 bg-[#060606] p-8 font-mono text-xs md:text-sm text-crt-primary z-50 flex flex-col justify-start items-start space-y-3 select-none overflow-hidden ${animClass}`}>
      {phase !== "on-anim" && (
        <>
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center">
              <span className="mr-2">&gt;</span>
              <span>{line}</span>
            </div>
          ))}

          {progress > 0 && (
            <div className="flex flex-col space-y-1 pt-2 w-full max-w-md">
              <div className="text-[10px] text-crt-dim font-bold">LOADING SYSTEM CORE FILE RESOURCE BANK:</div>
              <pre className="font-bold tracking-wider leading-normal text-crt-primary whitespace-pre">{getProgressBar()}</pre>
            </div>
          )}

          {progress === 100 && (
            <div className="pt-4 flex items-center space-x-1 animate-pulse">
              <span className="font-extrabold">SYSTEM READY. EXECUTING SHELL...</span>
              <span className="w-2.5 h-4 bg-crt-primary"></span>
            </div>
          )}

          {progress < 100 && (
            <div className="flex items-center">
              <span className="w-2 h-3.5 bg-crt-primary animate-[blink_0.8s_infinite_alternate]"></span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
