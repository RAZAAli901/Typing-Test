export const CONSENT_STORAGE_KEY = "typemaster_consent_v1";
export const CONSENT_VERSION = 1;
export const CONSENT_EXPIRY_DAYS = 365;
const CONSENT_EXPIRY_MS = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export type ConsentStatus = "unknown" | "granted" | "denied";

export interface StoredConsentPayload {
  version: number;
  status: "granted" | "denied";
  timestamp: number;
}

export function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") {
    return "unknown";
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return "unknown";

    const parsed: StoredConsentPayload = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return "unknown";
    }

    const age = Date.now() - parsed.timestamp;
    if (age > CONSENT_EXPIRY_MS) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return "unknown";
    }

    return parsed.status;
  } catch (err) {
    console.error("[CONSENT] Failed to read stored consent:", err);
    return "unknown";
  }
}

export function setStoredConsent(status: "granted" | "denied"): void {
  if (typeof window === "undefined") return;

  try {
    const payload: StoredConsentPayload = {
      version: CONSENT_VERSION,
      status,
      timestamp: Date.now(),
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("[CONSENT] Failed to save stored consent:", err);
  }
}

export function clearStoredConsent(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (err) {
    console.error("[CONSENT] Failed to clear stored consent:", err);
  }
}

/**
 * Checks if the user's browser transmits the Global Privacy Control (GPC) signal.
 * When enabled, consent is automatically defaulted to 'denied' without banner prompting.
 */
export function isGlobalPrivacyControlEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  // @ts-expect-error - navigator.globalPrivacyControl is standard in privacy browsers (Brave, Firefox, etc.)
  return Boolean(navigator.globalPrivacyControl);
}
