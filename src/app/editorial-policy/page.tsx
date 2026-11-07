import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { OPERATOR_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Editorial Policy & Content Standards - TypeMaster",
  description:
    "Editorial standards, research integrity guidelines, corrections process, and strict advertising separation on TypeMaster.",
  path: "/editorial-policy",
});

const SECTIONS: LegalSection[] = [
  { id: "mission-and-scope", title: "1. Mission and Editorial Scope" },
  { id: "research-integrity", title: "2. Research Integrity & Fact-Checking" },
  { id: "advertising-separation", title: "3. Separation of Advertising from Content" },
  { id: "corrections-policy", title: "4. Corrections and Revisions Policy" },
];

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      title="Editorial Policy & Content Standards"
      subtitle={`Our principles of accuracy, independence, and transparency at ${OPERATOR_NAME}.`}
      sections={SECTIONS}
    >
      <section id="mission-and-scope" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">1. Mission and Editorial Scope</h2>
        <p>
          The <strong>TypeMaster Learn</strong> portal provides free, evidence-based educational guides to help typists of all experience levels—students, programmers, administrative professionals, and casual learners—improve keystroke speed, touch typing accuracy, and ergonomics.
        </p>
        <p>
          Our guides cover keyboard layouts, finger positioning, posture recommendations, error correction psychology, and scoring formulas. All content is written in clear, accessible language without promotional hype.
        </p>
      </section>

      <section id="research-integrity" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">2. Research Integrity & Fact-Checking</h2>
        <p>
          We maintain strict standards regarding empirical accuracy and intellectual honesty:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Hedged Benchmarks:</strong> Typing speed averages and percentile distributions vary across studies and demographics. We explicitly acknowledge measurement variances and qualify claims with &ldquo;commonly cited&rdquo; or empirical ranges rather than stating contested figures as absolutes.
          </li>
          <li>
            <strong>No Fabricated Data:</strong> We never invent research studies, create fake testimonials, or fabricate quotes. When citing standard conventions (such as the standard 5-keystroke word definition), we explain the underlying rationale clearly.
          </li>
          <li>
            <strong>Mathematical Transparency:</strong> All discussions of Gross WPM, Net WPM, accuracy percentages, and anti-cheat validation correspond directly to the audited server algorithms running in the TypeMaster codebase.
          </li>
        </ul>
      </section>

      <section id="advertising-separation" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">3. Separation of Advertising from Content</h2>
        <p>
          To keep TypeMaster free for all users, we display digital advertisements provided through the Google AdSense network. We enforce complete separation between advertising and editorial content:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Clear Demarcation:</strong> Every ad placement is segregated into a dedicated slot prominently labeled &ldquo;Advertisement&rdquo; to ensure readers can immediately distinguish commercial messages from educational guides.
          </li>
          <li>
            <strong>No Editorial Influence:</strong> Advertisers have zero influence over the topics we cover, the ergonomic assessments we publish, or the mechanical keyboard evaluations we provide.
          </li>
          <li>
            <strong>Zero Affiliate Bias:</strong> Our keyboard guide recommendations and layout comparisons are produced without affiliate links, referral kickbacks, or sponsored manufacturer placements.
          </li>
          <li>
            <strong>Strict Placement Rules:</strong> Ads never appear adjacent to active typing inputs, game controls, legal pages, authentication portals, or error screens.
          </li>
        </ul>
      </section>

      <section id="corrections-policy" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">4. Corrections and Revisions Policy</h2>
        <p>
          We are committed to prompt corrections when factual inaccuracies, outdated advice, or broken links are identified. When an article undergoes substantive revision, we update the visible &ldquo;Last Updated&rdquo; date on the article header.
        </p>
        <p>
          If you discover an error in any guide, glossary entry, or scoring explanation, please report it through our{" "}
          <Link href="/contact" className="text-crt-primary hover:underline">
            Contact Portal (/contact)
          </Link>{" "}
          with the guide URL and your suggested correction.
        </p>
      </section>
    </LegalPage>
  );
}
