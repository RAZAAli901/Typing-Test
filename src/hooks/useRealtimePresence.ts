"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { checkSupabaseVarsPresence } from "@/lib/env";

export function useRealtimePresence(username?: string) {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isPresenceActive, setIsPresenceActive] = useState<boolean>(false);

  useEffect(() => {
    if (!checkSupabaseVarsPresence()) {
      // GRACEFUL DEGRADATION: If Supabase env vars are unconfigured, presence stays inactive without breaking UI
      setIsPresenceActive(false);
      return;
    }


    const currentUsername = username || "Anonymous Typist";
    const channel = supabaseClient.channel("presence:play", {
      config: {
        presence: { key: currentUsername },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(count);
        setIsPresenceActive(true);
      })
      .on("presence", { event: "join" }, ({ key }) => {
        console.log(`[PRESENCE] Competitor joined: ${key}`);
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log(`[PRESENCE] Competitor left: ${key}`);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            onlineAt: new Date().toISOString(),
            username: currentUsername,
          });
        }
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [username]);

  return {
    onlineCount,
    isPresenceActive,
  };
}
