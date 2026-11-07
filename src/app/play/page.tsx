import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PlayClient from "./PlayClient";

export const metadata: Metadata = pageMetadata({
  title: "Typing Test & Trainer - Test Your WPM Speed",
  description:
    "Take our free online typing test. Measure gross and net WPM, keystroke accuracy, and consistency across 8 custom modes.",
  path: "/play",
});

export default function PlayPage() {
  return <PlayClient />;
}
