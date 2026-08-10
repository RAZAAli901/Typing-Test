"use client";

import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { checkSupabaseVarsPresence } from "@/lib/env";

export interface RealtimeScorePayload {
  id: string;
  userId?: string | null;
  username?: string;
  guestDisplayName?: string | null;
  mode: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  timeTakenSeconds: number;
  createdAt: string;
}

interface UseLeaderboardRealtimeOptions {
  activeMode: string;
  onNewScore?: (payload: RealtimeScorePayload) => void;
  enabled?: boolean;
}

export function useLeaderboardRealtime({
  activeMode,
  onNewScore,
  enabled = true,
}: UseLeaderboardRealtimeOptions) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<RealtimeScorePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const callbackRef = useRef(onNewScore);

  useEffect(() => {
    callbackRef.current = onNewScore;
  }, [onNewScore]);

  useEffect(() => {
    if (!enabled || !checkSupabaseVarsPresence()) {
      setIsConnected(false);
      return;
    }

    let channel: ReturnType<typeof supabaseClient.channel> | null = null;

    let debounceTimer: NodeJS.Timeout | null = null;

    try {
      channel = supabaseClient
        .channel(`realtime:leaderboard:${activeMode}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Session",
            filter: `mode=eq.${activeMode}`,
          },
          (payload) => {
            const newRecord = payload.new as RealtimeScorePayload;
            if (newRecord && newRecord.id) {
              const formattedPayload: RealtimeScorePayload = {
                ...newRecord,
                username: newRecord.userId || newRecord.guestDisplayName || "Anonymous Guest",
              };
              
              // Debounce rapid updates (300ms throttle window)
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                setLastEvent(formattedPayload);
                if (callbackRef.current) {
                  callbackRef.current(formattedPayload);
                }
              }, 300);
            }
          }
        )

        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
            setError(null);
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            const errDetail = err?.message || `Realtime channel error status: ${status}`;
            console.warn(`[SUPABASE REALTIME WARNING] ${errDetail}`);
            setIsConnected(false);
            setError(errDetail);
          }
        });

    } catch (err: any) {
      console.warn("Failed to establish Supabase Realtime channel:", err);
      setIsConnected(false);
      setError(err.message || "Failed to connect to Realtime");
    }

    return () => {
      if (channel) {
        // UNMOUNT CLEANUP: Explicitly remove active channel to prevent memory leaks or duplicate listeners
        supabaseClient.removeChannel(channel);
      }
    };

  }, [activeMode, enabled]);

  return {
    isConnected,
    lastEvent,
    error,
  };
}
