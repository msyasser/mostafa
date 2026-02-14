import BlurText from "@/src/app/[locale]/_components/BlurText";
import CaseStudiesList from "./_components/CaseStudiesList";
import CaseStudiesHero from "./_components/CaseStudiesHero";
import { useTranslations } from "next-intl";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic ? "دراسات الحالة" : "Case Studies";
    const description = isArabic
        ? "استكشف كيف قمت بحل مشاكل الأعمال المعقدة باستخدام نوشن."
        : "Explore how I solved complex business problems with custom Notion systems.";
    const url = `${siteUrl}/${locale}/case-studies`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Mostafa Yasser",
            images: [
                {
                    url: `${siteUrl}/icon.png`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${siteUrl}/icon.png`],
        },
    };
}

export default function CaseStudiesPage() {
    return (
        <BlurText>
            <div className="bg-neutral-950 min-h-screen text-white selection:bg-main selection:text-neutral-900">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <CaseStudiesHero />
                    <CaseStudiesList />
                </div>
            </div>
        </BlurText>
    );
}
