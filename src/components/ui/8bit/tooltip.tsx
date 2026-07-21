"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger as ShadcnTooltipTrigger,
} from "@/components/ui/tooltip";
import "@/components/ui/8bit/styles/retro.css";

export const tooltipVariants = cva("font-vt323 text-xs uppercase tracking-wider select-none", {
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

function TooltipProvider({ delay = 100, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnTooltipProvider>) {
  return <ShadcnTooltipProvider delay={delay} {...props} />;
}

function Tooltip({ children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnTooltip>) {
  return <ShadcnTooltip {...props}>{children}</ShadcnTooltip>;
}

function TooltipTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnTooltipTrigger>) {
  return <ShadcnTooltipTrigger {...props}>{children}</ShadcnTooltipTrigger>;
}

function TooltipContent({ className, children, font, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnTooltipContent> & VariantProps<typeof tooltipVariants>) {
  return (
    <ShadcnTooltipContent
      {...props}
      className={cn(
        "bg-[#070707] text-[var(--color-crt-primary)] border border-[var(--color-crt-dim)] rounded px-3 py-1.5 shadow-[0_0_10px_rgba(0,0,0,0.9)] font-vt323 text-xs uppercase tracking-wider z-50",
        tooltipVariants({ font }),
        className
      )}
    >
      {children}
    </ShadcnTooltipContent>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
