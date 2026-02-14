"use client";

import PomodoroWidget from "@/src/components/widgets/Pomodoro";
import { useSearchParams } from "next/navigation";

export default function PomodoroPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return <PomodoroWidget theme={theme || "dark"} />;
}
