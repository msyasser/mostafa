import CaseStudiesList from "./_components/CaseStudiesList";
import CaseStudiesHero from "./_components/CaseStudiesHero";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic ? "دراسات الحالة" : "Case Studies";
    const description = isArabic
        ? "شوف إزاي حلّيت مشاكل شغل معقدة باستخدام نوشن."
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
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-main selection:text-neutral-900">
            <div className="mx-auto max-w-[1200px] px-6">
                <CaseStudiesHero />
                <CaseStudiesList />
            </div>
        </div>
    );
}
