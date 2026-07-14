"use client";

import React from "react";
import { useCrtSettings } from "@/lib/CrtSettingsContext";
import ScanlineOverlay from "./ScanlineOverlay";
import CurvedVignette from "./CurvedVignette";
import StaticNoiseLines from "./StaticNoiseLines";

interface RetroFrameProps {
  children: React.ReactNode;
}

export default function RetroFrame({ children }: RetroFrameProps) {
  const { settings, setTheme, setEffectsEnabled, setSoundEnabled } = useCrtSettings();

  return (
    <div className="flex-grow flex flex-col relative w-full h-full bg-[#1e1e1e] border-[16px] md:border-[24px] border-[#2d2d2d] rounded-[32px] md:rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_4px_16px_rgba(255,255,255,0.08),inset_0_-6px_20px_rgba(0,0,0,0.7)] p-4 md:p-6 select-none">
      {/* Inner Bezel shadow boundary */}
      <div className={`flex-grow flex flex-col relative bg-[#060606] rounded-[16px] md:rounded-[24px] border-4 md:border-8 border-[#151515] shadow-[inset_0_0_80px_rgba(0,0,0,1)] overflow-hidden ${
        settings.effectsEnabled ? "crt-flicker crt-glitch" : ""
      }`}>
        {/* CRT overlays */}
        <ScanlineOverlay />
        <CurvedVignette />
        <StaticNoiseLines />
        {/* Screen glass glossy shine overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-5 bg-gradient-to-tr from-transparent via-white/10 to-white/40"></div>

        {/* Content container */}
        <div className="flex-grow flex flex-col w-full h-full relative z-10 overflow-auto">
          {children}
        </div>
      </div>
      
      {/* Bottom control bezel panel */}
      <div className="mt-4 md:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-400">TYPEMASTER CRT-90</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
          <span>PAL SYSTEM</span>
        </div>

        {/* Dial knobs and dials */}
        <div className="flex items-center gap-4">
          {/* Color theme switch knob */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[7px] text-zinc-600 scale-90">COLOR</span>
            <button
              onClick={() => setTheme(settings.theme === "green" ? "amber" : "green")}
              className={`w-6 h-6 rounded-full border border-zinc-700 shadow-md active:scale-90 transition-all hover:bg-zinc-800 cursor-pointer flex items-center justify-center text-[8px] font-extrabold ${
                settings.theme === "green" ? "bg-[#182a15] text-[#39ff14]" : "bg-[#2a2215] text-[#ffb000]"
              }`}
              title="Toggle Phosphor Green / Amber Theme"
            >
              {settings.theme === "green" ? "GRN" : "AMB"}
            </button>
          </div>

          {/* Effects switch knob */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[7px] text-zinc-600 scale-90">EFFECTS</span>
            <button
              onClick={() => setEffectsEnabled(!settings.effectsEnabled)}
              className={`w-6 h-6 rounded-full border shadow-md active:scale-90 transition-all cursor-pointer flex items-center justify-center text-[8px] font-extrabold ${
                settings.effectsEnabled
                  ? "bg-zinc-900 border-zinc-700 text-emerald-400"
                  : "bg-zinc-800 border-zinc-800 text-zinc-500"
              }`}
              title="Toggle CRT Scanlines & Visual Filters"
            >
              {settings.effectsEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* Sound switch knob */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[7px] text-zinc-600 scale-90">AUDIO</span>
            <button
              onClick={() => setSoundEnabled(!settings.soundEnabled)}
              className={`w-6 h-6 rounded-full border shadow-md active:scale-90 transition-all cursor-pointer flex items-center justify-center text-[8px] font-extrabold ${
                settings.soundEnabled
                  ? "bg-zinc-900 border-zinc-700 text-emerald-400"
                  : "bg-zinc-800 border-zinc-800 text-zinc-500"
              }`}
              title="Toggle Keystroke & Error Sounds"
            >
              {settings.soundEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block"></div>

          {/* Power toggle/LED */}
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-zinc-600 scale-90">POWER</span>
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${
                settings.effectsEnabled
                  ? "bg-red-500 shadow-red-500/80 animate-pulse"
                  : "bg-red-950 border border-zinc-900 shadow-none"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
