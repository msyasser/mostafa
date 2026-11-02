import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { tasksWidget } from "../_data/tasksWidget";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "ToolsPage.tasksWidget" });
    const siteUrl = "https://www.mostafayasser.com";
    const url = `${siteUrl}/${locale}/tools/tasks-widget`;
    const image = `${siteUrl}/tasks-widget/${locale === "ar" ? "ar" : "en"}/overview.webp`;
    const title = t("metaTitle");
    const description = t("metaDescription");

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName: "Mostafa Yasser",
            images: [{ url: image, width: 1600, height: 900, alt: t("title") }],
            type: "website",
        },
        twitter: { card: "summary_large_image", title, description, images: [image] },
    };
}

export default async function TasksWidgetPage({ params }) {
    const { locale } = await params;
    const lang = locale === "ar" ? "ar" : "en";
    const t = await getTranslations("ToolsPage.tasksWidget");
    const features = t.raw("features");
    const steps = t.raw("steps");
    const [hero, ...gallery] = tasksWidget.screenshots;

    return (
        <div className="min-h-screen bg-neutral-950 px-6 pb-24 pt-10 text-white selection:bg-main selection:text-neutral-900">
            <div className="mx-auto max-w-[1100px]">
                <Link href="/tools" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white">
                    <span className="inline-block rtl:-scale-x-100" aria-hidden="true">←</span>
                    {t("backToTools")}
                </Link>

                <header className="max-w-3xl">
                    <span className="inline-block rounded-md bg-main px-2.5 py-0.5 text-xs font-semibold text-neutral-900">{t("badge")}</span>
                    <h1 className="mt-4 text-4xl font-semibold leading-[1.15] md:text-5xl">{t("title")}</h1>
                    <p className="mt-5 text-lg leading-relaxed text-neutral-400">{t("subtitle")}</p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        {tasksWidget.microsoftStoreUrl ? (
                            <a
                                href={tasksWidget.microsoftStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-track="tasks_widget_store_click"
                                data-track-place="microsoft_store"
                                className="inline-flex rounded-full bg-main px-7 py-3 font-semibold text-neutral-900 transition-transform duration-300 hover:scale-[1.03]"
                            >
                                {t("windowsButton")}
                            </a>
                        ) : (
                            <span className="inline-flex rounded-full border border-main/60 px-7 py-3 font-semibold text-main">{t("windowsLabel")}</span>
                        )}
                        {tasksWidget.googlePlayUrl ? (
                            <a
                                href={tasksWidget.googlePlayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-track="tasks_widget_store_click"
                                data-track-place="google_play"
                                className="inline-flex rounded-full border border-white/25 px-7 py-3 font-semibold text-white transition-colors hover:border-main hover:text-main"
                            >
                                {t("androidLabel")}
                            </a>
                        ) : (
                            <span className="inline-flex rounded-full border border-white/20 px-7 py-3 text-neutral-300">{t("androidLabel")}</span>
                        )}
                    </div>
                    <p className="mt-3 text-sm text-neutral-500">{t("requirements")}</p>
                </header>

                <div className="mt-10 overflow-hidden rounded-[22px] border border-main/20 shadow-2xl">
                    <Image
                        src={`/tasks-widget/${lang}/${hero}.webp`}
                        alt={t("title")}
                        width={1600}
                        height={900}
                        priority
                        sizes="(min-width: 1100px) 1100px, 100vw"
                        className="h-auto w-full"
                    />
                </div>

                <section className="mt-16">
                    <h2 className="mb-6 text-3xl font-semibold">{t("featuresTitle")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {features.map((feature) => (
                            <div key={feature.t} className="rounded-[18px] border border-main/20 bg-white/[0.045] p-6">
                                <h3 className="text-xl font-semibold text-white">{feature.t}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{feature.d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <h2 className="mb-6 text-3xl font-semibold">{t("howTitle")}</h2>
                    <ol className="grid gap-4 md:grid-cols-2">
                        {steps.map((step, index) => (
                            <li key={step} className="flex items-start gap-4 rounded-[18px] border border-main/20 bg-white/[0.045] p-5">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-main bg-neutral-950 text-sm font-semibold text-main">
                                    {index + 1}
                                </span>
                                <span className="text-[15px] leading-relaxed text-neutral-300">{step}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-5 text-neutral-400">
                        {t("templateText")}{" "}
                        <Link href="/templates/taskhub" className="text-main underline underline-offset-4">
                            {t("templateCta")}
                        </Link>
                    </p>
                </section>

                <section className="mt-16">
                    <h2 className="mb-6 text-3xl font-semibold">{t("screenshotsTitle")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {gallery.map((name) => (
                            <div key={name} className="overflow-hidden rounded-[18px] border border-main/20">
                                <Image
                                    src={`/tasks-widget/${lang}/${name}.webp`}
                                    alt={`${t("title")} - ${name}`}
                                    width={1600}
                                    height={900}
                                    sizes="(min-width: 768px) 540px, 100vw"
                                    className="h-auto w-full"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
