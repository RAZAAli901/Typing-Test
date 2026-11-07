"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  ConsentStatus,
  getStoredConsent,
  setStoredConsent,
  clearStoredConsent,
} from "@/lib/consent";

interface ConsentContextValue {
  status: ConsentStatus;
  isBannerOpen: boolean;
  grant: () => void;
  deny: () => void;
  reopen: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unknown");
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    // Check Global Privacy Control signal
    const isGpcActive =
      typeof navigator !== "undefined" &&
      // @ts-expect-error - GlobalPrivacyControl property is standard in privacy-preserving browsers
      Boolean(navigator.globalPrivacyControl);

    if (isGpcActive) {
      setStoredConsent("denied");
      setStatus("denied");
      setIsBannerOpen(false);
      return;
    }

    const saved = getStoredConsent();
    setStatus(saved);
    if (saved === "unknown") {
      setIsBannerOpen(true);
    }
  }, []);

  const grant = useCallback(() => {
    setStoredConsent("granted");
    setStatus("granted");
    setIsBannerOpen(false);
  }, []);

  const deny = useCallback(() => {
    setStoredConsent("denied");
    setStatus("denied");
    setIsBannerOpen(false);
  }, []);

  const reopen = useCallback(() => {
    setIsBannerOpen(true);
  }, []);

  return (
    <ConsentContext.Provider value={{ status, isBannerOpen, grant, deny, reopen }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
