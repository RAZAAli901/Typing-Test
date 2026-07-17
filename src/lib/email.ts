import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Initialize the Resend client. Falls back to null if no API key is set (e.g. dev mode fallback)
export const resend = resendApiKey ? new Resend(resendApiKey) : null;
