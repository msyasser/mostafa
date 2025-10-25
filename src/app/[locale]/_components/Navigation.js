"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const links = [
    { name: t("HOME"), to: "" },
    { name: t("TEMPLATES"), to: "templates" },
    { name: t("COURSES"), to: "courses" },
    { name: t("BLOGS"), to: "blog" },
    { name: t("CONTACT"), to: "contact" },
    { name: t("ABOUT_ME"), to: "about" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 p-3">
      <BlurText duration={1}>
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <Link
            href={`/${locale}`}
            className="hidden lg:flex items-center gap-2 pl-1 mt-0.5"
          >
            <Image
              src="/logos/lightLogo.webp"
              alt="Mostafa Yasser logo"
              height={180}
              width={180}
            />
            {/* <span className="text-xl uppercase">{t("MOSTAFA")}</span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link, index) => {
              const href = `/${locale}${link.to ? `/${link.to}` : ""}`;
              return (
                <Link
                  href={href}
                  key={index}
                  className={`hover:text-main transition duration-300 ${
                    pathname === href ? "text-main" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <LanguageSwitcher />
          </div>

          {/* Hamburger Icon */}
          <div className="lg:hidden flex justify-between items-center w-full px-2">
            <LanguageSwitcher />
            <Link href={`/${locale}`}>
              <p className="mx-auto px-0.5 font-bold text-xl uppercase mt-0.5">
                {t("MOSTAFA")}
              </p>
            </Link>

            <div
              className="relative flex flex-col justify-center items-center space-y-1 z-50"
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

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black backdrop-blur-md z-40 px-6 py-12 transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center space-y-6">
            {links.map((link, index) => {
              const href = `/${locale}${link.to ? `/${link.to}` : ""}`;
              return (
                <Link
                  href={href}
                  key={index}
                  className={`text-2xl font-semibold ${
                    pathname === href ? "text-main" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </BlurText>
    </nav>
  );
}
