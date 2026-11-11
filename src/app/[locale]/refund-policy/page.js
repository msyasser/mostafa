import LegalDocument from "../_components/LegalDocument";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteUrl = "https://www.mostafayasser.com";

  const title = isArabic ? "سياسة الاسترجاع والإلغاء" : "Refund & Cancellation Policy";
  const description = isArabic
    ? "سياسة الاسترجاع والإلغاء لقوالب نوشن، الكورس، الخدمات، والدعم الشهري."
    : "Refund and cancellation terms for Notion templates, the course, custom services and monthly support.";

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/${locale}/refund-policy` },
    openGraph: { title, description, url: `${siteUrl}/${locale}/refund-policy`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function RefundPolicy() {
  return <LegalDocument namespace="RefundPage" />;
}
