import Link from "next/link";
import { getRelatedGuides } from "@/content/guides";

interface RelatedGuidesProps {
  currentSlug: string;
  practiceMode: string;
  practiceModeLabel: string;
}

export default function RelatedGuides({
  currentSlug,
  practiceMode,
  practiceModeLabel,
}: RelatedGuidesProps) {
  const related = getRelatedGuides(currentSlug, 3);

  return (
    <div className="space-y-8 pt-8 border-t border-crt-border/60">
      {/* Practice Callout */}
      <section className="p-6 border border-crt-primary/40 rounded-lg bg-crt-primary/5 space-y-3">
        <h3 className="text-base font-bold text-crt-primary flex items-center gap-2">
          <span>⚡</span>
          <span>Apply This Technique</span>
        </h3>
        <p className="text-xs md:text-sm text-crt-dim leading-relaxed">
          Consistent short practice sessions turn theoretical technique into automatic muscle memory.
          Test your progress right now in TypeMaster&apos;s dedicated practice mode.
        </p>
        <div>
          <Link
            href={`/play?mode=${practiceMode}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-crt-primary bg-crt-primary text-crt-black font-semibold text-xs rounded hover:bg-crt-primary/90 transition-colors"
          >
            <span>Launch {practiceModeLabel} Practice Mode</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Related Guides List */}
      {related.length > 0 && (
        <section aria-labelledby="related-guides-heading" className="space-y-4">
          <h3 id="related-guides-heading" className="text-lg font-bold text-crt-primary">
            Related Training Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((guide) => (
              <div
                key={guide.slug}
                className="p-4 border border-crt-border/60 rounded bg-crt-black/40 hover:border-crt-primary/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-crt-dim mb-1">
                    {guide.readingMinutes} min read
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-crt-primary line-clamp-2">
                    <Link href={`/learn/${guide.slug}`} className="hover:text-crt-accent">
                      {guide.title}
                    </Link>
                  </h4>
                  <p className="mt-1 text-[11px] text-crt-dim line-clamp-2">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-crt-border/30">
                  <Link
                    href={`/learn/${guide.slug}`}
                    className="text-xs text-crt-primary hover:underline font-semibold"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
