"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";

export default function HomeRoutingSection() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  const routes = [
    {
      id: "templates",
      number: "01",
      title: t("routingTemplatesTitle"),
      description: t("routingTemplatesDesc"),
      btnText: t("routingTemplatesBtn"),
      href: `/${locale}/templates`,
    },
    {
      id: "courses",
      number: "02",
      title: t("routingCoursesTitle"),
      description: t("routingCoursesDesc"),
      btnText: t("routingCoursesBtn"),
      href: `/${locale}/courses`,
    },
    {
      id: "services",
      number: "03",
      title: t("routingServicesTitle"),
      description: t("routingServicesDesc"),
      btnText: t("routingServicesBtn"),
      href: `/${locale}/services`,
    },
  ];

  return (
    <section id="routing-section" className="w-full pt-24 pb-6 px-4 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <AnimatedInView threshold={0.1}>
            <h2 className="text-3xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white tracking-tight">
              {t("routingTitle")}
            </h2>
          </AnimatedInView>
          <AnimatedInView threshold={0.1}>
            <p className="text-gray-300 text-base sm:text-xl max-w-2xl mt-3">{t("routingSubtitle")}</p>
          </AnimatedInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <AnimatedWrapper key={route.id} delay={index * 0.12} className="h-full">
              <Link
                href={route.href}
                className="group h-full min-h-[280px] flex flex-col p-7 rounded-md bg-[#14110F] border border-[#3a3027] hover:border-main/60 transition-colors duration-300"
              >
                <span className="text-main text-lg tracking-[0.2em]">{route.number}</span>
                <h3 className="mt-11 mb-3 text-2xl sm:text-3xl font-semibold uppercase rtl:normal-case rtl:font-extrabold text-white leading-tight">
                  {route.title}
                </h3>
                <p className="text-neutral-300 text-base leading-relaxed flex-1">{route.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-main font-semibold uppercase tracking-[0.1em] rtl:tracking-normal rtl:normal-case text-sm sm:text-base">
                  {route.btnText}
                  <ArrowIcon className="text-lg transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
