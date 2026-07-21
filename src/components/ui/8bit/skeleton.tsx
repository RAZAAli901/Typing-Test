import * as React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

export type BitSkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: BitSkeletonProps) {
  return (
    <div
      {...props}
      className={cn(
        "animate-pulse bg-[#0a150a]/80 border border-[var(--color-crt-dim)]/30 rounded font-vt323 shadow-[0_0_6px_rgba(57,255,20,0.1)]",
        className
      )}
    />
  );
}

export { Skeleton };
