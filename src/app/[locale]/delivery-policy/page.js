import LegalDocument from "../_components/LegalDocument";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteUrl = "https://www.mostafayasser.com";

  const title = isArabic ? "سياسة التسليم والشحن" : "Delivery & Shipping Policy";
  const description = isArabic
    ? "إزاي وإمتى بيوصلك اللي اشتريته: قوالب نوشن، الكورس، الخدمات، والدعم الشهري. كل المنتجات رقمية ومفيش شحن."
    : "How and when you receive what you buy: Notion templates, the course, services and monthly support. Everything is digital, with no physical shipping.";

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/${locale}/delivery-policy` },
    openGraph: { title, description, url: `${siteUrl}/${locale}/delivery-policy`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function DeliveryPolicy() {
  return <LegalDocument namespace="DeliveryPage" />;
}
