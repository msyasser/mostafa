"use client";

import QuranWidget from "@/src/components/widgets/QuranWidget";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function QuranVersePage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");
    const reciter = searchParams.get("reciter");
    const displayMode = searchParams.get("displayMode");
    const fontStyle = searchParams.get("fontStyle");

    return (
        <EmbedWrapper>
            <QuranWidget
                theme={theme || "dark"}
                reciter={reciter || "ar.alafasy"}
                displayMode={displayMode || "both"}
                fontStyle={fontStyle || "uthmani"}
            />
        </EmbedWrapper>
    );
}
