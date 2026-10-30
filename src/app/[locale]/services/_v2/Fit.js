import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

export default function Fit() {
    const t = useTranslations("ServicesPage.v2.fit");

    return (
        <section className="px-6 py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
                    <div className="rounded-[26px] border border-main/20 bg-white/[0.045] p-7 backdrop-blur-sm">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">{t("goodFitTitle")}</span>
                        <ul className="mt-3">
                            {t.raw("goodFit").map((item) => (
                                <li
                                    key={item}
                                    className="relative py-1.5 ps-7 text-[15px] text-neutral-200 before:absolute before:start-0 before:top-1.5 before:font-semibold before:text-main before:content-['✓']"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-[26px] border border-main/20 bg-white/[0.045] p-7 backdrop-blur-sm">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">{t("howTitle")}</span>
                        <div className="mt-3.5 grid gap-x-7 gap-y-4 sm:grid-cols-2">
                            {t.raw("how").map((item) => (
                                <div key={item.t}>
                                    <h3 className="mb-0.5 text-xl font-semibold text-white">{item.t}</h3>
                                    <p className="text-sm text-neutral-400">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
