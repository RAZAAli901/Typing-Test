import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-crt-dim/40 bg-[#060606]/90 py-6 text-center text-xs text-crt-dim font-vt323 tracking-wider">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        <nav aria-label="Primary Navigation Links" className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-sans">
          <Link
            href="/play"
            className="inline-flex items-center min-h-[44px] px-3 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Play test
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center min-h-[44px] px-3 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Learn
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center min-h-[44px] px-3 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center min-h-[44px] px-3 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            About
          </Link>
        </nav>
        <nav aria-label="Legal and Contact Links" className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-sans">
          <Link
            href="/privacy"
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Privacy policy
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Terms of service
          </Link>
          <Link
            href="/cookies"
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Cookie policy
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/editorial-policy"
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
          >
            Editorial policy
          </Link>
        </nav>
        <p className="font-bold text-crt-dim font-vt323 tracking-wider uppercase pt-2">
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
        <p className="text-[10px] text-crt-dim/60 font-vt323 tracking-wider uppercase">
          Scoring logic uses Net WPM formula: (Gross WPM) - (Mistakes / timeInMinutes).
        </p>
      </div>
    </footer>
  );
}
