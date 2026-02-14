"use client";

import { useSearchParams } from "next/navigation";

export default function EmbedWrapper({ children }) {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme") || "dark";

    return (
        <div
            className={`flex items-center justify-center min-h-screen w-full transition-colors duration-300 ${theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"
                }`}
        >
            {children}
        </div>
    );
}
