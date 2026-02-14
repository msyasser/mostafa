"use client";

import LifeProgressWidget from "@/src/components/widgets/LifeProgress";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function LifeProgressPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <LifeProgressWidget theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
