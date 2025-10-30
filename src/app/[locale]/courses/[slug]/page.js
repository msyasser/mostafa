import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import SEOOptimizer from "@/src/app/[locale]/_components/SEOOptimizer";
import courses from "@/src/app/[locale]/_data/coursesData";
import { StarIcon, ClockIcon, UserIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import VideoPlayer from "./VideoPlayer";
import { getLocale } from "next-intl/server";
import { auth } from "@/src/app/api/auth/[...nextauth]/route";



// YouTube course videos data - Real video IDs from your course
const playlistVideos = [
  {
    id: "bumkYuAexk0",
    title: "Notion Basics - Getting Started",
    title_ar: "أساسيات نوشن - البداية",
    description: "Learn the fundamentals of Notion workspace setup and navigation.",
    description_ar: "تعلم أساسيات إعداد مساحة عمل نوشن والتنقل.",
    duration: "3:47",
    thumbnail: "https://img.youtube.com/vi/bumkYuAexk0/maxresdefault.jpg"
  },
  {
    id: "oYBvS7WT7fI",
    title: "Database Creation and Management", 
    title_ar: "إنشاء وإدارة قواعد البيانات",
    description: "Master database creation, properties, and basic operations.",
    description_ar: "أتقن إنشاء قواعد البيانات والخصائص والعمليات الأساسية.",
    duration: "2:45",
    thumbnail: "https://img.youtube.com/vi/oYBvS7WT7fI/maxresdefault.jpg"
  },
  {
    id: "tXpGGccqx60",
    title: "Advanced Database Techniques",
    title_ar: "تقنيات قواعد البيانات المتقدمة",
    description: "Explore formulas, relations, and advanced database features.",
    description_ar: "استكشف الصيغ والعلاقات وميزات قواعد البيانات المتقدمة.",
    duration: "3:44",
    thumbnail: "https://img.youtube.com/vi/tXpGGccqx60/maxresdefault.jpg"
  },
  {
    id: "JMH2oLmPohw",
    title: "Templates and Automation",
    title_ar: "القوالب والأتمتة",
    description: "Create templates and set up automation workflows.",
    description_ar: "إنشاء القوالب وإعداد سير عمل الأتمتة.",
    duration: "4:57",
    thumbnail: "https://img.youtube.com/vi/JMH2oLmPohw/maxresdefault.jpg"
  },
  {
    id: "N59oKcPia7U",
    title: "Team Collaboration Features",
    title_ar: "ميزات التعاون الجماعي",
    description: "Learn to collaborate effectively with your team in Notion.",
    description_ar: "تعلم التعاون بفعالية مع فريقك في نوشن.",
    duration: "2:36",
    thumbnail: "https://img.youtube.com/vi/N59oKcPia7U/maxresdefault.jpg"
  },
  {
    id: "msEM8_KWF4k",
    title: "Notion Formulas Mastery",
    title_ar: "إتقان صيغ نوشن",
    description: "Master complex formulas and calculations in Notion databases.",
    description_ar: "أتقن الصيغ المعقدة والحسابات في قواعد بيانات نوشن.",
    duration: "5:58",
    thumbnail: "https://img.youtube.com/vi/msEM8_KWF4k/maxresdefault.jpg"
  },
  {
    id: "ydmFE_jj2HQ",
    title: "Building Your Second Brain",
    title_ar: "بناء العقل الثاني",
    description: "Create a comprehensive knowledge management system with Notion.",
    description_ar: "إنشاء نظام شامل لإدارة المعرفة مع نوشن.",
    duration: "3:17",
    thumbnail: "https://img.youtube.com/vi/ydmFE_jj2HQ/maxresdefault.jpg"
  },
  {
    id: "GnkpfvfFDvU",
    title: "Notion for Project Management",
    title_ar: "نوشن لإدارة المشاريع",
    description: "Use Notion to manage projects, tasks, and team workflows.",
    description_ar: "استخدم نوشن لإدارة المشاريع والمهام وسير عمل الفريق.",
    duration: "2:46",
    thumbnail: "https://img.youtube.com/vi/GnkpfvfFDvU/maxresdefault.jpg"
  }
];

export default async function CourseSlugPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const course = courses.find(c => c.slug === slug);
  
  if (!course) {
    notFound();
  }

  const locale = await getLocale();
  const isArabic = locale === "ar";

  // Check authentication
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/auth/signin?callbackUrl=/${locale}/courses/${slug}`);
  }

  const courseName = isArabic ? course.name_ar : course.name;
  const courseDescription = isArabic ? course.description_ar : course.description;
  const courseInstructor = isArabic ? course.instructor_ar : course.instructor;
  const courseDuration = isArabic ? course.duration_ar : course.duration;
  const courseLevel = isArabic ? course.level_ar : course.level;
  const courseLanguage = isArabic ? course.language_ar : course.language;
  const courseCurrency = isArabic ? course.currency_ar : course.currency;

  return (
    <>
      <SEOOptimizer
        type="website"
        title={courseName}
        description={courseDescription}
        url={`https://www.mostafayasser.com/${locale}/courses/${slug}`}
        image={`https://www.mostafayasser.com${course.thumbnail}`}
        locale={locale}
      />
      
      <BlurText>
        <div className="min-h-screen bg-neutral-950 text-white">
          {/* Course Header */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border-b border-neutral-700">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                    {courseName}
                  </h1>
                  <p className="text-gray-400 text-lg mb-4">
                    {courseDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>{courseInstructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{courseDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AcademicCapIcon className="w-4 h-4" />
                      <span>{courseLevel}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-main mb-2">
                    {isArabic ? "مجاني" : "Free"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {isArabic ? "مجاني للأبد" : "Free Forever"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <VideoPlayer 
              course={course}
              playlistVideos={playlistVideos}
            />
          </div>
        </div>
      </BlurText>
    </>
  );
}
