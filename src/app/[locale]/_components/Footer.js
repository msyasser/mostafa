import { useLocale, useTranslations } from "next-intl";

import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTelegram,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import AnimatedInView from "./AnimatedInView";
import FooterSubscriptionForm from "./FooterSubscriptionForm";

function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <AnimatedInView threshold={0.3}>
      <div className="max-w-7xl mx-auto px-6 pt-20 lg:pt-40 pb-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Column 1: Logo & About */}
        <div className="space-y-6">
          <Link href={`/${locale}`} className="inline-block">
            <Image
              src="/logos/lightLogo.webp"
              alt="Mostafa Yasser logo"
              height={140}
              width={140}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          <div className={`scale-90 ${locale === 'ar' ? 'origin-right' : 'origin-left'}`}>
            <FooterSubscriptionForm />
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-main font-semibold text-lg uppercase tracking-wider">
              {t("follow")}
              <div className="w-8 h-0.5 bg-main rounded-full mt-1"></div>
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: BsFacebook, link: "https://facebook.com/engmsyasser", label: "Facebook" },
                { icon: BsTwitterX, link: "https://x.com/engmsyasser", label: "Twitter" },
                { icon: BsInstagram, link: "https://instagram.com/engmsyasser", label: "Instagram" },
                { icon: BsLinkedin, link: "https://linkedin.com/in/engmsyasser", label: "LinkedIn" },
                { icon: BsYoutube, link: "https://youtube.com/@engmsyasser", label: "YouTube" },
                { icon: BsTelegram, link: "https://t.me/mostafa_notion", label: "Telegram" },
              ].map(({ icon: Icon, link, label }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${label}`}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-main hover:border-main transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-6">
          <h4 className="text-main font-semibold text-lg uppercase tracking-wider border-b border-gray-800 pb-2">
            {t("quickLinks")}
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { label: t("links.home"), href: "/" },
              { label: t("links.services"), href: "/services" },
              { label: t("links.caseStudies"), href: "/case-studies" },
              { label: t("links.templates"), href: "/templates" },
              { label: t("links.blogs"), href: "/blog" },
              { label: t("links.tools"), href: "/tools" },
            ].map((link, idx) => (
              <Link
                key={idx}
                href={`/${locale}${link.href === "/" ? "" : link.href}`}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
              >
                <span className="w-1.5 h-px bg-gray-700 group-hover:bg-main group-hover:w-3 transition-all duration-300"></span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Information & Legal */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h4 className="text-main font-semibold text-lg uppercase tracking-wider border-b border-gray-800 pb-2">
              {t("information")}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { label: t("links.about"), href: "/about" },
                { label: t("links.contact"), href: "/contact" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}${link.href}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-px bg-gray-700 group-hover:bg-main group-hover:w-3 transition-all duration-300"></span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-main font-semibold text-lg uppercase tracking-wider border-b border-gray-800 pb-2">
              {t("legal")}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { label: t("privacy"), href: "/privacy-policy" },
                { label: t("terms"), href: "/terms-of-service" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={`/${locale}${link.href}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-px bg-gray-700 group-hover:bg-main group-hover:w-3 transition-all duration-300"></span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Premium Systems */}
        <div className="space-y-6">
          <h4 className="text-main font-semibold text-lg uppercase tracking-wider border-b border-gray-800 pb-2">
            {t("premiumTemplates")}
          </h4>
          <div className="flex flex-col gap-4">
            {[
              { label: t("templates.secondBrain"), href: "/templates/second-brain" },
              { label: t("templates.studyHub"), href: "/templates/study-hub" },
              { label: t("templates.financeHub"), href: "/templates/finance-hub" },
            ].map((template, idx) => (
              <Link
                key={idx}
                href={`/${locale}${template.href}`}
                className="p-3 bg-white/5 rounded-xl border border-gray-800 hover:border-main/50 hover:bg-white/[0.08] transition-all duration-300 group"
              >
                <span className="block text-white font-medium text-sm group-hover:text-main transition-colors">
                  {template.label}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">View System</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />
      </div>

      <div
        className="max-w-7xl mx-auto px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400"
        dir="ltr"
      >
        <p className="text-center md:text-left">{t("copyright")}</p>
        <p className="text-center md:text-right">
          <a
            href="https://arab-os.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-main transition flex items-center justify-center md:justify-end gap-1.5 group"
          >
            <span className="text-xs font-light">{t("poweredBy")}</span>
            <span className="text-gray-600 self-center hidden md:inline">•</span>
            <span className="text-white font-medium group-hover:text-main transition-colors flex items-center gap-1">
              Arab OS
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[10px]">
                ↗
              </span>
            </span>

          </a>
        </p>

      </div>
    </AnimatedInView>
  );
}

export default Footer;
