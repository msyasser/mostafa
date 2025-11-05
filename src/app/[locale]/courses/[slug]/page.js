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
    title: "What is Notion and Why Should You Use It?",
    title_ar: "ما هو نوشن؟ ولماذا يجب أن تستخدمه؟",
    description: "Learn the fundamentals of Notion and why it's an essential productivity tool.",
    description_ar: "تعلم أساسيات نوشن ولماذا هو أداة إنتاجية أساسية.",
    duration: "3:47",
    thumbnail: "https://img.youtube.com/vi/bumkYuAexk0/maxresdefault.jpg"
  },
  {
    id: "oYBvS7WT7fI",
    title: "How to Use Blocks and Templates in Notion", 
    title_ar: "كيفية استخدام البلوكات والقوالب في نوشن",
    description: "Master the use of blocks and templates to enhance your workspace.",
    description_ar: "أتقن استخدام البلوكات والقوالب لتحسين مساحة العمل الخاصة بك.",
    duration: "2:45",
    thumbnail: "https://img.youtube.com/vi/oYBvS7WT7fI/maxresdefault.jpg"
  },
  {
    id: "tXpGGccqx60",
    title: "Complete Guide to Using Databases in Notion",
    title_ar: "دليل شامل لاستخدام قواعد البيانات في نوشن",
    description: "Explore databases and their features in Notion.",
    description_ar: "استكشف قواعد البيانات وميزاتها في نوشن.",
    duration: "3:44",
    thumbnail: "https://img.youtube.com/vi/tXpGGccqx60/maxresdefault.jpg"
  },
  {
    id: "JMH2oLmPohw",
    title: "Best Way to Organize Your Studies with Notion",
    title_ar: "أفضل طريقة لتنظيم دراستك باستخدام نوشن",
    description: "Create an effective study organization system with Notion.",
    description_ar: "إنشاء نظام فعال لتنظيم الدراسة باستخدام نوشن.",
    duration: "4:57",
    thumbnail: "https://img.youtube.com/vi/JMH2oLmPohw/maxresdefault.jpg"
  },
  {
    id: "N59oKcPia7U",
    title: "How to Make Weekly Planning a Successful Habit with Notion?",
    title_ar: "كيف تجعل تخطيط الأسبوع عادة ناجحة باستخدام نوشن؟",
    description: "Learn to establish weekly planning as a successful habit.",
    description_ar: "تعلم إنشاء عادة تخطيط الأسبوع الناجحة.",
    duration: "2:36",
    thumbnail: "https://img.youtube.com/vi/N59oKcPia7U/maxresdefault.jpg"
  },
  {
    id: "msEM8_KWF4k",
    title: "How to Create a Habit Tracker in Notion?",
    title_ar: "كيف تنشئ متتبع العادات في نوشن؟",
    description: "Build a comprehensive habit tracking system in Notion.",
    description_ar: "بناء نظام شامل لتتبع العادات في نوشن.",
    duration: "5:58",
    thumbnail: "https://img.youtube.com/vi/msEM8_KWF4k/maxresdefault.jpg"
  },
  {
    id: "ydmFE_jj2HQ",
    title: "Tools That Will Completely Change Your Notion Experience",
    title_ar: "أدوات ستغير تجربتك مع نوشن بالكامل",
    description: "Discover powerful tools to enhance your Notion workflow.",
    description_ar: "اكتشف أدوات قوية لتحسين سير عملك في نوشن.",
    duration: "3:17",
    thumbnail: "https://img.youtube.com/vi/ydmFE_jj2HQ/maxresdefault.jpg"
  },
  {
    id: "GnkpfvfFDvU",
    title: "How to Benefit from External Tools to Increase Your Productivity?",
    title_ar: "كيف تستفيد من أدوات خارجية لزيادة إنتاجيتك ؟",
    description: "Integrate external tools with Notion to boost productivity.",
    description_ar: "دمج أدوات خارجية مع نوشن لزيادة الإنتاجية.",
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
