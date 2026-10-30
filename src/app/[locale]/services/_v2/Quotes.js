import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

export default function Quotes() {
    const t = useTranslations("ServicesPage.v2.quotes");
    const items = t.raw("items");

    return (
        <section className="px-6 pb-10 pt-8">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item, index) => {
                        const featured = index === 0;
                        return (
                            <figure
                                key={item.who}
                                className={
                                    featured
                                        ? "rounded-[26px] bg-gradient-to-br from-main to-[#be9462] p-8 text-neutral-900 md:p-10"
                                        : "rounded-[26px] border border-main/20 bg-white/[0.045] p-8 backdrop-blur-sm md:p-10"
                                }
                            >
                                <div
                                    className={`text-[80px] font-semibold leading-[0.55] ${featured ? "text-neutral-900/80" : "text-main/80"}`}
                                    aria-hidden="true"
                                >
                                    “
                                </div>
                                <blockquote className={`my-5 text-xl font-medium leading-relaxed md:text-[22px] ${featured ? "" : "text-white"}`}>
                                    {item.q}
                                </blockquote>
                                <figcaption>
                                    <b className="block font-semibold">{item.who}</b>
                                    <span className={`text-sm ${featured ? "text-neutral-800" : "text-neutral-400"}`}>{item.what}</span>
                                    <span className={`mt-3 block text-xs ${featured ? "text-neutral-800" : "text-neutral-400"}`}>
                                        {t("translated")}
                                    </span>
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
