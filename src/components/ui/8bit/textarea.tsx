import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const textareaVariants = cva("font-vt323 tracking-wider text-lg uppercase transition-all select-none", {
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

export interface BitTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

function Textarea({ className, font, ...props }: BitTextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full min-h-[120px] bg-[#070707] border-2 border-[var(--color-crt-dim)]/50 rounded p-4 text-[var(--color-crt-primary)] focus:outline-none focus:border-[var(--color-crt-primary)] focus:shadow-[0_0_8px_var(--color-crt-primary)] shadow-inner placeholder:text-[var(--color-crt-dim)]/40 font-vt323 text-lg transition-all resize-y",
        textareaVariants({ font }),
        className
      )}
    />
  );
}

export { Textarea };
