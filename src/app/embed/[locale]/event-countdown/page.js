"use client";

import EventCountdown from "@/src/components/widgets/EventCountdown";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function EventCountdownPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const date = searchParams.get("date");
    const title = searchParams.get("title");

    return (
        <EmbedWrapper>
            <EventCountdown
                theme={theme || "dark"}
                initialDate={date || ""}
                initialTitle={title || ""}
            />
        </EmbedWrapper>
    );
}
