"use client";

import { useEffect, useState } from "react";
import { RealtimeScorePayload } from "./useLeaderboardRealtime";

interface UsePersonalBestAlertOptions {
  currentUsername?: string | null;
  userPersonalBestWpm?: number;
  lastScorePayload?: RealtimeScorePayload | null;
}

export function usePersonalBestAlert({
  currentUsername,
  userPersonalBestWpm = 0,
  lastScorePayload,
}: UsePersonalBestAlertOptions) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!lastScorePayload || !currentUsername) return;

    // Ignore self-submitted scores
    const submitter = lastScorePayload.username || lastScorePayload.userId;
    if (submitter?.toLowerCase() === currentUsername.toLowerCase()) return;

    // Check if incoming score beats user's personal best
    if (userPersonalBestWpm > 0 && lastScorePayload.netWpm > userPersonalBestWpm) {
      const msg = `⚡ COMPETITOR ALERT: ${submitter} posted ${lastScorePayload.netWpm} WPM in ${lastScorePayload.mode} (beat your PB of ${userPersonalBestWpm} WPM)!`;
      setAlertMessage(msg);

      const timer = setTimeout(() => setAlertMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [lastScorePayload, currentUsername, userPersonalBestWpm]);

  return {
    alertMessage,
    clearAlert: () => setAlertMessage(null),
  };
}
