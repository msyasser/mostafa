"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import SubscriptionForm from "@/src/app/[locale]/_components/SubscriptionForm";

// Shown under every tool: the people who use a free tool are the best audience for the newsletter,
// the templates and a first call.
export default function ToolCta() {
    const t = useTranslations("ToolsPage.cta");

    return (
        <section className="mx-auto mt-16 w-full max-w-3xl rounded-[22px] border border-main/30 bg-neutral-900 p-7 text-center md:p-9">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("title")}</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-400">{t("newsletter")}</p>
            <div className="mx-auto mt-5 max-w-md">
                <SubscriptionForm
                    className="flex w-full"
                    inputClassName="flex-1 min-w-0 px-4 py-3 bg-neutral-950 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-s-md focus:outline-none focus:border-main"
                    buttonClassName="px-5 py-3 bg-main text-neutral-950 font-bold rounded-e-md cursor-pointer hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                    href="/templates"
                    data-track="tool_cta_click"
                    data-track-place="templates"
                    className="rounded-full border border-main/50 px-6 py-2.5 font-semibold text-main transition-colors hover:bg-main hover:text-neutral-900"
                >
                    {t("templates")}
                </Link>
                <Link
                    href="/services#calendar-section"
                    data-track="book_call_click"
                    data-track-place="tool_page"
                    className="rounded-full bg-main px-6 py-2.5 font-semibold text-neutral-900 transition-transform hover:scale-[1.03]"
                >
                    {t("services")}
                </Link>
            </div>
        </section>
    );
}
