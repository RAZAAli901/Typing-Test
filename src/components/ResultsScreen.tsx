"use client";

interface TimelineDataPoint {
  time: number;
  wpm: number;
  acc: number;
}

interface ResultsScreenProps {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  elapsedTime: number;
  timelineData: TimelineDataPoint[];
  onRetry: () => void;
}

export default function ResultsScreen({
  grossWpm,
  netWpm,
  accuracy,
  mistakes,
  elapsedTime,
  timelineData,
  onRetry,
}: ResultsScreenProps) {
  // SVG Chart Dimensions
  const svgWidth = 500;
  const svgHeight = 150;
  const padding = 20;

  // Compute SVG coordinates for the graph
  const renderChart = () => {
    if (timelineData.length < 2) {
      return (
        <div className="h-full flex items-center justify-center text-xs text-slate-500 font-light">
          Not enough timeline data to draw speed curves (test must be &gt; 2 seconds).
        </div>
      );
    }

    const maxTime = Math.max(...timelineData.map((d) => d.time), 1);
    const maxWpm = Math.max(60, ...timelineData.map((d) => d.wpm), grossWpm);

    const getX = (t: number) =>
      padding + ((t / maxTime) * (svgWidth - 2 * padding));
    
    const getY_wpm = (w: number) =>
      (svgHeight - padding) - ((w / maxWpm) * (svgHeight - 2 * padding));
    
    const getY_acc = (a: number) =>
      (svgHeight - padding) - ((a / 100) * (svgHeight - 2 * padding));

    // Generate path descriptions
    let wpmPath = `M ${getX(0)} ${getY_wpm(0)}`;
    let accPath = `M ${getX(0)} ${getY_acc(100)}`;

    timelineData.forEach((pt) => {
      wpmPath += ` L ${getX(pt.time)} ${getY_wpm(pt.wpm)}`;
      accPath += ` L ${getX(pt.time)} ${getY_acc(pt.acc)}`;
    });

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full text-slate-500 overflow-visible"
      >
        {/* Horizontal grid guide lines */}
        {[1, 2, 3].map((i) => {
          const y = padding + (i * (svgHeight - 2 * padding)) / 4;
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={svgWidth - padding}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Accuracy Path (Dashed accent line) */}
        <path
          d={accPath}
          fill="none"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* WPM Path (Neon glowing line) */}
        <path
          d={wpmPath}
          fill="none"
          stroke="#00f2fe"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]"
        />

        {/* WPM Data Points Circles */}
        {timelineData.map((pt, idx) => (
          <circle
            key={idx}
            cx={getX(pt.time)}
            cy={getY_wpm(pt.wpm)}
            r="4"
            fill="#030014"
            stroke="#00f2fe"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl glass-panel rounded-2xl p-6 md:p-8 space-y-8 border border-white/10 shadow-2xl animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          🎉 Session Results
        </h2>
        <p className="text-xs text-slate-400 font-light">
          Congratulations on completing this typing sprint! Here is your performance overview.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Net WPM */}
        <div className="glass-panel bg-cyan-950/20 border-cyan-800/30 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Net WPM
          </span>
          <span className="text-3xl md:text-4xl font-mono font-extrabold text-cyan-400 mt-1">
            {netWpm}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 font-light">
            typing speed
          </span>
        </div>

        {/* Accuracy */}
        <div className="glass-panel bg-purple-950/20 border-purple-800/30 rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Accuracy
          </span>
          <span className="text-3xl md:text-4xl font-mono font-extrabold text-purple-400 mt-1">
            {accuracy.toFixed(1)}%
          </span>
          <span className="text-[9px] text-slate-500 mt-1 font-light">
            correct keys
          </span>
        </div>

        {/* Gross WPM */}
        <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Gross WPM
          </span>
          <span className="text-2xl md:text-3xl font-mono font-bold text-slate-300 mt-1">
            {grossWpm}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 font-light">
            keystroke speed
          </span>
        </div>

        {/* Time Taken */}
        <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Time Taken
          </span>
          <span className="text-2xl md:text-3xl font-mono font-bold text-slate-300 mt-1">
            {elapsedTime.toFixed(1)}s
          </span>
          <span className="text-[9px] text-slate-500 mt-1 font-light">
            duration
          </span>
        </div>

        {/* Mistakes */}
        <div className="glass-panel bg-rose-950/10 border-rose-900/20 rounded-xl p-4 flex flex-col items-center justify-center col-span-2 md:col-span-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Mistakes
          </span>
          <span className="text-2xl md:text-3xl font-mono font-bold text-rose-400 mt-1">
            {mistakes}
          </span>
          <span className="text-[9px] text-slate-500 mt-1 font-light">
            typos made
          </span>
        </div>
      </div>

      {/* SVG Performance Chart */}
      <div className="glass-panel rounded-xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">WPM and Accuracy Timeline</h4>
          <div className="flex gap-4 text-[10px] font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> WPM
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 border border-dashed border-purple-400 rounded-full"></span> Accuracy
            </span>
          </div>
        </div>
        <div className="h-[180px] w-full flex items-center justify-center bg-slate-950/20 border border-white/5 rounded-lg p-2">
          {renderChart()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-md hover:shadow-cyan-400/20 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          Try Again 🔄
        </button>
      </div>
    </div>
  );
}
