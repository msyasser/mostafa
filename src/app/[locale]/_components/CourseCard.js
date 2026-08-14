"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ClockIcon, UserIcon, AcademicCapIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CourseCard({ course }) {
  const t = useTranslations("CoursesPage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { data: session } = useSession();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const courseName = isArabic ? course.name_ar : course.name;
  const courseDescription = isArabic ? course.description_ar : course.description;
  const courseInstructor = isArabic ? course.instructor_ar : course.instructor;
  const courseDuration = isArabic ? course.duration_ar : course.duration;
  const courseLevel = isArabic ? course.level_ar : course.level;
  const courseLanguage = isArabic ? course.language_ar : course.language;
  const courseCurrency = isArabic ? course.currency_ar : course.currency;

  const handleCardClick = (e) => {
    if (!session) {
      e.preventDefault();
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-main/50 transition-all duration-300 hover:shadow-2xl hover:shadow-main/10">
      {/* Login Required Tooltip */}
      {showLoginPrompt && !session && (
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="text-center p-6 relative max-w-xs w-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowLoginPrompt(false);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 transition-colors rounded-lg hover:bg-neutral-800"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LockClosedIcon className="w-16 h-16 text-main mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {isArabic ? "تسجيل الدخول مطلوب" : "Login Required"}
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {isArabic ? "يرجى تسجيل الدخول لمشاهدة هذه الدورة" : "Please login to access this course"}
            </p>
            <Link
              href={
                typeof window !== "undefined" &&
                !window.location.hostname.includes("localhost") &&
                !window.location.hostname.includes(".vercel.app") &&
                (window.location.hostname.startsWith("courses.") || window.location.hostname.startsWith("templates."))
                  ? `https://www.mostafayasser.com/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
                      window.location.origin + `/${locale}/courses/${course.slug}`
                    )}`
                  : `/${locale}/auth/signin?callbackUrl=/${locale}/courses/${course.slug}`
              }
              className="inline-block bg-main text-black font-semibold py-2 px-6 rounded-lg hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </Link>
          </div>
        </div>
      )}

      {/* Clickable Card Content */}
      <Link href={session ? `/${locale}/courses/${course.slug}` : `#`} className="block" onClick={handleCardClick}>
        {/* Course Icon */}
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-main/20 to-main/5 flex items-center justify-center">
            <AcademicCapIcon className="w-16 h-16 text-main/60" />
          </div>
        
        {/* Premium Badge */}
        {course.premium && (
          <div className="absolute top-4 right-4 bg-main text-black px-3 py-1 rounded-full text-sm font-semibold">
            {t("premium")}
          </div>
        )}
        
        {/* Price */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="text-lg font-bold">{isArabic ? "مجاني" : "Free"}</span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-main transition-colors duration-300 line-clamp-2">
          {courseName}
        </h3>

        {/* Instructor */}
        <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          {courseInstructor}
        </p>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {courseDescription}
        </p>

        {/* Course Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>{courseDuration}</span>
            <span className="mx-2">•</span>
            <span>{courseLevel}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AcademicCapIcon className="w-4 h-4" />
            <span>{courseLanguage}</span>
            <span className="mx-2">•</span>
            <span>{course.enrolled.toLocaleString()} {t("enrolled")}</span>
          </div>
        </div>


        {/* Course Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-800 text-gray-300 text-xs rounded-full"
            >
              {isArabic ? course.tags_ar[index] : tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full bg-main text-black font-semibold py-3 px-4 rounded-lg text-center hover:bg-white transition-colors duration-300">
          {course.youtubePlaylist ? (isArabic ? "شاهد الدورة" : "Watch Course") : t("viewCourse")}
        </div>
      </div>
      </Link>
    </div>
  );
}
