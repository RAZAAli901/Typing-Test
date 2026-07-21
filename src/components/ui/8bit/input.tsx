import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const inputVariants = cva("font-vt323 tracking-wider text-lg uppercase transition-all select-none", {
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

export interface BitInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

function Input({ className, font, ...props }: BitInputProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full bg-[#070707] border-2 border-[var(--color-crt-dim)]/50 rounded p-3 text-[var(--color-crt-primary)] focus:outline-none focus:border-[var(--color-crt-primary)] focus:shadow-[0_0_8px_var(--color-crt-primary)] shadow-inner placeholder:text-[var(--color-crt-dim)]/40 font-vt323 text-lg transition-all",
        inputVariants({ font }),
        className
      )}
    />
  );
}

export { Input };
