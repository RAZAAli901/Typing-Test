import Icon from "@/components/Icon";

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
        <div className="h-full flex items-center justify-center text-xs text-crt-dim font-bold">
          [NOT ENOUGH TIMELINE DATA TO GENERATE PLOT]
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
        className="w-full h-full text-crt-dim overflow-visible"
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
              stroke="var(--color-crt-dim)"
              strokeOpacity="0.2"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Accuracy Path (Dashed accent line colored dynamically to match CRT dim color) */}
        <path
          d={accPath}
          fill="none"
          stroke="var(--color-crt-dim)"
          strokeWidth="2"
          strokeDasharray="2 2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        />

        {/* WPM Path (Neon glowing line) */}
        <path
          d={wpmPath}
          fill="none"
          stroke="var(--color-crt-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 4px var(--color-crt-primary))" }}
        />

        {/* WPM Data Points Circles */}
        {timelineData.map((pt, idx) => (
          <circle
            key={idx}
            cx={getX(pt.time)}
            cy={getY_wpm(pt.wpm)}
            r="3.5"
            fill="#060606"
            stroke="var(--color-crt-primary)"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-2xl bg-[#080808] border-2 border-dashed border-crt-dim/50 rounded-lg p-6 md:p-8 space-y-6 font-vt323 shadow-[0_0_20px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(0,0,0,0.9)] text-crt-dim select-none">
      <div className="text-center border-b-2 border-dashed border-crt-dim/40 pb-4 space-y-2">
        <h2 className="text-3xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          *** SESSION REPORT ***
        </h2>
        <p className="text-xs text-crt-dim font-bold tracking-widest uppercase">
          TYPEMASTER TERMINAL CORE OUTPUT
        </p>
      </div>

      {/* Receipt Row Metrics */}
      <div className="space-y-4 text-xl text-crt-dim px-2">
        <div className="flex justify-between items-center">
          <span>NET SPEED (WPM)</span>
          <span className="flex-grow border-b border-dotted border-crt-dim/40 mx-2"></span>
          <span className="text-3xl font-black text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)]">{netWpm}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>ACCURACY (%)</span>
          <span className="flex-grow border-b border-dotted border-crt-dim/40 mx-2"></span>
          <span className="text-3xl font-black text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)]">{accuracy.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>GROSS SPEED (WPM)</span>
          <span className="flex-grow border-b border-dotted border-crt-dim/40 mx-2"></span>
          <span className="font-bold text-white/90">{grossWpm}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>ELAPSED DURATION (S)</span>
          <span className="flex-grow border-b border-dotted border-crt-dim/40 mx-2"></span>
          <span className="font-bold text-white/90">{elapsedTime.toFixed(1)}s</span>
        </div>
        <div className="flex justify-between items-center">
          <span>TOTAL TYPOS MADE</span>
          <span className="flex-grow border-b border-dotted border-crt-dim/40 mx-2"></span>
          <span className="font-bold text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]">{mistakes}</span>
        </div>
      </div>

      {/* SVG Performance Chart */}
      <div className="bg-[#050505] border border-crt-dim/30 rounded p-4 space-y-4 shadow-[inset_0_0_8px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between text-sm">
          <h4 className="font-bold text-crt-primary uppercase">PERFORMANCE TIMELINE</h4>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-crt-primary drop-shadow-[0_0_2px_var(--color-crt-primary)]">
              <span className="w-2 h-2 rounded-full bg-crt-primary"></span> SPEED
            </span>
            <span className="flex items-center gap-1.5 text-crt-dim">
              <span className="w-2.5 h-2.5 border border-dashed border-crt-dim rounded-full"></span> ACCURACY
            </span>
          </div>
        </div>
        <div className="h-[180px] w-full flex items-center justify-center bg-zinc-950/40 rounded p-2">
          {renderChart()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-2 border-t border-dashed border-crt-dim/30">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold text-lg rounded active:scale-95 transition-all shadow-[4px_4px_0px_var(--color-crt-dim)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer uppercase tracking-widest"
        >
          <span>Retry Practice</span>
          <Icon name="play" size={18} />
        </button>
      </div>
    </div>
  );
}
