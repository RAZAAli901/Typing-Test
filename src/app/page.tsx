import Link from "next/link";

export default function Home() {
  const modes = [
    {
      name: "Standard",
      desc: "Classic practice text with balanced sentences to find your baseline rhythm.",
      icon: "📝",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    },
    {
      name: "Numbers",
      desc: "Practice entering report data, temperatures, ratios, and percentages quickly.",
      icon: "🔢",
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    },
    {
      name: "Quotes",
      desc: "Type famous inspirational quotes and philosophical thoughts from history.",
      icon: "💬",
      color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    },
    {
      name: "Code Snippet",
      desc: "Practice programming syntax, brackets, semicolons, and indentation rules.",
      icon: "💻",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    },
    {
      name: "Punctuation",
      desc: "Type paragraphs loaded with symbols, exclamation marks, and complex punctuation.",
      icon: "🔣",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    },
    {
      name: "Random Words",
      desc: "Endless combinations of words selected from our local dictionary database.",
      icon: "🔀",
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    },
    {
      name: "Daily Challenge",
      desc: "A single identical prompt refreshed daily for all players globally.",
      icon: "📅",
      color: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 text-crt-dim text-xs font-bold tracking-widest uppercase font-mono">
          <span className="w-2 h-2 rounded-full bg-crt-primary animate-pulse shadow-[0_0_5px_var(--color-crt-primary)]"></span>
          [REBUILT FROM CLI TO NEXT.JS]
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-widest text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] uppercase leading-tight font-vt323">
          Master Your Typing Speed on TypeMaster Web
        </h1>
        <p className="text-lg md:text-xl text-crt-dim font-bold tracking-wider uppercase font-vt323">
          Experience real-time keystroke scanning, character color-coding, in-app synthesized audio feedback, and detailed performance curves linked to our global Vercel Postgres leaderboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/play"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:-translate-y-0.5 text-center text-base"
          >
            Start Typing ⚡
          </Link>
          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center text-base"
          >
            View Leaderboards 🏆
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <div className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col space-y-3">
          <span className="text-3xl">🎙️</span>
          <h3 className="text-lg font-bold text-white">Live Feedback HUD</h3>
          <p className="text-sm text-slate-400 font-light">
            Monitor speed (Gross & Net WPM), accuracy percentage, and elapsed stopwatch time in real-time on every keystroke.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col space-y-3">
          <span className="text-3xl">🎛️</span>
          <h3 className="text-lg font-bold text-white">Synthesized Audio</h3>
          <p className="text-sm text-slate-400 font-light">
            Zero asset load times! Audio cues are dynamically synthesized via the Web Audio API for tactile typewriter sounds.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col space-y-3">
          <span className="text-3xl">📈</span>
          <h3 className="text-lg font-bold text-white">SVG Performance Curves</h3>
          <p className="text-sm text-slate-400 font-light">
            Get an instant visual dashboard of your typing stability with an SVG-generated speed and accuracy timeline graph.
          </p>
        </div>
      </section>

      {/* Typing Modes Showcase */}
      <section className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">7 Specialized Typing Modes</h2>
          <p className="text-slate-400 text-sm md:text-base font-light">
            Tailor your practice session by choosing from any of our diverse standard or algorithmic typing challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((m, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${m.color} border rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-300 group`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {m.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {m.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Leaderboard Active</span>
                <Link
                  href={`/play?mode=${m.name.toLowerCase().replace(" ", "-")}`}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                >
                  Configure &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
