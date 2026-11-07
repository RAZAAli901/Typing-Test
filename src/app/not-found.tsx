import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The requested page address could not be found on TypeMaster.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-8 font-vt323 select-none">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse uppercase tracking-wider">
          ⚠️ SIGNAL LOST
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-crt-primary tracking-widest uppercase drop-shadow-[0_0_4px_var(--color-crt-primary)]">
          ERROR 404: ADDRESS NOT FOUND
        </h2>
      </div>

      <div className="bg-[#080808] border-2 border-dashed border-crt-dim/40 rounded p-6 max-w-lg text-base md:text-lg text-crt-dim leading-relaxed tracking-wider shadow-[0_0_15px_rgba(0,0,0,0.8)] font-mono">
        <p className="mb-3 text-crt-primary">
          The requested URL does not exist or has been relocated to another memory sector.
        </p>
        <p className="text-xs text-crt-dim">
          If you followed a broken link or suspect a system defect, please submit a diagnostic report via our contact portal.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/play"
          className="inline-block px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold text-base rounded shadow-[3px_3px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest"
        >
          [ START TYPING TEST ]
        </Link>
        <Link
          href="/learn"
          className="inline-block px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold text-base rounded shadow-[3px_3px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest"
        >
          [ EXPLORE GUIDES ]
        </Link>
        <Link
          href="/contact"
          className="inline-block px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold text-base rounded shadow-[3px_3px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-widest"
        >
          [ CONTACT SUPPORT ]
        </Link>
      </div>
    </div>
  );
}
