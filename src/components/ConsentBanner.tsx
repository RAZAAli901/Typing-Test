"use client";

import React from "react";
import Link from "next/link";
import { useConsent } from "./ConsentContext";

export default function ConsentBanner() {
  const { isBannerOpen, grant, deny } = useConsent();

  if (!isBannerOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie consent banner"
      role="region"
      className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 border-t-2 border-crt-dim/50 backdrop-blur-md p-4 sm:p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed text-center md:text-left">
          <p>
            We use strictly necessary storage for authentication and visual preferences. With your permission, we and Google AdSense also use cookies to serve personalized advertisements and support our free typing test tools.
          </p>
          <p className="text-[11px] text-zinc-400">
            Read our{" "}
            <Link
              href="/privacy"
              className="text-crt-primary hover:underline font-mono focus:outline-none focus-visible:ring-1 focus-visible:ring-crt-primary"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/cookies"
              className="text-crt-primary hover:underline font-mono focus:outline-none focus-visible:ring-1 focus-visible:ring-crt-primary"
            >
              Cookie Policy
            </Link>{" "}
            for complete technical disclosures.
          </p>
        </div>

        <div className="flex flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={deny}
            className="min-w-[120px] min-h-[44px] px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded font-mono text-xs uppercase tracking-wider font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary cursor-pointer active:scale-95"
          >
            [ REJECT ALL ]
          </button>
          <button
            type="button"
            onClick={grant}
            className="min-w-[120px] min-h-[44px] px-5 py-2.5 bg-crt-primary hover:bg-amber-400 text-black border border-crt-primary rounded font-mono text-xs uppercase tracking-wider font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(255,176,0,0.3)]"
          >
            [ ACCEPT ALL ]
          </button>
        </div>
      </div>
    </aside>
  );
}
