import { useTranslations, useLocale } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
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
        <div className="w-full px-4 sm:px-6 py-8 sm:py-12 mt-4 sm:mt-6 lg:mt-12">
          <section className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-main mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>

            <AnimatedWrapper delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {activeCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </AnimatedWrapper>
          </section>
        </div>
      </BlurText>
    </>
  );
}
