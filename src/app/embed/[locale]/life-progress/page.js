"use client";

import LifeProgressWidget from "@/src/components/widgets/LifeProgress";
import { useSearchParams } from "next/navigation";

export default function LifeProgressPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return <LifeProgressWidget theme={theme || "dark"} />;
}
