"use client";

import StudyPlanner from "@/src/components/widgets/StudyPlanner";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function StudyPlannerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <StudyPlanner theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
