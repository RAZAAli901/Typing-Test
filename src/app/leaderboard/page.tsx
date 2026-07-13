"use client";

import { useEffect, useState } from "react";
import { ModeType } from "@/content/texts";

interface SessionData {
  id: string;
  username: string;
  mode: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  timeTakenSeconds: number;
  createdAt: string;
}

export default function LeaderboardPage() {
  const [activeMode, setActiveMode] = useState<ModeType | "custom">("standard");
  const [activeSort, setActiveSort] = useState<"netWpm" | "accuracy">("netWpm");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modesList: { id: ModeType | "custom"; label: string; icon: string }[] = [
    { id: "standard", label: "Standard", icon: "📝" },
    { id: "numbers", label: "Numbers", icon: "🔢" },
    { id: "quotes", label: "Quotes", icon: "💬" },
    { id: "code-snippet", label: "Code", icon: "💻" },
    { id: "punctuation", label: "Punctuation", icon: "🔣" },
    { id: "random-words", label: "Random", icon: "🔀" },
    { id: "daily-challenge", label: "Daily Challenge", icon: "📅" },
    { id: "custom", label: "Custom Text", icon: "⚙️" },
  ];

  // Fetch leaderboard data when mode or sort selection changes
  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/leaderboard?mode=${activeMode}&sort=${activeSort}&limit=10`
        );
        if (!response.ok) {
          throw new Error("Failed to load leaderboard data.");
        }
        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [activeMode, activeSort]);

  // Read current claim username from localStorage to highlight in list (hydration safe)
  const [claimedUsername, setClaimedUsername] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setClaimedUsername(localStorage.getItem("typemaster_username"));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          🏆 Global Leaderboard
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-light">
          Compare typing performance against players worldwide.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="w-full flex flex-wrap gap-2 justify-center bg-slate-950/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        {modesList.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-white bg-white/0 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Toggles */}
      <div className="flex justify-between items-center bg-slate-950/20 p-4 rounded-xl border border-white/5">
        <div className="text-xs text-slate-400 font-medium">
          Showing Top 10 results for <span className="text-cyan-400 capitalize">{activeMode}</span>
        </div>
        <div className="flex gap-2 items-center text-xs text-slate-400">
          <span>Sort by:</span>
          <div className="flex bg-slate-950/60 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveSort("netWpm")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeSort === "netWpm"
                  ? "bg-cyan-500/20 text-cyan-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Net WPM
            </button>
            <button
              onClick={() => setActiveSort("accuracy")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeSort === "accuracy"
                  ? "bg-cyan-500/20 text-cyan-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Accuracy
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl bg-slate-950/20 backdrop-blur-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-cyan-500/25 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-400 text-sm font-semibold">
            ❌ {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-4xl">🏜️</div>
            <h4 className="text-base font-bold text-white">No records found</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Be the first to set a score for <span className="capitalize">{activeMode}</span> mode!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6 text-center">Net WPM</th>
                  <th className="py-4 px-6 text-center">Accuracy</th>
                  <th className="py-4 px-6 text-center">Duration</th>
                  <th className="py-4 px-6 text-center hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-200">
                {sessions.map((session, idx) => {
                  const rank = idx + 1;
                  const isCurUser = claimedUsername && session.username.toLowerCase() === claimedUsername.toLowerCase();
                  
                  // Rank styling icons for podium finishes
                  let rankDisplay: React.ReactNode = rank;
                  if (rank === 1) rankDisplay = "🥇";
                  else if (rank === 2) rankDisplay = "🥈";
                  else if (rank === 3) rankDisplay = "🥉";

                  return (
                    <tr
                      key={session.id}
                      className={`transition-colors hover:bg-white/2 ${
                        isCurUser
                          ? "bg-cyan-500/5 border-l-4 border-l-cyan-400"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-center font-bold text-sm">
                        {rankDisplay}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        <span className={isCurUser ? "text-cyan-300 font-bold" : "text-white"}>
                          {session.username}
                        </span>
                        {isCurUser && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                            You
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-white">
                        {session.netWpm}
                      </td>
                      <td className="py-4 px-6 text-center font-semibold text-emerald-400">
                        {session.accuracy.toFixed(1)}%
                      </td>
                      <td className="py-4 px-6 text-center text-slate-400 font-light">
                        {session.timeTakenSeconds.toFixed(1)}s
                      </td>
                      <td className="py-4 px-6 text-center text-slate-400 font-light text-xs hidden md:table-cell">
                        {new Date(session.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
