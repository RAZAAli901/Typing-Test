import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const alertVariants = cva("font-vt323 p-4 rounded text-sm uppercase tracking-wider select-none transition-all", {
  variants: {
    font: {
      normal: "",
      retro: "retro font-vt323",
    },
    variant: {
      default: "bg-emerald-950/30 text-[var(--color-crt-primary)] border-2 border-[var(--color-crt-primary)] shadow-[0_0_8px_var(--color-crt-primary)] animate-pulse",
      destructive: "bg-red-950/40 text-red-500 border-2 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse",
      warning: "bg-amber-950/30 text-[var(--crt-amber,#ffb000)] border-2 border-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.3)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BitAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({ className, font, variant = "default", children, ...props }: BitAlertProps) {
  return (
    <div
      {...props}
      className={cn(alertVariants({ variant, font }), className)}
    >
      {children}
    </div>
  );
}

function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      {...props}
      className={cn("font-bold text-base uppercase tracking-widest mb-1", className)}
    >
      {children}
    </h5>
  );
}

function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      {...props}
      className={cn("text-xs font-mono uppercase tracking-wider leading-relaxed", className)}
    >
      {children}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };
