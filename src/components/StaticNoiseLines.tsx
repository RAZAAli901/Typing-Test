"use client";

import { useCrtSettings } from "@/lib/CrtSettingsContext";

export default function StaticNoiseLines() {
  const { settings } = useCrtSettings();

  if (!settings.effectsEnabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Primary tracking line */}
      <div 
        className="absolute left-0 w-full h-[60px] bg-white/[0.015] blur-[4px] pointer-events-none"
        style={{
          animation: settings.reducedMotion ? "none" : "crt-static-roll 15s linear infinite",
          top: "-60px"
        }}
      />
      {/* Secondary fast tracking line */}
      <div 
        className="absolute left-0 w-full h-[20px] bg-white/[0.01] blur-[2px] pointer-events-none"
        style={{
          animation: settings.reducedMotion ? "none" : "crt-static-roll 6s linear infinite",
          animationDelay: "3s",
          top: "-20px"
        }}
      />
    </div>
  );
}
