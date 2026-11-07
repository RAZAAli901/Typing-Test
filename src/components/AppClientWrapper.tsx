"use client";

import React, { useEffect } from "react";
import RetroBootScreen from "./RetroBootScreen";
import { TooltipProvider } from "@/components/ui/8bit/tooltip";
import { useBootState } from "@/hooks/useBootState";

interface AppClientWrapperProps {
  children: React.ReactNode;
}

export default function AppClientWrapper({ children }: AppClientWrapperProps) {
  const { booting, handleBootComplete } = useBootState();

  useEffect(() => {
    // Blinking tab title cursor preserving per-page title
    let cursorActive = true;
    const titleInterval = setInterval(() => {
      if (typeof document === "undefined") return;
      const cleanTitle = document.title.replace(/\s*[▮]$/, "").trimEnd();
      document.title = cursorActive ? `${cleanTitle} ▮` : cleanTitle;
      cursorActive = !cursorActive;
    }, 850);

    return () => clearInterval(titleInterval);
  }, []);

  return (
    <TooltipProvider>
      {booting && <RetroBootScreen onComplete={handleBootComplete} />}
      <div
        id="app-content-root"
        aria-hidden={booting ? true : undefined}
        inert={booting ? true : undefined}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}
