"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const progressVariants = cva("font-vt323 select-none transition-all", {
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

export interface BitProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  progressBg?: string;
}

function Progress({
  className,
  font,
  value = 0,
  progressBg,
  ...props
}: BitProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value || 0));

  return (
    <ProgressPrimitive.Root
      {...props}
      value={safeValue}
      className={cn(
        "relative w-full h-4 bg-[#070707] border-2 border-[var(--color-crt-dim)]/60 rounded overflow-hidden p-0.5 shadow-inner font-vt323",
        progressVariants({ font }),
        className
      )}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full transition-all duration-300 rounded-xs",
          progressBg || "bg-[var(--color-crt-primary)] shadow-[0_0_8px_var(--color-crt-primary)]"
        )}
        style={{ width: `${safeValue}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
