import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-crt-dim/40 bg-[#060606]/90 py-6 text-center text-xs text-crt-dim font-vt323 tracking-wider uppercase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        <nav aria-label="Primary Navigation Links" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/play" className="hover:text-crt-primary transition-colors">
            Play Test
          </Link>
          <Link href="/learn" className="hover:text-crt-primary transition-colors">
            Learn
          </Link>
          <Link href="/leaderboard" className="hover:text-crt-primary transition-colors">
            Leaderboard
          </Link>
          <Link href="/about" className="hover:text-crt-primary transition-colors">
            About
          </Link>
        </nav>
        <nav aria-label="Legal and Contact Links" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
          <Link href="/privacy" className="hover:text-crt-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-crt-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-crt-primary transition-colors">
            Cookie Policy
          </Link>
          <Link href="/contact" className="hover:text-crt-primary transition-colors">
            Contact
          </Link>
          <Link href="/editorial-policy" className="hover:text-crt-primary transition-colors">
            Editorial Policy
          </Link>
        </nav>
        <p className="font-bold text-crt-dim">
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
        <p className="mt-1 text-[10px] text-crt-dim/60">
          Scoring logic uses Net WPM formula: (Gross WPM) - (Mistakes / timeInMinutes).
        </p>
      </div>
    </footer>
  );
}
