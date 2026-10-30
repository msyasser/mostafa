import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

export default function Process() {
    const t = useTranslations("ServicesPage.v2.process");
    const steps = t.raw("steps");

    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
                <ol className="grid md:grid-cols-5">
                    {steps.map((step, index) => (
                        <li key={step.t} className="relative pb-8 ps-14 last:pb-0 md:pb-0 md:pe-6 md:ps-0 md:pt-14">
                            <span className="absolute start-0 top-0 z-10 grid size-10 place-items-center rounded-full border border-main bg-neutral-950 text-sm font-semibold text-main">
                                {index + 1}
                            </span>
                            {index < steps.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-0 start-5 top-10 w-px bg-main/30 md:bottom-auto md:end-0 md:start-10 md:top-5 md:h-px md:w-auto"
                                />
                            )}
                            <h3 className="mb-1 text-[19px] font-semibold text-white">{step.t}</h3>
                            <p className="text-sm text-neutral-400">{step.d}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
