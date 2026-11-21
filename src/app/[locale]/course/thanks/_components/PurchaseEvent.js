"use client";

import { useEffect } from "react";
import { track } from "@/src/lib/track";

// Tells GA4 and the Meta Pixel (as "Purchase") that someone landed here after paying, so ads can be measured
// and optimised for real sales. Sent once per browser tab; a free-coupon enrolment (?granted=1) is not a sale.
export default function PurchaseEvent({ granted }) {
    useEffect(() => {
        if (granted) return;
        try {
            if (sessionStorage.getItem("course_purchase_sent")) return;
            sessionStorage.setItem("course_purchase_sent", "1");
        } catch {
            // storage blocked: send anyway
        }
        track("course_purchase", { place: "thanks_page" });
    }, [granted]);
    return null;
}
