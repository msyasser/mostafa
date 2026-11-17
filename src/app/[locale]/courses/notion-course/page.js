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
    const image = `${SITE_URL}/courses/notion-course-${locale === "ar" ? "ar" : "en"}.webp`;

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
            images: [{ url: image, width: 1600, height: 900, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: [image] },
    };
}

export default async function NotionCoursePage({ params }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "NotionCoursePage.meta" });
    const tFaq = await getTranslations({ locale, namespace: "NotionCoursePage.faq" });

    const lessons = sections.flatMap((section) => section.lessons);
    const seconds = lessons.reduce((sum, lesson) => sum + lesson.seconds, 0);
    const url = `${SITE_URL}/${locale}/courses/notion-course`;
    const instructor = {
        "@type": "Person",
        name: locale === "ar" ? "مصطفى ياسر" : "Mostafa Yasser",
        alternateName: locale === "ar" ? "Mostafa Yasser" : "مصطفى ياسر",
        jobTitle: "Notion Consulting Partner",
        url: SITE_URL,
        sameAs: [
            "https://youtube.com/@engmsyasser",
            "https://linkedin.com/in/engmsyasser",
            "https://notion.com/@mostafayasser",
            "https://x.com/engmsyasser",
            "https://facebook.com/engmsyasser",
            "https://instagram.com/engmsyasser",
        ],
    };
    const courseLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: t("title"),
        description: t("description"),
        inLanguage: "ar",
        url,
        image: `${SITE_URL}/courses/notion-course-${locale === "ar" ? "ar" : "en"}.webp`,
        provider: instructor,
        educationalCredentialAwarded: "Notion Power User (NPU)",
        coursePrerequisites: locale === "ar" ? "مفيش خبرة سابقة مطلوبة" : "No previous experience needed",
        offers: {
            "@type": "Offer",
            category: "Paid",
            price: course.priceEgp,
            priceCurrency: "EGP",
            url,
            // Until enrollment opens the page collects a waitlist, so the offer is marked as a pre-order.
            availability: course.salesOpen ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: `PT${Math.round(seconds / 3600)}H`,
            instructor,
        },
    };
    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tFaq.raw("items").map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
    };
    const ld = (data) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={ld(courseLd)} />
            <script type="application/ld+json" dangerouslySetInnerHTML={ld(faqLd)} />
            <CoursePage />
        </>
    );
}
