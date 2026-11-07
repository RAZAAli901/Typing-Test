"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT_ID, ADS_ENABLED } from "@/lib/site";
import { isRouteEligibleForAds } from "@/lib/adEligibility";
import { useConsent } from "./ConsentContext";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal";
  minHeight?: number;
  className?: string;
}

export default function AdSlot({
  slotId,
  format = "auto",
  minHeight = 250,
  className = "",
}: AdSlotProps) {
  const pathname = usePathname();
  const { status } = useConsent();

  const isEligible = isRouteEligibleForAds(pathname);

  useEffect(() => {
    if (!ADS_ENABLED || !ADSENSE_CLIENT_ID || status !== "granted" || !isEligible || !slotId) {
      return;
    }

    try {
      if (typeof window !== "undefined") {
        // @ts-expect-error - adsbygoogle is dynamically attached by Google script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("[ADSENSE] Ad initialization push error:", err);
    }
  }, [ADS_ENABLED, status, isEligible, slotId]);

  if (!ADS_ENABLED || !ADSENSE_CLIENT_ID || status !== "granted" || !isEligible || !slotId) {
    return null;
  }

  return (
    <div
      className={`ad-slot-wrapper my-8 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-3 bg-zinc-950 border border-zinc-800/80 rounded text-center overflow-hidden ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Advertisement container"
    >
      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-2 select-none">
        Advertisement
      </span>
      <div className="w-full flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight: `${minHeight - 30}px` }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
