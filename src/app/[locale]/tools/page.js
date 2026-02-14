import { useTranslations } from "next-intl";
import ToolsGallery from "./_components/ToolsGallery";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isArabic = locale === "ar";
    const siteUrl = "https://www.mostafayasser.com";
    const title = isArabic ? "الأدوات المجانية" : "Free Tools";
    const description = isArabic
        ? "مجموعة من الأدوات المجانية لزيادة إنتاجيتك وتنظيم حياتك. تتضمن مؤقت بومودورو، متتبع العادات، والمزيد."
        : "A collection of free tools to boost your productivity and organize your life. Includes Pomodoro timer, habit tracker, and more.";
    const url = `${siteUrl}/${locale}/tools`;

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

export default function ToolsPage() {
    const t = useTranslations("ToolsPage");

    return (
        <div className="min-h-screen py-20 bg-black text-white">
            <div className="text-center mb-12 px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-main to-white bg-clip-text text-transparent pb-2">
                    {t("title")}
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    {t("subtitle")}
                </p>
            </div>

            <ToolsGallery />
        </div>
    );
}
