import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import AnimatedText from "@/src/app/[locale]/_components/AnimatedText";
import TypewriterText from "@/src/app/[locale]/_components/TypewriterText";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import HeroScrollIndicator from "@/src/app/[locale]/_components/HeroScrollIndicator";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import SEOOptimizer from "./_components/SEOOptimizer";

// Lazy load components that are not immediately visible
const HomeRoutingSection = dynamic(() => import("@/src/app/[locale]/_components/HomeRoutingSection"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-800/40 rounded-3xl my-8"></div>,
});
const TemplatesShowcase = dynamic(() => import("@/src/app/[locale]/_components/TempaltesShowCase"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/40 rounded-3xl my-8"></div>,
});
const HomeCoursesSection = dynamic(() => import("@/src/app/[locale]/_components/HomeCoursesSection"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/40 rounded-3xl my-8"></div>,
});
const HomeAboutSection = dynamic(() => import("@/src/app/[locale]/_components/HomeAboutSection"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/40 rounded-3xl my-8"></div>,
});
const ContactCTASection = dynamic(() => import("@/src/app/[locale]/_components/ContactCTASection"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-800/40 rounded-3xl my-8"></div>,
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
  const isArabic = locale === "ar";

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
        {/* 1. HERO SECTION */}
        <div className="text-center min-h-[calc(100vh-160px)] flex flex-col justify-center items-center relative overflow-hidden px-4">
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-main/10 blur-[140px] -z-10 rounded-full pointer-events-none" />

          <AnimatedText className="max-w-5xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-4 font-extrabold leading-tight tracking-tight">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <TypewriterText text={t("titlePrefix")} highlightText={t("titleHighlight")} />
            </h1>
          </AnimatedText>

          <AnimatedWrapper delay={2.5}>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-8 max-w-3xl mx-auto px-4 font-medium tracking-wide">
              {t("subtitle")}
            </p>

            <HeroScrollIndicator />
          </AnimatedWrapper>
        </div>

        {/* 2. ROUTING / PATH FINDER SECTION */}
        <HomeRoutingSection />

        {/* 3. TEMPLATES SHOWCASE SECTION */}
        <TemplatesShowcase title={t("templatesTitle")} subtitle={t("templatesSubtitle")} />

        {/* 4. COURSES & ACADEMY SECTION */}
        <HomeCoursesSection />

        {/* 5. ABOUT ME & CREDIBILITY SECTION */}
        <HomeAboutSection />

        {/* 6. FINAL HIGH-CONVERSION CTA SECTION */}
        <ContactCTASection />
      </BlurText>
    </>
  );
}
