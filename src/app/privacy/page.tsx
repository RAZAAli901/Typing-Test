import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { OPERATOR_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy - How TypeMaster Handles Your Data",
  description:
    "Comprehensive privacy policy describing account data, public leaderboards, cookie usage, advertising consent, and your privacy rights under GDPR and CCPA.",
  path: "/privacy",
});

const SECTIONS: LegalSection[] = [
  { id: "who-we-are", title: "1. Who We Are and Operator Details" },
  { id: "account-data", title: "2. Account and Authentication Data" },
  { id: "gameplay-data", title: "3. Gameplay and Leaderboard Data" },
  { id: "technical-data", title: "4. Technical Data, Network Logs & Retention" },
  { id: "browser-storage", title: "5. Browser Storage, Cookies & Local State" },
  { id: "advertising", title: "6. Digital Advertising & Google AdSense" },
  { id: "service-providers", title: "7. Third-Party Service Providers & Transfers" },
  { id: "your-rights", title: "8. Your Privacy Rights & Choices" },
  { id: "children-and-updates", title: "9. Children's Privacy & Policy Updates" },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How TypeMaster collects, processes, and protects your information."
      sections={SECTIONS}
    >
      <section id="who-we-are" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">1. Who We Are and Operator Details</h2>
        <p>
          This website and its associated services are operated by <strong>{OPERATOR_NAME}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible online at{" "}
          <Link href={SITE_URL} className="text-crt-primary hover:underline">
            {SITE_URL}
          </Link>.
        </p>
        <p>
          We are committed to operating transparently and respecting the privacy rights of all visitors, learners, and registered account holders. If you have any inquiries, data protection requests, or security concerns, you can contact us directly through our dedicated{" "}
          <Link href="/contact" className="text-crt-primary hover:underline">
            Contact Portal (/contact)
          </Link>.
        </p>
      </section>

      <section id="account-data" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">2. Account and Authentication Data</h2>
        <p>
          When you register an account on TypeMaster, we collect and process specific account credentials necessary to authenticate your sessions and maintain your typing profile:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Username:</strong> Your chosen unique pseudonym. It serves as your public handle on global leaderboards and profile displays. <em>Lawful basis: Contractual necessity (providing requested application services).</em>
          </li>
          <li>
            <strong>Email Address:</strong> Used strictly for account sign-in, account security notifications, password resets, and 6-digit email ownership verification. We never sell, rent, or distribute your email address to marketing third parties. <em>Lawful basis: Contractual necessity.</em>
          </li>
          <li>
            <strong>Password:</strong> Your password is converted immediately on the server using an adaptive salted bcrypt cryptographic hash (work factor 10–12). Plain-text passwords are never written to database tables, logs, or backups. <em>Lawful basis: Security obligation and contractual necessity.</em>
          </li>
          <li>
            <strong>Avatar Image:</strong> If you optionally upload a profile picture, the image is sanitized, resized server-side, and stored securely in an isolated cloud storage bucket. <em>Lawful basis: Voluntary user consent.</em>
          </li>
          <li>
            <strong>Email Verification Codes:</strong> Temporary 6-digit one-time access codes sent during signup are stored as SHA-256 hashes in our database and automatically expire within 10 minutes. <em>Lawful basis: Legitimate interest in preventing automated spam and credential stuffing.</em>
          </li>
        </ul>
      </section>

      <section id="gameplay-data" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">3. Gameplay and Leaderboard Data</h2>
        <p>
          When you complete a typing speed test on TypeMaster, our servers compute and record your performance metrics:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Test Metrics:</strong> Net Words Per Minute (WPM), Gross WPM, accuracy percentage, test duration in seconds, character count, and mistake tallies.
          </li>
          <li>
            <strong>Test Configuration:</strong> The specific practice mode chosen (such as Standard, Numbers, Quotes, Code Snippet, or Daily Challenge) and target text length.
          </li>
          <li>
            <strong>Guest Display Names:</strong> Visitors who choose to test without creating an account may optionally submit an arbitrary guest display name to identify their test on the leaderboard.
          </li>
          <li>
            <strong>Anti-Cheat Tokens:</strong> Temporary practice session tokens cryptographically paired with randomized target texts ensure score validity and prevent simulated or automated score injection.
          </li>
        </ul>
        <div className="bg-zinc-900 border-l-4 border-crt-primary p-4 my-3 text-sm text-zinc-300">
          <strong className="text-crt-primary">Public Leaderboard Disclosure:</strong> Your username (or guest display name), avatar picture, typing mode, net speed, accuracy, and test submission timestamp are published to the public Global Leaderboard and public user profile pages. Do not use your real legal name or confidential identifiers in your username or guest display name.
        </div>
      </section>

      <section id="technical-data" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">4. Technical Data, Network Logs & Retention</h2>
      </section>

      <section id="browser-storage" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">5. Browser Storage, Cookies & Local State</h2>
      </section>

      <section id="advertising" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">6. Digital Advertising & Google AdSense</h2>
      </section>

      <section id="service-providers" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">7. Third-Party Service Providers & Transfers</h2>
      </section>

      <section id="your-rights" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">8. Your Privacy Rights & Choices</h2>
      </section>

      <section id="children-and-updates" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">9. Children's Privacy & Policy Updates</h2>
      </section>
    </LegalPage>
  );
}
