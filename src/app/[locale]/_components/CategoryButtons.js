"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const rtlScrollTypeRef = useRef("default");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getRtlScrollType = useCallback(() => {
    if (typeof document === "undefined") {
      return "default";
    }

    const testEl = document.createElement("div");
    testEl.style.width = "100px";
    testEl.style.height = "100px";
    testEl.style.overflow = "scroll";
    testEl.style.direction = "rtl";
    testEl.style.visibility = "hidden";
    testEl.style.position = "absolute";
    testEl.style.top = "-9999px";

    const inner = document.createElement("div");
    inner.style.width = "200px";
    inner.style.height = "100px";

    testEl.appendChild(inner);
    document.body.appendChild(testEl);

    const initialScrollLeft = testEl.scrollLeft;
    testEl.scrollLeft = 1;
    const afterScrollLeft = testEl.scrollLeft;

    document.body.removeChild(testEl);

    if (initialScrollLeft > 0) {
      return "reverse";
    }
    if (afterScrollLeft === 0) {
      return "negative";
    }
    return "default";
  }, []);

  const getMaxScroll = useCallback(
    (container) => Math.max(0, container.scrollWidth - container.clientWidth),
    []
  );

  const getNormalizedScrollLeft = useCallback(
    (container) => {
      const maxScroll = getMaxScroll(container);
      if (!isRtl) {
        return container.scrollLeft;
      }

      switch (rtlScrollTypeRef.current) {
        case "negative":
          return -container.scrollLeft;
        case "reverse":
          return maxScroll - container.scrollLeft;
        default:
          return container.scrollLeft;
      }
    },
    [getMaxScroll, isRtl]
  );

  const setNormalizedScrollLeft = useCallback(
    (container, value, behavior = "auto") => {
      const maxScroll = getMaxScroll(container);
      const clampedValue = Math.max(0, Math.min(value, maxScroll));

      if (!isRtl) {
        container.scrollTo({ left: clampedValue, behavior });
        return;
      }

      switch (rtlScrollTypeRef.current) {
        case "negative":
          container.scrollTo({ left: -clampedValue, behavior });
          break;
        case "reverse":
          container.scrollTo({ left: maxScroll - clampedValue, behavior });
          break;
        default:
          container.scrollTo({ left: clampedValue, behavior });
          break;
      }
    },
    [getMaxScroll, isRtl]
  );

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
    if (isRtl) {
      rtlScrollTypeRef.current = getRtlScrollType();
    }

    const updateScrollState = () => {
      const container = scrollRef.current;
      if (!container) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      const maxScroll = getMaxScroll(container);
      const normalizedScrollLeft = getNormalizedScrollLeft(container);

      const canScrollToLeft = isRtl
        ? normalizedScrollLeft < maxScroll - 1
        : normalizedScrollLeft > 0;
      const canScrollToRight = isRtl
        ? normalizedScrollLeft > 0
        : normalizedScrollLeft < maxScroll - 1;

      setCanScrollLeft(canScrollToLeft);
      setCanScrollRight(canScrollToRight);
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
  }, [getMaxScroll, getNormalizedScrollLeft, getRtlScrollType, isRtl]);

  const handleArrowScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const amount = Math.max(120, Math.round(container.clientWidth * 0.6));
    const normalizedScrollLeft = getNormalizedScrollLeft(container);
    const directionFactor = direction === "left" ? (isRtl ? 1 : -1) : isRtl ? -1 : 1;
    const nextScrollLeft = normalizedScrollLeft + amount * directionFactor;

    setNormalizedScrollLeft(container, nextScrollLeft, "smooth");
  };

  const showPrev = isRtl ? canScrollRight : canScrollLeft;
  const showNext = isRtl ? canScrollLeft : canScrollRight;
  const prevSideClass = isRtl ? "right-0" : "left-0";
  const nextSideClass = isRtl ? "left-0" : "right-0";
  const prevShadowClass = isRtl
    ? "right-0 bg-linear-to-l from-black to-transparent"
    : "left-0 bg-linear-to-r from-black to-transparent";
  const nextShadowClass = isRtl
    ? "left-0 bg-linear-to-r from-black to-transparent"
    : "right-0 bg-linear-to-l from-black to-transparent";
  const prevDirection = isRtl ? "right" : "left";
  const nextDirection = isRtl ? "left" : "right";

  return (
    <div className="relative py-2">
      {showPrev && (
        <button
          type="button"
          onClick={() => handleArrowScroll(prevDirection)}
          className={`absolute ${prevSideClass} top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-md transition hover:bg-black cursor-pointer pointer-events-auto`}
          aria-label={prevDirection === "left" ? "Scroll categories left" : "Scroll categories right"}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={prevDirection === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      )}
      {showNext && (
        <button
          type="button"
          onClick={() => handleArrowScroll(nextDirection)}
          className={`absolute ${nextSideClass} top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white shadow-md transition hover:bg-black cursor-pointer pointer-events-auto`}
          aria-label={nextDirection === "left" ? "Scroll categories left" : "Scroll categories right"}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={nextDirection === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth category-scrollbar-hidden"
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
      {showPrev && (
        <div className={`pointer-events-none absolute inset-y-0 w-8 ${prevShadowClass}`} />
      )}
      {showNext && (
        <div className={`pointer-events-none absolute inset-y-0 w-8 ${nextShadowClass}`} />
      )}
    </div>
  );
}
