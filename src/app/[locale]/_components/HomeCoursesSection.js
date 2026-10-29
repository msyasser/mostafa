"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  BsArrowRight, 
  BsArrowLeft, 
  BsYoutube, 
  BsPlayCircle, 
  BsStarFill, 
  BsPeople, 
  BsClock, 
  BsLockFill 
} from "react-icons/bs";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import courses from "@/src/app/[locale]/_data/coursesData";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";
import Image from "next/image";

export default function HomeCoursesSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  const { data: session } = useSession();
  const [activeLoginPromptCourseId, setActiveLoginPromptCourseId] = useState(null);

  const activeCourses = courses.filter((c) => c.status === "active");
  const single = activeCourses.length === 1;

  const handleCardClick = (e, course) => {
    if (!session) {
      e.preventDefault();
      setActiveLoginPromptCourseId(course.id);
    }
  };

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

        <div className={single ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"}>
          {activeCourses.map((course, index) => {
            const courseName = isArabic ? course.name_ar : course.name;
            const courseDesc = isArabic ? course.description_ar : course.description;
            const courseDuration = isArabic ? course.duration_ar : course.duration;
            const courseLevel = isArabic ? course.level_ar : course.level;
            const isLocked = !session;
            const showPrompt = activeLoginPromptCourseId === course.id && !session;
            const courseHref = `/${locale}/courses/${course.slug}`;
            const signinHref = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(courseHref)}`;

            return (
              <AnimatedWrapper key={course.id} delay={index * 0.15}>
                <div className="group relative bg-[#14110F] rounded-md overflow-hidden border border-[#3a3027] hover:border-main/50 transition-colors duration-300 h-full">
                  
                  {/* Login Required Overlay Modal */}
                  {showPrompt && (
                    <div
                      className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex items-center justify-center p-6 transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <div className="text-center p-4 relative max-w-xs w-full">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveLoginPromptCourseId(null);
                          }}
                          className="absolute -top-2 right-0 text-gray-400 hover:text-white p-2 transition-colors rounded-full hover:bg-neutral-800"
                          aria-label="Close"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="w-14 h-14 rounded-2xl bg-main/10 border border-main/30 flex items-center justify-center mx-auto mb-4 text-main shadow-lg">
                          <LockClosedIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {isArabic ? "تسجيل الدخول مطلوب" : "Sign In Required"}
                        </h3>
                        <p className="text-gray-400 mb-6 text-xs sm:text-sm leading-relaxed">
                          {isArabic
                            ? "يرجى تسجيل الدخول أو إنشاء حساب مجاني لمشاهدة الدورة والوصول إلى كافة الدروس."
                            : "Please sign in or create a free account to access this course and all its resources."}
                        </p>
                        <Link
                          href={signinHref}
                          className="block w-full bg-main text-black font-bold py-3 px-6 rounded-xl hover:bg-white transition-all duration-300 shadow-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isArabic ? "تسجيل الدخول الآن" : "Sign In to Access"}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Main Clickable Card Link */}
                  <Link
                    href={session ? courseHref : "#"}
                    onClick={(e) => handleCardClick(e, course)}
                    className={`cursor-pointer h-full ${single ? "md:grid md:grid-cols-[1.05fr_1fr]" : "flex flex-col justify-between"}`}
                  >
                    {/* Thumbnail / Header */}
                    <div className={`relative aspect-video w-full overflow-hidden bg-neutral-950 ${single ? "md:aspect-auto md:min-h-[320px]" : ""}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40 z-10" />
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={courseName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-main/20 to-neutral-900">
                          <BsPlayCircle className="text-5xl text-main/70 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}

                      {/* Top Badges (Free Badge) */}
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-[3px] text-xs font-bold tracking-wider border border-main bg-black/70 text-main uppercase rtl:normal-case">
                          {isArabic ? "مجاني" : "Free"}
                        </span>
                      </div>

                      {/* Bottom Info on Thumbnail */}
                      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 text-xs font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                        <BsClock className="text-main" />
                        <span>{courseDuration}</span>
                        <span>•</span>
                        <span>{courseLevel}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-amber-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <BsStarFill key={i} className="inline-block" />
                            ))}
                          </div>
                          <span className="text-white text-xs font-bold">{course.rating}</span>
                          <span className="text-neutral-500 text-xs">({course.reviews})</span>
                        </div>

                        <h3 className="text-2xl sm:text-4xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white mb-3 group-hover:text-main transition-colors duration-300 line-clamp-2">
                          {courseName}
                        </h3>
                        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                          {courseDesc}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 py-3 border-t border-neutral-800 mb-5">
                          <span className="flex items-center gap-1.5">
                            <BsPeople className="text-main text-sm" />
                            <span>{course.enrolled?.toLocaleString()} {isArabic ? "مشترك" : "Students"}</span>
                          </span>
                          <span className="flex items-center gap-1 text-red-400 font-medium">
                            <BsYoutube className="text-base" />
                            <span>YouTube Playlist</span>
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-2 py-3 px-7 rounded-full border-[1.5px] border-[#3a3027] text-[#F4D9B6] font-semibold text-sm group-hover:border-main group-hover:text-main transition-colors duration-300">
                          <span>{isArabic ? "شاهد محتوى الدورة" : "Access Course"}</span>
                          <ArrowIcon className="text-base transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </AnimatedWrapper>
            );
          })}
        </div>

        {/* View all courses button */}
        <div className="flex justify-center mt-12">
          <AnimatedInView threshold={0.1}>
            <Link
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 text-main font-semibold uppercase tracking-[0.1em] rtl:tracking-normal rtl:normal-case text-base hover:text-white transition-colors"
            >
              <span>{t("viewAllCourses")}</span>
              <ArrowIcon className="text-lg" />
            </Link>
          </AnimatedInView>
        </div>
      </div>
    </section>
  );
}
