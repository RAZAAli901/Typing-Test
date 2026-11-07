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
        <p>
          To maintain application reliability, prevent abuse, and mitigate automated attacks, our infrastructure processes certain technical network metadata:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>IP Addresses &amp; Rate Limiting:</strong> Client IP addresses are evaluated transiently in server memory to enforce request throttling, block brute-force password guessing, and protect API endpoints. IP addresses are evaluated in sliding windows (ranging from 60 seconds for general requests to 15 minutes for authentication attempts) and are never written to permanent database storage.
          </li>
          <li>
            <strong>Edge Server Logs:</strong> Our cloud hosting infrastructure (Vercel) automatically logs standard HTTP access data (including HTTP status codes, user-agent headers, and request paths) for server telemetry and cyber-attack mitigation. These transient edge logs are automatically purged on standard cloud provider rotation cycles (typically within 30 days).
          </li>
        </ul>
        <h3 className="text-base font-bold text-zinc-200 pt-2">Data Retention Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-zinc-800 rounded">
            <thead className="bg-zinc-900 text-crt-primary uppercase font-mono">
              <tr>
                <th className="p-2 border-b border-zinc-800">Data Category</th>
                <th className="p-2 border-b border-zinc-800">Storage Medium</th>
                <th className="p-2 border-b border-zinc-800">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr>
                <td className="p-2 font-medium">Account Profile (User, Password Hash, Email)</td>
                <td className="p-2">PostgreSQL Database</td>
                <td className="p-2">Retained until self-serve user account deletion</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Typing Scores &amp; Accuracy Metrics</td>
                <td className="p-2">PostgreSQL Database</td>
                <td className="p-2">Permanent on public leaderboards or until account deletion</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Anti-Cheat Practice Sessions</td>
                <td className="p-2">PostgreSQL Database</td>
                <td className="p-2">15 minutes (ephemeral token expiration)</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Email Verification Code Hashes</td>
                <td className="p-2">PostgreSQL Database</td>
                <td className="p-2">10 minutes (strict cryptographic timeout)</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Rate Limiting IP Windows</td>
                <td className="p-2">In-Memory Cache</td>
                <td className="p-2">60 seconds to 15 minutes (volatile only)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="browser-storage" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">5. Browser Storage, Cookies & Local State</h2>
        <p>
          TypeMaster stores limited technical preferences and authentication tokens in your local browser environment to provide core site features:
        </p>
        <h3 className="text-base font-bold text-zinc-200">A. Strictly Necessary HTTP Cookies</h3>
        <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
          <li>
            <code>next-auth.session-token</code> / <code>__Secure-next-auth.session-token</code>: Holds an encrypted JSON Web Token (JWT) identifying your signed-in account session. Expiration: 30 days (rolling).
          </li>
          <li>
            <code>next-auth.csrf-token</code> / <code>__Host-next-auth.csrf-token</code>: Protects account forms against cross-site request forgery attacks. Expiration: Browser session.
          </li>
          <li>
            <code>next-auth.callback-url</code> / <code>__Secure-next-auth.callback-url</code>: Remembers intended return destination following successful login. Expiration: Browser session.
          </li>
        </ul>
        <h3 className="text-base font-bold text-zinc-200 pt-2">B. Client LocalStorage &amp; SessionStorage Keys</h3>
        <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
          <li>
            <code>typemaster_username</code> (localStorage): Stores your active username or guest display name locally so forms pre-fill on your device.
          </li>
          <li>
            <code>typemaster_crt_theme</code> (localStorage): Stores your CRT display theme preference (Amber, Green, Cyan, or Classic).
          </li>
          <li>
            <code>typemaster_crt_effects</code> (localStorage): Stores boolean preference for CRT screen curvature and scanline overlays.
          </li>
          <li>
            <code>typemaster_crt_sound</code> (localStorage): Stores boolean preference for typewriter audio synthesis on keystrokes.
          </li>
          <li>
            <code>typemaster_crt_live_flash</code> (localStorage): Stores boolean toggle for leaderboard alert flash animations.
          </li>
          <li>
            <code>typemaster_consent_v1</code> (localStorage): Stores your cookie and advertising consent decision (Granted or Denied) with timestamp. Expiration: 12 months.
          </li>
          <li>
            <code>typemaster_booted</code> (sessionStorage): Cleared when browser tab closes; prevents boot screen re-triggering during internal page transitions.
          </li>
        </ul>
        <p className="text-sm pt-2">
          For a full breakdown of each cookie duration and purpose, visit our{" "}
          <Link href="/cookies" className="text-crt-primary hover:underline">
            Cookie Policy (/cookies)
          </Link>.
        </p>
      </section>

      <section id="advertising" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">6. Digital Advertising & Google AdSense</h2>
        <p>
          We partner with <strong>Google AdSense</strong> (operated by Google LLC) and authorized third-party ad vendors to serve digital advertisements on eligible editorial content pages of this site.
        </p>
        <p>
          Third-party vendors, including Google, use cookies and similar device identifiers to serve ads based on your prior visits to this website or other sites on the Internet. Google&rsquo;s use of advertising cookies enables it and its partners to serve personalized or contextual advertisements based on your browsing activity.
        </p>
        <div className="bg-zinc-900 border-l-4 border-crt-primary p-4 my-3 text-sm text-zinc-300">
          <strong className="text-crt-primary">Strict Consent-Gated Ad Serving:</strong> No advertising cookies, tracking beacons, or Google AdSense scripts are initialized or loaded when you first visit TypeMaster. Advertising scripts execute <em>only if you voluntarily provide explicit consent</em> via our on-screen consent interface. Furthermore, advertisements are strictly excluded from game interfaces (/play), leaderboard data tables (/leaderboard), stats analytics (/stats), authentication flows (/login, /signup, /verify), profile settings (/profile), and all legal policy documents; ads appear exclusively on eligible publisher content routes (/, /about, and /learn guides).
        </div>
        <p>
          You have full control over your advertising choices and may opt out of personalized advertising at any time:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Google Ad Settings:</strong> You can manage or opt out of personalized Google advertising by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crt-primary hover:underline"
            >
              Google Ad Settings (adssettings.google.com)
            </a>.
          </li>
          <li>
            <strong>How Google Uses Partner Site Data:</strong> Learn how Google processes information when you use partner sites by reviewing{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crt-primary hover:underline"
            >
              How Google uses information from sites or apps that use our services
            </a>.
          </li>
          <li>
            <strong>Industry Opt-Out Portals:</strong> You can opt out of collection and use of information for ad targeting by third-party ad networks via the Digital Advertising Alliance at{" "}
            <a
              href="https://optout.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crt-primary hover:underline"
            >
              aboutads.info/choices
            </a>{" "}
            or via the European Interactive Digital Advertising Alliance at{" "}
            <a
              href="https://www.youronlinechoices.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crt-primary hover:underline"
            >
              youronlinechoices.eu
            </a>.
          </li>
          <li>
            <strong>In-App Consent Withdrawal:</strong> You may modify or withdraw your consent at any time by clicking the &ldquo;Cookie Settings&rdquo; link in our website footer or visiting our{" "}
            <Link href="/cookies" className="text-crt-primary hover:underline">
              Cookie Preferences Page
            </Link>.
          </li>
        </ul>
      </section>

      <section id="service-providers" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">7. Third-Party Service Providers & Transfers</h2>
        <p>
          We rely on vetted third-party service providers (data subprocessors) to facilitate core hosting, storage, and notification infrastructure:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Supabase Inc. (Database &amp; Storage):</strong> Provides managed cloud PostgreSQL infrastructure and avatar image hosting. Supabase stores your account username, email, encrypted password hash, typing scores, and uploaded avatars.
          </li>
          <li>
            <strong>Resend Inc. (Transactional Email):</strong> Dispatches 6-digit email ownership verification codes and password recovery links. Resend receives only your recipient email address and transient message payload.
          </li>
          <li>
            <strong>Vercel Inc. (Cloud Hosting &amp; Edge Runtime):</strong> Provides edge compute, static file CDN delivery, and DNS routing. Vercel processes inbound HTTP connections and ephemeral request routing metadata.
          </li>
          <li>
            <strong>Google LLC (Google AdSense):</strong> If consent is explicitly granted, Google delivers digital advertisements and processes ad measurement cookies.
          </li>
        </ul>
        <h3 className="text-base font-bold text-zinc-200 pt-2">International Data Transfers</h3>
        <p>
          Our cloud service providers operate servers primarily in the United States and distributed global edge locations. Consequently, your personal information may be transferred to, stored, or processed in jurisdictions outside of your country of residence where data protection legislation may differ from your local jurisdiction. Where applicable, our subprocessors maintain standard contractual clauses and rigorous enterprise encryption protocols (TLS 1.3 in transit and AES-256 at rest) to safeguard your information across international boundaries.
        </p>
      </section>

      <section id="your-rights" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">8. Your Privacy Rights & Choices</h2>
        <p>
          Depending on your location (including the European Economic Area, United Kingdom, California, and other jurisdictions), you possess statutory privacy rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-300">
          <li>
            <strong>Right to Access &amp; Data Portability:</strong> You may request a complete export of your personal information, including account attributes and historical typing sessions. You can generate a machine-readable JSON export directly from your{" "}
            <Link href="/profile" className="text-crt-primary hover:underline">
              Profile Page (/profile)
            </Link>{" "}
            or contact us to receive an archive.
          </li>
          <li>
            <strong>Right to Rectification:</strong> You may update your account details, change your password, or replace your avatar picture directly in account settings at any time.
          </li>
          <li>
            <strong>Right to Erasure (Account Deletion):</strong> You have the right to permanently purge your account, historical test scores, and uploaded avatars from our systems. You can execute immediate self-service account deletion directly on your{" "}
            <Link href="/profile" className="text-crt-primary hover:underline">
              Profile Page
            </Link>{" "}
            or request manual deletion by contacting us.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Where data processing relies on voluntary consent (such as digital advertising cookies), you may revoke or adjust your decision at any moment via our footer &ldquo;Cookie Settings&rdquo; button or on our{" "}
            <Link href="/cookies" className="text-crt-primary hover:underline">
              Cookies Page
            </Link>.
          </li>
          <li>
            <strong>Right to Non-Discrimination:</strong> We will never deny services, alter test mechanics, or restrict feature availability because you exercised your statutory privacy rights.
          </li>
        </ul>
        <p className="text-sm pt-2">
          To submit a formal data subject access request (DSAR) or privacy inquiry, please visit our{" "}
          <Link href="/contact" className="text-crt-primary hover:underline">
            Contact Page
          </Link>. We respond to verified requests within statutory timeframes (30 days or less).
        </p>
      </section>

      <section id="children-and-updates" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">9. Children's Privacy & Policy Updates</h2>
        <h3 className="text-base font-bold text-zinc-200">Children&rsquo;s Privacy (COPPA / GDPR Article 8)</h3>
        <p>
          TypeMaster is an online speed typing platform designed for general audiences, students, and software professionals. It is not directed toward children under 13 years of age (or under 16 in the European Economic Area). We do not knowingly solicit, collect, or process personal data from children under these age thresholds. If you are a parent or legal guardian and discover that your minor child has registered an account without appropriate authorization, please reach out via our{" "}
          <Link href="/contact" className="text-crt-primary hover:underline">
            Contact Portal
          </Link>{" "}
          so we can immediately terminate the account and permanently delete all related records.
        </p>
        <h3 className="text-base font-bold text-zinc-200 pt-2">Amendments and Policy Revisions</h3>
        <p>
          We may update this Privacy Policy from time to time to accommodate new application features, security improvements, or statutory regulatory amendments. The effective date of the current document is displayed in the &ldquo;Last Updated&rdquo; timestamp at the head of this page. Whenever material changes are introduced to how we collect or process personal data, we will post an advance notice on the website or via an on-screen alert banner prior to the modifications becoming operative. Continued usage of TypeMaster following the effective date of an amended policy constitutes acknowledgment and acceptance of the revised practices.
        </p>
      </section>
    </LegalPage>
  );
}
