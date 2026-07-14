"use client";

import { useCrtSettings } from "@/lib/CrtSettingsContext";

export default function CurvedVignette() {
  const { settings } = useCrtSettings();

  if (!settings.effectsEnabled) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-40"
      style={{
        boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.9)",
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.45) 100%)",
      }}
    />
  );
}
