"use client";

import { useCrtSettings } from "@/lib/CrtSettingsContext";

export default function ScanlineOverlay() {
  const { settings } = useCrtSettings();

  if (!settings.effectsEnabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.14]"
      style={{
        background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)",
      }}
    />
  );
}
