"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// One full run of the animation in /logos/logo-animation.webp (the file plays once).
const ANIMATION_DURATION = 5300;
const ANIMATED_SRC = "/logos/logo-animation.webp";
const STATIC_SRC = "/logos/logo-static.webp";

export default function AnimatedLogo({ className = "h-10 w-auto" }) {
  // 0 = resting logo; any other value = playing. A new value remounts the <img>,
  // which restarts the animation from its first frame.
  const [playId, setPlayId] = useState(0);
  const isHoveredRef = useRef(false);
  const timerRef = useRef(null);
  const playRef = useRef(null);

  useEffect(() => {
    const play = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPlayId((n) => n + 1);
      timerRef.current = setTimeout(() => {
        if (isHoveredRef.current) {
          play();
        } else {
          setPlayId(0);
          timerRef.current = null;
        }
      }, ANIMATION_DURATION);
    };
    playRef.current = play;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return () => clearTimeout(timerRef.current);

    // Play once on load, but only after the page is idle and the file has arrived
    // so it never competes with the content.
    let idleId;
    const start = () => {
      const preload = new window.Image();
      preload.onload = () => play();
      preload.src = ANIMATED_SRC;
    };
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 3000 });
    } else {
      idleId = window.setTimeout(start, 1500);
    }

    return () => {
      if ("requestIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (playId === 0 && playRef.current) playRef.current();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Image
        key={playId}
        src={playId === 0 ? STATIC_SRC : ANIMATED_SRC}
        alt="Mostafa Yasser"
        width={95}
        height={71}
        unoptimized
        priority
        className="h-full w-auto max-h-full object-contain"
      />
    </span>
  );
}
