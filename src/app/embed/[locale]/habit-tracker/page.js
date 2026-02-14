"use client";

import HabitTracker from "@/src/components/widgets/HabitTracker";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function HabitTrackerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <HabitTracker theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
