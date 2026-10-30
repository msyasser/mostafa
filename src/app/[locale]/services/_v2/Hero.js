import Image from "next/image";
import { useTranslations } from "next-intl";
import { BsArrowRight } from "react-icons/bs";
import { clients } from "../_data/clients";
import { CREDLY_BADGE_URL } from "@/src/app/[locale]/_data/credentials";

const tile = "rounded-[22px] border border-main/20 bg-white/[0.045] p-5 backdrop-blur-sm";

export default function Hero() {
    const t = useTranslations("ServicesPage.v2.hero");

    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_85%_-5%,rgba(215,177,128,0.14),transparent_60%),radial-gradient(600px_500px_at_-5%_40%,rgba(100,67,52,0.25),transparent_60%)]" />

            <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-12 pt-16 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
                <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                        {t("badge")}
                    </span>
                    <h1 className="mb-5 mt-4 text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-[66px]">
                        {t("titleStart")}
                        <em className="not-italic text-main">{t("titleEm")}</em>
                        {t("titleEnd")}
                    </h1>
                    <p className="mb-7 max-w-[520px] text-lg text-neutral-400 sm:text-[19px]">{t("subtitle")}</p>

                    <div id="services-hero-cta" className="flex flex-wrap gap-3">
                        <a
                            href="#calendar-section"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-main px-8 py-3.5 text-[15px] font-semibold text-neutral-900 transition-transform duration-300 hover:scale-[1.03]"
                        >
                            {t("ctaBook")} <BsArrowRight className="rtl:rotate-180" />
                        </a>
                        <a
                            href="#case-studies"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:border-main hover:text-main"
                        >
                            {t("ctaCases")}
                        </a>
                    </div>
                    <p className="mt-3 text-[13px] text-neutral-400">{t("note")}</p>
                </div>

                <div className="grid grid-cols-6 gap-3.5">
                    <div className="col-span-6 rounded-[22px] bg-gradient-to-br from-main to-[#be9462] p-5 text-neutral-900 sm:col-span-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                            {t("ratingLabel")}
                        </span>
                        <div className="flex items-end gap-3.5">
                            <div className="text-[54px] font-semibold leading-none"><bdi dir="ltr">{t("ratingValue")}</bdi></div>
                            <div>
                                <div className="text-lg tracking-[3px]" aria-hidden="true">★★★★★</div>
                                <div className="text-[13px] opacity-75">{t("ratingText")}</div>
                            </div>
                        </div>
                    </div>

                    <div className={`${tile} col-span-3 sm:col-span-2`}>
                        <div className="text-5xl font-semibold leading-none text-main"><bdi dir="ltr">{t("systemsValue")}</bdi></div>
                        <div className="mt-1.5 text-[13px] text-neutral-300">{t("systemsLabel")}</div>
                    </div>

                    <a
                        href={CREDLY_BADGE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${tile} col-span-6 flex items-center gap-3.5 transition-colors hover:border-main/60 sm:col-span-3`}
                    >
                        <Image
                            src="/badges/notion-consulting-partner.webp"
                            alt={t("badgeTitle")}
                            width={272}
                            height={480}
                            className="h-[84px] w-auto"
                        />
                        <div>
                            <b className="block text-[19px] font-semibold leading-tight text-white">{t("badgeTitle")}</b>
                            <span className="text-[13px] text-neutral-300">{t("badgeNote")}</span>
                        </div>
                    </a>

                    <div className={`${tile} col-span-3 sm:col-span-3`}>
                        <div className="text-5xl font-semibold leading-none text-main"><bdi dir="ltr">{t("downloadsValue")}</bdi></div>
                        <div className="mt-1.5 text-[13px] text-neutral-300">{t("downloadsLabel")}</div>
                    </div>

                    <div className={`${tile} col-span-6`}>
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-main rtl:text-sm rtl:tracking-normal rtl:[font-family:inherit]">
                            {t("clientsTitle")}
                        </span>
                        <ul className="mt-3 flex flex-wrap gap-2.5">
                            {clients.map((client) => (
                                <li
                                    key={client.name}
                                    title={client.name}
                                    className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/15"
                                >
                                    <Image src={client.logo} alt={client.name} fill sizes="44px" className="object-cover" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
