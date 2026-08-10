"use client";

import React from "react";
import Icon from "@/components/Icon";

interface PersonalBestAlertBannerProps {
  message: string | null;
  onClose?: () => void;
}

export default function PersonalBestAlertBanner({ message, onClose }: PersonalBestAlertBannerProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0a0a0a] border-2 border-amber-500 p-4 rounded shadow-[0_0_20px_rgba(255,176,0,0.4)] animate-bounce font-vt323 text-lg text-amber-400 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon name="trophy" size={20} className="text-amber-400 animate-pulse flex-shrink-0" />
        <span className="leading-tight">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-amber-500 hover:text-white font-mono text-xs px-1 uppercase tracking-widest border border-amber-500/40 rounded"
        >
          [X]
        </button>
      )}
    </div>
  );
}
