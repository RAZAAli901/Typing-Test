"use client";

const METRICS = [
  {
    name: "Gross WPM (Words Per Minute)",
    formula: "Gross WPM = (Total Keys Typed / 5) / Time (Minutes)",
    desc: "Gross WPM measures raw typing speed without accounting for mistakes. In typing standards, a 'word' is defined as exactly 5 keystrokes (including spaces) to normalize comparisons across different languages.",
    icon: "📈",
  },
  {
    name: "Net WPM (Net Words Per Minute)",
    formula: "Net WPM = Gross WPM - (Uncorrected Errors / Time (Minutes))",
    desc: "Net WPM is the true industry metric for typing efficiency. It penalizes mistakes by subtracting the speed cost of uncorrected errors over time. A Net WPM of 40-50 is average, while 80+ is highly professional.",
    icon: "🎯",
  },
  {
    name: "Accuracy Percentage",
    formula: "Accuracy = (Correct Characters / Total Keys Typed) x 100",
    desc: "Accuracy indicates typing precision. High speeds are counter-productive if accuracy falls below 90%. Maintaining a score of 95% or higher is recommended for professional typing consistency.",
    icon: "⚖️",
  },
];

const MODES = [
  {
    name: "Standard Mode",
    desc: "Focuses on clean, fluid English text passages with balanced sentence structures. Great for checking your baseline speed.",
    icon: "📝",
  },
  {
    name: "Numbers Mode",
    desc: "Presents batch reports, ambient decimals, serial numbers, and statistics. Essential training for bookkeeping and data entry fields.",
    icon: "🔢",
  },
  {
    name: "Quotes Mode",
    desc: "Features famous quotes and philosophy excerpts. Exercises capital letters, basic spacing, and varying prompt structures.",
    icon: "💬",
  },
  {
    name: "Code Snippet Mode",
    desc: "Loads real code snippets (functions, variables, loops) with heavy braces, brackets, logic operators, and indentations. Perfect for developers.",
    icon: "💻",
  },
  {
    name: "Punctuation Mode",
    desc: "A text prompt saturated with complex symbols, hyphens, dashes, exclamation points, and brackets. Excellent for keyboard layout mastery.",
    icon: "🔣",
  },
  {
    name: "Random Words Mode",
    desc: "Assembles dynamic passages from our local word bank. Prevents memory recall, forcing visual scanning of individual word strings.",
    icon: "🔀",
  },
  {
    name: "Daily Challenge Mode",
    desc: "Uses a deterministic, date-seeded prompt shared by all global visitors. Compete daily on even grounds on the Leaderboard.",
    icon: "📅",
  },
  {
    name: "Custom Text Mode",
    desc: "Paste in custom training prompts from your clipboard. Practice specifically on reports, scripts, or passages you type daily.",
    icon: "⚙️",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          ℹ️ About TypeMaster
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-light max-w-lg mx-auto">
          Learn how your typing metrics are measured and explore the skills tested by each practice mode.
        </p>
      </div>

      {/* Calculations & Formulas Section */}
      <div className="space-y-6">
        <div className="border-b border-white/5 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🧮 How We Calculate Your Speed
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/20 space-y-4 hover:border-cyan-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{metric.icon}</span>
                <h3 className="text-base font-bold text-white">{metric.name}</h3>
              </div>
              <div className="bg-slate-950/80 border border-white/5 p-3.5 rounded-xl font-mono text-xs text-cyan-400 select-all text-center md:text-left">
                {metric.formula}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {metric.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modes Legend Section */}
      <div className="space-y-6">
        <div className="border-b border-white/5 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎮 Typing Challenge Modes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map((mode, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/10 flex gap-4 hover:border-purple-500/10 transition-all duration-300"
            >
              <span className="text-3xl self-start mt-1">{mode.icon}</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{mode.name}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {mode.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Origin Note Callout */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-950/10 to-purple-950/10 text-center space-y-2">
        <h4 className="text-sm font-bold text-white">✨ Rebuilt for the Modern Web</h4>
        <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
          TypeMaster Web is a complete Next.js port of the original TypeMaster C++ CLI. While the terminal game had to calculate limits without standard string or time containers, the web version introduces high-precision web APIs, client-side persistence, and a global PostgreSQL-backed leaderboard.
        </p>
      </div>
    </div>
  );
}
