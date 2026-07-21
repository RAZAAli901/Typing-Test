"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Alert } from "@/components/ui/8bit/alert";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/play";

  const [email, setEmail] = useState(searchParams.get("email") || "");
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

        {searchParams.get("verified") === "true" && (
          <Alert variant="default" className="text-center font-mono">
            [IDENTITY VERIFIED — READY FOR DATABASE ACCESS]
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER REGISTERED EMAIL"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold uppercase tracking-wider">SECURE PASSWORD</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER ACCESS KEY"
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

          {error === "UNVERIFIED_EMAIL" ? (
            <Alert variant="destructive" className="space-y-2 text-center">
              <div>[ACCESS DENIED: IDENTITY UNVERIFIED]</div>
              <div>
                <Link
                  href={`/verify?email=${encodeURIComponent(email)}`}
                  className="text-crt-primary underline hover:text-crt-primary/80 font-bold"
                >
                  [CLICK HERE TO ENTER ACCESS CODE]
                </Link>
              </div>
            </Alert>
          ) : error && (
            <Alert variant="destructive">
              [ACCESS DENIED: {error}]
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <span>{isLoading ? "AUTHORIZING..." : "ACCESS DATABASE"}</span>
            <Icon name="play" size={16} />
          </Button>

          <Button
            asChild
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <Link href="/signup">
              <span>REGISTER NEW PROFILE</span>
              <Icon name="user" size={16} className="text-crt-amber" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full"
            size="sm"
          >
            <Link href="/play">
              Continue as Guest [→]
            </Link>
          </Button>
        </form>
      </div>
    </div>
  );
}
