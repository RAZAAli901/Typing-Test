import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us & Support Portal - TypeMaster",
  description:
    "Get in touch with the TypeMaster team for technical support, bug reports, privacy inquiries, and editorial feedback.",
  path: "/contact",
});

export default function ContactPage() {
  const githubIssuesUrl = "https://github.com/RAZAAli901/Typing-Test/issues";
  const contactHref = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=[TypeMaster%20Inquiry]`
    : githubIssuesUrl;

  return (
    <LegalPage
      title="Contact & Support Portal"
      subtitle={`Official support and communication directory for ${OPERATOR_NAME}.`}
    >
      <section className="space-y-4">
        <p>
          We welcome inquiries, defect reports, editorial suggestions, and data subject access requests. Please choose the appropriate communication channel below:
        </p>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
          <h2 className="text-lg font-bold text-crt-primary">Direct Communication Channel</h2>
          {CONTACT_EMAIL ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                You can reach our administrative and support team directly via email:
              </p>
              <a
                href={contactHref}
                className="inline-flex items-center px-4 py-2 bg-crt-primary/10 hover:bg-crt-primary/20 text-crt-primary border border-crt-primary/40 rounded font-mono text-sm tracking-wider font-bold transition-colors"
              >
                [ EMAIL: {CONTACT_EMAIL} ]
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                Our public issue tracker is monitored actively for bug reports and inquiries:
              </p>
              <a
                href={githubIssuesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-crt-primary/10 hover:bg-crt-primary/20 text-crt-primary border border-crt-primary/40 rounded font-mono text-sm tracking-wider font-bold transition-colors"
              >
                [ OPEN GITHUB ISSUE &rarr; ]
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-crt-primary">Inquiry Submission Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="font-bold text-sm text-zinc-200">Technical Bugs & Defects</h3>
            <p className="text-xs text-zinc-400">
              Please include your client operating system, browser brand and build number, reproduction steps, and any relevant console output or screenshots.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="font-bold text-sm text-zinc-200">Privacy & Data Rights Requests</h3>
            <p className="text-xs text-zinc-400">
              Please specify the statutory right you wish to exercise (access, rectification, deletion, or consent withdrawal) and the associated account username and registered email address.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="font-bold text-sm text-zinc-200">Leaderboard & Cheating Inquiries</h3>
            <p className="text-xs text-zinc-400">
              To flag suspicious scores or request review of an invalidated session, provide the session ID and submission timestamp.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="font-bold text-sm text-zinc-200">Editorial & Guide Feedback</h3>
            <p className="text-xs text-zinc-400">
              Found a typo or factual inaccuracy in our guides? Let us know the guide title, URL, and suggested correction pursuant to our{" "}
              <Link href="/editorial-policy" className="text-crt-primary hover:underline">
                Editorial Policy
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </LegalPage>
  );
}
