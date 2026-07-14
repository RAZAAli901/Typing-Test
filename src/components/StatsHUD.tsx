"use client";

interface StatsHUDProps {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  elapsedTime: number;
}

export default function StatsHUD({
  grossWpm,
  netWpm,
  accuracy,
  mistakes,
  elapsedTime,
}: StatsHUDProps) {
  // Segmented digit LED/VFD readout panel styling
  return (
    <div className="grid grid-cols-3 gap-2.5 md:gap-4 w-full max-w-4xl font-vt323 select-none">
      {/* WPM Card */}
      <div className="bg-[#070707] border border-crt-dim/40 rounded p-4 flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-crt-primary/[0.01] pointer-events-none" />
        <span className="text-xs font-bold text-crt-dim uppercase tracking-wider">
          NET SPEED
        </span>
        <span className="text-4xl md:text-5xl font-black text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] mt-1 animate-pulse">
          {netWpm} <span className="text-xs font-bold text-crt-dim">WPM</span>
        </span>
        <span className="text-xs text-crt-dim mt-1 font-medium tracking-wide">
          GROSS: {grossWpm}
        </span>
      </div>

      {/* Accuracy Card */}
      <div className="bg-[#070707] border border-crt-dim/40 rounded p-4 flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-crt-primary/[0.01] pointer-events-none" />
        <span className="text-xs font-bold text-crt-dim uppercase tracking-wider">
          ACCURACY
        </span>
        <span className="text-4xl md:text-5xl font-black text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] mt-1">
          {accuracy.toFixed(1)}<span className="text-xs font-bold text-crt-dim">%</span>
        </span>
        <span className="text-xs text-crt-dim mt-1 font-medium tracking-wide">
          TYPOS: {mistakes}
        </span>
      </div>

      {/* Time Card */}
      <div className="bg-[#070707] border border-crt-dim/40 rounded p-4 flex flex-col items-center justify-center shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-crt-primary/[0.01] pointer-events-none" />
        <span className="text-xs font-bold text-crt-dim uppercase tracking-wider">
          ELAPSED TIME
        </span>
        <span className="text-4xl md:text-5xl font-black text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] mt-1">
          {elapsedTime.toFixed(1)}<span className="text-xs font-bold text-crt-dim">S</span>
        </span>
        <span className="text-xs text-crt-dim mt-1 font-medium tracking-wide">
          STOPWATCH
        </span>
      </div>
    </div>
  );
}
