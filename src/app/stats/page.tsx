import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import StatsClient from "./StatsClient";

export const metadata: Metadata = pageMetadata({
  title: "Typing Performance Statistics & Personal Records",
  description:
    "Analyze your personal typing metrics, speed progression timeline, accuracy charts, and mode-specific personal bests.",
  path: "/stats",
  noIndex: true,
});

export default function StatsPage() {
  return <StatsClient />;
}
