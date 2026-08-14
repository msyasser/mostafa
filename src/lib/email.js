import { Resend } from "resend";
import crypto from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const VERIFICATION_SECRET = process.env.NEXTAUTH_SECRET || "verification-secret-key-32-chars-min!";

// Generate a 6-digit code
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a signed token containing email, code, and expiry
export function createVerificationToken(email, code) {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${email.toLowerCase().trim()}:${code}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", VERIFICATION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

// Verify the signed token and code
export function verifyToken(token, email, code) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [tokenEmail, tokenCode, expiresAtStr, hmac] = decoded.split(":");
    
    if (!tokenEmail || !tokenCode || !expiresAtStr || !hmac) {
      return { valid: false, error: "Invalid token format" };
    }

    if (tokenEmail !== email.toLowerCase().trim()) {
      return { valid: false, error: "Email mismatch" };
    }

    if (Date.now() > parseInt(expiresAtStr, 10)) {
      return { valid: false, error: "Verification code has expired" };
    }

    const payload = `${tokenEmail}:${tokenCode}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac("sha256", VERIFICATION_SECRET).update(payload).digest("hex");

    if (hmac !== expectedHmac) {
      return { valid: false, error: "Invalid verification token" };
    }

    if (tokenCode !== code.trim()) {
      return { valid: false, error: "Incorrect verification code" };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: "Verification failed" };
  }
}

// Send Verification Email HTML
export async function sendVerificationEmail({ email, name, code, locale = "en" }) {
  if (!resend) {
    throw new Error("Resend API key is not configured");
  }

  const isArabic = locale === "ar";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Mostafa Yasser <auth@mostafayasser.com>";

  const subject = isArabic
    ? `${code} هو رمز التحقق الخاص بك | مصطفى ياسر`
    : `${code} is your verification code | Mostafa Yasser`;

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${isArabic ? "rtl" : "ltr"}">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; margin: 0; padding: 40px 20px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #161616; border: 1px solid #262626; border-radius: 16px; overflow: hidden; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <!-- Header -->
        <tr>
          <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #262626; background: linear-gradient(180deg, #1f1a14 0%, #161616 100%);">
            <h1 style="color: #d7b180; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">Mostafa Yasser</h1>
            <p style="color: #888888; font-size: 13px; margin: 6px 0 0 0;">${isArabic ? "أنظمة وبناء نوشن المتقدمة" : "Notion Architecture & Systems"}</p>
          </td>
        </tr>

        <!-- Body Content -->
        <tr>
          <td style="padding: 36px 32px; text-align: ${isArabic ? "right" : "left"};">
            <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">
              ${isArabic ? `مرحباً ${name || ""}،` : `Hello ${name || ""},`}
            </h2>
            <p style="color: #a3a3a3; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
              ${
                isArabic
                  ? "شكراً لتسجيلك في المنصة. استخدم رمز التحقق التالي لتأكيد بريدك الإلكتروني وإكمال إنشاء حسابك:"
                  : "Thank you for creating an account. Please use the verification code below to verify your email address and complete your registration:"
              }
            </p>

            <!-- Verification Code Box -->
            <div style="background-color: #0f0f0f; border: 1px solid #d7b180; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 28px 0;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #d7b180; display: inline-block;">
                ${code}
              </span>
              <p style="color: #737373; font-size: 12px; margin: 10px 0 0 0;">
                ${isArabic ? "الرمز صالح لمدة 10 دقائق" : "Code is valid for 10 minutes"}
              </p>
            </div>

            <p style="color: #737373; font-size: 13px; line-height: 1.5; margin: 0;">
              ${
                isArabic
                  ? "إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذا البريد الإلكتروني بأمان."
                  : "If you did not request this email, you can safely ignore it."
              }
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px; text-align: center; border-top: 1px solid #222222; background-color: #111111;">
            <p style="color: #555555; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Mostafa Yasser. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: subject,
    html: html,
  });
}
