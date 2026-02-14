import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { tools } from "../_data/tools";
import ToolExplorer from "../_components/ToolExplorer";

import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
    return tools.map((tool) => ({
        tool: tool.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { tool: slug, locale } = await params;
    const toolData = tools.find((t) => t.slug === slug);

    if (!toolData) return {};

    const t = await getTranslations("ToolsPage");
    const title = t(toolData.titleKey);
    const description = t(toolData.descriptionKey);
    const siteUrl = "https://www.mostafayasser.com";
    const url = `${siteUrl}/${locale}/tools/${slug}`;

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

export default async function ToolPage({ params }) {
    const { tool: slug } = await params;
    const toolData = tools.find((t) => t.slug === slug);

    if (!toolData) {
        notFound();
    }

    // const t = useTranslations("ToolsPage");

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <ToolExplorer slug={slug} />
        </div>
    );
}
