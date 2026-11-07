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
  { id: "user-content", title: "6. User Content & Pseudonyms" },
  { id: "warranty-disclaimer", title: "7. Disclaimer of Warranties" },
  { id: "liability-limit", title: "8. Limitation of Liability" },
  { id: "termination", title: "9. Termination of Service" },
  { id: "terms-changes", title: "10. Amendments to Terms" },
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
      <section id="user-content" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">6. User Content & Pseudonyms</h2>
        <p>
          You retain copyright in any custom practice passages or avatar images you upload. By submitting content or establishing a public username, you grant {OPERATOR_NAME} a worldwide, royalty-free, non-exclusive license to host, display, and format that content strictly as required to operate leaderboard rankings and user profiles. You warrant that your uploaded content does not violate third-party intellectual property, privacy, or publicity rights.
        </p>
      </section>

      <section id="warranty-disclaimer" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">7. Disclaimer of Warranties</h2>
        <p className="uppercase text-xs tracking-wider font-mono text-zinc-300">
          The platform, including all speed typing modules, accuracy formulas, leaderboard data, and educational articles, is provided strictly on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranty of any kind, whether express, implied, or statutory. {OPERATOR_NAME} expressly disclaims all warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation.
        </p>
      </section>

      <section id="liability-limit" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">8. Limitation of Liability</h2>
        <p className="uppercase text-xs tracking-wider font-mono text-zinc-300">
          To the maximum extent permitted by applicable law, in no event shall {OPERATOR_NAME}, its operators, affiliates, or infrastructure subprocessors be liable for any indirect, punitive, incidental, special, or consequential damages, or loss of profits, data, or operational downtime arising out of or related to your use or inability to use this platform.
        </p>
      </section>

      <section id="termination" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">9. Termination of Service</h2>
        <p>
          We reserve the right to suspend or terminate your account and revoke access to platform services at our discretion, without liability, in the event of any breach of these Terms, suspected automated bot usage, or abusive conduct toward the service. You may terminate your relationship with TypeMaster at any time by executing self-serve account deletion on your profile page or ceasing site usage.
        </p>
      </section>

      <section id="terms-changes" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">10. Amendments to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Service periodically. Any revisions become effective immediately upon posting to this URL, as reflected by the &ldquo;Last Updated&rdquo; date at the top of the agreement. Your continued access to TypeMaster following the posting of amended terms signifies your binding acceptance of the updated conditions.
        </p>
      </section>
    </LegalPage>
  );
}
