"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CrtTheme = "green" | "amber";

interface CrtSettings {
  theme: CrtTheme;
  effectsEnabled: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  liveFlashEnabled: boolean;
}

interface CrtSettingsContextType {
  settings: CrtSettings;
  setTheme: (theme: CrtTheme) => void;
  setEffectsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLiveFlashEnabled: (enabled: boolean) => void;
}

const CrtSettingsContext = createContext<CrtSettingsContextType | undefined>(undefined);

export function CrtSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CrtTheme>("amber");
  const [effectsEnabled, setEffectsEnabledState] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);
  const [liveFlashEnabled, setLiveFlashEnabledState] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    // 2. Load settings from localStorage
    const savedTheme = localStorage.getItem("typemaster_crt_theme") as CrtTheme | null;
    const savedEffects = localStorage.getItem("typemaster_crt_effects");
    const savedSound = localStorage.getItem("typemaster_crt_sound");
    const savedLiveFlash = localStorage.getItem("typemaster_crt_live_flash");

    if (savedTheme) setThemeState(savedTheme);
    if (savedEffects !== null) setEffectsEnabledState(savedEffects === "true");
    if (savedSound !== null) setSoundEnabledState(savedSound === "true");
    if (savedLiveFlash !== null) setLiveFlashEnabledState(savedLiveFlash === "true");

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const setTheme = (t: CrtTheme) => {
    setThemeState(t);
    localStorage.setItem("typemaster_crt_theme", t);
  };

  const setEffectsEnabled = (enabled: boolean) => {
    setEffectsEnabledState(enabled);
    localStorage.setItem("typemaster_crt_effects", String(enabled));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("typemaster_crt_sound", String(enabled));
  };

  const setLiveFlashEnabled = (enabled: boolean) => {
    setLiveFlashEnabledState(enabled);
    localStorage.setItem("typemaster_crt_live_flash", String(enabled));
  };

  // Sync theme class to html/document element
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "green") {
        root.classList.add("theme-green");
        root.classList.remove("theme-amber");
      } else {
        root.classList.add("theme-amber");
        root.classList.remove("theme-green");
      }
    }
  }, [theme]);

  const settings: CrtSettings = {
    theme,
    effectsEnabled: effectsEnabled && !reducedMotion, // Overridden by prefers-reduced-motion
    soundEnabled,
    reducedMotion,
    liveFlashEnabled,
  };

  return (
    <CrtSettingsContext.Provider
      value={{
        settings,
        setTheme,
        setEffectsEnabled,
        setSoundEnabled,
        setLiveFlashEnabled,
      }}
    >
      {children}
    </CrtSettingsContext.Provider>
  );
}


export function useCrtSettings() {
  const context = useContext(CrtSettingsContext);
  if (!context) {
    throw new Error("useCrtSettings must be used within a CrtSettingsProvider");
  }
  return context;
}
