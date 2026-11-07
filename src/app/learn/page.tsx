import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { getAllGuides } from "@/content/guides";

export const metadata: Metadata = pageMetadata({
  title: "Learn Touch Typing: Guides, Technique & Speed Training",
  description:
    "Comprehensive typing guides, ergonomic best practices, keyboard layout reviews, and daily routines to improve speed and accuracy.",
  path: "/learn",
});

export default function LearnPage() {
  const guides = getAllGuides();

  return (
    <div className="min-h-screen bg-crt-black text-crt-primary p-4 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />

        <header className="border-b border-crt-border/60 pb-6">
          <div className="inline-block px-2.5 py-1 text-xs border border-crt-primary/40 rounded bg-crt-primary/10 text-crt-primary mb-3">
            DOCUMENTATION &amp; TRAINING
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-crt-primary">
            Touch Typing Guides &amp; Technique
          </h1>
          <p className="mt-3 text-crt-dim max-w-3xl leading-relaxed text-sm md:text-base">
            Master the fundamentals of touch typing, ergonomic hand positioning, and sustainable speed training.
            Whether you are preparing for coding sprints, clerical assessments, or everyday typing flow,
            our guides break down the motor science and practical routines behind fast, error-free typing.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <Link
              href="/learn/glossary"
              className="px-3 py-1.5 border border-crt-border rounded hover:border-crt-primary hover:text-crt-primary text-crt-dim transition-colors"
            >
              📖 Touch Typing Glossary (20+ Terms)
            </Link>
            <Link
              href="/play"
              className="px-3 py-1.5 border border-crt-primary bg-crt-primary text-crt-black font-semibold rounded hover:bg-crt-primary/90 transition-colors"
            >
              ⚡ Launch Interactive Test
            </Link>
          </div>
        </header>

        <section aria-labelledby="guides-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="guides-heading" className="text-xl font-bold text-crt-primary">
              All Training Guides ({guides.length})
            </h2>
            <span className="text-xs text-crt-dim">Updated for 2026</span>
          </div>

          {guides.length === 0 ? (
            <div className="p-8 border border-crt-border/60 rounded-lg bg-crt-black/40 text-center">
              <p className="text-crt-dim text-sm">
                Training guides are being indexed. Check back shortly for our comprehensive guide library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((guide) => (
                <article
                  key={guide.slug}
                  className="p-5 border border-crt-border/80 rounded-lg bg-crt-black/40 hover:border-crt-primary/80 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-crt-dim mb-2">
                      <span>{guide.readingMinutes} min read</span>
                      <time dateTime={guide.updatedDate}>{guide.updatedDate}</time>
                    </div>
                    <h3 className="text-base font-bold text-crt-primary group-hover:text-crt-accent transition-colors">
                      <Link href={`/learn/${guide.slug}`}>{guide.title}</Link>
                    </h3>
                    <p className="mt-2 text-xs md:text-sm text-crt-dim leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-crt-border/40 flex items-center justify-between text-xs">
                    <Link
                      href={`/learn/${guide.slug}`}
                      className="text-crt-primary hover:underline font-semibold"
                    >
                      Read Guide &rarr;
                    </Link>
                    <Link
                      href={`/play?mode=${guide.practiceMode}`}
                      className="text-crt-dim hover:text-crt-primary"
                    >
                      Practice ({guide.practiceModeLabel})
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
