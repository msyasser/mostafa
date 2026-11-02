"use client";

import { useEffect, useRef, useState } from "react";

// Renders its children only once the card is close to the screen, so the tools page does not start
// eleven live widgets (and their network calls) at once. The placeholder keeps the card height stable.
export default function LazyPreview({ children, minHeight = 190 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "300px 0px" }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex w-full justify-center" style={visible ? undefined : { minHeight }}>
            {visible ? children : null}
        </div>
    );
}
