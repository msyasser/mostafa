import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

export default function Process() {
    const t = useTranslations("ServicesPage.v2.process");
    const steps = t.raw("steps");

    return (
        <section className="px-6 py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <ol className="grid rounded-[26px] border border-main/20 bg-white/[0.045] p-2.5 backdrop-blur-sm md:grid-cols-5">
                    {steps.map((step, index) => (
                        <li
                            key={step.t}
                            className="border-b border-dashed border-main/20 p-6 last:border-b-0 md:border-b-0 md:border-e md:last:border-e-0"
                        >
                            <span className="mb-2.5 block text-4xl font-semibold text-main">{String(index + 1).padStart(2, "0")}</span>
                            <h3 className="mb-1 text-[19px] font-semibold text-white">{step.t}</h3>
                            <p className="text-sm text-neutral-400">{step.d}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
