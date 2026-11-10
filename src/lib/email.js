import { Resend } from "resend";
import crypto from "crypto";
import { escapeHtml } from "@/src/lib/validation";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

function getVerificationSecret() {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET (or AUTH_SECRET) must be set");
  }
  return "dev-only-insecure-verification-secret";
}

function signPayload(email, code, expiresAt) {
  return crypto
    .createHmac("sha256", getVerificationSecret())
    .update(`${email}:${code}:${expiresAt}`)
    .digest("hex");
}

// Generate a 6-digit code
export function generateVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

// The token carries only the email, expiry and an HMAC over email+code+expiry.
// The code itself is never in the token, so the client can't read it back out;
// it can only be confirmed by submitting the right code.
export function createVerificationToken(email, code) {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  const hmac = signPayload(normalizedEmail, code, expiresAt);
  return Buffer.from(JSON.stringify({ e: normalizedEmail, x: expiresAt, h: hmac })).toString("base64url");
}

// Verify the signed token and code
export function verifyToken(token, email, code) {
  try {
    if (typeof token !== "string" || typeof code !== "string") {
      return { valid: false, error: "Invalid token format" };
    }

    const { e: tokenEmail, x: expiresAt, h: hmac } = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8")
    );

    if (!tokenEmail || !expiresAt || !hmac) {
      return { valid: false, error: "Invalid token format" };
    }

    if (tokenEmail !== email.toLowerCase().trim()) {
      return { valid: false, error: "Email mismatch" };
    }

    if (Date.now() > Number(expiresAt)) {
      return { valid: false, error: "Verification code has expired" };
    }

    const expected = Buffer.from(signPayload(tokenEmail, code.trim(), expiresAt), "hex");
    const actual = Buffer.from(String(hmac), "hex");

    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return { valid: false, error: "Incorrect verification code" };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: "Verification failed" };
  }
}

// Send Verification Email HTML
export async function sendVerificationEmail({ email, name, code, locale = "en", purpose = "signup" }) {
  if (!resend) {
    throw new Error("Resend API key is not configured");
  }

  const isArabic = locale === "ar";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Mostafa Yasser <auth@mostafayasser.com>";

  const subject = isArabic
    ? `‏${code} كود التأكيد | مصطفى ياسر`
    : `${code} is your verification code | Mostafa Yasser`;

  const FONT = "'Tajawal','Segoe UI',Tahoma,Arial,sans-serif";
  const reset = purpose === "reset";
  const heading = isArabic ? (reset ? "إعادة تعيين كلمة المرور" : "كود تأكيد الإيميل") : (reset ? "Reset your password" : "Confirm your email");
  const safeName = escapeHtml(String(name || "").trim());
  const greeting = safeName ? (isArabic ? `أهلاً ${safeName}، ` : `Hi ${safeName}, `) : "";
  const lead = isArabic
    ? (reset ? "وصلنا طلب لتغيير كلمة المرور. اكتب الكود ده عشان تعمل كلمة مرور جديدة:" : "اكتب الكود ده عشان نأكد إيميلك ونكمّل إنشاء حسابك:")
    : (reset ? "we received a request to reset your password. Use this code to set a new one:" : "use this code to confirm your email and finish creating your account:");

  const html = `<!doctype html><html lang="${isArabic ? "ar" : "en"}" dir="${isArabic ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>${heading}</title></head>
<body style="margin:0;padding:0;background:#0C0B0A;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${heading}: ${code}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0C0B0A" style="background:#0C0B0A;"><tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td align="center" style="padding:0 0 26px;"><img src="https://www.mostafayasser.com/logos/my-mark-email.png" width="84" height="60" alt="Mostafa Yasser" style="display:block;border:0;width:84px;height:60px;"></td></tr>
<tr><td bgcolor="#171411" dir="${isArabic ? "rtl" : "ltr"}" style="background:#171411;border:1px solid #3D342B;border-radius:18px;padding:36px 32px;text-align:${isArabic ? "right" : "left"};font-family:${FONT};color:#FAF7F2;">
<div style="width:48px;height:3px;background:#D7B180;border-radius:3px;margin:0 0 20px;${isArabic ? "margin-left:auto;" : ""}"></div>
<h1 style="margin:0 0 14px;font-size:24px;line-height:1.4;font-weight:700;color:#FAF7F2;font-family:${FONT};">${heading}</h1>
<p style="margin:0 0 14px;font-size:16px;line-height:1.8;color:#D9D1C7;font-family:${FONT};">${greeting}${lead}</p>
<div dir="ltr" style="margin:22px 0;padding:20px;text-align:center;background:#0C0B0A;border:1px solid #D7B180;border-radius:14px;font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:700;letter-spacing:10px;color:#D7B180;">${code}</div>
<p style="margin:0 0 14px;font-size:16px;line-height:1.8;color:#D9D1C7;font-family:${FONT};">${isArabic ? "الكود صالح لمدة ١٠ دقايق." : "The code is valid for 10 minutes."}</p>
<p style="margin:18px 0 0;font-size:13px;line-height:1.7;color:#8A7F73;font-family:${FONT};">${isArabic ? "لو إنت ما طلبتش الكود ده، تجاهل الإيميل وحسابك في أمان." : "If you didn't request this code, you can ignore this email. Your account is safe."}</p>
</td></tr>
<tr><td align="center" style="padding:22px 8px 0;font-family:${FONT};font-size:13px;line-height:1.7;color:#8A7F73;"><a href="https://mostafayasser.com" style="color:#BDB3A7;text-decoration:none;" dir="ltr">mostafayasser.com</a></td></tr>
</table></td></tr></table></body></html>`;

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: subject,
    html: html,
  });
}
