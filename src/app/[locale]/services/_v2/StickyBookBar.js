"use client";

import { useEffect, useState } from "react";

// Small screens only: shows a "Book a free call" bar once the hero buttons have scrolled out of view,
// and hides it again while the booking calendar itself is on screen.
export default function StickyBookBar({ label }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hero = document.getElementById("services-hero-cta");
        const calendar = document.getElementById("calendar-section");
        if (!hero || !("IntersectionObserver" in window)) return undefined;

        let heroPassed = false;
        let calendarVisible = false;
        const update = () => setShow(heroPassed && !calendarVisible);

        const heroObserver = new IntersectionObserver(([entry]) => {
            heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            update();
        });
        const calendarObserver = new IntersectionObserver(([entry]) => {
            calendarVisible = entry.isIntersecting;
            update();
        });
        heroObserver.observe(hero);
        if (calendar) calendarObserver.observe(calendar);

        return () => {
            heroObserver.disconnect();
            calendarObserver.disconnect();
        };
    }, []);

    return (
        <div
            aria-hidden={!show}
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-main/20 bg-neutral-950/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
                show ? "translate-y-0" : "translate-y-full"
            }`}
        >
            <a
                href="#calendar-section"
                tabIndex={show ? 0 : -1}
                className="flex w-full items-center justify-center rounded-full bg-main py-3.5 text-[15px] font-semibold text-neutral-900"
            >
                {label} <span className="inline-block rtl:-scale-x-100">→</span>
            </a>
        </div>
    );
}
