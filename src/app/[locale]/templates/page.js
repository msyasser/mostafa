import TemplatesPage from "./templatesPage";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteUrl = "https://www.mostafayasser.com";
  const title = isArabic
    ? "قوالب نوشن"
    : "Notion Templates";
  const description = isArabic
    ? "اكتشف قوالب نوشن المميزة المصممة لمساعدتك على البقاء منظمًا ومنتجًا وملهمًا. استعرض أحدث التصاميم وارتقِ بتنظيمك الرقمي."
    : "Discover premium Notion templates designed to help you stay organized, productive, and inspired. Explore my latest creations and boost your digital workflow.";
  const url = `${siteUrl}/${locale}/templates`;
  const imageUrl = isArabic
    ? `${siteUrl}/thumbnails/ARThumbnails/2.webp`
    : `${siteUrl}/thumbnails/ENThumbnails/2.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: isArabic
      ? ["قوالب نوشن", "قوالب إنتاجية", "تنظيم نوشن", "قوالب مصطفى ياسر", "لوحة تحكم نوشن", "قوالب نوشن مجانية"]
      : ["Notion templates", "Productivity templates", "Organize Notion", "Mostafa Yasser templates", "Notion dashboard", "Free Notion templates"],
    openGraph: {
      title,
      description,
      url,
      siteName: "Mostafa Yasser",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Templates({ params }) {
  return <TemplatesPage />;
}


