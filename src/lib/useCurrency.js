"use client";
import { useSyncExternalStore } from "react";
import { DEFAULT_CURRENCY } from "./currency";

// Tiny shared store: every price on the page re-renders together when the currency changes.
// Server render and first paint use EGP; after mount we switch to USD only if the visitor's
// country is known and is not Egypt, or if they picked a currency themselves.
let current = DEFAULT_CURRENCY;
let started = false;
const listeners = new Set();

function readCookie(name) {
    try {
        const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return m ? decodeURIComponent(m[1]) : "";
    } catch {
        return "";
    }
}

function detect() {
    const pref = readCookie("pref_currency");
    if (pref === "EGP" || pref === "USD") return pref;
    const country = readCookie("geo_country").toUpperCase();
    return country && country !== "EG" ? "USD" : DEFAULT_CURRENCY;
}

function set(next) {
    if (next === current) return;
    current = next;
    listeners.forEach((l) => l());
}

function subscribe(listener) {
    listeners.add(listener);
    if (!started) {
        started = true;
        set(detect());
    }
    return () => listeners.delete(listener);
}

export function setCurrency(next) {
    try {
        document.cookie = `pref_currency=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    set(next);
}

export default function useCurrency() {
    return useSyncExternalStore(subscribe, () => current, () => DEFAULT_CURRENCY);
}
