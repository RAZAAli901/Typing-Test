"use client";

import { useEffect, useState } from "react";
import { ModeType } from "@/content/texts";
import DefaultAvatar from "@/components/DefaultAvatar";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/8bit/button";

interface SessionData {
  id: string;
  username: string;
  mode: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  timeTakenSeconds: number;
  createdAt: string;
  user?: {
    avatarUrl?: string | null;
  };
}

export default function LeaderboardPage() {
  const [activeMode, setActiveMode] = useState<ModeType | "custom">("standard");
  const [activeSort, setActiveSort] = useState<"netWpm" | "accuracy">("netWpm");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modesList: { id: ModeType | "custom"; label: string; icon: any }[] = [
    { id: "standard", label: "Standard", icon: "standard" },
    { id: "numbers", label: "Numbers", icon: "numbers" },
    { id: "quotes", label: "Quotes", icon: "quotes" },
    { id: "code-snippet", label: "Code", icon: "code" },
    { id: "punctuation", label: "Punctuation", icon: "punctuation" },
    { id: "random-words", label: "Random", icon: "random" },
    { id: "daily-challenge", label: "Daily Challenge", icon: "daily" },
    { id: "custom", label: "Custom Text", icon: "custom" },
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
          let errorMsg = "Failed to load leaderboard data.";
          try {
            const data = await response.json();
            if (data && data.error) {
              errorMsg = data.error;
            }
          } catch (e) {
            errorMsg = `Server error (Status ${response.status})`;
          }
          throw new Error(errorMsg);
        }
        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err: any) {
        console.warn("Database leaderboard fetch failed, falling back to local scores:", err);
        
        const isNetworkError = err.message && (
          err.message.includes("fetch") || 
          err.message.includes("Network") || 
          err.message.includes("Failed to fetch")
        );
        const displayError = isNetworkError
          ? "Failed to connect to the server (Network Error). Please check your connection."
          : (err.message || "Failed to load leaderboard data.");
        
        setError(displayError);

        if (typeof window !== "undefined") {
          try {
            const localSessionsStr = localStorage.getItem("typemaster_local_sessions") || "[]";
            const localSessions = JSON.parse(localSessionsStr) as any[];
            
            // Filter by activeMode
            const filtered = localSessions.filter((s) => s.mode === activeMode);
            
            // Sort by activeSort (netWpm or accuracy)
            filtered.sort((a, b) => {
              if (activeSort === "accuracy") {
                return b.accuracy - a.accuracy || b.netWpm - a.netWpm;
              }
              return b.netWpm - a.netWpm || b.accuracy - a.accuracy;
            });
            
            // Take top 10
            setSessions(filtered.slice(0, 10));
          } catch (localErr) {
            console.error("Failed to load local scores fallback:", localErr);
          }
        }
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

  const getOrdinalRank = (n: number) => {
    const s = ["TH", "ST", "ND", "RD"];
    const v = n % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return `${String(n).padStart(2, "0")}${suffix}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 font-vt323 text-lg">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          🏆 GLOBAL HIGHSCORES
        </h1>
        <p className="text-sm md:text-base text-crt-dim font-bold tracking-widest uppercase">
          Compare typing performance against players worldwide.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="w-full flex flex-wrap gap-2 justify-center bg-[#070707] p-2 rounded border border-crt-dim/30 shadow-md">
        {modesList.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <Button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              variant={isActive ? "default" : "ghost"}
              size="sm"
            >
              <Icon name={m.icon as any} size={16} className={isActive ? "text-crt-primary" : "text-crt-dim"} />
              <span>{m.label.toUpperCase()}</span>
            </Button>
          );
        })}
      </div>

      {/* Sort Toggles */}
      <div className="flex justify-between items-center bg-[#070707] p-4 rounded border border-crt-dim/30">
        <div className="text-xs md:text-sm text-crt-dim font-bold tracking-widest uppercase">
          TOP 10 SCORES: <span className="text-crt-primary font-black uppercase">{activeMode}</span>
        </div>
        <div className="flex gap-2 items-center text-xs md:text-sm text-crt-dim font-bold uppercase">
          <span>Sort by:</span>
          <div className="flex gap-1 bg-[#0a0a0a] p-0.5 rounded border border-crt-dim/20">
            <Button
              onClick={() => setActiveSort("netWpm")}
              variant={activeSort === "netWpm" ? "default" : "ghost"}
              size="sm"
            >
              NET WPM
            </Button>
            <Button
              onClick={() => setActiveSort("accuracy")}
              variant={activeSort === "accuracy" ? "default" : "ghost"}
              size="sm"
            >
              ACCURACY
            </Button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-[#070707] border-2 border-crt-dim/40 rounded shadow-[0_0_20px_rgba(0,0,0,0.9)] overflow-hidden">
        {isLoading ? (
          <div className="overflow-x-auto animate-pulse">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-crt-dim/20 bg-zinc-950/60 text-crt-dim text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-20"><div className="h-3 bg-zinc-900 rounded w-10 mx-auto" /></th>
                  <th className="py-4 px-6"><div className="h-3 bg-zinc-900 rounded w-20" /></th>
                  <th className="py-4 px-6 text-center"><div className="h-3 bg-zinc-900 rounded w-16 mx-auto" /></th>
                  <th className="py-4 px-6 text-center"><div className="h-3 bg-zinc-900 rounded w-16 mx-auto" /></th>
                  <th className="py-4 px-6 text-center"><div className="h-3 bg-zinc-900 rounded w-16 mx-auto" /></th>
                  <th className="py-4 px-6 text-center hidden md:table-cell"><div className="h-3 bg-zinc-900 rounded w-24 mx-auto" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-crt-dim/10 text-sm">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="h-16">
                    <td className="py-4 px-6 text-center"><div className="h-4 bg-zinc-900 rounded w-8 mx-auto" /></td>
                    <td className="py-4 px-6"><div className="h-4 bg-zinc-900 rounded w-28" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-4 bg-zinc-900 rounded w-10 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-4 bg-zinc-900 rounded w-12 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><div className="h-4 bg-zinc-900 rounded w-10 mx-auto" /></td>
                    <td className="py-4 px-6 text-center hidden md:table-cell"><div className="h-3 bg-zinc-900 rounded w-20 mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-bold tracking-widest uppercase">
            [ERROR: {error}]
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-4xl animate-pulse">🏜️</div>
            <h4 className="text-lg font-bold text-crt-primary">NO HIGH SCORES RECORDED</h4>
            <p className="text-xs text-crt-dim uppercase tracking-wider">
              Be the first to set a score in <span className="text-white font-bold">{activeMode}</span> mode!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-crt-dim/30 bg-zinc-950/80 text-crt-dim font-bold text-xs uppercase tracking-widest">
                  <th className="py-4 px-6 w-24">Rank</th>
                  <th className="py-4 px-6 text-left">Competitor</th>
                  <th className="py-4 px-6">Net WPM</th>
                  <th className="py-4 px-6">Accuracy</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 hidden md:table-cell">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-crt-dim/15 text-slate-200">
                {sessions.map((session, idx) => {
                  const rank = idx + 1;
                  const isCurUser = claimedUsername && session.username.toLowerCase() === claimedUsername.toLowerCase();
                  
                  const rankStr = getOrdinalRank(rank);

                  return (
                    <tr
                      key={session.id}
                      className={`transition-colors hover:bg-crt-primary/[0.04] ${
                        isCurUser
                          ? "bg-crt-primary/10 border-l-4 border-l-crt-primary"
                          : idx % 2 === 0
                          ? "bg-[#070707]"
                          : "bg-[#0e0e0e]/50"
                      }`}
                    >
                      <td className="py-4 px-6 font-bold text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)] tracking-wide">
                        {rankStr}
                      </td>
                      <td className="py-4 px-6 text-left font-bold text-white tracking-wide">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center bg-zinc-950 border border-crt-dim/40 flex-shrink-0">
                            {session.user?.avatarUrl ? (
                              <img src={session.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <DefaultAvatar className="w-4 h-4 text-crt-primary" />
                            )}
                          </div>
                          <span>{session.username}</span>
                          {isCurUser && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-crt-primary/20 text-crt-primary border border-crt-primary/30">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-white text-xl drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
                        {session.netWpm}
                      </td>
                      <td className="py-4 px-6 font-bold text-crt-primary">
                        {session.accuracy.toFixed(1)}%
                      </td>
                      <td className="py-4 px-6 text-crt-dim font-medium">
                        {session.timeTakenSeconds.toFixed(1)}s
                      </td>
                      <td className="py-4 px-6 text-crt-dim text-xs font-light hidden md:table-cell">
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
