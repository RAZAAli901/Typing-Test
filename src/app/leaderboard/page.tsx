import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = pageMetadata({
  title: "Global Typing Leaderboard - Live WPM Highscores",
  description:
    "View live global typing speed records, top net WPM ranks, and daily challenge high scores across all typing test modes.",
  path: "/leaderboard",
});

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
