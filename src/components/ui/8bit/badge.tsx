import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const badgeVariants = cva("font-vt323 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded select-none transition-all", {
  variants: {
    font: {
      normal: "",
      retro: "retro font-vt323",
    },
    variant: {
      default: "bg-[#070707] text-[var(--color-crt-primary)] border border-[var(--color-crt-dim)] shadow-[0_0_4px_var(--color-crt-dim)]",
      secondary: "bg-[#181105] text-[var(--crt-amber,#ffb000)] border border-amber-900/60 shadow-[0_0_4px_rgba(251,191,36,0.3)]",
      outline: "bg-transparent text-[var(--color-crt-dim)] border border-[var(--color-crt-dim)]/40",
      destructive: "bg-red-950/40 text-red-500 border border-red-500/50 shadow-[0_0_4px_rgba(239,68,68,0.3)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BitBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<badgeVariants> {}

function Badge({ className, font, variant = "default", children, ...props }: BitBadgeProps) {
  return (
    <div
      {...props}
      className={cn(badgeVariants({ variant, font }), className)}
    >
      {children}
    </div>
  );
}

export { Badge };
