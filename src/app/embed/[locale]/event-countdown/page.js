"use client";

import EventCountdown from "@/src/components/widgets/EventCountdown";
import { useSearchParams } from "next/navigation";

export default function EventCountdownPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const date = searchParams.get("date");
    const title = searchParams.get("title");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <EventCountdown
                theme={theme || "dark"}
                initialDate={date || ""}
                initialTitle={title || ""}
            />
        </div>
    );
}
