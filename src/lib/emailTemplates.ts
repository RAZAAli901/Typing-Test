export interface EmailTemplateResult {
  html: string;
  text: string;
}

/**
 * Returns the retro-styled HTML and plain text templates for the verification email.
 */
export function getVerificationEmailTemplate(code: string): EmailTemplateResult {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>TypeMaster Identity Verification</title>
        <style>
          body {
            background-color: #0c0c0c;
            color: #39ff14;
            font-family: 'Courier New', Courier, monospace;
            padding: 32px 16px;
            margin: 0;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            border: 2px solid #39ff14;
            border-radius: 4px;
            background-color: #050505;
            padding: 30px;
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
            text-align: center;
          }
          h1 {
            color: #ffb000;
            font-size: 22px;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 1px dashed #39ff14;
            padding-bottom: 12px;
            margin-top: 0;
            text-shadow: 0 0 4px #ffb000;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #39ff14;
            text-transform: uppercase;
            text-shadow: 0 0 2px rgba(57, 255, 20, 0.5);
          }
          .code-box {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            background-color: #0d0d0d;
            border: 2px solid #39ff14;
            border-radius: 4px;
            padding: 16px;
            margin: 24px 0;
            letter-spacing: 6px;
            box-shadow: inset 0 0 10px rgba(57, 255, 20, 0.3);
            text-shadow: 0 0 8px #ffffff;
          }
          .footer {
            font-size: 10px;
            color: #0a5f00;
            margin-top: 30px;
            border-top: 1px dashed #0a5f00;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>*** SECURE IDENTITY VERIFICATION ***</h1>
          <p>A new cognitive profile has been requested on the TypeMaster Suite console. Use the following access key to authorize your credentials:</p>
          <div class="code-box">${code}</div>
          <p>This code is valid for 10 minutes and will expire afterwards.</p>
          <div class="footer">
            TYPEMASTER SUITE WEB V1.0 // SECURITY MODULE // EYES ONLY
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
*** SECURE IDENTITY VERIFICATION ***

A new cognitive profile has been requested on the TypeMaster Suite console.
Use the following access key to authorize your credentials:

ACCESS CODE: ${code}

This code is valid for 10 minutes and will expire afterwards.

--------------------------------------------------
TYPEMASTER SUITE WEB V1.0 // SECURITY MODULE // EYES ONLY
  `.trim();

  return { html, text };
}
