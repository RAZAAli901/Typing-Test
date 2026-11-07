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
      </section>

      <section id="gameplay-data" className="space-y-3">
        <h2 className="text-xl font-bold text-crt-primary">3. Gameplay and Leaderboard Data</h2>
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
