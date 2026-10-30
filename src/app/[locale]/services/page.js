import ServicesPageV2 from "./_v2/ServicesPageV2";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic
        ? "مستشار نوشن معتمد: أنظمة وأتمتة وتدريب"
        : "Custom Notion Systems Architecture";
    const description = isArabic
        ? "بصمم أنظمة نوشن متفصّلة على طريقة شغلك: لوحات للمشاريع والعملاء والمالية، وأتمتة وربط أدوات، وتدريب لفريقك. احجز مكالمة اكتشاف مجانية 30 دقيقة."
        : "I build custom Notion systems around how you work: project, client and finance workspaces, automations and integrations, and team training. Book a free 30-minute discovery call.";
    const url = `${siteUrl}/${locale}/services`;
    const imageUrl = `${siteUrl}/icon.png`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
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

export default function ServicesPage() {
    return <ServicesPageV2 />;
}
