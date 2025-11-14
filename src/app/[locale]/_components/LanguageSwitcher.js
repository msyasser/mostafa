"use client";

import { useRouter } from "@/src/i18n/navigation";
import { usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const locales = {
  en: "ar",
  ar: "en",
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = locales[currentLocale];

  const handleClick = () => {
    // Use replace instead of push to prevent adding to history stack
    router.replace(pathname, { locale: switchTo });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-transparent hover:bg-white/10 backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      aria-label="Switch language"
    >
      <GlobeAltIcon className="w-5 h-5 text-main hover:opacity-70 transition duration-200" />
    </button>
  );
}
