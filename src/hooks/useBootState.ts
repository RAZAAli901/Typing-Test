"use client";

import { useState, useEffect, useCallback } from "react";

export function useBootState() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("typemaster_booted");
    if (hasBooted === "true") {
      setBooting(false);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem("typemaster_booted", "true");
    setBooting(false);
  }, []);

  return {
    booting,
    handleBootComplete,
  };
}
