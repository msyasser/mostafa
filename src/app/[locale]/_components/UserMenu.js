"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function UserMenu({ inline = false }) {
  const { data: session } = useSession();
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
      <div className={`w-full bg-black/95 rounded-lg border border-white/10 ${isArabic ? "text-right" : "text-left"}`}>
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-main flex items-center justify-center text-black font-bold">
            {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{session.user.name || session.user.email}</p>
            {session.user.email && (
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            )}
          </div>
        </div>
        <div className="py-2">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className={`w-full ${isArabic ? "text-right" : "text-left"} px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors`}
          >
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
        className="flex items-center px-1 py-1 rounded-full hover:bg-white/10 transition-all duration-200"
        aria-label="User menu"
      >
        <div className="w-9 h-9 rounded-full bg-main flex items-center justify-center text-black font-bold">
          {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
        </div>
      </button>

      {isOpen && (
        <div className={`absolute ${isArabic ? "left-0" : "right-0"} mt-2 w-64 bg-black/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10 z-50 overflow-hidden ${isArabic ? "text-right" : "text-left"}`}>
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold truncate">{session.user.name || session.user.email}</p>
            {session.user.email && (
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            )}
          </div>

          <div className="py-2">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className={`w-full ${isArabic ? "text-right" : "text-left"} px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors`}
            >
              {t("SIGN_OUT")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

