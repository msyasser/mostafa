import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { tools } from "../_data/tools";
import ToolExplorer from "../_components/ToolExplorer";

export function generateStaticParams() {
    return tools.map((tool) => ({
        tool: tool.slug,
    }));
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
