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
        // The server also sends this purchase to Meta (Conversions API) with the id pm-<Paymob transaction id>;
        // the same id here makes Meta count the sale once. Paymob adds ?id=<transaction id> to the return link.
        let txn = "", cents = 0;
        try {
            const q = new URLSearchParams(window.location.search);
            txn = q.get("id") || "";
            cents = Number(q.get("amount_cents")) || 0; // the amount Paymob charged, in piasters
        } catch {
            // no query string
        }
        track("course_purchase", { place: "thanks_page" }, {
            ...(/^\d{3,20}$/.test(txn) ? { eventId: `pm-${txn}` } : {}),
            ...(cents > 0 && cents < 100000000 ? { value: cents / 100, currency: "EGP" } : {}),
        });
    }, [granted]);
    return null;
}
