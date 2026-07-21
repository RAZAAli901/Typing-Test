"use client";

import React from "react";
import { Button } from "@/components/ui/8bit/button";

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
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="w-6 h-6 text-[10px] p-0 text-black hover:text-white"
          >
            X
          </Button>
        </div>
        
        {/* Modal content */}
        <div className="p-6 text-crt-dim space-y-4">
          <div className="text-white font-semibold leading-relaxed uppercase">{children}</div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-dashed border-crt-dim/20">
            {onConfirm && (
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                size="sm"
              >
                PROCEED
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
