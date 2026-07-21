import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from "@/components/ui/tabs";
import "@/components/ui/8bit/styles/retro.css";

export const tabsVariants = cva("font-vt323 tracking-wider uppercase select-none", {
  variants: {
    font: {
      normal: "",
      retro: "retro font-vt323 text-lg",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

function Tabs({ className, ...props }: React.ComponentProps<typeof ShadcnTabs>) {
  return (
    <ShadcnTabs
      {...props}
      className={cn("w-full font-vt323", className)}
    />
  );
}

function TabsList({ className, children, ...props }: React.ComponentProps<typeof ShadcnTabsList>) {
  return (
    <ShadcnTabsList
      {...props}
      className={cn(
        "flex flex-wrap gap-2 justify-center bg-[#070707] p-2 rounded border border-[var(--color-crt-dim)]/40 shadow-md h-auto font-vt323",
        className
      )}
    >
      {children}
    </ShadcnTabsList>
  );
}

function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof ShadcnTabsTrigger>) {
  return (
    <ShadcnTabsTrigger
      {...props}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 font-vt323 text-base font-bold rounded transition-all cursor-pointer text-[var(--color-crt-dim)] hover:text-white border border-transparent data-active:bg-[#0c1a0c] data-active:text-[var(--color-crt-primary)] data-active:border-[var(--color-crt-dim)] data-active:shadow-[0_0_8px_rgba(57,255,20,0.2)]",
        className
      )}
    >
      {children}
    </ShadcnTabsTrigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof ShadcnTabsContent>) {
  return (
    <ShadcnTabsContent
      {...props}
      className={cn("pt-4 font-vt323 text-lg focus:outline-none", className)}
    />
  );
}

export { Tabs, TabsList, TabsContent, TabsTrigger };
