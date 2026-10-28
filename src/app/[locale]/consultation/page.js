import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BsArrowDown } from "react-icons/bs";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import ConsultationCalendar from "./_components/ConsultationCalendar";
import Reviews from "./_components/Reviews";

const SITE_URL = "https://www.mostafayasser.com";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ConsultationPage.meta" });
  const title = t("title");
  const description = t("description");
  const url = `${SITE_URL}/${locale}/consultation`;
  const imageUrl = `${SITE_URL}/icon.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const container = "mx-auto w-full max-w-6xl px-6 sm:px-10";
const sectionTitle =
  "text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl rtl:normal-case rtl:leading-tight";
const buttonBase =
  "inline-flex min-h-12 items-center gap-3 px-7 py-3.5 text-base font-bold uppercase tracking-wide transition-transform duration-150 hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none sm:px-9 sm:py-4 sm:text-xl rtl:normal-case";
const primaryButton = `${buttonBase} bg-main text-neutral-950 shadow-[6px_6px_0_#644334] hover:shadow-[4px_4px_0_#644334]`;
const darkButton = `${buttonBase} bg-neutral-950 text-[#F4D9B6] shadow-[6px_6px_0_#644334] hover:shadow-[4px_4px_0_#644334]`;

export default function ConsultationPage() {
  const t = useTranslations("ConsultationPage");

  const details = [
    { label: t("details.price"), value: t("details.priceValue") },
    { label: t("details.duration"), value: t("details.durationValue") },
    { label: t("details.meeting"), value: t("details.meetingValue") },
    { label: t("details.languages"), value: t("details.languagesValue") },
  ];

  return (
    <BlurText>
      <main className="min-h-screen overflow-x-clip bg-[#0C0B0A] text-white selection:bg-main selection:text-neutral-950">
        {/* Ticker */}
        <div
          aria-hidden="true"
          className="-mx-10 mt-24 -rotate-[1.2deg] overflow-hidden whitespace-nowrap bg-main py-2.5 text-base font-bold uppercase tracking-[0.18em] text-neutral-950 shadow-[0_14px_40px_#000c] sm:text-xl"
        >
          {t("hero.ticker")}
        </div>

        {/* Hero */}
        <section className={`${container} pb-8 pt-12`}>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-main sm:text-base rtl:tracking-normal">
            {t("hero.badge")}
          </p>
          <h1 className="text-[clamp(2.6rem,7.2vw,6.5rem)] font-bold uppercase leading-[0.95] tracking-tight rtl:text-[clamp(2.3rem,6vw,5.2rem)] rtl:font-extrabold rtl:normal-case rtl:leading-[1.15] rtl:tracking-normal">
            {t("hero.titleStart")}{" "}
            <span className="inline-block border-b-[7px] border-main bg-gradient-to-r from-[#F4D9B6] via-[#D7B180] to-[#C49C6A] bg-clip-text text-transparent sm:border-b-[9px]">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-2xl sm:leading-snug">
                {t("hero.subtitle")}
              </p>

              <dl className="mt-8 border-t-[3px] border-white">
                {details.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 border-b border-neutral-800 py-3.5 text-base sm:text-2xl"
                  >
                    <dt className="text-neutral-300">{label}</dt>
                    <dd className="font-bold text-main">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 flex flex-col items-start gap-4">
                <Link href="#book" className={primaryButton}>
                  {t("hero.cta")}
                  <BsArrowDown aria-hidden="true" />
                </Link>
                <p className="text-sm text-neutral-300 sm:text-base">{t("hero.note")}</p>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-[380px] lg:order-2 lg:max-w-none">
              <div className="relative border-[3px] border-main shadow-[8px_8px_0_#644334] sm:shadow-[12px_12px_0_#644334]">
                <Image
                  src="/about/mostafa-portrait.webp"
                  alt="Mostafa Yasser"
                  width={760}
                  height={850}
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="aspect-[1/1.12] w-full bg-neutral-900 object-cover"
                  unoptimized
                  priority
                />
                <Image
                  src="/badges/notion-consulting-partner.webp"
                  alt={t("hero.badgeAlt")}
                  width={272}
                  height={480}
                  unoptimized
                  className="absolute -bottom-6 -start-5 h-24 w-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.8)] sm:-start-8 sm:h-32"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section id="book" className={`${container} scroll-mt-28 py-16`}>
          <h2 className={sectionTitle}>{t("book.title")}</h2>
          <p className="mb-7 mt-3 text-base text-neutral-300 sm:text-xl">{t("book.subtitle")}</p>
          <div className="min-h-[650px] border-[3px] border-white bg-neutral-900 p-2 shadow-[6px_6px_0_#D7B180] sm:p-4 sm:shadow-[10px_10px_0_#D7B180]">
            <ConsultationCalendar />
          </div>
        </section>

        {/* What we'll cover */}
        <section className={`${container} py-14`}>
          <h2 className={`${sectionTitle} mb-8 text-main`}>{t("cover.title")}</h2>
          <ol className="border-b-2 border-white">
            {t.raw("cover.items").map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[3.5rem_1fr] items-center gap-4 border-t-2 border-white py-4 sm:grid-cols-[6rem_1fr] sm:gap-6"
              >
                <span aria-hidden="true" className="text-4xl font-bold leading-none text-main sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xl leading-snug sm:text-3xl">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Who it's for */}
        <section className={`${container} py-14`}>
          <h2 className={`${sectionTitle} mb-6`}>{t("audience.title")}</h2>
          <p className="mb-5 text-lg text-neutral-300 sm:text-2xl">{t("audience.intro")}</p>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {t.raw("audience.items").map((item) => (
              <li key={item} className="flex items-start gap-3 border-t border-neutral-700 pt-3 text-lg sm:text-2xl">
                <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 bg-main sm:mt-2.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-base text-neutral-300 sm:text-xl">{t("audience.outro")}</p>
        </section>

        {/* Reviews */}
        <Reviews />

        {/* Final call to action */}
        <section className="mt-8 bg-main px-6 py-16 text-center text-neutral-950 sm:py-20">
          <h2 className="text-[clamp(2.1rem,5.6vw,4.8rem)] font-bold uppercase leading-[1] tracking-tight rtl:text-[clamp(1.9rem,4.8vw,4rem)] rtl:font-extrabold rtl:normal-case rtl:leading-[1.2] rtl:tracking-normal">
            {t("final.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium sm:text-xl">{t("final.text")}</p>
          <Link href="#book" className={`${darkButton} mt-8`}>
            {t("final.cta")}
            <BsArrowDown aria-hidden="true" className="rotate-180" />
          </Link>
        </section>
      </main>
    </BlurText>
  );
}
