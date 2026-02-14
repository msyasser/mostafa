"use client";
import { useEffect, useRef } from "react";

export default function GoogleCalendarButton({
    url = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3NsVkbwatyYzZvmKcri7ps5EEYJso5gZHI8v9f--rPyj3__tyj-5XIxOzh4jJY3rVkRCfBb5KM?gv=true",
    label = "Book an appointment",
    color = "#d7b180"
}) {
    const targetRef = useRef(null);

    useEffect(() => {
        // Check if script already exists to avoid duplicates
        let script = document.querySelector('script[src="https://calendar.google.com/calendar/scheduling-button-script.js"]');
        let link = document.querySelector('link[href="https://calendar.google.com/calendar/scheduling-button-script.css"]');

        if (!link) {
            link = document.createElement("link");
            link.href = "https://calendar.google.com/calendar/scheduling-button-script.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }

        const initCalendar = () => {
            if (window.calendar && window.calendar.schedulingButton) {
                window.calendar.schedulingButton.load({
                    url: url,
                    color: color,
                    label: label,
                    target: targetRef.current,
                });
            }
        };

        if (!script) {
            script = document.createElement("script");
            script.src = "https://calendar.google.com/calendar/scheduling-button-script.js";
            script.async = true;
            script.onload = initCalendar;
            document.body.appendChild(script);
        } else {
            // If script is already loaded, init immediately (or wait for load if it's still loading - simplified)
            if (window.calendar && window.calendar.schedulingButton) {
                initCalendar();
            } else {
                script.onload = initCalendar;
            }
        }
    }, [url, label, color]);

    return <div ref={targetRef} className="flex justify-center mt-8 scale-110" />;
}
