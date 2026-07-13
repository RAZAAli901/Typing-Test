"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserStats {
  username: string;
  totalSessions: number;
  averageWpm: number;
  averageAccuracy: number;
  topWpm: number;
  totalDurationMinutes: number;
}

interface PBData {
  mode: string;
  netWpm: number;
  accuracy: number;
  createdAt: string;
}

const MODES = [
  { id: "standard", label: "Standard", icon: "📝" },
  { id: "numbers", label: "Numbers", icon: "🔢" },
  { id: "quotes", label: "Quotes", icon: "💬" },
  { id: "code-snippet", label: "Code Snippet", icon: "💻" },
  { id: "punctuation", label: "Punctuation", icon: "🔣" },
  { id: "random-words", label: "Random Words", icon: "🔀" },
  { id: "daily-challenge", label: "Daily Challenge", icon: "📅" },
  { id: "custom", label: "Custom Text", icon: "⚙️" },
];

export default function StatsPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [claimInput, setClaimInput] = useState("");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  // Stats Data
  const [stats, setStats] = useState<UserStats | null>(null);
  const [personalBests, setPersonalBests] = useState<Record<string, PBData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch username on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("typemaster_username");
      if (stored && stored !== "Anonymous") {
        setUsername(stored);
      } else {
        setUsername(null);
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch stats and personal bests when username changes
  useEffect(() => {
    if (!username) return;
    const currentUsername = username;

    async function fetchUserData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Aggregated Stats
        const statsRes = await fetch(`/api/users/${currentUsername}/stats`);
        if (statsRes.status === 404) {
          // If user exists in localStorage but has no sessions yet in database
          setStats({
            username: currentUsername,
            totalSessions: 0,
            averageWpm: 0,
            averageAccuracy: 0,
            topWpm: 0,
            totalDurationMinutes: 0,
          });
          setPersonalBests({});
          return;
        }
        if (!statsRes.ok) throw new Error("Could not load stats data.");
        const statsData = await statsRes.json();
        setStats(statsData);

        // 2. Fetch PBs for all modes
        const pbPromises = MODES.map(async (mode) => {
          try {
            const pbRes = await fetch(`/api/users/${currentUsername}/personal-best?mode=${mode.id}`);
            if (pbRes.ok) {
              const pbData = await pbRes.json();
              return { mode: mode.id, data: pbData.personalBest || null };
            }
          } catch (e) {
            console.error(`Error fetching PB for mode ${mode.id}`, e);
          }
          return { mode: mode.id, data: null };
        });

        const pbResults = await Promise.all(pbPromises);
        const pbMap: Record<string, PBData | null> = {};
        pbResults.forEach((res) => {
          pbMap[res.mode] = res.data;
        });
        setPersonalBests(pbMap);
      } catch (err: any) {
        setError(err.message || "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [username]);

  // Handle Username Claim Submit
  const handleClaimUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError(null);
    const cleaned = claimInput.trim();

    if (cleaned.length < 3 || cleaned.length > 20) {
      setClaimError("Username must be between 3 and 20 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleaned)) {
      setClaimError("Username can only contain letters, numbers, underscores, and dashes.");
      return;
    }

    setIsSubmittingClaim(true);

    try {
      // Validate via mock/temporary sessions check or save directly if passes rules
      // For proper profile setups, we can check database profiles or save local
      // We will perform a basic profanity/system name check locally before saving
      const BLOCKED = ["admin", "moderator", "root", "system", "support", "fuck", "shit", "ass", "bitch", "cunt", "nigger"];
      const lower = cleaned.toLowerCase();
      if (BLOCKED.some((b) => lower.includes(b))) {
        setClaimError("Username contains restricted or inappropriate terms.");
        setIsSubmittingClaim(false);
        return;
      }

      // Success
      localStorage.setItem("typemaster_username", cleaned);
      setUsername(cleaned);

      // Dispatch custom event to notify Navbar component
      window.dispatchEvent(new Event("usernameChanged"));
    } catch (err) {
      setClaimError("Failed to claim username. Please try again.");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const handleResetUsername = () => {
    if (confirm("Are you sure you want to change your username? Your local stats will carry over if you reuse the name.")) {
      localStorage.setItem("typemaster_username", "Anonymous");
      setUsername(null);
      setClaimInput("");
      setStats(null);
      setPersonalBests({});
      window.dispatchEvent(new Event("usernameChanged"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {!username ? (
        /* Claim Username Flow Screen */
        <div className="max-w-md mx-auto py-12">
          <div className="glass-panel border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl bg-slate-950/40 text-center">
            <div className="text-4xl">👑</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Claim Username</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a unique identity to save your scores to the global leaderboard and track your personal statistics.
              </p>
            </div>

            <form onSubmit={handleClaimUsername} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-400 ml-1">Username</label>
                <input
                  type="text"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  placeholder="e.g. SpeedTyper_42"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  maxLength={20}
                />
              </div>

              {claimError && (
                <div className="text-rose-400 text-xs font-semibold text-left ml-1 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                  ⚠️ {claimError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingClaim || !claimInput.trim()}
                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-400/15"
              >
                {isSubmittingClaim ? "Validating..." : "Claim Identity 🚀"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Profile statistics Screen */
        <>
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xl shadow-md">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{username}</h2>
                <p className="text-xs text-slate-400 font-light">TypeMaster Competitor</p>
              </div>
            </div>
            <button
              onClick={handleResetUsername}
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer"
            >
              Edit Username ⚙️
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              {/* Aggregated Stats Cards Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/20 h-24 flex flex-col justify-center items-center space-y-2"
                  >
                    <div className="h-3 bg-slate-900 rounded w-12" />
                    <div className="h-6 bg-slate-900 rounded w-8" />
                    <div className="h-2 bg-slate-900 rounded w-16" />
                  </div>
                ))}
              </div>

              {/* Personal Bests Skeleton */}
              <div className="space-y-4">
                <div className="h-5 bg-slate-900 rounded w-36" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/10 h-20 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-3.5 bg-slate-900 rounded w-20" />
                          <div className="h-2.5 bg-slate-900 rounded w-16" />
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-slate-900 rounded w-12 ml-auto" />
                        <div className="h-2.5 bg-slate-900 rounded w-10 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-rose-400 text-sm font-semibold">
              ❌ {error}
            </div>
          ) : (
            <>
              {/* Aggregated Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center bg-slate-950/20">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Completed
                  </span>
                  <span className="text-2xl font-black text-white">{stats?.totalSessions}</span>
                  <span className="block text-slate-500 text-[10px] mt-1 font-light">sessions</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center bg-slate-950/20">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Average Speed
                  </span>
                  <span className="text-2xl font-black text-white">{stats?.averageWpm}</span>
                  <span className="block text-slate-500 text-[10px] mt-1 font-light">net WPM</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center bg-slate-950/20">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Top Speed
                  </span>
                  <span className="text-2xl font-black text-cyan-400">{stats?.topWpm}</span>
                  <span className="block text-slate-500 text-[10px] mt-1 font-light">max net WPM</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center bg-slate-950/20">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Average Accuracy
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {stats?.averageAccuracy}%
                  </span>
                  <span className="block text-slate-500 text-[10px] mt-1 font-light">precision rate</span>
                </div>

                <div className="glass-panel col-span-2 md:col-span-1 p-5 rounded-2xl border border-white/5 text-center bg-slate-950/20">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Practice Time
                  </span>
                  <span className="text-2xl font-black text-purple-400">
                    {stats?.totalDurationMinutes}
                  </span>
                  <span className="block text-slate-500 text-[10px] mt-1 font-light">minutes</span>
                </div>
              </div>

              {/* Personal Bests Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-white">🏆 Personal Bests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MODES.map((m) => {
                    const pb = personalBests[m.id];
                    return (
                      <div
                        key={m.id}
                        className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/10 flex items-center justify-between hover:border-cyan-500/20 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{m.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{m.label}</h4>
                            <p className="text-[10px] text-slate-400 font-light">
                              {pb
                                ? `Achieved on ${new Date(pb.createdAt).toLocaleDateString()}`
                                : "No record set"}
                            </p>
                          </div>
                        </div>

                        {pb ? (
                          <div className="text-right">
                            <span className="block text-lg font-black text-white">
                              {pb.netWpm} <span className="text-[10px] font-semibold text-slate-400">WPM</span>
                            </span>
                            <span className="block text-xs font-semibold text-emerald-400">
                              {pb.accuracy.toFixed(1)}% acc
                            </span>
                          </div>
                        ) : (
                          <Link
                            href="/play"
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/20 px-3 py-1.5 rounded-lg border border-cyan-800/30 hover:bg-cyan-950/40 transition-all"
                          >
                            Play Mode ➡️
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
