import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import blogsData from "@/src/app/[locale]/_data/blogsData";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { Suspense } from "react";
import Loader from "@/src/app/[locale]/_components/Loader";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "المدونة"
    : "Blog";

  const description = isArabic
    ? "اكتشف أحدث مقالاتي حول قوالب نوشن، حلول الإنتاجية، سير العمل الرقمي، واستراتيجيات الأعمال عبر الإنترنت."
    : "Explore my latest blog posts on Notion templates, productivity hacks, digital workflows, and online business strategies.";

  const openGraphDescription = isArabic
    ? "اكتشف رؤى وأفكار قابلة للتنفيذ لتحسين مساحة عمل نوشن وزيادة إنتاجيتك الرقمية."
    : "Discover actionable insights and ideas to level up your Notion workspace and digital productivity.";

  return {
    title,
    description,
    keywords: isArabic
      ? [
        "مدونة نوشن",
        "مدونة الإنتاجية",
        "مقالات مصطفى ياسر",
        "دروس نوشن",
        "نصائح التنظيم الرقمي",
        "رؤى خبير نوشن",
        "تخطيط الحياة باستخدام نوشن",
      ]
      : [
        "Notion blog",
        "Productivity blog",
        "Mostafa Yasser articles",
        "Notion tutorials",
        "Digital organization tips",
        "Notion expert insights",
        "Life planning with Notion",
      ],
    openGraph: {
      title,
      description: openGraphDescription,
      url: `https://mostafayasser.com/${locale}/blog`,
      siteName: "Mostafa Yasser",
      images: [
        {
          url: "/blogs/ENBlogs/1.webp",
          width: 1200,
          height: 630,
          alt: isArabic ? "مدونة مصطفى ياسر" : "Mostafa Yasser Blog",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "مدونة مصطفى ياسر" : "Blog by Mostafa Yasser",
      description: isArabic
        ? "استكشف أحدث المقالات حول نوشن والإنتاجية والأنظمة الرقمية."
        : "Explore the latest articles on Notion, productivity, and digital systems.",
      images: ["/blogs/ENBlogs/1.webp"],
    },
  };
}

function Blogs() {
  const t = useTranslations("BlogsPage");
  const tt = useTranslations("BlogSlug");
  const locale = useLocale();

  return (
    <BlurText>
      <div className="min-h-screen py-12 px-6 mt-6 sm:mt-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-main mb-8 sm:mb-10">
            {t("subtitle")}
          </p>

          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
              {blogsData.map((blog) => (
                <Link
                  href={`/${locale}/blog/${blog.slug}`}
                  key={blog.id}
                  className="rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-2 overflow-hidden ease-in-out hover:shadow-main"
                >
                  <div className="aspect-[4/3]">
                    <Image
                      src={tt(`${blog.title}.image`)}
                      alt={blog.title}
                      width={500}
                      height={500}
                    />
                  </div>
                  <div className="p-4 sm:p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">
                      {tt(`${blog.title}.title`)}
                    </h3>
                    <p className="text-sm sm:text-base mb-3">{blog.excerpt}</p>
                    <span className="transition text-main hover:opacity-70">
                      {t("readMore")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Suspense>
        </div>
      </div>
    </BlurText>
  );
}

export default Blogs;
