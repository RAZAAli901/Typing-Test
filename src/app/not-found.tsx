"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-8 font-vt323 select-none">
      {/* Visual Glitch Header */}
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse uppercase tracking-wider">
          ⚠️ SIGNAL LOST
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-crt-primary tracking-widest uppercase drop-shadow-[0_0_4px_var(--color-crt-primary)]">
          ERROR 404: ADDR NOT FOUND
        </h2>
      </div>

      {/* Terminal details block */}
      <div className="bg-[#080808] border-2 border-dashed border-crt-dim/40 rounded p-6 max-w-md text-base md:text-lg text-crt-dim leading-relaxed tracking-wider shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        THE REQUESTED MEMORY ADDRESS OR PAGE PATH HAS DRIFTED OUTSIDE CURRENT SYSTEM SCANNING BOUNDS. CHECK SYSTEM LINK AND RESET MODEM.
      </div>

      {/* Back to Home Button */}
      <div>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-zinc-900 hover:bg-zinc-800 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold text-lg rounded shadow-[4px_4px_0px_var(--color-crt-dim)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer uppercase tracking-widest"
        >
          RECONNECT ⚡
        </Link>
      </div>
    </div>
  );
}
