import { useTranslations } from "next-intl";
import ToolsGallery from "./_components/ToolsGallery";

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
