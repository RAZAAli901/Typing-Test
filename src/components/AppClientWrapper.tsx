"use client";

import React, { useState, useEffect } from "react";
import RetroBootScreen from "./RetroBootScreen";

interface AppClientWrapperProps {
  children: React.ReactNode;
}

export default function AppClientWrapper({ children }: AppClientWrapperProps) {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Session storage check to skip boot sequence on reload/navigation
    const hasBooted = sessionStorage.getItem("typemaster_booted");
    if (hasBooted === "true") {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    // Blinking tab title cursor: "TYPEMASTER_v1 ▮"
    let cursorActive = true;
    const titleInterval = setInterval(() => {
      document.title = `TYPEMASTER_v1 ${cursorActive ? "▮" : " "}`;
      cursorActive = !cursorActive;
    }, 850);

    return () => clearInterval(titleInterval);
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem("typemaster_booted", "true");
    setBooting(false);
  };

  if (booting) {
    return <RetroBootScreen onComplete={handleBootComplete} />;
  }

  return <>{children}</>;
}
