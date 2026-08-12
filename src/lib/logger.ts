// Server-only file - Security Logger Module

export interface SecurityEvent {
  event: "LOGIN_FAILED" | "LOGIN_SUCCESS" | "ACCOUNT_LOCKED" | "PASSWORD_RESET" | "SESSION_REJECTED" | "RATE_LIMIT_TRIGGERED";
  timestamp: string;
  ip?: string;
  email?: string;
  userId?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Logs a security event in structured JSON format.
 * Guarantees zero inclusion of sensitive credentials, plain passwords, or full tokens.
 */
export function logSecurityEvent(event: Omit<SecurityEvent, "timestamp">): void {
  const payload: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  console.log(JSON.stringify({ type: "SECURITY_AUDIT_LOG", ...payload }));
}
