import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdContainer from "@/components/AdContainer";
import { pageMetadata } from "@/lib/seo";
import { getAllGuides } from "@/content/guides";

export const metadata: Metadata = pageMetadata({
  title: "Learn Touch Typing: Guides, Technique & Speed Training",
  description:
    "Comprehensive typing guides, ergonomic best practices, keyboard layout reviews, and daily routines to improve speed and accuracy.",
  path: "/learn",
});

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is touch typing and why should I learn it?",
    answer:
      "Touch typing is the technique of typing by tactile memory and spatial awareness using all ten fingers, without looking down at the keyboard. Learning touch typing eliminates visual distraction, reduces neck and wrist strain, and enables you to transcribe thoughts directly to the screen at speeds exceeding 60 to 80 WPM.",
  },
  {
    question: "How long does it take to learn touch typing from scratch?",
    answer:
      "Most beginners achieve comfortable touch typing within two to four weeks by committing to 15 minutes of deliberate practice each day. While initial speed drops temporarily as your brain builds new muscle memory, velocity reliably surpasses previous hunt-and-peck limits within a month.",
  },
  {
    question: "What is considered a good typing speed for everyday work?",
    answer:
      "The global average typing speed is approximately 40 WPM. Speeds between 50 and 70 WPM are considered proficient for professional knowledge work and administration, while 70 to 90 WPM places you in the top 10% of typists. Elite transcriptionists and competitive typists frequently exceed 100+ WPM.",
  },
  {
    question: "Why is accuracy more important than raw speed when practicing?",
    answer:
      "Every typographical error costs between 1 and 2.5 seconds of productive time in backspacing, re-orienting, and correcting. Practicing with an accuracy floor of 98% prevents your brain from myelinating incorrect motor patterns, establishing the neurological precision necessary for effortless velocity.",
  },
  {
    question: "Does typing faster really help software developers and programmers?",
    answer:
      "Yes. While software engineering revolves around architecture and logic design, fluid keyboard mastery minimizes friction during active implementation. Typing code quickly preserves short-term working memory and prevents context switching when managing brackets, variables, and terminal commands.",
  },
  {
    question: "How does TypeMaster measure Words Per Minute (WPM)?",
    answer:
      "TypeMaster uses the international standard of 5 characters per word (including letters, spaces, and punctuation). Gross WPM measures total mechanical throughput, while Net WPM subtracts error penalties to evaluate true commercial-grade transcription velocity.",
  },
  {
    question: "Are mechanical keyboards actually better for typing speed?",
    answer:
      "Mechanical switches provide consistent tactile feedback and actuate midway through key travel (around 2mm), meaning you do not have to bottom out keys with excessive force. This crisp tactile confirmation reduces finger fatigue and aids cadence, though low-profile scissor switches also support high speeds.",
  },
  {
    question: "Can ergonomic keyboards prevent wrist strain and carpal tunnel?",
    answer:
      "Split ergonomic keyboards allow your hands to align naturally with your forearms, eliminating ulnar deviation (awkward outward wrist bending). Combined with neutral desk heights and 90-degree elbow angles, ergonomic keyboards significantly reduce repetitive strain risks.",
  },
];

export default function LearnPage() {
  const guides = getAllGuides();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-crt-black text-crt-primary p-4 md:p-8 font-mono">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
              📖 Touch Typing Glossary (25+ Terms)
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

        {/* Visible Frequently Asked Questions Section */}
        <section
          aria-labelledby="faq-heading"
          className="pt-8 border-t border-crt-border/60 space-y-6"
        >
          <div>
            <div className="inline-block px-2 py-0.5 text-[10px] border border-crt-border rounded text-crt-dim mb-2">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 id="faq-heading" className="text-xl md:text-2xl font-bold text-crt-primary">
              Touch Typing &amp; Training FAQ
            </h2>
            <p className="mt-1 text-xs md:text-sm text-crt-dim">
              Answers to common questions regarding typing technique, ergonomics, speed progression, and scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 border border-crt-border/70 rounded-lg bg-crt-black/40 space-y-2 hover:border-crt-primary/50 transition-colors"
              >
                <h3 className="text-sm md:text-base font-bold text-crt-primary flex items-start gap-2">
                  <span className="text-crt-accent select-none">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs md:text-sm text-crt-dim leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Content Ad Slot */}
        <AdContainer slotId="learn-hub-bottom" minHeight={250} />
      </div>
    </div>
  );
}
