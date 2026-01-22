"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const categories = ["productivity", "education", "islam", "finance", "challenges", "bundle", "content", "lifestyle", "health", "business", "work"];

export default function CategoryButtons() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Categories");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleFilter = (category) => {
    const params = new URLSearchParams(searchParams);

    // If the same category is clicked, remove it (toggle off)
    if (activeCategory === category) {
      params.delete("category");
    } else {
      // Otherwise, set the new category
      params.set("category", category);
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const activeCategory = searchParams.get("category");

  useEffect(() => {
    const updateScrollState = () => {
      const container = scrollRef.current;
      if (!container) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    const container = scrollRef.current;
    container?.addEventListener("scroll", updateScrollState);

    return () => {
      window.removeEventListener("resize", handleResize);
      container?.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return (
    <div className="relative py-2">
      <div
        ref={scrollRef}
        className="overflow-x-auto category-scrollbar-hidden"
      >
        <div className="flex gap-2 justify-start min-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`cursor-pointer px-6 py-2 rounded-xl border transition-all duration-300 whitespace-nowrap ${activeCategory === cat
              ? "bg-main text-white border-black"
              : "bg-black text-main"
              }`}
          >
            {t(cat)}
          </button>
        ))}
        </div>
      </div>
      {(isRtl ? canScrollRight : canScrollLeft) && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent" />
      )}
      {(isRtl ? canScrollLeft : canScrollRight) && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent" />
      )}
    </div>
  );
}
