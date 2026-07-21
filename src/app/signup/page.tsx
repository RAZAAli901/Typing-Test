"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Alert } from "@/components/ui/8bit/alert";
import { Card } from "@/components/ui/8bit/card";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password strength checklist states
  const [hasMinLen, setHasMinLen] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const strengthScore = [hasMinLen, hasDigit, passwordsMatch].filter(Boolean).length;

  useEffect(() => {
    setHasMinLen(password.length >= 6);
    setHasDigit(/\d/.test(password));
    setPasswordsMatch(password.length > 0 && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Format Validations
    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Username must be 3-20 characters long and contain only letters, numbers, dashes, or underscores.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address format.");
      return;
    }

    if (!hasMinLen || !hasDigit) {
      setError("Password does not meet safety criteria checklist.");
      return;
    }

    if (!passwordsMatch) {
      setError("Entered access keys do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create identity.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}&t=${Date.now()}`);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An unexpected registration error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 font-vt323 text-lg text-crt-dim select-none">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          *** SIGN UP ***
        </h1>
        <p className="text-xs text-crt-dim font-bold tracking-widest uppercase">
          REGISTER NEW COGNITIVE IDENTITY
        </p>
      </div>

      <Card className="space-y-6 p-6">
        <div className="flex justify-between items-center text-[10px] font-bold text-crt-dim/60 border-b border-dashed border-crt-dim/20 pb-2 mb-2">
          <span>IDENTITY SEED: 0x8A9E</span>
          <span className="flex items-center gap-1 text-crt-primary animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-crt-primary"></span>
            CIPHER_CORE_READY
          </span>
        </div>

        {success ? (
          <div className="space-y-4 text-center py-8">
            <div className="text-4xl text-emerald-400 animate-bounce">✔</div>
            <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest">[IDENTITY CREATED]</h3>
            <p className="text-sm uppercase tracking-wider text-crt-dim">
              REDIRECTING TO ACCESS CODE VERIFICATION GATEWAY...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold uppercase tracking-wider">COMPETITOR ID (USERNAME)</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER USERNAME"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold uppercase tracking-wider">ACCESS PASSWORD</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="MIN 6 CHARACTERS, 1 DIGIT"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold uppercase tracking-wider">CONFIRM ACCESS PASSWORD</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="RE-ENTER ACCESS KEY"
                required
              />
            </div>

            {/* Password strength checklist indicators */}
            <div className="bg-[#050505] border border-crt-dim/20 rounded p-3 text-xs space-y-3">
              <div className="font-bold text-crt-dim uppercase tracking-wider text-[10px]">ACCESS KEY CRITERIA:</div>
              
              {/* Strength Meter Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[11px] uppercase tracking-wider">
                  <span>KEY STRENGTH:</span>
                  <span className={`${
                    strengthScore === 1 ? "text-red-500" :
                    strengthScore === 2 ? "text-amber-500" :
                    strengthScore >= 3 ? "text-emerald-400" : "text-crt-dim/50"
                  } drop-shadow-[0_0_2px_currentColor]`}>
                    {strengthScore === 1 ? "WEAK" :
                     strengthScore === 2 ? "MODERATE" :
                     strengthScore >= 3 ? "STRONG/SECURE" : "UNRESOLVED"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-950 border border-crt-dim/20 rounded-sm overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore === 1 ? "bg-red-500 w-1/3" :
                      strengthScore === 2 ? "bg-amber-500 w-2/3" :
                      strengthScore >= 3 ? "bg-emerald-400 w-full" : "w-0"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={hasMinLen ? "text-emerald-400" : "text-crt-dim/40"}>
                    {hasMinLen ? "☑" : "☐"}
                  </span>
                  <span className={hasMinLen ? "text-emerald-400 font-semibold" : ""}>AT LEAST 6 CHARACTERS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={hasDigit ? "text-emerald-400" : "text-crt-dim/40"}>
                    {hasDigit ? "☑" : "☐"}
                  </span>
                  <span className={hasDigit ? "text-emerald-400 font-semibold" : ""}>CONTAINS AT LEAST 1 DIGIT (0-9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={passwordsMatch ? "text-emerald-400" : "text-crt-dim/40"}>
                    {passwordsMatch ? "☑" : "☐"}
                  </span>
                  <span className={passwordsMatch ? "text-emerald-400 font-semibold" : ""}>CONFIRMATION MATCHES PASSWORD</span>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                [ALERT: {error}]
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <span>{isLoading ? "CREATING..." : "BUILD PROFILE"}</span>
              <Icon name="play" size={16} />
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
        )}

        <div className="text-center pt-4 border-t border-dashed border-crt-dim/30 text-sm font-bold uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-1">
          <span className="text-crt-dim/60">ALREADY HAVE AN IDENTITY?</span>
          <Link href="/login" className="text-crt-primary hover:text-white transition-colors underline decoration-2 underline-offset-4">
            [ACCESS EXISTING IDENTITY]
          </Link>
        </div>
      </Card>
    </div>
  );
}
