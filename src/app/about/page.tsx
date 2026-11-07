import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";

export const metadata: Metadata = pageMetadata({
  title: "About TypeMaster - Typing Speed Metrics & System Architecture",
  description:
    "Learn about TypeMaster's typing formulas, Gross vs Net WPM calculations, anti-cheat validation, and retro CRT terminal interface.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutClient />;
}
