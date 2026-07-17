"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const tParam = searchParams.get("t");

  // Determine expiration offset (10 minutes total lifespan)
  const initialTime = tParam 
    ? Math.max(0, Math.floor((parseInt(tParam) + 10 * 60 * 1000 - Date.now()) / 1000))
    : 600;

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "FAILED TO RESEND ACCESS KEY.");
      } else {
        setSuccess("A NEW ACCESS KEY HAS BEEN DISPATCHED.");
        setTimeLeft(600); // Reset expiry to 10 mins
        setResendCooldown(60); // Reset cooldown to 60s
      }
    } catch (err) {
      setError("CONNECTION TO SECURITY MODULE FAILED.");
    } finally {
      setResendLoading(false);
    }
  };

  const getFormattedError = (err: string) => {
    const lower = err.toLowerCase();
    if (lower.includes("invalid") || lower.includes("credentials") || lower.includes("failed")) {
      return "[INVALID CODE]";
    }
    if (lower.includes("expired")) {
      return "[CODE EXPIRED — REQUEST A NEW ONE]";
    }
    return `[ERROR: ${err.toUpperCase()}]`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("ACCESS CODE MUST BE 6 DIGITS.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "VERIFICATION FAILED.");
      } else {
        setSuccess("ACCESS GRANTED — IDENTITY VERIFIED");
        setTimeout(() => {
          router.push(`/login?verified=true&email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err) {
      setError("CONNECTION TO SECURITY MODULE FAILED.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-vt323 text-lg text-crt-dim select-none">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          *** ENTER ACCESS CODE ***
        </h1>
        <p className="text-xs text-crt-dim font-bold tracking-widest uppercase">
          IDENTITY VERIFICATION GATEWAY
        </p>
      </div>

      <div className="bg-[#080808] border-2 border-crt-dim/40 rounded p-6 shadow-[0_0_20px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-crt-dim/60 border-b border-dashed border-crt-dim/20 pb-2">
          <span>IDENTITY GATEWAY PORT: 8443</span>
          <span className="flex items-center gap-1 text-crt-primary animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-crt-primary"></span>
            GATEWAY_SECURED
          </span>
        </div>

        {error && (
          <div className="border border-red-500/50 bg-red-950/20 text-red-500 p-3 text-center uppercase tracking-wider drop-shadow-[0_0_3px_#ef4444] text-xs font-bold font-mono">
            {getFormattedError(error)}
          </div>
        )}

        {success && (
          <div className="border-2 border-crt-primary bg-[#050505] text-crt-primary p-4 text-center uppercase tracking-wider font-bold text-lg drop-shadow-[0_0_6px_var(--color-crt-primary)] font-mono animate-pulse">
            [ACCESS GRANTED — IDENTITY VERIFIED]
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <label className="block text-sm font-bold uppercase tracking-wider">
              ENTER 6-DIGIT SECURITY KEY
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full bg-[#0a0a0a] border border-crt-dim/30 rounded py-3 px-4 text-center font-mono text-3xl tracking-[1rem] focus:outline-none focus:border-crt-primary focus:shadow-[0_0_10px_var(--color-crt-primary)] text-crt-primary transition-all uppercase placeholder-crt-dim/20"
              maxLength={6}
              disabled={isLoading || !!success}
              autoFocus
            />
            <p className="text-[11px] text-crt-dim/60 uppercase pb-2">
              TRANSMITTED TO: {email || "UNKNOWN"}
            </p>
            <div className="text-sm">
              {timeLeft > 0 ? (
                <span className="text-crt-primary uppercase font-bold tracking-wider">
                  CODE EXPIRES IN {formatTime(timeLeft)}
                </span>
              ) : (
                <span className="text-red-500 uppercase font-bold tracking-wider animate-pulse">
                  CODE EXPIRED — REQUEST A NEW ONE
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6 || !!success || timeLeft === 0}
            className="w-full bg-[#070707] text-crt-primary border-2 border-crt-primary font-bold py-3 uppercase tracking-widest hover:bg-crt-primary hover:text-black transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-[4px_4px_0px_var(--color-crt-primary)] relative"
          >
            {isLoading ? "AUTHORIZING..." : "SUBMIT ACCESS KEY"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-dashed border-crt-dim/20 text-xs">
          {resendCooldown > 0 ? (
            <p className="text-crt-dim/40 uppercase">
              RESEND COOLDOWN ACTIVE — WAIT {resendCooldown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || !!success}
              className="text-crt-primary uppercase font-bold tracking-wider hover:underline hover:text-crt-primary/80 disabled:opacity-40"
            >
              {resendLoading ? "RE-TRANSMITTING..." : "[REQUEST NEW ACCESS KEY]"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 font-vt323 text-crt-dim">LOADING ACCESS PORTAL...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
