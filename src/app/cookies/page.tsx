import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/LegalPage";
import { STORAGE_REGISTRY } from "@/lib/storageRegistry";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy & Storage Registry - TypeMaster",
  description:
    "Complete technical inventory of all cookies, localStorage, and sessionStorage tokens utilized by TypeMaster.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy & Storage Registry"
      subtitle="Complete technical registry of all cookies and browser storage keys used on TypeMaster."
    >
      <section className="space-y-4">
        <p>
          TypeMaster uses standard browser storage mechanisms—including HTTP cookies, HTML5 <code>localStorage</code>, and <code>sessionStorage</code>—to authenticate users, remember visual terminal preferences, and protect against security threats.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
          <div>
            <h2 className="text-base font-bold text-crt-primary">Your Advertising Consent Settings</h2>
            <p className="text-xs text-zinc-400 mt-1">
              You can grant, deny, or adjust third-party digital advertising cookie permissions at any time.
            </p>
          </div>
          <button
            id="reopen-consent-settings-btn"
            type="button"
            className="px-4 py-2 bg-crt-primary/10 hover:bg-crt-primary/20 text-crt-primary border border-crt-primary/40 rounded font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
          >
            [ REOPEN COOKIE PREFERENCES ]
          </button>
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-crt-primary">Technical Storage Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-zinc-800 rounded">
            <thead className="bg-zinc-900 text-crt-primary uppercase font-mono">
              <tr>
                <th className="p-3 border-b border-zinc-800">Storage Identifier</th>
                <th className="p-3 border-b border-zinc-800">Storage Type</th>
                <th className="p-3 border-b border-zinc-800">Category</th>
                <th className="p-3 border-b border-zinc-800">Provider</th>
                <th className="p-3 border-b border-zinc-800">Duration</th>
                <th className="p-3 border-b border-zinc-800">Purpose Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {STORAGE_REGISTRY.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-crt-primary whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="p-3 font-mono text-zinc-400 whitespace-nowrap">
                    {item.type}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.category === "Necessary"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : item.category === "Functional"
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                          : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-300 whitespace-nowrap">
                    {item.provider}
                  </td>
                  <td className="p-3 text-zinc-400 whitespace-nowrap">
                    {item.duration}
                  </td>
                  <td className="p-3 text-zinc-300 leading-normal min-w-[240px]">
                    {item.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </LegalPage>
  );
}
