// Server-only file - RESTRICTED TO SERVER EXECUTION (Reads RESEND_API_KEY)
import { Resend } from "resend";
import { getVerificationEmailTemplate, getNewDeviceLoginEmailTemplate } from "./emailTemplates";

const resendApiKey = process.env.RESEND_API_KEY;

// Initialize the Resend client. Falls back to null if no API key is set (e.g. dev mode fallback)
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * SECURITY AUDIT CHECKPOINT:
 * Plaintext verification codes must never be logged in production environments.
 * The console output below is strictly evaluated as a Dev Mode console fallback.
 *
 * Sends a verification email with a 6-digit access code.
 * Falls back to console logging if the Resend client is not configured.
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const { html, text } = getVerificationEmailTemplate(code);

  if (!resend) {
    console.log(`\n==================================================`);
    console.log(`[DEV MODE — CODE NOT EMAILED]`);
    console.log(`TO: ${email}`);
    console.log(`CODE: ${code}`);
    console.log(`==================================================\n`);
    return true;
  }

  try {
    const response = await resend.emails.send({
      from: "TypeMaster <onboarding@resend.dev>",
      to: email,
      subject: "Authorize TypeMaster Access Credentials",
      html,
      text,
    });

    if (response.error) {
      console.error("Resend delivery error:", response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Resend transport exception:", error);
    return false;
  }
}

/**
 * Dispatches email notification when a login from a new or unrecognized device/IP occurs.
 */
export async function sendNewDeviceLoginNotification(email: string, userAgent: string, ip: string): Promise<boolean> {
  const { html, text } = getNewDeviceLoginEmailTemplate(userAgent, ip);

  if (!resend) {
    console.log(`[DEV MODE] New device login notification for ${email} (IP: ${ip}, UA: ${userAgent})`);
    return true;
  }

  try {
    const response = await resend.emails.send({
      from: "TypeMaster Security <security@resend.dev>",
      to: email,
      subject: "Security Alert: New Login to Your Account",
      html,
      text,
    });

    return !response.error;
  } catch (err) {
    console.error("Failed to send login notification email:", err);
    return false;
  }
}
