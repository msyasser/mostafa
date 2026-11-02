import { useTranslations } from "next-intl";

export default function CaseStudiesHero() {
    const t = useTranslations("CaseStudiesPage");

    return (
        <section className="pb-10 pt-12 md:pb-14 md:pt-20">
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                {t("portfolioBadge")}
            </span>
            <h1 className="mt-3 text-5xl font-semibold leading-[1.1] md:text-6xl">
                {t("selected")} <span className="text-main">{t("works")}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">{t("heroDesc")}</p>
        </section>
    );
}
