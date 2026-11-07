"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ADS_ENABLED, ADSENSE_CLIENT_ID } from "@/lib/site";
import { isRouteEligibleForAds } from "@/lib/adEligibility";
import { useConsent } from "./ConsentContext";
import AdSlot from "./AdSlot";

interface AdContainerProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal";
  minHeight?: number;
  className?: string;
}

export default function AdContainer({
  slotId,
  format = "auto",
  minHeight = 250,
  className = "",
}: AdContainerProps) {
  const pathname = usePathname();
  const { status } = useConsent();

  const isEligible = isRouteEligibleForAds(pathname);

  // If ads are killed, missing publisher ID, consent not granted, or route is ineligible, render nothing
  if (!ADS_ENABLED || !ADSENSE_CLIENT_ID || status !== "granted" || !isEligible) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-container-region my-8 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-lg text-center overflow-hidden transition-all ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="text-[10px] uppercase tracking-widest text-crt-dim/60 mb-2 select-none font-mono">
        Advertisement
      </div>
      <AdSlot slotId={slotId} format={format} minHeight={minHeight - 24} />
    </aside>
  );
}
