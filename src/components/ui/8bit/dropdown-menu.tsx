"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@/components/ui/8bit/styles/retro.css";

const DropdownMenu = ShadcnDropdownMenu;
const DropdownMenuTrigger = ShadcnDropdownMenuTrigger;

export const dropdownMenuVariants = cva("font-vt323 text-base uppercase tracking-wider select-none", {
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

function DropdownMenuContent({ className, children, font, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuContent> & VariantProps<typeof dropdownMenuVariants>) {
  return (
    <ShadcnDropdownMenuContent
      {...props}
      className={cn(
        "bg-[#070707] text-[var(--color-crt-primary)] border-2 border-[var(--color-crt-dim)] rounded p-2 shadow-[0_0_20px_rgba(0,0,0,0.95)] font-vt323 text-base z-50 space-y-1 min-w-[180px]",
        dropdownMenuVariants({ font }),
        className
      )}
    >
      {children}
    </ShadcnDropdownMenuContent>
  );
}

function DropdownMenuItem({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuItem>) {
  return (
    <ShadcnDropdownMenuItem
      {...props}
      className={cn(
        "px-3 py-1.5 rounded text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer focus:bg-[#0c1a0c] focus:text-[var(--color-crt-primary)] outline-none border border-transparent focus:border-[var(--color-crt-dim)]/50",
        className
      )}
    >
      {children}
    </ShadcnDropdownMenuItem>
  );
}

function DropdownMenuLabel({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuLabel>) {
  return (
    <ShadcnDropdownMenuLabel
      {...props}
      className={cn("px-3 py-1 text-xs font-bold text-[var(--color-crt-dim)] uppercase tracking-widest", className)}
    >
      {children}
    </ShadcnDropdownMenuLabel>
  );
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<typeof ShadcnDropdownMenuSeparator>) {
  return (
    <ShadcnDropdownMenuSeparator
      {...props}
      className={cn("my-1 border-t border-dashed border-[var(--color-crt-dim)]/30", className)}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
