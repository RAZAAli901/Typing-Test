import Link from "next/link";
import Icon from "@/components/Icon";

export default function Home() {
  const modes = [
    {
      name: "Standard",
      desc: "Classic practice text with balanced sentences to find your baseline rhythm.",
      icon: "standard",
      borderColor: "border-cyan-500/30",
    },
    {
      name: "Numbers",
      desc: "Practice entering report data, temperatures, ratios, and percentages quickly.",
      icon: "numbers",
      borderColor: "border-purple-500/30",
    },
    {
      name: "Quotes",
      desc: "Type famous inspirational quotes and philosophical thoughts from history.",
      icon: "quotes",
      borderColor: "border-pink-500/30",
    },
    {
      name: "Code Snippet",
      desc: "Practice programming syntax, brackets, semicolons, and indentation rules.",
      icon: "code",
      borderColor: "border-emerald-500/30",
    },
    {
      name: "Punctuation",
      desc: "Type paragraphs loaded with symbols, exclamation marks, and complex punctuation.",
      icon: "punctuation",
      borderColor: "border-amber-500/30",
    },
    {
      name: "Random Words",
      desc: "Endless combinations of words selected from our local dictionary database.",
      icon: "random",
      borderColor: "border-indigo-500/30",
    },
    {
      name: "Daily Challenge",
      desc: "A single identical prompt refreshed daily for all players globally.",
      icon: "daily",
      borderColor: "border-violet-500/30",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-8 md:py-12 font-vt323 text-lg text-crt-dim select-none">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 font-vt323 text-lg">
          <Link
            href="/play"
            className="w-full sm:w-auto px-8 py-3 bg-[#080808] hover:bg-zinc-900 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold rounded shadow-[4px_4px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center uppercase tracking-widest"
          >
            Start Typing ⚡
          </Link>
          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-8 py-3 bg-[#080808] hover:bg-zinc-900 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold rounded shadow-[4px_4px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center uppercase tracking-widest"
          >
            View Leaderboards 🏆
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl font-vt323 text-lg">
        <div className="bg-[#070707] border-2 border-crt-dim/40 rounded p-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] space-y-3 hover:border-crt-primary/60 transition-all duration-300 flex flex-col">
          <Icon name="mic" className="text-crt-primary" size={32} />
          <h3 className="text-xl font-bold text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)] uppercase">Live Feedback HUD</h3>
          <p className="text-base text-crt-dim/80 leading-relaxed uppercase">
            Monitor speed (Gross & Net WPM), accuracy percentage, and elapsed stopwatch time in real-time on every keystroke.
          </p>
        </div>

        <div className="bg-[#070707] border-2 border-crt-dim/40 rounded p-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] space-y-3 hover:border-crt-primary/60 transition-all duration-300 flex flex-col">
          <Icon name="speaker" className="text-crt-primary" size={32} />
          <h3 className="text-xl font-bold text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)] uppercase">Synthesized Audio</h3>
          <p className="text-base text-crt-dim/80 leading-relaxed uppercase">
            Zero asset load times! Audio cues are dynamically synthesized via the Web Audio API for tactile typewriter sounds.
          </p>
        </div>

        <div className="bg-[#070707] border-2 border-crt-dim/40 rounded p-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] space-y-3 hover:border-crt-primary/60 transition-all duration-300 flex flex-col">
          <Icon name="chart" className="text-crt-primary" size={32} />
          <h3 className="text-xl font-bold text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)] uppercase">SVG Performance Curves</h3>
          <p className="text-base text-crt-dim/80 leading-relaxed uppercase">
            Get an instant visual dashboard of your typing stability with an SVG-generated speed and accuracy timeline graph.
          </p>
        </div>
      </section>

      {/* Typing Modes Showcase */}
      <section className="w-full max-w-6xl space-y-8 font-vt323 text-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-crt-primary uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">7 Specialized Typing Modes</h2>
          <p className="text-crt-dim font-bold tracking-widest uppercase text-sm md:text-base">
            Tailor your practice session by choosing from any of our diverse standard or algorithmic typing challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((m, idx) => (
            <div
              key={idx}
              className={`bg-[#070707] border-2 ${m.borderColor} p-6 rounded flex flex-col justify-between hover:border-crt-primary hover:scale-[1.02] transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] group`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name={m.icon as any} className="text-crt-primary group-hover:text-white transition-all duration-300" size={24} />
                  <h4 className="text-lg font-bold text-crt-primary group-hover:text-white transition-colors uppercase">
                    {m.name}
                  </h4>
                </div>
                <p className="text-sm text-crt-dim/75 leading-relaxed uppercase">
                  {m.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider font-vt323 text-crt-dim">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crt-primary animate-pulse shadow-[0_0_4px_var(--color-crt-primary)]"></span>
                  <span>[LDR ACTIVE]</span>
                </div>
                <Link
                  href={`/play?mode=${m.name.toLowerCase().replace(" ", "-")}`}
                  className="text-crt-primary hover:text-white hover:drop-shadow-[0_0_3px_var(--color-crt-primary)] transition-all font-bold"
                >
                  [CONFIGURE &rarr;]
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
