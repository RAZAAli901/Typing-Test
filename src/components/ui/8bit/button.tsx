import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import "@/components/ui/8bit/styles/retro.css";

/**
 * 8bitcn Button Component — CRT Retro Variant Mapping:
 * - `default`: Primary CTA (CRT Green phosphor border/text with hover glow)
 * - `secondary`: Secondary CTA / Amber Accent (CRT Amber phosphor styling)
 * - `outline`: Outline action (Dark glass panel with CRT border)
 * - `destructive`: Danger action (Red phosphor border/bg for clear/reset)
 * - `ghost`: Minimalist action (Icon buttons, navbar toggles)
 * - `link`: In-text directional link
 */
export const buttonVariants = cva("font-vt323 uppercase tracking-widest transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-crt-primary)] focus-visible:ring-offset-1 focus-visible:ring-offset-black", {
  variants: {
    font: {
      normal: "",
      retro: "retro font-vt323 text-lg",
    },
    variant: {
      default: "bg-[#080808] text-[var(--color-crt-primary)] hover:text-white border-2 border-[var(--color-crt-dim)] hover:border-[var(--color-crt-primary)] hover:bg-zinc-900 shadow-[2px_2px_0px_var(--color-crt-dim)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
      destructive: "bg-[#180505] text-red-500 hover:text-red-300 border-2 border-red-900/60 hover:border-red-500 hover:bg-red-950/40 shadow-[2px_2px_0px_#7f1d1d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
      outline: "bg-[#070707] text-[var(--color-crt-primary)] hover:text-white border-2 border-[var(--color-crt-dim)] hover:border-[var(--color-crt-primary)] hover:bg-zinc-900",
      secondary: "bg-[#0c1a0c] text-[var(--crt-amber,#ffb000)] hover:text-amber-200 border-2 border-amber-900/60 hover:border-[var(--crt-amber,#ffb000)] hover:bg-amber-950/30 shadow-[2px_2px_0px_#78350f]",
      ghost: "text-[var(--color-crt-primary)] hover:text-white hover:bg-[var(--color-crt-dim)]/20",
      link: "text-[var(--color-crt-primary)] underline-offset-4 hover:underline",
    },
    size: {
      default: "px-6 py-2.5 text-lg",
      sm: "px-4 py-1.5 text-base",
      lg: "px-8 py-3.5 text-xl",
      icon: "p-2 min-w-10 h-10 flex items-center justify-center text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({ children, asChild, className, font, variant = "default", size = "default", ...props }: BitButtonProps) {
  return (
    <ShadcnButton
      {...props}
      className={cn(
        "rounded-none active:translate-y-0.5 transition-all relative inline-flex items-center justify-center gap-2",
        buttonVariants({ variant, size, font }),
        size === "icon" && "mx-1 my-0",
        className
      )}
      size={size}
      variant={variant}
    >
      {asChild ? (
        <span className="relative inline-flex items-center justify-center gap-2">
          {children}
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}

export { Button };
