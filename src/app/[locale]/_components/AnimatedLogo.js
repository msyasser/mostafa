"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ANIMATION_DURATION = 5300; // 5.3s - one full loop

// Module-level cache: SVG is fetched only once per session
let _cachedSvg = null;
let _fetchPromise = null;

function getSvgContent() {
  if (_cachedSvg) return Promise.resolve(_cachedSvg);
  if (!_fetchPromise) {
    _fetchPromise = fetch("/logos/White Logo Animation.svg")
      .then((res) => res.text())
      .then((svg) => {
        _cachedSvg = svg
          .replace(/<\?xml.*?\?>/i, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .trim();
        return _cachedSvg;
      })
      .catch((err) => {
        _fetchPromise = null; // allow retry on failure
        console.error("Failed to load logo SVG:", err);
        return null;
      });
  }
  return _fetchPromise;
}

export default function AnimatedLogo({ className = "h-10 w-auto" }) {
  const [svgContent, setSvgContent] = useState(_cachedSvg || "");
  const [isPlaying, setIsPlaying] = useState(false);

  const isHoveredRef = useRef(false);
  const cycleTimerRef = useRef(null);
  const hasPlayedOnMountRef = useRef(false);

  useEffect(() => {
    if (_cachedSvg) {
      setSvgContent(_cachedSvg);
    } else {
      getSvgContent().then((content) => {
        if (content) setSvgContent(content);
      });
    }

    return () => {
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };
  }, []);

  // Play once on initial mount after SVG loads
  useEffect(() => {
    if (!svgContent || hasPlayedOnMountRef.current) return;
    hasPlayedOnMountRef.current = true;

    setIsPlaying(true);

    cycleTimerRef.current = setTimeout(() => {
      if (isHoveredRef.current) {
        startCycle();
      } else {
        setIsPlaying(false);
      }
    }, ANIMATION_DURATION);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgContent]);

  const startCycle = () => {
    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);

    cycleTimerRef.current = setTimeout(() => {
      if (isHoveredRef.current) {
        startCycle();
      } else {
        setIsPlaying(false);
        cycleTimerRef.current = null;
      }
    }, ANIMATION_DURATION);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!isPlaying) {
      setIsPlaying(true);
      startCycle();
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  if (!svgContent) {
    return (
      <Image
        src="/logos/lightLogo.webp"
        alt="Mostafa Yasser logo"
        width={75}
        height={42}
        className={`${className} object-contain`}
        priority
      />
    );
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center ${className} ${
        isPlaying
          ? "[&_.f]:![animation-play-state:running]"
          : "[&_.f]:![animation-play-state:paused]"
      } [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-h-full [&>svg]:object-contain`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
