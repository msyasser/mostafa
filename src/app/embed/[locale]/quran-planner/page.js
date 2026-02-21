"use client";

import QuranicPlanner from "@/src/components/widgets/QuranicPlanner";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function QuranicPlannerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const startSura = searchParams.get("startSura");
    const days = searchParams.get("days");
    const startDate = searchParams.get("startDate");

    return (
        <EmbedWrapper>
            <QuranicPlanner
                theme={theme || "dark"}
                initialStartSura={startSura || "fatiha"}
                initialDays={days || ""}
                initialStartDate={startDate || ""}
            />
        </EmbedWrapper>
    );
}
