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
    // Blinking tab title cursor: "TYPEMASTER_v1 ▮"
    let cursorActive = true;
    const titleInterval = setInterval(() => {
      document.title = `TYPEMASTER_v1 ${cursorActive ? "▮" : " "}`;
      cursorActive = !cursorActive;
    }, 850);

    return () => clearInterval(titleInterval);
  }, []);

  return (
    <TooltipProvider>
      {booting && <RetroBootScreen onComplete={handleBootComplete} />}
      <div id="app-content-root">
        {children}
      </div>
    </TooltipProvider>
  );
}
