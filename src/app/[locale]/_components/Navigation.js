"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const t = useTranslations("Navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const links = [
    { name: t("HOME"), to: "" },
    { name: t("SERVICES"), to: "services" },
    {
      name: t("CONTENT"),
      dropdown: true,
      items: [
        { name: t("TEMPLATES"), to: "templates" },
        { name: t("COURSES"), to: "courses" },
        { name: t("TOOLS"), to: "tools" },
        { name: t("BLOGS"), to: "blog" }
      ]
    },
    { name: t("ABOUT_ME"), to: "about" },
    { name: t("CONTACT"), to: "contact" },
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md shadow-md z-50 p-3 transition-all duration-300 ease-in-out">
      <BlurText duration={1}>
        <div className="flex justify-between items-center mx-auto max-w-7xl transition-all duration-300 ease-in-out">
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
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {links.map((link, index) => {
              if (link.dropdown) {
                return (
                  <div key={index} className="relative group">
                    <button className="flex items-center gap-1 hover:text-main transition-colors duration-300 ease-in-out font-medium py-2">
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
                        {link.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={`/${locale}/${subItem.to}`}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 
                                     hover:bg-white/10 hover:text-white hover:pl-5
                                     transition-all duration-200"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const href = `/${locale}${link.to ? `/${link.to}` : ""}`;
              return (
                <Link
                  href={href}
                  key={index}
                  className={`hover:text-main transition-all duration-300 ease-in-out font-medium ${pathname === href ? "text-main" : ""
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center gap-3 ml-2">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>

          {/* Hamburger Icon */}
          <div className="lg:hidden flex justify-between items-center w-full px-2">
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
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

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black backdrop-blur-md z-40 px-6 py-12 transition-all duration-300 ease-in-out flex flex-col ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex flex-col items-center space-y-6 flex-1 overflow-y-auto w-full">
            {links.map((link, index) => {
              if (link.dropdown) {
                const isActive = activeDropdown === index;
                return (
                  <div key={index} className="flex flex-col items-center w-full">
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className="text-2xl font-semibold transition-all duration-300 ease-in-out hover:text-main flex items-center gap-2"
                    >
                      {link.name}
                      {isActive ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex flex-col items-center space-y-4 mt-4 w-full bg-white/5 rounded-xl py-4 overflow-hidden"
                        >
                          {link.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={`/${locale}/${subItem.to}`}
                              className="text-lg hover:text-main transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const href = `/${locale}${link.to ? `/${link.to}` : ""}`;
              return (
                <Link
                  href={href}
                  key={index}
                  className={`text-2xl font-semibold transition-all duration-300 ease-in-out hover:text-main ${pathname === href ? "text-main" : ""
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 w-full max-w-sm">
              <UserMenu inline />
            </div>
          </div>
        </div>
      </BlurText>
    </nav>
  );
}
