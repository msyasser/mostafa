"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// One full run of the animation in /logos/logo-animation.webp (the file plays once).
// The animation draws the whole wordmark on a 535x73 canvas, while the resting logo is only the
// mark (logo-static.webp is that canvas cropped to x 6-101, y 1-72). The wrapper is sized like the
// resting mark and the animated canvas is laid over it, so the mark stays put and the wordmark
// can grow out to the side without being clipped.
const ANIMATION_DURATION = 5300;
const ANIMATED_SRC = "/logos/logo-animation.webp";
const STATIC_SRC = "/logos/logo-static.webp";

// Where the resting crop sits on the animation canvas, as a share of the wrapper (95 x 71 units)
const CANVAS_STYLE = {
  position: "absolute",
  height: "102.8169%", // 73 / 71
  width: "auto",
  maxWidth: "none",
  top: "-1.4085%", // 1 / 71
  insetInlineStart: "-6.3158%", // 6 / 95
  pointerEvents: "none",
};

export default function AnimatedLogo({ className = "h-10 w-auto" }) {
  // 0 = resting logo; any other value = playing. A new value remounts the <img>,
  // which restarts the animation from its first frame.
  const [playId, setPlayId] = useState(0);
  const wrapRef = useRef(null);
  const isHoveredRef = useRef(false);
  const timerRef = useRef(null);
  const playRef = useRef(null);

  useEffect(() => {
    // The wordmark reads left to right and grows to the right of the mark, so in a right-to-left
    // header (mark on the right edge) there is no room for it: the logo just stays at rest there.
    const rtl = wrapRef.current && window.getComputedStyle(wrapRef.current).direction === "rtl";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rtl || reduceMotion) return undefined;

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

  const playing = playId !== 0;

  return (
    <span
      ref={wrapRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center ${playing ? "z-10" : ""} ${className}`}
    >
      <Image
        src={STATIC_SRC}
        alt="Mostafa Yasser"
        width={95}
        height={71}
        unoptimized
        priority
        className={`h-full w-auto max-h-full object-contain ${playing ? "invisible" : ""}`}
      />
      {playing && (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={playId} src={ANIMATED_SRC} alt="" aria-hidden="true" style={CANVAS_STYLE} />
      )}
    </span>
  );
}
