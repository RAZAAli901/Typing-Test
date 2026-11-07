"use client";

import React from "react";
import { useConsent } from "./ConsentContext";

export default function ReopenConsentButton() {
  const { reopen } = useConsent();

  return (
    <button
      id="reopen-consent-settings-btn"
      type="button"
      onClick={reopen}
      className="px-4 py-2 bg-crt-primary/10 hover:bg-crt-primary/20 text-crt-primary border border-crt-primary/40 rounded font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-crt-primary"
    >
      [ REOPEN COOKIE PREFERENCES ]
    </button>
  );
}
