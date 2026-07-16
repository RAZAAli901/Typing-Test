"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [personalBests, setPersonalBests] = useState<Record<string, PBData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.name) return;
    const username = session.user.name;

    async function fetchProfileData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch Aggregated Stats
        const statsRes = await fetch(`/api/users/${username}/stats`);
        if (statsRes.status === 404) {
          setStats({
            username,
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
            const pbRes = await fetch(`/api/users/${username}/personal-best?mode=${mode.id}`);
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

    fetchProfileData();
  }, [session, status]);

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 font-vt323 text-lg animate-pulse text-crt-dim">
        <div className="h-20 bg-zinc-950/40 rounded border border-crt-dim/20" />
        <div className="h-32 bg-zinc-950/40 rounded border border-crt-dim/20" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto py-12 font-vt323 text-lg text-center text-crt-dim">
        <p className="uppercase">[REDIRECTING TO SECURE LOGIN ACCESS MODULE...]</p>
      </div>
    );
  }

  const maskEmail = (emailStr?: string | null) => {
    if (!emailStr) return "N/A";
    const parts = emailStr.split("@");
    if (parts.length !== 2) return emailStr;
    const [local, domain] = parts;
    if (local.length <= 3) return `***@${domain}`;
    return `${local.slice(0, 3)}***@${domain}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 font-vt323 text-lg text-crt-dim select-none">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-crt-primary tracking-widest uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
          👤 USER PROFILE
        </h1>
        <p className="text-sm md:text-base text-crt-dim font-bold tracking-widest uppercase">
          Review your credentials, configuration, and performance stats database.
        </p>
      </div>

      <div className="bg-[#080808] border-2 border-crt-dim/40 rounded p-6 shadow-[0_0_20px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-dashed border-crt-dim/30">
          {/* Avatar Area */}
          <div className="relative w-24 h-24 bg-[#0a0a0a] border-2 border-crt-dim/50 rounded flex items-center justify-center overflow-hidden shadow-inner group">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="user" className="text-crt-dim group-hover:text-crt-primary transition-colors" size={48} />
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white uppercase">{session?.user?.name}</h2>
            <p className="text-sm uppercase tracking-wider">EMAIL: <span className="text-crt-primary">{maskEmail(session?.user?.email)}</span></p>
            <p className="text-xs text-crt-dim/70 uppercase">TYPEMASTER CONNECTION ACTIVE</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#070707] border border-crt-dim/30 rounded p-4 text-center shadow-inner">
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">COMPLETED</span>
            <span className="text-2xl font-black text-white">{stats?.totalSessions || 0}</span>
            <span className="block text-[10px] mt-1">sessions</span>
          </div>
          <div className="bg-[#070707] border border-crt-dim/30 rounded p-4 text-center shadow-inner">
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">AVG SPEED</span>
            <span className="text-2xl font-black text-white">{stats?.averageWpm || 0}</span>
            <span className="block text-[10px] mt-1">net WPM</span>
          </div>
          <div className="bg-[#070707] border border-crt-dim/30 rounded p-4 text-center shadow-inner">
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">TOP SPEED</span>
            <span className="text-2xl font-black text-crt-primary drop-shadow-[0_0_3px_var(--color-crt-primary)]">{stats?.topWpm || 0}</span>
            <span className="block text-[10px] mt-1">max net WPM</span>
          </div>
          <div className="bg-[#070707] border border-crt-dim/30 rounded p-4 text-center shadow-inner">
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">AVG ACCURACY</span>
            <span className="text-2xl font-black text-emerald-400">{stats?.averageAccuracy || 0}%</span>
            <span className="block text-[10px] mt-1">precision</span>
          </div>
          <div className="bg-[#070707] border border-crt-dim/30 rounded p-4 text-center shadow-inner col-span-2 md:col-span-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">PRACTICE TIME</span>
            <span className="text-2xl font-black text-purple-400">{stats?.totalDurationMinutes || 0}</span>
            <span className="block text-[10px] mt-1">minutes</span>
          </div>
        </div>

        {/* Personal Bests */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-black text-white uppercase tracking-wider">🏆 PERSONAL BEST RECORDS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODES.map((m) => {
              const pb = personalBests[m.id];
              return (
                <div
                  key={m.id}
                  className="bg-[#070707] border border-crt-dim/30 rounded p-4 flex items-center justify-between hover:border-crt-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={m.icon as any} className="text-crt-dim" size={24} />
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">{m.label}</h4>
                      <p className="text-[10px] font-light uppercase">
                        {pb ? `LOGGED ON ${new Date(pb.createdAt).toLocaleDateString()}` : "NO RECORD SET"}
                      </p>
                    </div>
                  </div>

                  {pb ? (
                    <div className="text-right">
                      <span className="block text-lg font-black text-white">
                        {pb.netWpm} <span className="text-[10px]">WPM</span>
                      </span>
                      <span className="block text-xs font-semibold text-emerald-400 uppercase">
                        {pb.accuracy.toFixed(1)}% ACC
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/play?mode=${m.id}`}
                      className="text-xs font-bold text-crt-primary hover:text-white bg-crt-primary/10 px-3 py-1.5 rounded border border-crt-dim/40 hover:bg-crt-primary/20 hover:border-crt-primary transition-all uppercase tracking-wider"
                    >
                      PLAY [→]
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
