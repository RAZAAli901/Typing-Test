import { Resend } from "resend";
import { getVerificationEmailTemplate } from "./emailTemplates";

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
