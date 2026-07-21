"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/8bit/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics or reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center space-y-6">
      {/* Warning Icon & Header */}
      <div className="space-y-2">
        <div className="text-6xl animate-bounce">⚠️</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-xs text-slate-400 font-light max-w-xs mx-auto">
          An unexpected application error occurred while rendering this page.
        </p>
      </div>

      {/* Error Details Panel */}
      <div className="glass-panel border border-rose-500/20 bg-rose-500/5 rounded-2xl p-4 max-w-md shadow-lg text-left">
        <span className="block text-[10px] uppercase font-bold text-rose-400 tracking-wider mb-1">
          Error Message
        </span>
        <code className="block text-xs font-mono text-slate-300 break-all bg-slate-950/60 p-2.5 rounded-lg border border-white/5 max-h-[100px] overflow-y-auto">
          {error.message || "Unknown client error"}
        </code>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={reset}
          size="default"
        >
          Try Again 🔄
        </Button>
        <Button
          asChild
          variant="outline"
          size="default"
        >
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
