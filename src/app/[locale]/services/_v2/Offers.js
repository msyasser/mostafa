import { useTranslations } from "next-intl";
import SectionHead from "./SectionHead";

// Grid positions of the five tiles on large screens (the second one is the gold tile)
const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

export default function Offers() {
    const t = useTranslations("ServicesPage.v2.offers");
    const items = t.raw("items");

    return (
        <section className="px-6 py-12 md:py-[70px]">
            <div className="mx-auto max-w-[1200px]">
                <SectionHead eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
                <div className="grid gap-4 lg:grid-cols-6">
                    {items.map((item, index) => {
                        const gold = index === 1;
                        return (
                            <div
                                key={item.t}
                                className={`relative overflow-hidden rounded-[26px] p-7 ${spans[index]} ${
                                    gold
                                        ? "bg-gradient-to-br from-main to-[#be9462] text-neutral-900"
                                        : "border border-main/20 bg-white/[0.045] backdrop-blur-sm"
                                }`}
                            >
                                <span
                                    className={`absolute end-5 top-3.5 text-6xl font-semibold leading-none ${gold ? "text-neutral-900/20" : "text-main/25"}`}
                                    aria-hidden="true"
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className={`mb-2 mt-9 max-w-[88%] text-2xl font-semibold ${gold ? "" : "text-white"}`}>{item.t}</h3>
                                <p className={`text-[15px] ${gold ? "text-neutral-800" : "text-neutral-400"}`}>{item.d}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
