"use client";

import React from "react";

interface CrtModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

export default function CrtModal({ isOpen, title, onClose, onConfirm, children }: CrtModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 font-vt323 text-lg select-none">
      <div className="w-full max-w-md bg-[#080808] border-2 border-crt-primary rounded shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Chunky retro title bar */}
        <div className="bg-crt-primary text-black px-4 py-2 flex items-center justify-between font-bold tracking-wider">
          <span>{title.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="bg-black text-crt-primary hover:bg-crt-primary hover:text-black px-1.5 py-0.5 transition-colors font-press-start text-[8px] cursor-pointer border border-crt-primary rounded-sm"
          >
            X
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6 text-crt-dim space-y-4">
          <div className="text-white font-semibold leading-relaxed uppercase">{children}</div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dashed border-crt-dim/20">
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-1.5 bg-zinc-900 border-2 border-crt-dim text-crt-primary hover:text-white hover:border-crt-primary font-bold rounded shadow-[2px_2px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-sm"
              >
                PROCEED
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-transparent border border-crt-dim/50 text-crt-dim hover:text-white hover:border-white font-bold rounded transition-all cursor-pointer text-sm"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
