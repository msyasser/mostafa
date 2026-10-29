import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import AnimatedText from "@/src/app/[locale]/_components/AnimatedText";
import TypewriterText from "@/src/app/[locale]/_components/TypewriterText";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import HeroScrollIndicator from "@/src/app/[locale]/_components/HeroScrollIndicator";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import SEOOptimizer from "./_components/SEOOptimizer";
import Image from "next/image";

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
const HomeReviews = dynamic(() => import("@/src/app/[locale]/_components/HomeReviews"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/40 rounded-3xl my-8"></div>,
});
const HomeAboutSection = dynamic(() => import("@/src/app/[locale]/_components/HomeAboutSection"), {
  loading: () => <div className="animate-pulse h-96 bg-gray-800/40 rounded-3xl my-8"></div>,
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
  const tt = useTranslations("TemplateSlug");
  const locale = useLocale();
  const stats = t.raw("heroStats");
  // Three premium systems shown as a stack of real template previews
  const stack = ["Second Brain", "FinanceHub", "StudyHub"];

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
        <div className="relative mx-auto max-w-7xl px-4 pt-6 md:pt-12 overflow-x-clip">
          {/* Ambient Gold Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-main/10 blur-[140px] -z-10 rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-10 lg:gap-6 items-center">
            <div>
              <p className="text-main text-xs sm:text-sm tracking-[0.22em] rtl:tracking-normal uppercase mb-3">
                {t("heroEyebrow")}
              </p>
              <AnimatedText>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold uppercase leading-[1.02] rtl:leading-[1.25] rtl:font-extrabold rtl:text-5xl rtl:sm:text-6xl rtl:xl:text-7xl">
                  <TypewriterText text={t("titlePrefix")} highlightText={t("titleHighlight")} />
                </h1>
              </AnimatedText>

              <AnimatedWrapper delay={2.5}>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-7 max-w-xl font-medium">
                  {t("subtitle")}
                </p>
                <p className="mt-5 text-sm sm:text-base text-neutral-400 flex items-center gap-3">
                  <span className="text-main tracking-[0.2em]" aria-hidden="true">★★★★★</span>
                  <span>{t("heroRating")}</span>
                </p>
                <HeroScrollIndicator />
              </AnimatedWrapper>
            </div>

            {/* Real template previews, stacked */}
            <AnimatedWrapper delay={0.6} className="relative w-full aspect-[10/9]">
              {stack.map((name, i) => (
                <Image
                  key={name}
                  src={tt(`${name}.image`)}
                  alt={tt(`${name}.name`)}
                  width={900}
                  height={726}
                  unoptimized
                  priority={i === 0}
                  className={`absolute rounded-2xl shadow-[0_26px_60px_rgba(0,0,0,0.65)] h-auto ${
                    i === 0
                      ? "end-0 top-0 z-[1] w-[74%]"
                      : i === 1
                        ? "start-[2%] top-[22%] z-[2] w-[74%]"
                        : "end-[6%] top-[44%] z-[3] w-[60%]"
                  }`}
                />
              ))}
            </AnimatedWrapper>
          </div>

          {/* Stats strip */}
          <dl className="mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 border-t border-neutral-800 pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 min-w-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl sm:text-4xl font-semibold text-main">{s.value}</dd>
                <span className="text-xs sm:text-sm text-neutral-400 uppercase tracking-wider rtl:tracking-normal rtl:normal-case" aria-hidden="true">
                  {s.label}
                </span>
              </div>
            ))}
          </dl>
        </div>

        {/* 2. ROUTING / PATH FINDER SECTION */}
        <HomeRoutingSection />

        {/* 3. TEMPLATES SHOWCASE SECTION */}
        <TemplatesShowcase title={t("templatesTitle")} subtitle={t("templatesSubtitle")} />

        {/* 4. COURSES & ACADEMY SECTION */}
        <HomeCoursesSection />

        {/* 5. REVIEWS FROM THE NOTION MARKETPLACE */}
        <HomeReviews />

        {/* 6. ABOUT ME & CREDIBILITY SECTION */}
        <HomeAboutSection />
      </BlurText>
    </>
  );
}
