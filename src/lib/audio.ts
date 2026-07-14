/**
 * Web Audio API synthesizer for retro CRT interface sound effects.
 * Avoids raw audio asset loading.
 */

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedCtx) {
    sharedCtx = new AudioContextClass();
  }
  // Resume context if suspended (browser security policy)
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * Synthesizes a mechanical typewriter keys click sound.
 */
export function playKeystrokeClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // 1. Snappy click oscillator
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);
  
  gainNode.gain.setValueAtTime(0.06, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.04);
}

/**
 * Synthesizes a low-fi error buzz sound.
 */
export function playErrorBuzz() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Sawtooth low frequency buzz
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(100, now);
  
  // Filter for low-fi speaker look
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 150;
  filter.Q.value = 1.0;

  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  
  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.18);
}
