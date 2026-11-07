import React from "react";
import Link from "next/link";
import { LEGAL_LAST_UPDATED } from "@/lib/site";

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalPageProps {
  title: string;
  subtitle?: string;
  sections?: LegalSection[];
  children: React.ReactNode;
}

export default function LegalPage({
  title,
  subtitle,
  sections,
  children,
}: LegalPageProps) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-sans text-zinc-200">
      <header className="border-b border-crt-dim/40 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-crt-primary font-vt323 tracking-wider uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        <div className="text-xs font-mono text-zinc-400">
          Last Updated: <time dateTime={LEGAL_LAST_UPDATED}>{LEGAL_LAST_UPDATED}</time>
        </div>
      </header>

      {sections && sections.length > 0 && (
        <nav
          aria-label="Table of contents"
          className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 font-mono text-sm"
        >
          <div className="font-bold text-crt-primary text-xs uppercase tracking-widest mb-3">
            Table of Contents
          </div>
          <ol className="space-y-1.5 list-decimal list-inside text-zinc-300">
            {sections.map((sec) => (
              <li key={sec.id}>
                <Link
                  href={`#${sec.id}`}
                  className="text-zinc-300 hover:text-crt-primary transition-colors underline underline-offset-2"
                >
                  {sec.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="legal-content prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-zinc-200">
        {children}
      </div>
    </article>
  );
}
