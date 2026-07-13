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
  return (
    <div className="grid grid-cols-3 gap-2.5 md:gap-4 w-full max-w-4xl">
      {/* WPM Card */}
      <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 shadow-md transition-all duration-300">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Net Speed
        </span>
        <span className="text-3xl md:text-4xl font-mono font-extrabold text-cyan-400 mt-1">
          {netWpm}
        </span>
        <span className="text-[10px] text-slate-400 mt-1 font-light">
          gross: {grossWpm} WPM
        </span>
      </div>

      {/* Accuracy Card */}
      <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 shadow-md transition-all duration-300">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Accuracy
        </span>
        <span className="text-3xl md:text-4xl font-mono font-extrabold text-purple-400 mt-1">
          {accuracy.toFixed(1)}%
        </span>
        <span className="text-[10px] text-slate-400 mt-1 font-light">
          {mistakes} mistakes
        </span>
      </div>

      {/* Time Card */}
      <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 shadow-md transition-all duration-300">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Elapsed Time
        </span>
        <span className="text-3xl md:text-4xl font-mono font-extrabold text-pink-500 mt-1">
          {elapsedTime.toFixed(1)}s
        </span>
        <span className="text-[10px] text-slate-400 mt-1 font-light">
          stopwatch active
        </span>
      </div>
    </div>
  );
}
