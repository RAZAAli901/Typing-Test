"use client";

import { useCrtSettings } from "@/lib/CrtSettingsContext";

export default function ScanlineOverlay() {
  const { settings } = useCrtSettings();

  // If user disables effects or prefers reduced motion, disable scanlines for optimal readability
  if (!settings.effectsEnabled || settings.reducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.08]"
      style={{
        background:
          "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.25) 2px, rgba(0, 0, 0, 0.25) 4px)",
      }}
      aria-hidden="true"
    />
  );
}
