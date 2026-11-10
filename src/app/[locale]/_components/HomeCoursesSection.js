"use client";

import { useTranslations, useLocale } from "next-intl";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";
import NotionCourseCard from "./NotionCourseCard";

export default function HomeCoursesSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();

  return (
    <section id="courses-section" className="w-full pt-24 pb-6 px-4 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <AnimatedInView threshold={0.1}>
            <h2 className="text-3xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white tracking-tight">
              {t("coursesSectionTitle")}
            </h2>
          </AnimatedInView>
          <AnimatedInView threshold={0.1}>
            <p className="text-gray-300 text-base sm:text-xl max-w-2xl mt-3">
              {t("coursesSectionSubtitle")}
            </p>
          </AnimatedInView>
        </div>

        <AnimatedWrapper>
          <NotionCourseCard href={`/${locale}/courses/notion-course`} place="home_courses" />
        </AnimatedWrapper>
      </div>
    </section>
  );
}
