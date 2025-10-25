import { useTranslations, useLocale } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import AnimatedText from "@/src/app/[locale]/_components/AnimatedText";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
import CourseCard from "@/src/app/[locale]/_components/CourseCard";
import courses from "@/src/app/[locale]/_data/coursesData";
import SEOOptimizer from "@/src/app/[locale]/_components/SEOOptimizer";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const baseUrl = "https://www.mostafayasser.com";
  const imageUrl = isArabic
    ? `${baseUrl}/metaData/ar/courses.webp`
    : `${baseUrl}/metaData/en/courses.webp`;

  const title = isArabic
    ? "الدورات التدريبية | مصطفى ياسر"
    : "Courses | Mostafa Yasser";

  const description = isArabic
    ? "تعلم إتقان نوشن مع دورات مصطفى ياسر التدريبية. من المبتدئين إلى المتقدمين، اكتشف كيفية بناء أنظمة إنتاجية قوية."
    : "Master Notion with Mostafa Yasser's comprehensive courses. From beginners to advanced users, learn how to build powerful productivity systems.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/courses`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "دورات مصطفى ياسر التدريبية"
            : "Mostafa Yasser Courses",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/courses`,
    },
  };
}

export default function CoursesPage() {
  const t = useTranslations("CoursesPage");
  const locale = useLocale();

  // Filter courses by status
  const activeCourses = courses.filter(course => course.status === "active");

  // Group courses by category
  const coursesByCategory = activeCourses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {});

  const categories = [
    { key: "knowledge-management", name: t("categories.knowledgeManagement"), name_ar: "إدارة المعرفة" },
    { key: "education", name: t("categories.education"), name_ar: "التعليم" },
    { key: "team-collaboration", name: t("categories.teamCollaboration"), name_ar: "التعاون الجماعي" },
    { key: "automation", name: t("categories.automation"), name_ar: "الأتمتة" },
    { key: "design", name: t("categories.design"), name_ar: "التصميم" },
  ];

  return (
    <>
      <SEOOptimizer
        type="website"
        title={t("title")}
        description={t("subtitle")}
        url={`https://www.mostafayasser.com/${locale}/courses`}
        image={`https://www.mostafayasser.com/metaData/${locale === "ar" ? "ar" : "en"}/courses.webp`}
        locale={locale}
      />
      
      <BlurText>
        <div className="min-h-screen bg-neutral-950 text-white px-6 py-12 sm:px-12 lg:px-24">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto text-center mb-16">
            <AnimatedText className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-2 font-extrabold leading-tight mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-2 font-extrabold leading-tight">
                {t("title")}
              </h1>
            </AnimatedText>

            <AnimatedWrapper delay={0.5}>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                {t("subtitle")}
              </p>
            </AnimatedWrapper>

          </div>

          {/* Courses by Category */}
          <div className="max-w-7xl mx-auto">
            <AnimatedWrapper delay={1.5}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </AnimatedWrapper>
          </div>

          {/* Call to Action Section */}
          <AnimatedWrapper delay={2}>
            <div className="max-w-4xl mx-auto text-center mt-20 p-8 bg-gradient-to-r from-main/10 to-main/5 rounded-3xl border border-main/20">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                {t("cta.description")}
              </p>
              <a
                href="https://t.me/engmsyasser"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-main text-black font-semibold px-8 py-4 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t("cta.button")}
              </a>
            </div>
          </AnimatedWrapper>
        </div>
      </BlurText>
    </>
  );
}
