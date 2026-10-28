import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  BsArrowDown,
  BsCameraVideo,
  BsCheck2,
  BsClock,
  BsPatchCheckFill,
  BsTag,
  BsTranslate,
} from "react-icons/bs";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import AnimatedWrapper from "@/src/app/[locale]/_components/AnimatedWrapper";
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

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-main px-8 py-3 font-bold text-neutral-900 shadow-xl shadow-main/20 transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main";

export default function ConsultationPage() {
  const t = useTranslations("ConsultationPage");

  const details = [
    { icon: BsTag, label: t("details.price"), value: t("details.priceValue") },
    { icon: BsClock, label: t("details.duration"), value: t("details.durationValue") },
    { icon: BsCameraVideo, label: t("details.meeting"), value: t("details.meetingValue") },
    { icon: BsTranslate, label: t("details.languages"), value: t("details.languagesValue") },
  ];

  return (
    <BlurText>
      <main className="min-h-screen bg-neutral-950 text-white selection:bg-main selection:text-neutral-900">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-14 pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-main/10 blur-[130px]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <AnimatedWrapper>
              <div className="mb-8 flex items-center gap-10">
                <div className="relative shrink-0">
                  <div className="relative size-24 overflow-hidden rounded-full bg-neutral-900 ring-2 ring-main/70 ring-offset-4 ring-offset-neutral-950 sm:size-28">
                    <Image
                      src="/about/mostafa-portrait.svg"
                      alt="Mostafa Yasser"
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                  <Image
                    src="/badges/notion-consulting-partner.webp"
                    alt={t("hero.badgeAlt")}
                    width={272}
                    height={480}
                    unoptimized
                    className="absolute -bottom-4 -end-8 h-20 w-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)] sm:h-24"
                  />
                </div>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs text-main sm:text-sm">
                    <BsPatchCheckFill aria-hidden="true" />
                    {t("hero.badge")}
                  </span>
                  <p className="text-sm text-neutral-300 sm:text-base">{t("hero.note")}</p>
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {t("hero.titleStart")} <span className="text-main">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-xl">
                {t("hero.subtitle")}
              </p>

              <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 px-4 py-3"
                  >
                    <Icon aria-hidden="true" className="shrink-0 text-lg text-main" />
                    <div>
                      <dt className="text-xs text-neutral-400">{label}</dt>
                      <dd className="font-semibold text-white">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <Link href="#book" className={`${primaryButton} mt-10`}>
                {t("hero.cta")}
                <BsArrowDown aria-hidden="true" />
              </Link>
            </AnimatedWrapper>
          </div>
        </section>

        {/* Calendar */}
        <section id="book" className="scroll-mt-28 px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold md:text-4xl">{t("book.title")}</h2>
              <p className="mt-2 text-neutral-400">{t("book.subtitle")}</p>
            </div>
            <div className="min-h-[650px] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl sm:p-4">
              <ConsultationCalendar />
            </div>
          </div>
        </section>

        {/* What we'll cover */}
        <section className="border-t border-neutral-800 bg-neutral-900/40 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold md:text-4xl">{t("cover.title")}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.raw("cover.items").map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-main/15 text-main">
                    <BsCheck2 aria-hidden="true" className="text-xl" />
                  </span>
                  <span className="text-lg leading-relaxed text-neutral-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who it's for */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold md:text-4xl">{t("audience.title")}</h2>
            <p className="mt-6 text-lg text-neutral-300">{t("audience.intro")}</p>
            <ul className="mt-4 space-y-3">
              {t.raw("audience.items").map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-neutral-100">
                  <BsCheck2 aria-hidden="true" className="mt-1 shrink-0 text-xl text-main" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl text-neutral-400">{t("audience.outro")}</p>
          </div>
        </section>

        {/* Reviews of the templates, from the Notion Marketplace */}
        <Reviews />

        {/* Final call to action */}
        <section className="px-6 pb-28">
          <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">{t("final.title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">{t("final.text")}</p>
            <Link href="#book" className={`${primaryButton} mt-8`}>
              {t("final.cta")}
            </Link>
          </div>
        </section>
      </main>
    </BlurText>
  );
}
