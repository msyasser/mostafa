"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BsArrowRight, BsArrowLeft, BsGrid1X2, BsMortarboard, BsLightningCharge } from "react-icons/bs";
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
      icon: BsGrid1X2,
      title: t("routingTemplatesTitle"),
      description: t("routingTemplatesDesc"),
      btnText: t("routingTemplatesBtn"),
      href: `/${locale}/templates`,
      badge: isArabic ? "الأكثر طلباً" : "Most Popular",
      accent: "from-amber-500/20 via-amber-500/5 to-transparent",
      borderHover: "hover:border-amber-400/50",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(215,177,128,0.25)]",
    },
    {
      id: "courses",
      icon: BsMortarboard,
      title: t("routingCoursesTitle"),
      description: t("routingCoursesDesc"),
      btnText: t("routingCoursesBtn"),
      href: `/${locale}/courses`,
      badge: isArabic ? "تعلم الآن" : "Learn & Build",
      accent: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderHover: "hover:border-blue-400/50",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    },
    {
      id: "services",
      icon: BsLightningCharge,
      title: t("routingServicesTitle"),
      description: t("routingServicesDesc"),
      btnText: t("routingServicesBtn"),
      href: `/${locale}/services`,
      badge: isArabic ? "للشركات والفرق" : "For Teams",
      accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderHover: "hover:border-emerald-400/50",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    },
  ];

  return (
    <section className="w-full py-16 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <AnimatedInView threshold={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {t("routingTitle")}
            </h2>
          </AnimatedInView>
          <AnimatedInView threshold={0.1}>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-3">
              {t("routingSubtitle")}
            </p>
          </AnimatedInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {routes.map((route, index) => {
            const Icon = route.icon;
            return (
              <AnimatedWrapper key={route.id} delay={index * 0.15}>
                <Link
                  href={route.href}
                  className={`group relative h-full flex flex-col justify-between p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 ${route.borderHover} transition-all duration-500 ${route.glowColor} overflow-hidden backdrop-blur-sm`}
                >
                  {/* Subtle gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${route.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-800/90 flex items-center justify-center text-main border border-white/5 group-hover:scale-110 group-hover:bg-main group-hover:text-black transition-all duration-300">
                        <Icon className="text-2xl" />
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-800 text-gray-300 border border-neutral-700">
                        {route.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-main transition-colors duration-300">
                      {route.title}
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
                      {route.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-main font-semibold text-base sm:text-lg pt-4 border-t border-neutral-800/80 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                    <span>{route.btnText}</span>
                    <ArrowIcon className="text-xl" />
                  </div>
                </Link>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
