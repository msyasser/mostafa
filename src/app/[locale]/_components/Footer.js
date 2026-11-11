"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTelegram,
  BsTwitterX,
  BsYoutube,
  BsArrowRight,
  BsArrowLeft,
} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import AnimatedInView from "./AnimatedInView";
import SubscriptionForm from "./SubscriptionForm";

const SOCIALS = [
  { icon: BsFacebook, link: "https://facebook.com/engmsyasser", label: "Facebook" },
  { icon: BsTwitterX, link: "https://x.com/engmsyasser", label: "Twitter" },
  { icon: BsInstagram, link: "https://instagram.com/engmsyasser", label: "Instagram" },
  { icon: BsLinkedin, link: "https://linkedin.com/in/engmsyasser", label: "LinkedIn" },
  { icon: BsYoutube, link: "https://youtube.com/@engmsyasser", label: "YouTube" },
  { icon: BsTelegram, link: "https://t.me/mostafa_notion", label: "Telegram" },
];

function SocialIcons({ className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {SOCIALS.map(({ icon: Icon, link, label }) => (
        <a
          key={label}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit my ${label}`}
          className="w-9 h-9 rounded-full border border-[#4a382d] flex items-center justify-center text-neutral-400 hover:text-main hover:border-main transition-all duration-300"
        >
          <Icon size={14} />
        </a>
      ))}
    </div>
  );
}

function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const pathname = usePathname();
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  // On templates.mostafayasser.com and courses.mostafayasser.com a relative link like
  // /en/about is rewritten to /en/templates/about (a 404), so links to pages that
  // live on the main site must be absolute there. Same logic as Navigation.
  const [hostname, setHostname] = useState("");
  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const isLocalOrPreview =
    hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes(".vercel.app");
  const isTemplatesSubdomain = !isLocalOrPreview && hostname.startsWith("templates.");
  const isCoursesSubdomain = !isLocalOrPreview && hostname.startsWith("courses.");
  const isSubdomain = isTemplatesSubdomain || isCoursesSubdomain;

  const mainUrl = (path = "") =>
    isSubdomain ? `https://www.mostafayasser.com/${locale}${path}` : `/${locale}${path}`;
  // Templates and Courses live on their own subdomains in production (same as the header).
  const sectionUrl = (section) =>
    (section === "templates" ? isTemplatesSubdomain : isCoursesSubdomain)
      ? `/${locale}`
      : isLocalOrPreview || !hostname
        ? `/${locale}/${section}`
        : `https://${section}.mostafayasser.com/${locale}`;

  // The big "start here" block belongs to the home page only; every other page gets the slim footer.
  const isHome = !isSubdomain && (pathname === `/${locale}` || pathname === `/${locale}/`);

  const pages = [
    { label: t("links.templates"), href: sectionUrl("templates") },
    { label: t("links.courses"), href: sectionUrl("courses") },
    { label: t("links.tools"), href: mainUrl("/tools") },
    { label: t("links.blogs"), href: mainUrl("/blog") },
    { label: t("links.about"), href: mainUrl("/about") },
    { label: t("links.contact"), href: mainUrl("/contact") },
    { label: t("privacy"), href: mainUrl("/privacy-policy") },
    { label: t("terms"), href: mainUrl("/terms-of-service") },
  ];

  return (
    <footer className="mt-20 sm:mt-24">
      {isHome ? (
        <AnimatedInView threshold={0.1}>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-10 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-main text-xs sm:text-sm tracking-[0.22em] rtl:tracking-normal uppercase">
                {t("ctaEyebrow")}
              </p>
              <h2 className="mt-2.5 mb-4 text-4xl sm:text-5xl font-semibold uppercase rtl:normal-case rtl:font-extrabold leading-[1.05] rtl:leading-[1.3]">
                {t("ctaTitle")}
              </h2>
              <p className="text-lg sm:text-xl text-neutral-300 max-w-xl mb-6 leading-relaxed">{t("ctaText")}</p>
              <div className="flex flex-wrap gap-3.5">
                <Link
                  href={sectionUrl("templates")}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-main text-neutral-950 font-bold uppercase tracking-[0.06em] rtl:tracking-normal rtl:normal-case hover:bg-white transition-colors"
                >
                  {t("ctaTemplates")}
                  <ArrowIcon />
                </Link>
                <Link
                  href={sectionUrl("courses")}
                  className="inline-flex items-center px-7 py-3.5 rounded-full border-[1.5px] border-[#3a3027] text-[#F4D9B6] font-bold uppercase tracking-[0.06em] rtl:tracking-normal rtl:normal-case hover:border-main hover:text-main transition-colors"
                >
                  {t("ctaCourse")}
                </Link>
              </div>
            </div>

            {/* Subscribe box */}
            <div className="rounded-xl bg-[#33261f] p-7 sm:p-8">
              <h3 className="text-2xl font-semibold text-[#F4D9B6] mb-1.5">{t("subTitle")}</h3>
              <p className="text-[#cdbfb2] text-base mb-5">{t("subNote")}</p>
              <SubscriptionForm
                buttonText={isArabic ? "اشترك" : "Subscribe"}
                className="flex w-full"
                inputClassName="flex-1 min-w-0 px-4 py-3 bg-[#241b16] border border-[#4a382d] text-white placeholder:text-neutral-400 rounded-s-md focus:outline-none focus:border-main"
                buttonClassName="px-5 py-3 bg-main text-neutral-950 font-bold rounded-e-md uppercase tracking-wide rtl:tracking-normal rtl:normal-case cursor-pointer hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <SocialIcons className="mt-5" />
            </div>
          </div>
        </AnimatedInView>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href={mainUrl()} className="inline-block">
            <Image
              src="/logos/lightLogo.webp"
              alt="Mostafa Yasser logo"
              height={30}
              width={110}
              className="h-7 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <SocialIcons />
        </div>
      )}

      {/* Pages row: custom work is a quiet gold link, the copyright closes the row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-neutral-800 py-5 text-base text-neutral-300"
        >
          {pages.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href={mainUrl("/services")} className="text-main font-semibold hover:text-white transition-colors">
            {t("customSystems")} <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
          </Link>
          <span className="flex-1 hidden lg:block" />
          <span className="basis-full lg:basis-auto text-sm text-neutral-400">
            <span dir="auto" suppressHydrationWarning>
              {t("copyright", { year: new Date().getFullYear() })}
            </span>
          </span>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
