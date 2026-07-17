"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/play";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all authorization fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || "Authentication failed. Access denied.");
      } else {
        // If Remember Me is checked, store flag in localStorage
        if (rememberMe) {
          localStorage.setItem("typemaster_remember_me", "true");
        } else {
          localStorage.removeItem("typemaster_remember_me");
        }

        // Sync local claim username
        if (res?.url) {
          // Parse username from session profile if needed
          const fetchSession = async () => {
            const sRes = await fetch("/api/auth/session");
            if (sRes.ok) {
              const session = await sRes.json();
              if (session?.user?.name) {
                localStorage.setItem("typemaster_username", session.user.name);
                window.dispatchEvent(new Event("usernameChanged"));
              }
            }
          };
          await fetchSession();
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err: any) {
      setError("An unexpected connection issue occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-vt323 text-lg text-crt-dim select-none">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          *** TERMINAL LOGIN ***
        </h1>
        <p className="text-xs text-crt-dim font-bold tracking-widest uppercase">
          SECURE PROTOCOL ACCESS MODULE
        </p>
      </div>

      <div className="bg-[#080808] border-2 border-crt-dim/40 rounded p-6 shadow-[0_0_20px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-crt-dim/60 border-b border-dashed border-crt-dim/20 pb-2">
          <span>SECURE PORT: 8443</span>
          <span className="flex items-center gap-1 text-crt-primary animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-crt-primary"></span>
            SECURE_SYS_ONLINE
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER REGISTERED EMAIL"
              className="w-full bg-[#070707] border-2 border-crt-dim/30 rounded p-3 text-crt-primary focus:outline-none focus:border-crt-primary/80 shadow-inner placeholder:text-crt-dim/30"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold uppercase tracking-wider">SECURE PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS KEY"
              className="w-full bg-[#070707] border-2 border-crt-dim/30 rounded p-3 text-crt-primary focus:outline-none focus:border-crt-primary/80 shadow-inner placeholder:text-crt-dim/30"
              required
            />
          </div>

          {/* Remember Me Option */}
          <label className="flex items-center gap-3 cursor-pointer select-none py-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="hidden"
            />
            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all bg-[#070707] ${rememberMe ? "border-crt-primary" : "border-crt-dim/50"}`}>
              {rememberMe && <span className="w-2.5 h-2.5 bg-crt-primary rounded-sm shadow-[0_0_4px_var(--color-crt-primary)]"></span>}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              REMEMBER THIS MACHINE (30-DAY CACHE)
            </span>
          </label>

          {error && (
            <div className="bg-red-950/40 border border-red-500 text-red-500 text-sm font-bold uppercase p-3 rounded animate-pulse">
              [ACCESS DENIED: {error}]
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border-2 border-crt-dim text-crt-primary disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-crt-primary font-bold rounded shadow-[4px_4px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase tracking-wider text-lg"
          >
            <span>{isLoading ? "AUTHORIZING..." : "ACCESS DATABASE"}</span>
            <Icon name="play" size={16} />
          </button>

          <Link
            href="/signup"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border-2 border-crt-amber text-crt-amber hover:text-white hover:border-crt-amber shadow-[4px_4px_0px_var(--color-crt-amber)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer uppercase tracking-wider text-lg font-bold rounded"
          >
            <span>REGISTER NEW PROFILE</span>
            <Icon name="user" size={16} className="text-crt-amber" />
          </Link>

          <Link
            href="/play"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2 bg-transparent border border-crt-dim/40 hover:border-crt-primary text-crt-dim hover:text-crt-primary font-bold rounded transition-all cursor-pointer uppercase tracking-wider text-sm"
          >
            Continue as Guest [→]
          </Link>
        </form>
      </div>
    </div>
  );
}
