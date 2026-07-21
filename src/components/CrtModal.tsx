"use client";

import React from "react";
import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/8bit/dialog";

interface CrtModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

export default function CrtModal({ isOpen, title, onClose, onConfirm, children }: CrtModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-2 border-crt-primary">
        {/* Chunky retro title bar */}
        <div className="bg-crt-primary text-black px-4 py-2 flex items-center justify-between font-bold tracking-wider">
          <DialogTitle className="text-black drop-shadow-none text-lg">
            {title.toUpperCase()}
          </DialogTitle>
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
          <DialogFooter className="flex-row items-center justify-end gap-3 pt-3 border-t border-dashed border-crt-dim/20">
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
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
