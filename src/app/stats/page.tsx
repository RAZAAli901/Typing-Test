"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/8bit/button";
import { Card } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";

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
  { id: "standard", label: "Standard", icon: "standard" },
  { id: "numbers", label: "Numbers", icon: "numbers" },
  { id: "quotes", label: "Quotes", icon: "quotes" },
  { id: "code-snippet", label: "Code Snippet", icon: "code" },
  { id: "punctuation", label: "Punctuation", icon: "punctuation" },
  { id: "random-words", label: "Random Words", icon: "random" },
  { id: "daily-challenge", label: "Daily Challenge", icon: "daily" },
  { id: "custom", label: "Custom Text", icon: "custom" },
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
        console.warn("Database stats fetch failed, calculating from local scores:", err);
        if (typeof window !== "undefined") {
          try {
            const localSessionsStr = localStorage.getItem("typemaster_local_sessions") || "[]";
            const localSessions = JSON.parse(localSessionsStr) as any[];
            
            // Filter user sessions
            const userSessions = localSessions.filter(
              (s) => s.username.toLowerCase() === currentUsername.toLowerCase()
            );

            if (userSessions.length === 0) {
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

            const totalSessionsCount = userSessions.length;
            const avgWpm = Math.round(
              userSessions.reduce((acc, s) => acc + s.netWpm, 0) / totalSessionsCount
            );
            const avgAccuracy = Number(
              (userSessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessionsCount).toFixed(1)
            );
            const topWpmScore = Math.max(...userSessions.map((s) => s.netWpm));
            const totalDurationMins = Number(
              (userSessions.reduce((acc, s) => acc + s.timeTakenSeconds, 0) / 60).toFixed(2)
            );

            setStats({
              username: currentUsername,
              totalSessions: totalSessionsCount,
              averageWpm: avgWpm,
              averageAccuracy: avgAccuracy,
              topWpm: topWpmScore,
              totalDurationMinutes: totalDurationMins,
            });

            // Calculate personal bests per mode
            const pbMap: Record<string, PBData | null> = {};
            MODES.forEach((mode) => {
              const modeSessions = userSessions.filter((s) => s.mode === mode.id);
              if (modeSessions.length > 0) {
                // Sort by netWpm descending, then accuracy descending
                modeSessions.sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy);
                const best = modeSessions[0];
                pbMap[mode.id] = {
                  mode: mode.id,
                  netWpm: best.netWpm,
                  accuracy: best.accuracy,
                  createdAt: best.createdAt,
                };
              } else {
                pbMap[mode.id] = null;
              }
            });
            setPersonalBests(pbMap);
          } catch (localErr) {
            setError("Failed to compile local statistics.");
          }
        } else {
          setError(err.message || "Failed to load profile data.");
        }
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
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 font-vt323 text-lg text-crt-dim select-none">
      {!username ? (
        /* Claim Username Flow Screen */
        <div className="max-w-md mx-auto py-12 font-vt323 text-lg text-crt-dim">
          <div className="bg-[#080808] border-2 border-crt-dim/40 rounded p-8 space-y-6 shadow-[0_0_20px_rgba(0,0,0,0.9)] text-center">
            <Icon name="user" size={40} className="mx-auto text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] animate-pulse" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-crt-primary uppercase drop-shadow-[0_0_4px_var(--color-crt-primary)]">CLAIM COMPETITOR ID</h2>
              <p className="text-sm text-crt-dim leading-relaxed uppercase">
                Choose a unique identity to save your scores to the global leaderboard and track your personal statistics.
              </p>
            </div>

            <form onSubmit={handleClaimUsername} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-sm font-bold text-crt-dim uppercase tracking-wider ml-1">Competitor Name</label>
                <Input
                  type="text"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  placeholder="E.G. SPEED_TYPER"
                  maxLength={20}
                />
              </div>

              {claimError && (
                <div className="bg-red-950/40 border border-red-500 text-red-500 text-sm font-bold uppercase p-3 rounded animate-pulse text-left tracking-wider">
                  [ALERT: {claimError.toUpperCase()}]
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmittingClaim || !claimInput.trim()}
                className="w-full"
                size="lg"
              >
                <span>{isSubmittingClaim ? "VALIDATING PROFILE..." : "CLAIM IDENTITY"}</span>
                <Icon name="play" size={16} />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* Profile statistics Screen */
        <>
          {/* Header Banner */}
          <div className="bg-[#080808] border-2 border-crt-dim/40 rounded p-6 shadow-[0_0_20px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#0a0a0a] border border-crt-dim/50 rounded flex items-center justify-center overflow-hidden shadow-inner p-1">
                <DefaultAvatar className="w-10 h-10 text-crt-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase">{username}</h2>
                <p className="text-xs text-crt-dim font-bold tracking-wider uppercase">TypeMaster Competitor</p>
              </div>
            </div>
            <Button
              onClick={handleResetUsername}
              variant="outline"
              size="sm"
            >
              <span>EDIT USERNAME</span>
              <Icon name="settings" size={12} />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-8 animate-pulse text-crt-dim">
              {/* Aggregated Stats Cards Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#070707] border border-crt-dim/30 rounded p-4 h-24 flex flex-col justify-center items-center space-y-2 shadow-inner"
                  >
                    <div className="h-3 bg-crt-dim/20 rounded w-12" />
                    <div className="h-6 bg-crt-dim/20 rounded w-8" />
                    <div className="h-2 bg-crt-dim/20 rounded w-16" />
                  </div>
                ))}
              </div>

              {/* Personal Bests Skeleton */}
              <div className="space-y-4">
                <div className="h-5 bg-crt-dim/20 rounded w-36" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#070707] border border-crt-dim/30 rounded p-4 h-20 flex justify-between items-center shadow-inner"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-crt-dim/20 rounded" />
                        <div className="space-y-2">
                          <div className="h-3.5 bg-crt-dim/20 rounded w-20" />
                          <div className="h-2.5 bg-crt-dim/20 rounded w-16" />
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-crt-dim/20 rounded w-12 ml-auto" />
                        <div className="h-2.5 bg-crt-dim/20 rounded w-10 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-950/40 border border-red-500 text-red-500 text-sm font-bold uppercase p-3 rounded animate-pulse text-center tracking-wider">
              [ERROR: {error.toUpperCase()}]
            </div>
          ) : (
            <>
              {/* Aggregated Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="p-4 text-center">
                  <span className="block text-crt-dim text-[10px] font-bold uppercase tracking-wider mb-1">
                    Completed
                  </span>
                  <span className="text-2xl font-black text-white">{stats?.totalSessions}</span>
                  <span className="block text-crt-dim/70 text-[10px] mt-1 uppercase font-bold">sessions</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="block text-crt-dim text-[10px] font-bold uppercase tracking-wider mb-1">
                    Average Speed
                  </span>
                  <span className="text-2xl font-black text-white">{stats?.averageWpm}</span>
                  <span className="block text-crt-dim/70 text-[10px] mt-1 uppercase font-bold">net WPM</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="block text-crt-dim text-[10px] font-bold uppercase tracking-wider mb-1">
                    Top Speed
                  </span>
                  <span className="text-2xl font-black text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)]">{stats?.topWpm}</span>
                  <span className="block text-crt-dim/70 text-[10px] mt-1 uppercase font-bold">max net WPM</span>
                </Card>

                <Card className="p-4 text-center">
                  <span className="block text-crt-dim text-[10px] font-bold uppercase tracking-wider mb-1">
                    Average Accuracy
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {stats?.averageAccuracy}%
                  </span>
                  <span className="block text-crt-dim/70 text-[10px] mt-1 uppercase font-bold">precision</span>
                </Card>

                <Card className="p-4 text-center col-span-2 md:col-span-1">
                  <span className="block text-crt-dim text-[10px] font-bold uppercase tracking-wider mb-1">
                    Practice Time
                  </span>
                  <span className="text-2xl font-black text-purple-400">
                    {stats?.totalDurationMinutes}
                  </span>
                  <span className="block text-crt-dim/70 text-[10px] mt-1 uppercase font-bold">minutes</span>
                </Card>
              </div>

              {/* Personal Bests Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Icon name="trophy" size={20} className="text-crt-primary drop-shadow-[0_0_4px_var(--color-crt-primary)]" />
                  <span>PERSONAL BEST RECORDS</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MODES.map((m) => {
                    const pb = personalBests[m.id];
                    return (
                      <Card
                        key={m.id}
                        className="p-4 flex flex-row items-center justify-between space-y-0"
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <Icon name={m.icon as any} className="text-crt-dim" size={24} />
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase">{m.label}</h4>
                            <p className="text-[10px] font-light uppercase">
                              {pb
                                ? `LOGGED ON ${new Date(pb.createdAt).toLocaleDateString()}`
                                : "No record set"}
                            </p>
                          </div>
                        </div>

                        <div className="relative z-10">
                          {pb ? (
                            <div className="text-right">
                              <span className="block text-lg font-black text-white">
                                {pb.netWpm} <span className="text-[10px]">WPM</span>
                              </span>
                              <span className="block text-xs font-semibold text-emerald-400 uppercase">
                                {pb.accuracy.toFixed(1)}% acc
                              </span>
                            </div>
                          ) : (
                            <Button asChild size="sm">
                              <Link href={`/play?mode=${m.id}`}>
                                <span>PLAY</span>
                                <Icon name="play" size={10} className="text-crt-primary" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </Card>
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
