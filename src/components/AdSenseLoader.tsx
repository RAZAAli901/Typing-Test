"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT_ID } from "@/lib/site";
import { useConsent } from "./ConsentContext";

export default function AdSenseLoader() {
  const pathname = usePathname();
  const { status } = useConsent();

  const isAdsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

  if (!isAdsEnabled || !ADSENSE_CLIENT_ID || status !== "granted") {
    return null;
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
