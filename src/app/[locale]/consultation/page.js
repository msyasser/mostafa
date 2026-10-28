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

const container = "mx-auto w-full max-w-[1400px] px-6 sm:px-12 lg:px-20";
const sectionTitle =
  "text-4xl font-bold uppercase leading-none tracking-tight sm:text-6xl rtl:normal-case rtl:leading-tight";
const buttonBase =
  "inline-flex min-h-14 items-center gap-3 px-8 py-4 text-lg font-bold uppercase tracking-wide transition-transform duration-150 hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none sm:px-12 sm:py-6 sm:text-2xl rtl:normal-case";
const primaryButton = `${buttonBase} bg-main text-neutral-950 shadow-[8px_8px_0_#644334] hover:shadow-[5px_5px_0_#644334]`;
const darkButton = `${buttonBase} bg-neutral-950 text-[#F4D9B6] shadow-[8px_8px_0_#644334] hover:shadow-[5px_5px_0_#644334]`;

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
          className="-mx-10 mt-24 -rotate-[1.4deg] overflow-hidden whitespace-nowrap bg-main py-3 text-xl font-bold uppercase tracking-[0.2em] text-neutral-950 shadow-[0_18px_50px_#000c] sm:text-3xl"
        >
          {t("hero.ticker")}
        </div>

        {/* Hero */}
        <section className={`${container} pb-10 pt-14`}>
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-main sm:text-xl rtl:tracking-normal">
            {t("hero.badge")}
          </p>
          <h1 className="text-[clamp(3.2rem,10.4vw,11rem)] font-bold uppercase leading-[0.9] tracking-tight rtl:text-[clamp(2.7rem,8.2vw,8.2rem)] rtl:font-extrabold rtl:normal-case rtl:leading-[1.12] rtl:tracking-normal">
            {t("hero.titleStart")}{" "}
            <span className="inline-block border-b-[10px] border-main bg-gradient-to-r from-[#F4D9B6] via-[#D7B180] to-[#C49C6A] bg-clip-text text-transparent sm:border-b-[14px]">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_430px] lg:gap-20">
            <div className="order-2 lg:order-1">
              <p className="max-w-3xl text-xl leading-relaxed text-neutral-300 sm:text-3xl sm:leading-snug">
                {t("hero.subtitle")}
              </p>

              <dl className="mt-9 border-t-[3px] border-white">
                {details.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 border-b border-neutral-800 py-4 text-lg sm:text-3xl"
                  >
                    <dt className="text-neutral-300">{label}</dt>
                    <dd className="font-bold text-main">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-col items-start gap-5">
                <Link href="#book" className={primaryButton}>
                  {t("hero.cta")}
                  <BsArrowDown aria-hidden="true" />
                </Link>
                <p className="text-base text-neutral-300 sm:text-lg">{t("hero.note")}</p>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-[430px] lg:order-2 lg:max-w-none">
              <div className="relative border-4 border-main shadow-[10px_10px_0_#644334] sm:shadow-[18px_18px_0_#644334]">
                <Image
                  src="/about/mostafa-portrait.svg"
                  alt="Mostafa Yasser"
                  width={860}
                  height={960}
                  sizes="(min-width: 1024px) 430px, 90vw"
                  className="aspect-[1/1.12] w-full bg-neutral-900 object-cover"
                  unoptimized
                  priority
                />
                <div className="absolute -top-8 -end-4 flex size-28 rotate-12 flex-col items-center justify-center rounded-full bg-main text-neutral-950 shadow-[0_14px_34px_#000a] sm:-top-11 sm:-end-10 sm:size-40">
                  <span className="text-xs font-bold uppercase tracking-widest sm:text-base rtl:tracking-normal">
                    {t("hero.sticker")}
                  </span>
                  <span className="text-5xl font-bold leading-none sm:text-7xl">
                    {t("details.priceValue")}
                  </span>
                </div>
                <Image
                  src="/badges/notion-consulting-partner.webp"
                  alt={t("hero.badgeAlt")}
                  width={272}
                  height={480}
                  unoptimized
                  className="absolute -bottom-8 -start-6 h-28 w-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.8)] sm:-start-10 sm:h-40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section id="book" className={`${container} scroll-mt-28 py-20`}>
          <h2 className={sectionTitle}>{t("book.title")}</h2>
          <p className="mb-8 mt-3 text-lg text-neutral-300 sm:text-2xl">{t("book.subtitle")}</p>
          <div className="min-h-[650px] border-4 border-white bg-neutral-900 p-2 shadow-[8px_8px_0_#D7B180] sm:p-4 sm:shadow-[14px_14px_0_#D7B180]">
            <ConsultationCalendar />
          </div>
        </section>

        {/* What we'll cover */}
        <section className={`${container} py-16`}>
          <h2 className={`${sectionTitle} mb-10 text-main`}>{t("cover.title")}</h2>
          <ol className="border-b-[3px] border-white">
            {t.raw("cover.items").map((item, i) => (
              <li
                key={item}
                className="grid grid-cols-[4.5rem_1fr] items-center gap-4 border-t-[3px] border-white py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
              >
                <span aria-hidden="true" className="text-6xl font-bold leading-none text-main sm:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl leading-tight sm:text-4xl">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Who it's for */}
        <section className={`${container} py-16`}>
          <h2 className={`${sectionTitle} mb-8`}>{t("audience.title")}</h2>
          <p className="mb-6 text-xl text-neutral-300 sm:text-3xl">{t("audience.intro")}</p>
          <ul className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
            {t.raw("audience.items").map((item) => (
              <li key={item} className="flex items-start gap-4 border-t border-neutral-700 pt-4 text-xl sm:text-3xl">
                <span aria-hidden="true" className="mt-2 size-3 shrink-0 bg-main sm:mt-3 sm:size-4" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-lg text-neutral-300 sm:text-2xl">{t("audience.outro")}</p>
        </section>

        {/* Reviews */}
        <Reviews />

        {/* Final call to action */}
        <section className="mt-10 bg-main px-6 py-20 text-center text-neutral-950 sm:py-28">
          <h2 className="text-[clamp(2.8rem,9vw,8.5rem)] font-bold uppercase leading-[0.95] tracking-tight rtl:text-[clamp(2.4rem,7vw,6.5rem)] rtl:font-extrabold rtl:normal-case rtl:leading-[1.15] rtl:tracking-normal">
            {t("final.title")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium sm:text-2xl">{t("final.text")}</p>
          <Link href="#book" className={`${darkButton} mt-10`}>
            {t("final.cta")}
            <BsArrowDown aria-hidden="true" className="rotate-180" />
          </Link>
        </section>
      </main>
    </BlurText>
  );
}
