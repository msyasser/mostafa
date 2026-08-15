import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import dynamic from "next/dynamic";
import AnimatedText from "@/src/app/[locale]/_components/AnimatedText";
import TypewriterText from "@/src/app/[locale]/_components/TypewriterText";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import SEOOptimizer from "./_components/SEOOptimizer";

// Lazy load components that are not immediately visible
const TemplatesShowcase = dynamic(() => import("@/src/app/[locale]/_components/TempaltesShowCase"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800 rounded-lg"></div>,
});
const SubscriptionForm = dynamic(() => import("@/src/app/[locale]/_components/SubscriptionForm"), {
  loading: () => <div className="animate-pulse h-32 bg-gray-800 rounded-lg"></div>,
});
const HomeServicesSection = dynamic(() => import("@/src/app/[locale]/_components/HomeServicesSection"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800 rounded-lg"></div>,
});
const ContentAuthoritySection = dynamic(() => import("@/src/app/[locale]/_components/ContentAuthoritySection"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-800 rounded-lg"></div>,
});


export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const siteUrl = "https://www.mostafayasser.com";
  const imageUrl = isArabic
    ? `${siteUrl}/metaData/ar/1.webp`
    : `${siteUrl}/metaData/en/1.webp`;

  const title = isArabic
    ? "مصطفى ياسر | قوالب وأنظمة نوشن لتعزيز الإنتاجية وتنظيم الحياة"
    : "Mostafa Yasser | Notion Templates & Custom Productivity Systems";

  const description = isArabic
    ? "يقدم مصطفى ياسر قوالب نوشن احترافية لتعزيز الإنتاجية وتنظيم سير العمل. تشمل الخدمات أنظمة مخصصة لإدارة المشاريع والمهام والماليات ومصادر تعليمية متكاملة."
    : "Mostafa Yasser offers beautifully crafted Notion templates designed to boost productivity and streamline workflows. Services include custom systems to organize projects, tasks, and finances, and productivity tutorials.";

  return {
    title: {
      template: "%s",
      default: title,
    },
    description,
    keywords: isArabic
      ? ["قوالب نوشن", "نوشن", "أنظمة نوشن مخصصة", "تنظيم المهام", "إدارة المشاريع", "تنظيم الماليات", "مصطفى ياسر"]
      : ["Notion templates", "Notion systems", "Custom Notion systems", "Productivity templates", "Workflow automation", "Mostafa Yasser"],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: "Mostafa Yasser",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "مصطفى ياسر - قوالب وأنظمة نوشن"
            : "Mostafa Yasser - Notion Templates & Systems",
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
    other: {
      "google-site-verification": "SKiO5RTFyP9KeXKJAJ14FVn-qZUFpXut8_41TWNG_9o",
    },
  };
}

export default function HomePage() {
  const t = useTranslations("HomePage");

  const locale = useLocale();

  return (
    <>
      <SEOOptimizer
        type="website"
        title={t("title")}
        description={t("subtitle")}
        url={`https://www.mostafayasser.com/${locale}`}
        image={`https://www.mostafayasser.com/metaData/${locale === "ar" ? "ar" : "en"}/1.webp`}
        locale={locale}
      />
      <BlurText>
        <div className="text-center min-h-[calc(100vh-160px)] flex flex-col justify-center items-center">
          <AnimatedText className="max-w-5xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-4 font-extrabold leading-tight tracking-tight">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <TypewriterText text={t("title")} />
            </h1>
          </AnimatedText>

          <AnimatedWrapper delay={2.5}>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-8 max-w-3xl mx-auto px-4 font-medium tracking-wide">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 relative z-10">
              <a
                href="#templates-section"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-main text-black font-bold text-lg transition-all duration-300 hover:bg-white hover:scale-105 w-full sm:w-auto min-w-[200px] shadow-[0_0_20px_rgba(215,177,128,0.4)]"
              >
                {t("searchTemplatesButton")}
                {locale === "ar" ? <BsArrowLeft className="text-xl" /> : <BsArrowRight className="text-xl" />}
              </a>
              <a
                href={`/${locale}/services`}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg transition-all duration-300 hover:bg-white/10 w-full sm:w-auto min-w-[200px]"
              >
                {t("workWithUsButton")}
              </a>
            </div>
          </AnimatedWrapper>
        </div>

        {/* Services Section */}
        {/* Services Summary Section */}
        <HomeServicesSection />

        <TemplatesShowcase title={t("templatesTitle")} subtitle={t("templatesSubtitle")} />

        <ContentAuthoritySection />


      </BlurText>
    </>
  );
}
