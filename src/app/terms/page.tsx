import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service - TypeMaster Platform Agreement",
  description:
    "Terms of service governing platform access, acceptable use, account security, fair play leaderboard rules, and score integrity.",
  path: "/terms",
});

const SECTIONS: LegalSection[] = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "accounts-and-security", title: "2. Account Registration & Security" },
  { id: "acceptable-use", title: "3. Acceptable Use Policy" },
  { id: "leaderboard-conduct", title: "4. Leaderboard Conduct & Anti-Cheating" },
  { id: "score-removal", title: "5. Score Verification & Removal Rights" },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="Standard terms and conditions governing the use of TypeMaster."
      sections={SECTIONS}
    >
      <section id="acceptance" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">1. Acceptance of Terms</h2>
        <p>
          By accessing or utilizing <strong>TypeMaster</strong> (located at{" "}
          <Link href={SITE_URL} className="text-crt-primary hover:underline">
            {SITE_URL}
          </Link>), you agree to be bound by these Terms of Service and all incorporated policies, including our{" "}
          <Link href="/privacy" className="text-crt-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookies" className="text-crt-primary hover:underline">
            Cookie Policy
          </Link>. If you do not accept these terms in full, you must discontinue platform use immediately.
        </p>
      </section>

      <section id="accounts-and-security" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">2. Account Registration & Security</h2>
        <p>
          You may access public typing modes as an unauthenticated guest or register an account to record historical metrics and participate in authenticated leaderboards. When creating an account, you represent that:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>All registration credentials provided (including email address) are valid and belong to you.</li>
          <li>You are solely responsible for safeguarding your password and account credentials.</li>
          <li>You will notify {OPERATOR_NAME} immediately through our <Link href="/contact" className="text-crt-primary hover:underline">Contact Portal</Link> upon becoming aware of any unauthorized access or breach of your account.</li>
        </ul>
      </section>

      <section id="acceptable-use" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">3. Acceptable Use Policy</h2>
        <p>
          You agree to use TypeMaster exclusively for lawful educational, personal, or professional typing training. You agree NOT to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>Disrupt, impair, or compromise server stability, databases, or API infrastructure.</li>
          <li>Execute automated denial-of-service, brute-force password guessing, or abusive crawling.</li>
          <li>Upload obscene, defamatory, harassing, or infringing graphics as your avatar.</li>
          <li>Circumvent or tamper with rate limiters, security headers, or session validation barriers.</li>
        </ul>
      </section>

      <section id="leaderboard-conduct" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">4. Leaderboard Conduct & Anti-Cheating</h2>
        <p>
          The Global Leaderboard is an open competitive ranking intended to reflect genuine human keyboard mastery. To ensure fair competition for all participants:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>Automated typing scripts, macro injection programs, browser bots, or synthetic input generators are strictly prohibited.</li>
          <li>Manipulating browser timestamps or injecting simulated performance payloads into <code>/api/sessions</code> is a material breach of these terms.</li>
          <li>Target texts must be typed in real time in accordance with standard keystroke progression.</li>
        </ul>
      </section>

      <section id="score-removal" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">5. Score Verification & Removal Rights</h2>
        <p>
          All score submissions are validated server-side against practice session tokens and statistical plausibility limits. {OPERATOR_NAME} reserves the absolute right, without prior notice, to disqualify, hide, or permanently remove any leaderboard entry or score record deemed fraudulent, suspicious, or generated through synthetic tools. Repeated violations may result in immediate account suspension or termination.
        </p>
      </section>
    </LegalPage>
  );
}
