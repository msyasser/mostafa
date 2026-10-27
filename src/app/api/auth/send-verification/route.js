import { NextResponse } from "next/server";
import { generateVerificationCode, createVerificationToken, sendVerificationEmail } from "@/src/lib/email";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import { isValidEmail, normalizeEmail } from "@/src/lib/validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_NAME_LENGTH = 100;

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_USERS_DB_ID = process.env.NOTION_USERS_DB_ID;

async function checkUserExistsInNotion(email) {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID) return false;

  try {
    const schemaRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    });

    if (!schemaRes.ok) return false;

    const schema = await schemaRes.json();
    const properties = schema.properties || {};
    const emailProp = Object.keys(properties).find((p) => properties[p].type === "email");
    if (!emailProp) return false;

    const queryRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          property: emailProp,
          email: { equals: email.trim().toLowerCase() },
        },
      }),
    });

    if (!queryRes.ok) return false;

    const data = await queryRes.json();
    return data.results && data.results.length > 0;
  } catch (err) {
    console.error("Error checking user existence:", err);
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;
    const locale = body.locale === "ar" ? "ar" : "en";

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: locale === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(body.email);

    // Each request sends a real email from our domain, so limit per IP and per address.
    const ip = getClientIp(request.headers);
    const byIp = rateLimit(`send-verification-ip:${ip}`, { limit: 10, windowMs: WINDOW_MS });
    const byEmail = rateLimit(`send-verification-email:${email}`, { limit: 3, windowMs: WINDOW_MS });
    if (!byIp.ok || !byEmail.ok) {
      const retryAfter = Math.max(byIp.retryAfter, byEmail.retryAfter);
      return NextResponse.json(
        {
          error:
            locale === "ar"
              ? "محاولات كثيرة. يرجى المحاولة لاحقاً."
              : "Too many requests. Please try again later.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    // Check if user already exists
    const exists = await checkUserExistsInNotion(email);
    if (exists) {
      return NextResponse.json(
        {
          error:
            locale === "ar"
              ? "يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني"
              : "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Generate code and signed token
    const code = generateVerificationCode();
    const token = createVerificationToken(email, code);

    // Send email via Resend
    const emailResult = await sendVerificationEmail({
      email,
      name: typeof name === "string" ? name.trim().slice(0, MAX_NAME_LENGTH) : "",
      code,
      locale,
    });

    if (emailResult.error) {
      console.error("Resend sending error:", emailResult.error);
      return NextResponse.json(
        {
          error:
            locale === "ar"
              ? "فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى."
              : "Failed to send verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        verificationToken: token,
        message:
          locale === "ar"
            ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
            : "Verification code sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send verification code error:", error.message);
    return NextResponse.json(
      { error: "Failed to process verification request" },
      { status: 500 }
    );
  }
}
