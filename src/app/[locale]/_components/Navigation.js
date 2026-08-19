"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import AnimatedLogo from "./AnimatedLogo";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 p-3 transition-all duration-300 ease-in-out">
      <BlurText duration={1}>
        <div className="flex justify-between items-center mx-auto max-w-7xl transition-all duration-300 ease-in-out">
          <Link
            href={mainUrl("")}
            className="hidden lg:flex items-center gap-2 pl-1 mt-0.5 shrink-0"
          >
            <AnimatedLogo className="h-7 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 shrink-0">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              return (
                <Link
                  href={link.href}
                  key={index}
                  className={`hover:text-main transition-all duration-300 ease-in-out font-medium ${
                    active ? "text-main" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-3 ml-2 shrink-0 min-h-[36px]">
              <LanguageSwitcher />
              <Link
                href={mainUrl("services")}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-main text-black hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-lg shadow-main/30 shrink-0"
              >
                {t("HIRE_ME")}
              </Link>
              <UserMenu />
            </div>
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
    </nav>
  );
}


