"use client";

import AssetTracker from "@/src/components/widgets/AssetTracker";
import EmbedWrapper from "@/src/components/EmbedWrapper";
import { useSearchParams } from "next/navigation";

export default function AssetTrackerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <EmbedWrapper>
            <AssetTracker theme={theme || "dark"} />
        </EmbedWrapper>
    );
}
