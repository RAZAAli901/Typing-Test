import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Dialog as ShadcnDialog,
  DialogClose as ShadcnDialogClose,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger as ShadcnDialogTrigger,
} from "@/components/ui/dialog";
import "@/components/ui/8bit/styles/retro.css";

const Dialog = ShadcnDialog;
const DialogTrigger = ShadcnDialogTrigger;
const DialogHeader = ShadcnDialogHeader;
const DialogDescription = ShadcnDialogDescription;
const DialogClose = ShadcnDialogClose;
const DialogFooter = ShadcnDialogFooter;

export const dialogContentVariants = cva("font-vt323 tracking-wider text-lg select-none", {
  variants: {
    font: {
      normal: "",
      retro: "retro font-vt323",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitDialogProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnDialogContent>,
    VariantProps<typeof dialogContentVariants> {}

function DialogTitle({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnDialogTitle>) {
  return (
    <ShadcnDialogTitle
      {...props}
      className={cn("text-xl font-bold text-[var(--color-crt-primary)] drop-shadow-[0_0_4px_var(--color-crt-primary)] uppercase tracking-wider", className)}
    >
      {children}
    </ShadcnDialogTitle>
  );
}

function DialogContent({ className, children, font, ...props }: BitDialogProps) {
  return (
    <ShadcnDialogContent
      {...props}
      className={cn(
        "bg-[#070707] text-[var(--color-crt-primary)] border-2 border-[var(--color-crt-dim)] rounded p-6 shadow-[0_0_30px_rgba(0,0,0,0.95)] font-vt323 text-lg",
        dialogContentVariants({ font }),
        className
      )}
    >
      {children}
    </ShadcnDialogContent>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogClose,
};
