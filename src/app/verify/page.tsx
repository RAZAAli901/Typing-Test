"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Alert } from "@/components/ui/8bit/alert";
import { Card } from "@/components/ui/8bit/card";

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

  // Guard: Redirect if email is missing or already verified
  useEffect(() => {
    if (!email) {
      router.push("/signup");
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const res = await fetch(`/api/auth/verification-status?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.verified) {
            router.push("/login?verified=true");
          }
        }
      } catch (err) {
        console.error("Verification status query failed:", err);
      }
    };

    checkVerificationStatus();
  }, [email, router]);

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

      <Card className="space-y-6 p-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-crt-dim/60 border-b border-dashed border-crt-dim/20 pb-2">
          <span>IDENTITY GATEWAY PORT: 8443</span>
          <span className="flex items-center gap-1 text-crt-primary animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-crt-primary"></span>
            GATEWAY_SECURED
          </span>
        </div>

        {error && (
          <Alert variant="destructive" className="text-center font-mono">
            {getFormattedError(error)}
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="text-center font-mono text-lg font-bold">
            [ACCESS GRANTED — IDENTITY VERIFIED]
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <label className="block text-sm font-bold uppercase tracking-wider">
              ENTER 6-DIGIT SECURITY KEY
            </label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="text-center font-mono text-3xl tracking-[1rem]"
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

          <Button
            type="submit"
            disabled={isLoading || code.length !== 6 || !!success || timeLeft === 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? "AUTHORIZING..." : "SUBMIT ACCESS KEY"}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-dashed border-crt-dim/20 text-xs space-y-2">
          <p className="text-[10px] text-crt-dim/50 uppercase">
            Didn't get the code? Check your spam folder, or resend it below.
          </p>
          {resendCooldown > 0 ? (
            <p className="text-crt-dim/40 uppercase">
              RESEND COOLDOWN ACTIVE — WAIT {resendCooldown}s
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resendLoading || !!success}
              className="w-full"
              size="sm"
            >
              {resendLoading ? "RE-TRANSMITTING..." : "[REQUEST NEW ACCESS KEY]"}
            </Button>
          )}
        </div>
      </Card>
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
