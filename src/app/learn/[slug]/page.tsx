import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedGuides from "@/components/RelatedGuides";
import { getAllGuides, getGuideBySlug } from "@/content/guides";
import { pageMetadata } from "@/lib/seo";
import { OPERATOR_NAME, SITE_URL } from "@/lib/site";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return pageMetadata({
      title: "Guide Not Found",
      description: "The requested typing guide could not be found.",
      path: `/learn/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/learn/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedDate,
    dateModified: guide.updatedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/learn/${guide.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: OPERATOR_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: OPERATOR_NAME,
      url: SITE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-crt-black text-crt-primary p-4 md:p-8 font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: guide.title },
          ]}
        />

        <article className="border border-crt-border/80 rounded-lg bg-crt-black/50 p-6 md:p-10 space-y-8">
          <header className="border-b border-crt-border/60 pb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-crt-dim">
              <span className="px-2 py-0.5 border border-crt-primary/40 rounded bg-crt-primary/10 text-crt-primary">
                PRACTICE MODE: {guide.practiceModeLabel.toUpperCase()}
              </span>
              <span>•</span>
              <span>{guide.readingMinutes} min read</span>
              <span>•</span>
              <time dateTime={guide.updatedDate}>Updated: {guide.updatedDate}</time>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-crt-primary leading-tight">
              {guide.title}
            </h1>

            <p className="text-sm md:text-base text-crt-dim leading-relaxed">
              {guide.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/play?mode=${guide.practiceMode}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-crt-primary bg-crt-primary text-crt-black font-semibold text-xs rounded hover:bg-crt-primary/90 transition-colors"
              >
                <span>⚡ Test this skill in {guide.practiceModeLabel} mode</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </header>

          <div className="prose prose-invert max-w-none space-y-8">
            {guide.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-lg md:text-xl font-bold text-crt-primary border-b border-crt-border/40 pb-2">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm md:text-base text-crt-dim leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <RelatedGuides
            currentSlug={guide.slug}
            practiceMode={guide.practiceMode}
            practiceModeLabel={guide.practiceModeLabel}
          />
        </article>
      </div>
    </div>
  );
}
