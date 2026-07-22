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

export interface SanityValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Defense-in-depth sanity checks on recomputed/submitted metrics.
 * Rejects impossible values (netWpm > grossWpm, negative numbers, accuracy > 100, timeTakenSeconds <= 0).
 */
export function validateSanityBounds(metrics: RecomputedMetrics): SanityValidationResult {
  if (metrics.netWpm > metrics.grossWpm) {
    return { valid: false, reason: "netWpm cannot exceed grossWpm" };
  }

  if (
    metrics.grossWpm < 0 ||
    metrics.netWpm < 0 ||
    metrics.charsTyped < 0 ||
    metrics.mistakes < 0
  ) {
    return { valid: false, reason: "Metrics cannot be negative numbers" };
  }

  if (metrics.accuracy > 100 || metrics.accuracy < 0) {
    return { valid: false, reason: "Accuracy must be between 0 and 100%" };
  }

  if (metrics.timeTakenSeconds <= 0) {
    return { valid: false, reason: "timeTakenSeconds must be greater than 0" };
  }

  return { valid: true };
}

/**
 * Consistency check that mistakes cannot exceed charsTyped and accuracy is mathematically consistent.
 */
export function validateAccuracyConsistency(metrics: RecomputedMetrics): SanityValidationResult {
  if (metrics.mistakes > metrics.charsTyped) {
    return { valid: false, reason: "mistakes cannot exceed charsTyped" };
  }

  if (metrics.charsTyped > 0) {
    const expectedAccuracy = ((metrics.charsTyped - metrics.mistakes) / metrics.charsTyped) * 100;
    const diff = Math.abs(metrics.accuracy - expectedAccuracy);
    if (diff > 1.5) {
      return {
        valid: false,
        reason: `accuracy (${metrics.accuracy}%) is mathematically inconsistent with mistakes (${metrics.mistakes}) and charsTyped (${metrics.charsTyped})`,
      };
    }
  }

  return { valid: true };
}
