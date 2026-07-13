"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center space-y-6">
      {/* Visual Glitch Header */}
      <div className="space-y-2">
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 animate-pulse select-none">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          Lost in Space 🚀
        </h2>
      </div>

      {/* Glassmorphic Panel Description */}
      <div className="glass-panel border border-white/10 rounded-2xl p-6 max-w-md bg-slate-950/20 backdrop-blur-md shadow-xl text-xs md:text-sm text-slate-400 leading-relaxed font-light">
        The page you are looking for has drifted into deep space or never existed. Check the URL spelling, or head back to the arena to test your typing reflexes.
      </div>

      {/* Back to Home Button */}
      <div className="flex gap-4">
        <Link
          href="/play"
          className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md shadow-cyan-400/10 cursor-pointer"
        >
          Go to Arena ⚡
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white font-semibold text-sm transition-all hover:bg-white/10 cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
