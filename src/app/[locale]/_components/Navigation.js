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
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
    setActiveDropdown(null);
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
    { name: t("HOME"), to: "", href: mainUrl("") },
    {
      name: t("CONTENT"),
      dropdown: true,
      items: [
        { id: "templates", name: t("TEMPLATES"), href: isTemplatesSubdomain ? `/${locale}` : subdomainUrl("templates") },
        { id: "courses", name: t("COURSES"), href: isCoursesSubdomain ? `/${locale}` : subdomainUrl("courses") },
        { id: "tools", name: t("TOOLS"), href: mainUrl("tools") },
        { id: "blog", name: t("BLOGS"), href: mainUrl("blog") }
      ]
    },
    { name: t("ABOUT_ME"), to: "about", href: mainUrl("about") },
    { name: t("CONTACT"), to: "contact", href: mainUrl("contact") },
  ];

  const isLinkActive = (link) => {
    if (link.dropdown) {
      if (isTemplatesSubdomain || isCoursesSubdomain) return true;
      return (
        pathname.startsWith(`/${locale}/templates`) ||
        pathname.startsWith(`/${locale}/courses`) ||
        pathname.startsWith(`/${locale}/tools`) ||
        pathname.startsWith(`/${locale}/blog`)
      );
    }

    if (link.to === "") {
      if (isSubdomain) return false;
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }

    if (isSubdomain) return false;
    return pathname.startsWith(`/${locale}/${link.to}`);
  };

  const isSubItemActive = (subItem) => {
    if (subItem.id === "templates") {
      return isTemplatesSubdomain || (!isSubdomain && pathname.startsWith(`/${locale}/templates`));
    }
    if (subItem.id === "courses") {
      return isCoursesSubdomain || (!isSubdomain && pathname.startsWith(`/${locale}/courses`));
    }
    if (subItem.id === "tools") {
      return !isSubdomain && pathname.startsWith(`/${locale}/tools`);
    }
    if (subItem.id === "blog") {
      return !isSubdomain && pathname.startsWith(`/${locale}/blog`);
    }
    return false;
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 p-3 transition-all duration-300 ease-in-out">
      <BlurText duration={1}>
        <div className="flex justify-between items-center mx-auto max-w-7xl transition-all duration-300 ease-in-out">
          <Link
            href={mainUrl("")}
            className="hidden lg:flex items-center gap-2 pl-1 mt-0.5"
          >
            <AnimatedLogo className="h-7 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              if (link.dropdown) {
                return (
                  <div key={index} className="relative group">
                    <button className={`flex items-center gap-1 hover:text-main transition-colors duration-300 ease-in-out font-medium py-2 ${
                      active ? "text-main" : ""
                    }`}>
                      {link.name}
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                    </button>

                    {/* Invisible bridge to prevent closing */}
                    <div className="absolute top-full left-0 w-full h-2" />

                    <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-48 p-1.5 
                                  bg-neutral-900/90 backdrop-blur-xl border border-white/10 
                                  rounded-2xl shadow-2xl 
                                  opacity-0 translate-y-2 scale-95 invisible 
                                  group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:visible 
                                  transition-all duration-300 ease-out origin-top">
                      <div className="flex flex-col gap-0.5">
                        {link.items.map((subItem, subIndex) => {
                          const subActive = isSubItemActive(subItem);
                          return (
                            <a
                              key={subIndex}
                              href={subItem.href}
                              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                subActive
                                  ? "bg-white/10 text-main font-semibold pl-5"
                                  : "text-gray-300 hover:bg-white/10 hover:text-white hover:pl-5"
                              }`}
                            >
                              {subItem.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

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

            <div className="flex items-center gap-3 ml-2">
              <LanguageSwitcher />
              <Link
                href={mainUrl("services")}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-main text-black hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-lg shadow-main/30"
              >
                {t("HIRE_ME")}
              </Link>
              <UserMenu />
            </div>
          </div>

          {/* Hamburger Icon */}
          <div dir="ltr" className="lg:hidden flex justify-between items-center w-full px-2">
            <Link href={mainUrl("")} className="flex items-center">
              <AnimatedLogo className="h-6 w-auto" />
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div
                className="relative flex flex-col justify-center items-center space-y-1 z-50"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out transform rounded-full mt-0.5 ${menuOpen ? "rotate-45 absolute" : ""
                    }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out rounded-full ${menuOpen ? "opacity-0" : ""
                    }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out transform rounded-full ${menuOpen ? "rotate-135 absolute bottom-[3.1px]" : ""
                    }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black backdrop-blur-md z-40 px-6 py-12 transition-all duration-300 ease-in-out flex flex-col ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex flex-col items-center space-y-6 flex-1 overflow-y-auto w-full">
            {links.map((link, index) => {
              const active = isLinkActive(link);
              if (link.dropdown) {
                const isExpanded = activeDropdown === index;
                return (
                  <div key={index} className="flex flex-col items-center w-full">
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`text-2xl font-semibold transition-all duration-300 ease-in-out hover:text-main flex items-center gap-2 ${
                        active ? "text-main" : ""
                      }`}
                    >
                      {link.name}
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex flex-col items-center space-y-4 mt-4 w-full bg-white/5 rounded-xl py-4 overflow-hidden"
                        >
                          {link.items.map((subItem, subIndex) => {
                            const subActive = isSubItemActive(subItem);
                            return (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className={`text-lg transition-colors ${
                                  subActive ? "text-main font-bold" : "text-gray-300 hover:text-main"
                                }`}
                                onClick={() => setMenuOpen(false)}
                              >
                                {subItem.name}
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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

