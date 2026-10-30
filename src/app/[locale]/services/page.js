import ServicesPageV2 from "./_v2/ServicesPageV2";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic
        ? "خدمات بناء أنظمة نوشن المخصصة"
        : "Custom Notion Systems Architecture";
    const description = isArabic
        ? "أنظمة نوشن مخصصة ومصممة بدقة لتنظيم المشاريع، والمهام، والماليات للأفراد وفرق العمل لرفع الإنتاجية وتحقيق الوضوح الكامل."
        : "Tailored, scalable Notion architectures engineered to organize projects, tasks, and finances for individuals and growing teams.";
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
