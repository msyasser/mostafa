import { NextResponse } from "next/server";
import { generateVerificationCode, createVerificationToken, sendVerificationEmail } from "@/src/lib/email";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import { isValidEmail, normalizeEmail } from "@/src/lib/validation";
import { accountsApiEnabled, findAccount } from "@/src/lib/accounts";

const WINDOW_MS = 10 * 60 * 1000;

// Step 1 of "forgot password": email a 6-digit code to the address if an account exists.
// The answer is the same whether or not the account exists, so this cannot be used to look people up.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const locale = body.locale === "ar" ? "ar" : "en";
  const say = (ar, en) => (locale === "ar" ? ar : en);

  if (!accountsApiEnabled()) {
    return NextResponse.json({ error: say("الخدمة مش متاحة دلوقتي.", "This is not available right now.") }, { status: 503 });
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: say("البريد الإلكتروني غير صالح", "Invalid email address") }, { status: 400 });
  }
  const email = normalizeEmail(body.email);

  const ip = getClientIp(request.headers);
  const byIp = rateLimit(`forgot-ip:${ip}`, { limit: 10, windowMs: WINDOW_MS });
  const byEmail = rateLimit(`forgot-email:${email}`, { limit: 3, windowMs: WINDOW_MS });
  if (!byIp.ok || !byEmail.ok) {
    return NextResponse.json(
      { error: say("محاولات كثيرة. جرّب بعد شوية.", "Too many requests. Please try again later.") },
      { status: 429, headers: { "Retry-After": String(Math.max(byIp.retryAfter, byEmail.retryAfter)) } }
    );
  }

  let account;
  try {
    account = await findAccount(email);
  } catch (err) {
    console.error("Accounts API lookup failed:", err.message);
    return NextResponse.json({ error: say("حصلت مشكلة مؤقتة. جرّب بعد شوية.", "Temporary problem. Please try again shortly.") }, { status: 503 });
  }

  // The code is bound to this purpose ("reset:"), so a code from a sign-up email can never reset a password.
  const code = generateVerificationCode();
  const verificationToken = createVerificationToken(email, `reset:${code}`);

  if (account && account.status === "active") {
    const sent = await sendVerificationEmail({ email, name: account.name || "", code, locale, purpose: "reset" });
    if (sent.error) {
      console.error("Resend sending error:", sent.error);
      return NextResponse.json({ error: say("فشل إرسال الرمز. جرّب تاني.", "Failed to send the code. Please try again.") }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, verificationToken });
}
