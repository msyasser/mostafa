"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Floating "Book a free call" button: a full-width bar on phones, a pill at the corner on larger screens.
// It appears once the hero buttons have scrolled out of view and hides while the booking calendar is on screen.
export default function StickyBookBar({ label, sub }) {
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
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-main/20 bg-neutral-950/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:inset-x-auto md:bottom-6 md:end-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none ${
                show ? "translate-y-0" : "translate-y-full md:translate-y-[calc(100%+2rem)]"
            }`}
        >
            <a
                href="#calendar-section"
                tabIndex={show ? 0 : -1}
                className="flex w-full items-center gap-3 rounded-full bg-main py-1.5 pe-2 ps-1.5 text-neutral-900 md:w-auto md:shadow-[0_10px_30px_rgba(0,0,0,0.55)] md:transition-transform md:hover:scale-[1.03]"
            >
                <Image
                    src="/about/mostafa-portrait.webp"
                    alt=""
                    width={84}
                    height={84}
                    className="size-11 shrink-0 rounded-full border-2 border-neutral-900 object-cover object-[50%_20%]"
                />
                <span className="flex-1 leading-tight md:pe-2">
                    <b className="block text-[15px] font-bold">{label}</b>
                    <small className="text-xs opacity-80">{sub}</small>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-900 text-main rtl:-scale-x-100">→</span>
            </a>
        </div>
    );
}
