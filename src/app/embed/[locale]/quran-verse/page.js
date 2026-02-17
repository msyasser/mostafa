"use client";

import QuranWidget from "@/src/components/widgets/QuranWidget";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function QuranVersePage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <QuranWidget theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
