"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { FOOTER_PRIMARY_LINKS, LEGAL_NAV_LINKS } from "@/lib/nav";
import { useConsent } from "./ConsentContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { reopen } = useConsent();

  return (
    <footer className="mt-auto border-t border-crt-dim/40 bg-[#060606]/90 py-6 text-center text-xs text-crt-dim font-vt323 tracking-wider">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        <nav aria-label="Primary Navigation Links" className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-sans">
          {FOOTER_PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center min-h-[44px] px-3 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Legal and Contact Links" className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs font-sans">
          {LEGAL_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={reopen}
            className="inline-flex items-center min-h-[44px] px-2.5 py-2 text-crt-dim hover:text-crt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded transition-colors cursor-pointer"
          >
            Cookie settings
          </button>
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
