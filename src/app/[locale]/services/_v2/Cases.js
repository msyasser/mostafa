import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import SectionHead from "./SectionHead";

// Screenshots of the real systems, cropped to the dashboard so the interface is readable at card size
const images = {
    "gold-investment-tracking-system": "/projects/Gold Tracker/Services-card.webp",
    "resaltk-research-app-project-management": "/projects/Resaltk/Services-card.webp",
    "trend-design-business-operating-system": "/projects/Trend Design/Services-card.webp",
};

export default function Cases() {
    const t = useTranslations("ServicesPage.v2.cases");
    const items = t.raw("items");

    return (
        <section id="case-studies" className="scroll-mt-24 px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <div className="grid gap-4 md:grid-cols-3">
                    {items.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/case-studies/${item.slug}`}
                            className="group block overflow-hidden rounded-[22px] border border-main/20 bg-white/[0.045] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-main"
                        >
                            <div className="relative aspect-[3/2] overflow-hidden border-b border-main/20 bg-black">
                                <Image
                                    src={images[item.slug]}
                                    alt={item.t}
                                    fill
                                    sizes="(min-width: 768px) 380px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="px-6 pb-7 pt-5">
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">{item.tag}</span>
                                <h3 className="my-2 text-[23px] font-semibold leading-tight text-white">{item.t}</h3>
                                <p className="text-[15px] text-neutral-400">{item.d}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.tools.map((tool) => (
                                        <span key={tool} className="rounded-md border border-white/25 px-2.5 py-0.5 font-mono text-[11px] text-neutral-200">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                                <span className="mt-4 inline-block text-[15px] font-semibold text-main">
                                    {t("view")} <span className="inline-block transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
