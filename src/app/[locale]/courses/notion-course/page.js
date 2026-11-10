import { getTranslations, setRequestLocale } from "next-intl/server";
import CoursePage from "./_components/CoursePage";
import { course } from "./_data/course";
import { sections } from "./_data/curriculum";

const SITE_URL = "https://www.mostafayasser.com";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "NotionCoursePage.meta" });
    const title = t("title");
    const description = t("description");
    const url = `${SITE_URL}/${locale}/courses/notion-course`;
    const image = `${SITE_URL}/metaData/${locale === "ar" ? "ar" : "en"}/courses.webp`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: {
                en: `${SITE_URL}/en/courses/notion-course`,
                ar: `${SITE_URL}/ar/courses/notion-course`,
                "x-default": `${SITE_URL}/ar/courses/notion-course`,
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Mostafa Yasser",
            type: "website",
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: [image] },
    };
}

export default async function NotionCoursePage({ params }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "NotionCoursePage.meta" });

    const seconds = sections.flatMap((section) => section.lessons).reduce((sum, lesson) => sum + lesson.seconds, 0);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: t("title"),
        description: t("description"),
        inLanguage: "ar",
        url: `${SITE_URL}/${locale}/courses/notion-course`,
        provider: { "@type": "Person", name: "Mostafa Yasser", url: SITE_URL },
        offers: { "@type": "Offer", category: "Paid", price: course.priceEgp, priceCurrency: "EGP" },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: `PT${Math.round(seconds / 3600)}H`,
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <CoursePage />
        </>
    );
}
