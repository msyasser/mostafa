import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/email";
import { hashPassword } from "@/src/lib/password";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import { isValidEmail, normalizeEmail } from "@/src/lib/validation";
import { accountsApiEnabled, findAccount, updateAccount } from "@/src/lib/accounts";

const WINDOW_MS = 10 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 200;

// Step 2 of "forgot password": the emailed code proves the address, then the new password is saved.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const locale = body.locale === "ar" ? "ar" : "en";
  const say = (ar, en) => (locale === "ar" ? ar : en);
  const fail = (status, ar, en) => NextResponse.json({ error: say(ar, en) }, { status });

  if (!accountsApiEnabled()) return fail(503, "الخدمة مش متاحة دلوقتي.", "This is not available right now.");
  if (!isValidEmail(body.email)) return fail(400, "البريد الإلكتروني غير صالح", "Invalid email address");
  const email = normalizeEmail(body.email);

  const { verificationToken, verificationCode, password } = body;
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return fail(400, "كلمة المرور لازم تكون 6 حروف على الأقل.", "Password must be at least 6 characters.");
  }
  if (password.length > MAX_PASSWORD_LENGTH) return fail(400, "كلمة المرور طويلة جداً.", "Password is too long.");
  if (typeof verificationCode !== "string" || !/^\d{6}$/.test(verificationCode.trim())) {
    return fail(400, "اكتب الرمز المكوّن من 6 أرقام.", "Please enter the 6-digit code.");
  }

  // Wrong guesses are limited per address and per IP (a code has one million possibilities).
  const ip = getClientIp(request.headers);
  const byIp = rateLimit(`reset-ip:${ip}`, { limit: 20, windowMs: WINDOW_MS });
  const byEmail = rateLimit(`reset-email:${email}`, { limit: 5, windowMs: WINDOW_MS });
  if (!byIp.ok || !byEmail.ok) {
    return fail(429, "محاولات كثيرة. جرّب بعد شوية.", "Too many attempts. Please try again later.");
  }

  const check = verifyToken(verificationToken, email, `reset:${verificationCode.trim()}`);
  if (!check.valid) {
    const expired = /expired/i.test(check.error || "");
    return fail(
      400,
      expired ? "الرمز انتهت صلاحيته. اطلب رمز جديد." : "الرمز غير صحيح.",
      expired ? "The code has expired. Please request a new one." : "The code is incorrect."
    );
  }

  try {
    const account = await findAccount(email);
    if (!account || account.status !== "active") {
      return fail(400, "الرمز غير صحيح.", "The code is incorrect.");
    }
    await updateAccount(email, { passwordHash: await hashPassword(password) });
  } catch (err) {
    console.error("Password reset failed:", err.message);
    return fail(503, "حصلت مشكلة مؤقتة. جرّب بعد شوية.", "Temporary problem. Please try again shortly.");
  }

  return NextResponse.json({ success: true });
}
