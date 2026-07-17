"use client";

import Icon from "@/components/Icon";

const METRICS = [
  {
    name: "Gross WPM (Words Per Minute)",
    formula: "Gross WPM = (Total Keys Typed / 5) / Time (Minutes)",
    desc: "Gross WPM measures raw typing speed without accounting for mistakes. In typing standards, a 'word' is defined as exactly 5 keystrokes (including spaces) to normalize comparisons across different languages.",
    icon: "chart",
  },
  {
    name: "Net WPM (Net Words Per Minute)",
    formula: "Net WPM = Gross WPM - (Uncorrected Errors / Time (Minutes))",
    desc: "Net WPM is the true industry metric for typing efficiency. It penalizes mistakes by subtracting the speed cost of uncorrected errors over time. A Net WPM of 40-50 is average, while 80+ is highly professional.",
    icon: "target",
  },
  {
    name: "Accuracy Percentage",
    formula: "Accuracy = (Correct Characters / Total Keys Typed) x 100",
    desc: "Accuracy indicates typing precision. High speeds are counter-productive if accuracy falls below 90%. Maintaining a score of 95% or higher is recommended for professional typing consistency.",
    icon: "scale",
  },
];

const MODES = [
  {
    name: "Standard Mode",
    desc: "Focuses on clean, fluid English text passages with balanced sentence structures. Great for checking your baseline speed.",
    icon: "standard",
  },
  {
    name: "Numbers Mode",
    desc: "Presents batch reports, ambient decimals, serial numbers, and statistics. Essential training for bookkeeping and data entry fields.",
    icon: "numbers",
  },
  {
    name: "Quotes Mode",
    desc: "Features famous quotes and philosophy excerpts. Exercises capital letters, basic spacing, and varying prompt structures.",
    icon: "quotes",
  },
  {
    name: "Code Snippet Mode",
    desc: "Loads real code snippets (functions, variables, loops) with heavy braces, brackets, logic operators, and indentations. Perfect for developers.",
    icon: "code",
  },
  {
    name: "Punctuation Mode",
    desc: "A text prompt saturated with complex symbols, hyphens, dashes, exclamation points, and brackets. Excellent for keyboard layout mastery.",
    icon: "punctuation",
  },
  {
    name: "Random Words Mode",
    desc: "Assembles dynamic passages from our local word bank. Prevents memory recall, forcing visual scanning of individual word strings.",
    icon: "random",
  },
  {
    name: "Daily Challenge Mode",
    desc: "Uses a deterministic, date-seeded prompt shared by all global visitors. Compete daily on even grounds on the Leaderboard.",
    icon: "daily",
  },
  {
    name: "Custom Text Mode",
    desc: "Paste in custom training prompts from your clipboard. Practice specifically on reports, scripts, or passages you type daily.",
    icon: "custom",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-12 font-vt323 text-lg text-crt-dim select-none">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)] flex items-center justify-center gap-3">
          <Icon name="info" size={32} className="text-crt-primary drop-shadow-[0_0_5px_var(--color-crt-primary)]" />
          <span>ABOUT TYPEMASTER</span>
        </h1>
        <p className="text-sm md:text-base text-crt-dim font-bold tracking-widest uppercase">
          Learn how your typing metrics are measured and explore the skills tested by each practice mode.
        </p>
      </div>

      {/* Calculations & Formulas Section */}
      <div className="space-y-6">
        <div className="border-b border-crt-dim/30 pb-2">
          <h2 className="text-2xl font-black text-crt-primary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_4px_var(--color-crt-primary)]">
            <Icon name="grid" size={24} className="text-crt-primary" />
            <span>SPEED CALCULATION METRICS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#070707] border-2 border-crt-dim/40 p-6 rounded shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] space-y-4 hover:border-crt-primary/60 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-crt-primary/[0.01] pointer-events-none" />
              <div className="flex items-center gap-3">
                <Icon name={metric.icon as any} className="text-crt-primary" size={28} />
                <h3 className="text-xl font-bold text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)]">{metric.name.toUpperCase()}</h3>
              </div>
              <div className="bg-[#000000] border-2 border-crt-dim/50 p-3.5 rounded font-mono text-xs md:text-sm text-crt-primary select-all text-center md:text-left shadow-[inset_0_0_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_var(--color-crt-primary)]">
                {metric.formula}
              </div>
              <p className="text-base text-crt-dim/80 leading-relaxed font-medium uppercase">
                {metric.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modes Legend Section */}
      <div className="space-y-6">
        <div className="border-b border-crt-dim/30 pb-2">
          <h2 className="text-2xl font-black text-crt-primary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_4px_var(--color-crt-primary)]">
            <Icon name="game" size={24} className="text-crt-primary" />
            <span>TYPING CHALLENGE MODES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map((mode, idx) => (
            <div
              key={idx}
              className="bg-[#070707] border border-crt-dim/30 p-5 rounded flex gap-4 hover:border-crt-primary/45 transition-all duration-300 shadow-[inset_0_0_8px_rgba(0,0,0,0.95)]"
            >
              <Icon name={mode.icon as any} className="text-crt-dim self-start mt-1.5" size={24} />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-crt-primary uppercase">{mode.name.toUpperCase()}</h4>
                <p className="text-sm text-crt-dim/75 font-medium leading-relaxed uppercase">
                  {mode.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Origin Note Callout */}
      <div className="bg-[#070707] border-2 border-dashed border-crt-dim/40 p-6 rounded text-center space-y-2 shadow-[inset_0_0_10px_rgba(0,0,0,0.95)]">
        <h4 className="text-lg font-black text-crt-primary uppercase drop-shadow-[0_0_3px_var(--color-crt-primary)]">*** REBUILT FOR THE MODERN WEB ***</h4>
        <p className="text-sm text-crt-dim font-medium leading-relaxed max-w-xl mx-auto uppercase">
          TypeMaster Web is a complete Next.js port of the original TypeMaster C++ CLI. While the terminal game had to calculate limits without standard string or time containers, the web version introduces high-precision web APIs, client-side persistence, and a global PostgreSQL-backed leaderboard.
        </p>
      </div>
    </div>
  );
}
