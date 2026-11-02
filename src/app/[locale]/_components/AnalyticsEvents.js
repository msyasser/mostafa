"use client";

import { useEffect } from "react";
import { track } from "@/src/lib/track";

// One click listener for the whole site: any element with data-track="event_name" (and optionally
// data-track-place="where") sends that event to Google Analytics.
export default function AnalyticsEvents() {
    useEffect(() => {
        const onClick = (event) => {
            const element = event.target instanceof Element ? event.target.closest("[data-track]") : null;
            if (!element) return;
            track(element.dataset.track, {
                place: element.dataset.trackPlace || undefined,
                page_path: window.location.pathname,
                language: document.documentElement.lang || undefined,
            });
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    return null;
}
