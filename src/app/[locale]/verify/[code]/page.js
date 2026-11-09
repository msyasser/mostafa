import Link from "next/link";

// Public page behind the "Verify" line printed on every course certificate.
// It only asks the platform "is this code a real, valid certificate?" and shows the name, course and date.
export const dynamic = "force-dynamic";

const API_BASE = (process.env.COURSE_API_BASE || "https://api.mostafayasser.com").replace(/\/$/, "");
const CODE_RE = /^MY-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "التحقق من الشهادة" : "Verify certificate",
    robots: { index: false, follow: false },
  };
}

async function lookup(code) {
  if (!CODE_RE.test(code)) return { state: "invalid" };
  try {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(code)}`, { cache: "no-store" });
    if (res.status === 404) return { state: "invalid" };
    if (!res.ok) return { state: "error" };
    const d = await res.json();
    return d && d.valid ? { state: "valid", cert: d } : { state: "invalid" };
  } catch {
    return { state: "error" };
  }
}

export default async function VerifyCertificatePage({ params }) {
  const { locale, code: rawCode } = await params;
  const isArabic = locale === "ar";
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();
  const { state, cert } = await lookup(code);

  const date = cert
    ? new Date(cert.issuedAt * 1000).toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo",
      })
    : null;

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden bg-neutral-950">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-main/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-lg w-full mx-auto text-center">
        <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />

          {state === "valid" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-green-400 text-2xl" aria-hidden="true">✓</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
                {isArabic ? "شهادة حقيقية" : "Verified certificate"}
              </h1>
              <p className="text-neutral-500 text-sm mb-8">{isArabic ? "Verified certificate" : "شهادة حقيقية"}</p>
              <p className="text-neutral-400 text-sm mb-1">{isArabic ? "صادرة باسم" : "Issued to"}</p>
              <p className="text-2xl font-bold text-main mb-6" dir="auto">{cert.name}</p>
              <p className="text-neutral-400 text-sm mb-1">{isArabic ? "عن إتمام كورس" : "For completing the course"}</p>
              <p className="text-xl font-semibold text-white mb-6" dir="auto">{cert.courseTitle}</p>
              <p className="text-neutral-400 text-sm mb-1">{isArabic ? "بتاريخ" : "Issued on"}</p>
              <p className="text-white mb-8">{date}</p>
              <p className="text-neutral-500 text-xs mb-8" dir="ltr">{code}</p>
            </>
          )}

          {state === "invalid" && (
            <>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-2xl" aria-hidden="true">!</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                {isArabic ? "ما لقيناش الشهادة دي" : "Certificate not found"}
              </h1>
              <p className="text-neutral-400 leading-relaxed mb-8">
                {isArabic
                  ? "الرقم ده مش مطابق لأي شهادة سارية. اتأكد إنك كتبته زي ما هو مكتوب على الشهادة."
                  : "This code does not match any valid certificate. Check that it is written exactly as printed on the certificate."}
              </p>
            </>
          )}

          {state === "error" && (
            <>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                {isArabic ? "مقدرناش نتحقق دلوقتي" : "Could not check right now"}
              </h1>
              <p className="text-neutral-400 leading-relaxed mb-8">
                {isArabic ? "حصلت مشكلة مؤقتة. جرّب تاني بعد شوية." : "A temporary problem occurred. Please try again in a moment."}
              </p>
            </>
          )}

          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center w-full py-3.5 rounded-xl border border-neutral-700 text-neutral-200 hover:border-main hover:text-main transition-colors text-sm font-medium"
          >
            {isArabic ? "الرجوع للموقع" : "Back to the site"}
          </Link>
        </div>
      </div>
    </div>
  );
}
