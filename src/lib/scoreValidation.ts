export interface KeystrokeEventInput {
  char: string;
  timestamp: number;
  correct: boolean;
}

export interface RecomputedMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  charsTyped: number;
  mistakes: number;
  timeTakenSeconds: number;
}

/**
 * Pure server-side utility to recompute typing metrics from raw keystroke event log
 * and the verified target text.
 */
export function recomputeSessionMetrics(
  targetText: string,
  events: KeystrokeEventInput[]
): RecomputedMetrics {
  if (!events || events.length === 0) {
    return {
      grossWpm: 0,
      netWpm: 0,
      accuracy: 100,
      charsTyped: 0,
      mistakes: 0,
      timeTakenSeconds: 0,
    };
  }

  // Ensure events are chronologically ordered
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  const startTime = sortedEvents[0].timestamp;
  const endTime = sortedEvents[sortedEvents.length - 1].timestamp;
  const rawDurationSeconds = (endTime - startTime) / 1000;
  
  // Guard against zero-duration division by zero (minimum duration 0.5s for non-empty events)
  const timeTakenSeconds = Math.max(0.5, Number(rawDurationSeconds.toFixed(1)));
  const minutes = timeTakenSeconds / 60;

  const charsTyped = sortedEvents.length;
  let mistakes = 0;
  let correctCount = 0;

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const expectedChar = targetText[i];
    if (expectedChar !== undefined && event.char === expectedChar) {
      correctCount++;
    } else {
      mistakes++;
    }
  }

  const grossWpm = Math.round((charsTyped / 5) / minutes);
  const netWpm = Math.max(0, Math.round(grossWpm - (mistakes / minutes)));
  const accuracy = charsTyped > 0 ? Number(((correctCount / charsTyped) * 100).toFixed(1)) : 100;

  return {
    grossWpm,
    netWpm,
    accuracy,
    charsTyped,
    mistakes,
    timeTakenSeconds,
  };
}
