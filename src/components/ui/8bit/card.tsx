import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export const cardVariants = cva("font-vt323 text-lg transition-all select-none", {
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

export interface BitCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, font, children, ...props }: BitCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-[#070707] text-[var(--color-crt-primary)] border-2 border-[var(--color-crt-dim)]/60 rounded p-6 shadow-[inset_0_0_12px_rgba(0,0,0,0.95)] hover:border-[var(--color-crt-primary)]/70 transition-all duration-300 flex flex-col space-y-3 font-vt323 text-lg",
        cardVariants({ font }),
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("flex flex-col space-y-1.5 pb-2 border-b border-dashed border-[var(--color-crt-dim)]/30", className)}
    >
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn(
        "text-xl font-bold text-[var(--color-crt-primary)] drop-shadow-[0_0_3px_var(--color-crt-primary)] uppercase tracking-wider",
        className
      )}
    >
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cn("text-base text-[var(--color-crt-dim)]/80 leading-relaxed uppercase", className)}
    >
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("flex-1 space-y-2 pt-2", className)}
    >
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-between pt-3 border-t border-dashed border-[var(--color-crt-dim)]/30 text-xs font-bold uppercase tracking-wider text-[var(--color-crt-dim)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
