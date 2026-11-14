import ConfirmationCard from "../../_components/ConfirmationCard";

// Public page behind the QR code on every course certificate.
// It only asks the platform "is this code a real, valid certificate?" and shows the name, course and date.
export const dynamic = "force-dynamic";

const API_BASE = (process.env.COURSE_API_BASE || "https://api.mostafayasser.com").replace(/\/$/, "");
const CODE_RE = /^MY-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "التحقق من الاعتمادية" : "Verify credential",
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

function Row({ label, children, strong }) {
  return (
    <div className="py-3 border-t border-neutral-800 first:border-t-0">
      <p className="text-neutral-500 text-sm mb-0.5">{label}</p>
      <p dir="auto" className={strong ? "text-2xl font-bold text-main" : "text-lg font-semibold text-white"}>{children}</p>
    </div>
  );
}

export default async function VerifyCertificatePage({ params }) {
  const { locale, code: rawCode } = await params;
  const isArabic = locale === "ar";
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();
  const { state, cert } = await lookup(code);
  const back = { href: `/${locale}`, label: isArabic ? "الرجوع للموقع" : "Back to the site" };

  if (state === "valid") {
    const date = new Date(cert.issuedAt * 1000).toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo",
    });
    // A course that awards a named credential shows it; any other course keeps the plain certificate wording.
    const credential = cert.credential ? (isArabic ? cert.credential.ar : cert.credential.en) : null;
    return (
      <ConfirmationCard
        state="success"
        title={credential ? (isArabic ? "اعتمادية حقيقية" : "Verified credential") : (isArabic ? "شهادة حقيقية" : "Verified certificate")}
        action={back}
        footer={<p className="text-neutral-500 text-xs" dir="ltr">{code}</p>}
      >
        <div className="mt-6">
          {credential && <Row label={isArabic ? "الاعتمادية" : "Credential"} strong>{credential}</Row>}
          <Row label={isArabic ? "صادرة باسم" : "Issued to"} strong={!credential}>{cert.name}</Row>
          <Row label={credential ? (isArabic ? "من كورس" : "From the course") : (isArabic ? "عن إتمام" : "For completing")}>{cert.courseTitle}</Row>
          <Row label={credential ? (isArabic ? "تاريخ المنح" : "Granted on") : (isArabic ? "بتاريخ" : "Issued on")}>{date}</Row>
        </div>
      </ConfirmationCard>
    );
  }

  if (state === "invalid") {
    return (
      <ConfirmationCard state="error" title={isArabic ? "ما لقيناش الشهادة أو الاعتمادية دي" : "Certificate or credential not found"} action={back}>
        {isArabic
          ? "الرقم ده مش مطابق لأي شهادة أو اعتمادية سارية. اتأكد إنك كتبته زي ما هو مكتوب."
          : "This code does not match any valid certificate or credential. Check that it is written exactly as printed."}
      </ConfirmationCard>
    );
  }

  return (
    <ConfirmationCard state="wait" title={isArabic ? "مقدرناش نتحقق دلوقتي" : "Could not check right now"} action={back}>
      {isArabic ? "حصلت مشكلة مؤقتة. جرّب تاني بعد شوية." : "A temporary problem occurred. Please try again in a moment."}
    </ConfirmationCard>
  );
}
