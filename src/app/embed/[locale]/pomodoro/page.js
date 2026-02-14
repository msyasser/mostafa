"use client";

import PomodoroWidget from "@/src/components/widgets/Pomodoro";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function PomodoroPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <PomodoroWidget theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
