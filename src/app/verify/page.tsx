"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-sm uppercase">Verification page initialized for: {email}</p>
        </form>
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
