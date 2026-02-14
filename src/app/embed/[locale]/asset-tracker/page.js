"use client";

import AssetTracker from "@/src/components/widgets/AssetTracker";
import { useSearchParams } from "next/navigation";

export default function AssetTrackerPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <AssetTracker theme={theme || "dark"} />
        </div>
    );
}
