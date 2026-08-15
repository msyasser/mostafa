import BlurText from "@/src/app/[locale]/_components/BlurText";
import AboutHero from "./_components/AboutHero";
import StoryTimeline from "./_components/StoryTimeline";
import Certifications from "./_components/Certifications";
import AboutCTA from "./_components/AboutCTA";
import { useTranslations } from "next-intl";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteUrl = "https://www.mostafayasser.com";
  const title = isArabic
    ? "متخصص أنظمة وقوالب نوشن"
    : "Notion Specialist & Digital Architect";
  const description = isArabic
    ? "أنا مصطفى ياسر، متخصص في تصميم وبناء أنظمة وقوالب نوشن المخصصة لإدارة المشاريع والمهام والماليات وتبسيط مساحات العمل للأفراد والشركات."
    : "I'm Mostafa Yasser. I engineer custom Notion systems to organize projects, tasks, and finances, helping individuals and teams achieve workflow clarity.";
  const url = `${siteUrl}/${locale}/about`;
  const imageUrl = `${siteUrl}/certifications/notion-certifications.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: isArabic ? "عن مصطفى ياسر" : "About Mostafa Yasser",
      description,
      type: "profile",
      url,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: "Mostafa Yasser - Notion Certified",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function AboutPage() {
  return (
    <BlurText>
      <div className="bg-neutral-950 min-h-screen text-white selection:bg-main selection:text-neutral-900">
        <AboutHero />
        <StoryTimeline />
        <Certifications />
        <AboutCTA />
      </div>
    </BlurText>
  );
}
