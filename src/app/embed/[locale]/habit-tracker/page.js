"use client";

import HabitTracker from "@/src/components/widgets/HabitTracker";
import { useSearchParams } from "next/navigation";

export default function HabitTrackerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <HabitTracker theme={theme || "dark"} />
        </div>
    );
}
