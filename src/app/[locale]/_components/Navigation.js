"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import AnimatedLogo from "./AnimatedLogo";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const tt = useTranslations("TemplateSlug");
  const tc = useTranslations("Categories");
  const [menuOpen, setMenuOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);
  const [hostname, setHostname] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  useEffect(() => {
    setMounted(true);
    setHostname(window.location.hostname);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setResOpen(false);
    setTplOpen(false);
  }, [pathname]);

  const isDev = process.env.NODE_ENV === "development";
  const isLocalHost = mounted && (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("localhost"));
  const isPreview = mounted && hostname.includes(".vercel.app");
  const isLocalOrPreview = isDev || isLocalHost || isPreview;

  const isTemplatesSubdomain = !isLocalOrPreview && mounted && hostname.startsWith("templates.");
  const isCoursesSubdomain = !isLocalOrPreview && mounted && hostname.startsWith("courses.");
  const isSubdomain = isTemplatesSubdomain || isCoursesSubdomain;

  const mainUrl = (path = "") => {
    const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
    if (isSubdomain) {
      return `https://www.mostafayasser.com/${locale}${cleanPath}`;
    }
    return `/${locale}${cleanPath}`;
  };

  const subdomainUrl = (sub) => {
    if (isLocalOrPreview) {
      return `/${locale}/${sub}`;
    }
    return `https://${sub}.mostafayasser.com/${locale}`;
  };

  const links = [
    { id: "home", name: t("HOME"), to: "", href: mainUrl("") },
    { id: "templates", name: t("TEMPLATES"), to: "templates", href: isTemplatesSubdomain ? `/${locale}` : subdomainUrl("templates") },
    { id: "courses", name: t("COURSES"), to: "courses", href: isCoursesSubdomain ? `/${locale}` : subdomainUrl("courses") },
    { id: "tools", name: t("TOOLS"), to: "tools", href: mainUrl("tools") },
    { id: "blog", name: t("BLOGS"), to: "blog", href: mainUrl("blog") },
  ];

  // Mega menu content: real categories (they filter the templates page), real premium and free templates
  const megaCategories = ["productivity", "education", "finance", "islam", "challenges", "lifestyle", "health", "content"];
  const megaPremium = [
    { name: "Second Brain", slug: "second-brain" },
    { name: "FinanceHub", slug: "finance-hub" },
    { name: "StudyHub", slug: "study-hub" },
  ];
  const megaFree = [
    { name: "TaskMaster", slug: "task-manager" },
    { name: "Weekly Planner", slug: "weekly-planner" },
    { name: "90-Day Challenge Premium", slug: "90-day-challenge-premium" },
    { name: "Study Planner", slug: "study-planner" },
  ];
  const ArrowIcon = locale === "ar" ? BsArrowLeft : BsArrowRight;
  const templatesHref = isTemplatesSubdomain ? `/${locale}` : subdomainUrl("templates");
  const categoryHref = (c) => `${templatesHref}${templatesHref.includes("?") ? "&" : "?"}category=${c}`;

  // Desktop header: Templates and Courses stay on the bar, Tools and Blog sit under "Resources"
  const primaryLinks = links.filter((l) => l.id === "templates" || l.id === "courses");
  const resourceLinks = links.filter((l) => l.id === "tools" || l.id === "blog");

  const isLinkActive = (link) => {
    if (link.id === "home" || link.to === "") {
      if (isSubdomain) return false;
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    if (link.id === "templates") {
      return isTemplatesSubdomain || (!isSubdomain && pathname.startsWith(`/${locale}/templates`));
    }
    if (link.id === "courses") {
      return isCoursesSubdomain || (!isSubdomain && pathname.startsWith(`/${locale}/courses`));
    }
    if (link.id === "tools") {
      return !isSubdomain && pathname.startsWith(`/${locale}/tools`);
    }
    if (link.id === "blog") {
      return !isSubdomain && pathname.startsWith(`/${locale}/blog`);
    }

    if (isSubdomain) return false;
    return pathname.startsWith(`/${locale}/${link.to}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-main/25 z-50 p-3 transition-all duration-300 ease-in-out">
      <BlurText duration={1}>
        <div className="flex justify-between items-center mx-auto max-w-7xl transition-all duration-300 ease-in-out">
          <Link
            href={mainUrl("")}
            className="hidden lg:flex items-center gap-2 pl-1 mt-0.5 shrink-0"
          >
            <AnimatedLogo className="h-7 w-auto" />
          </Link>

          {/* Desktop Menu: centered links, one quiet action on the right */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 gap-8">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link);
              if (link.id === "templates") {
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-1.5"
                    onMouseEnter={() => { setTplOpen(true); setResOpen(false); }}
                    onMouseLeave={() => setTplOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`hover:text-main transition-colors duration-300 font-medium ${active || tplOpen ? "text-main" : ""}`}
                    >
                      {link.name}
                    </Link>
                    <button
                      type="button"
                      aria-label={link.name}
                      aria-haspopup="menu"
                      aria-expanded={tplOpen}
                      onClick={() => setTplOpen((v) => !v)}
                      className="text-current hover:text-main cursor-pointer"
                    >
                      <svg className={`w-3 h-3 transition-transform duration-200 ${tplOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 4.5L6 8l3.5-3.5" />
                      </svg>
                    </button>
                  </div>
                );
              }
              return (
                <Link
                  href={link.href}
                  key={link.id}
                  className={`hover:text-main transition-colors duration-300 font-medium ${active ? "text-main" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div
              className="relative"
              onMouseEnter={() => { setResOpen(true); setTplOpen(false); }}
              onMouseLeave={() => setResOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={resOpen}
                onClick={() => setResOpen((v) => !v)}
                className={`flex items-center gap-1.5 font-medium hover:text-main transition-colors duration-300 cursor-pointer ${
                  resourceLinks.some(isLinkActive) ? "text-main" : ""
                }`}
              >
                {t("RESOURCES_MENU")}
                <svg className={`w-3 h-3 transition-transform duration-200 ${resOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 4.5L6 8l3.5-3.5" />
                </svg>
              </button>
              {resOpen && (
                <div role="menu" className="absolute top-full start-0 pt-3 z-50">
                  <div className="min-w-44 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-md shadow-2xl py-2">
                    {resourceLinks.map((link) => (
                      <Link
                        role="menuitem"
                        href={link.href}
                        key={link.id}
                        className={`block px-5 py-2.5 hover:bg-white/5 hover:text-main transition-colors ${isLinkActive(link) ? "text-main" : ""}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 min-h-[36px] ms-auto">
            <LanguageSwitcher />
            <UserMenu />
            <Link
              href={mainUrl("services")}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-neutral-700 text-[#F4D9B6] hover:border-main hover:text-main transition-colors duration-200 shrink-0"
            >
              {t("HIRE_ME")}
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div dir="ltr" className="lg:hidden flex justify-between items-center w-full px-2">
            <Link href={mainUrl("")} className="flex items-center shrink-0">
              <AnimatedLogo className="h-6 w-auto" />
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div
                className="relative flex flex-col justify-center items-center space-y-1 z-50 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out transform rounded-full mt-0.5 ${
                    menuOpen ? "rotate-45 absolute" : ""
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out rounded-full ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out transform rounded-full ${
                    menuOpen ? "rotate-135 absolute bottom-[3.1px]" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black backdrop-blur-md z-40 px-6 py-12 transition-all duration-300 ease-in-out flex flex-col ${
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center space-y-6 flex-1 overflow-y-auto w-full">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              return (
                <Link
                  href={link.href}
                  key={index}
                  className={`text-2xl font-semibold transition-all duration-300 ease-in-out hover:text-main ${
                    active ? "text-main" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link
                href={mainUrl("services")}
                className="px-10 py-3 rounded-full text-base font-bold bg-main text-black hover:brightness-110 active:scale-95 transition-all duration-200 shadow-xl shadow-main/25"
                onClick={() => setMenuOpen(false)}
              >
                {t("HIRE_ME")}
              </Link>
              <UserMenu inline onItemClick={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      </BlurText>

      {/* Templates mega menu */}
      {tplOpen && (
        <div
          role="menu"
          className="hidden lg:block absolute top-full inset-x-0 border-b border-[#3a3027] bg-[#14110F] shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          onMouseEnter={() => setTplOpen(true)}
          onMouseLeave={() => setTplOpen(false)}
        >
          <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-[0.8fr_1.7fr_0.9fr] gap-10">
            <div>
              <h5 className="text-main text-xs tracking-[0.2em] rtl:tracking-normal rtl:text-base uppercase rtl:normal-case font-semibold mb-3">{t("MEGA_BY_NEED")}</h5>
              {megaCategories.map((c) => (
                <Link key={c} href={categoryHref(c)} role="menuitem" className="block py-1.5 text-lg text-neutral-200 hover:text-main transition-colors">
                  {tc(c)}
                </Link>
              ))}
              <Link href={templatesHref} className="mt-3 inline-flex items-center gap-2 text-main font-semibold">
                {t("MEGA_ALL")}
                <ArrowIcon />
              </Link>
            </div>

            <div>
              <h5 className="text-main text-xs tracking-[0.2em] rtl:tracking-normal rtl:text-base uppercase rtl:normal-case font-semibold mb-3">{t("MEGA_PREMIUM")}</h5>
              <div className="grid grid-cols-3 gap-4">
                {megaPremium.map((tpl) => (
                  <Link key={tpl.slug} href={mainUrl(`templates/${tpl.slug}`)} role="menuitem" className="group block">
                    <Image
                      src={tt(`${tpl.name}.image`)}
                      alt={tt(`${tpl.name}.name`)}
                      width={400}
                      height={323}
                      unoptimized
                      className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:-translate-y-0.5"
                    />
                    <span className="mt-2 flex items-baseline justify-between gap-2 font-semibold uppercase rtl:normal-case">
                      <span className="group-hover:text-main transition-colors">{tt(`${tpl.name}.name`)}</span>
                      <span className="text-main">{tt(`${tpl.name}.price`)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-main text-xs tracking-[0.2em] rtl:tracking-normal rtl:text-base uppercase rtl:normal-case font-semibold mb-3">{t("MEGA_FREE")}</h5>
              {megaFree.map((tpl) => (
                <Link
                  key={tpl.slug}
                  href={mainUrl(`templates/${tpl.slug}`)}
                  role="menuitem"
                  className="flex items-center justify-between gap-3 py-2 border-b border-neutral-800 text-neutral-200 hover:text-main transition-colors"
                >
                  <span>{tt(`${tpl.name}.name`)}</span>
                  <span className="text-sm text-neutral-400">{locale === "ar" ? "مجاني" : "Free"}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


