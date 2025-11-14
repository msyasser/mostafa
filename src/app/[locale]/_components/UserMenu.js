"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function UserMenu({ inline = false }) {
  const { data: session, status } = useSession();
  const t = useTranslations("Auth");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isArabic = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show skeleton while loading
  if (status === "loading") {
    if (inline) {
      return (
        <div className={`w-full bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 ${isArabic ? "text-right" : "text-left"}`}>
          <div className="px-5 py-4 border-b border-white/10 bg-black/50 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 animate-pulse"></div>
            <div className="min-w-0 flex-1">
              <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="py-2">
            <div className="h-10 bg-white/10 rounded-lg animate-pulse mx-2"></div>
          </div>
        </div>
      );
    }
    // Skeleton for desktop - matches either login button or avatar size
    return (
      <div className="flex items-center">
        <div className="px-4 py-2 rounded-lg bg-white/10 animate-pulse">
          <div className="h-4 w-20"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <a
        href={`/${locale}/auth/signin`}
        className={`px-4 py-2 bg-main text-black font-semibold rounded-lg hover:bg-transparent hover:text-main border border-main transition-all duration-300 ${inline ? "block mx-auto text-center" : ""}`}
      >
        {t("SIGN_IN")}
      </a>
    );
  }

  // Inline variant for mobile menus: render inline content instead of floating dropdown
  if (inline) {
    return (
      <div className={`w-full bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 ${isArabic ? "text-right" : "text-left"}`}>
        <div className="px-5 py-4 border-b border-white/10 bg-black/50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-main flex items-center justify-center text-black font-bold text-lg shadow-lg ring-2 ring-main/30">
            {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {session.user.name || session.user.email}
            </p>
            {session.user.email && session.user.name && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
        <div className="py-2">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className={`w-full ${isArabic ? "text-right" : "text-left"} px-5 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1 flex items-center gap-2 ${isArabic ? "justify-end" : "justify-start"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t("SIGN_OUT")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-1 py-1 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
        aria-label="User menu"
      >
        <div className="w-9 h-9 rounded-full bg-main flex items-center justify-center text-black font-bold">
          {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
        </div>
      </button>

      <div
        className={`absolute ${isArabic ? "left-0" : "right-0"} mt-2 w-72 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden ${isArabic ? "text-right" : "text-left"} transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Profile Section */}
        <div className="px-5 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-main flex items-center justify-center text-black font-bold text-lg shadow-lg ring-2 ring-main/30">
              {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {session.user.name || session.user.email}
              </p>
              {session.user.email && session.user.name && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="py-2">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className={`w-full ${isArabic ? "text-right" : "text-left"} px-5 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer rounded-lg mx-2 my-1 flex items-center gap-2 ${isArabic ? "justify-end" : "justify-start"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t("SIGN_OUT")}
          </button>
        </div>
      </div>
    </div>
  );
}

