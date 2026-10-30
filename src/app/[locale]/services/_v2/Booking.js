import { useTranslations } from "next-intl";
import CalConsultation from "../_components/CalConsultation";

export default function Booking() {
    const t = useTranslations("ServicesPage.v2.booking");

    return (
        <section id="calendar-section" className="scroll-mt-24 px-6 pb-24 pt-[70px]">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:tracking-normal">{t("eyebrow")}</span>
                    <h2 className="mb-4 mt-2 text-4xl font-semibold leading-[1.08] text-white md:text-5xl">{t("title")}</h2>
                    <p className="mx-auto max-w-xl text-lg text-neutral-400">{t("desc")}</p>
                </div>
                <div className="min-h-[650px] overflow-hidden rounded-[26px] border border-main/20 bg-neutral-950 p-2 shadow-2xl sm:p-4">
                    <CalConsultation />
                </div>
                <p className="mt-4 text-center text-xs text-neutral-400">{t("note")}</p>
            </div>
        </section>
    );
}
