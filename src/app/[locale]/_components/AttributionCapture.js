"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/src/lib/attribution";

// Remembers the campaign tags (utm_*, fbclid) and the referring site of the visit, on whatever page the visitor lands on.
export default function AttributionCapture() {
    useEffect(() => {
        captureAttribution();
    }, []);
    return null;
}
