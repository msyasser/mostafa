export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic ? "المصادر" : "Resources";
    const description = isArabic
        ? "مصادر مجانية وأدوات لمساعدتك في رحلتك."
        : "Free resources and tools to help you on your journey.";
    const url = `${siteUrl}/${locale}/resources`;

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

export default function ResourcesPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-4xl">Free Resources Coming Soon</h1>
        </div>
    );
}
