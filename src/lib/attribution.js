// Remembers where a visitor came from (campaign tags in the link, the Meta ad click id, the site that sent them),
// so an order can be tied to the campaign that produced it. Stored only in this browser for 30 days and sent
// only when the visitor starts the payment. The newest tagged visit wins; an untagged visit never overwrites a tagged one.
const KEY = "my_attr";
const DAYS = 30;

function readCookie(name) {
    try {
        return (document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)")) || [])[1] || "";
    } catch {
        return "";
    }
}

export function captureAttribution() {
    if (typeof window === "undefined") return;
    try {
        const q = new URLSearchParams(window.location.search);
        const tagged = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"].some((k) => q.get(k));
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem(KEY) || "null");
        } catch {
            stored = null;
        }
        const fresh = stored && Date.now() - stored.ts < DAYS * 86400000;
        if (fresh && !tagged) return;
        let ref = "";
        try {
            ref = document.referrer ? new URL(document.referrer).hostname : "";
        } catch {
            ref = "";
        }
        if (fresh && stored.tagged && !tagged) return;
        const rec = {
            ts: Date.now(), tagged,
            utm_source: q.get("utm_source") || (ref && !ref.endsWith("mostafayasser.com") ? ref : ""),
            utm_medium: q.get("utm_medium") || "", utm_campaign: q.get("utm_campaign") || "", utm_content: q.get("utm_content") || "",
            fbclid: q.get("fbclid") || "", referrer: ref, landing: window.location.pathname,
        };
        localStorage.setItem(KEY, JSON.stringify(rec));
    } catch {
        // attribution must never break a page
    }
}

// What is sent with the checkout request.
export function attributionForCheckout() {
    const out = {};
    try {
        const rec = JSON.parse(localStorage.getItem(KEY) || "null");
        if (rec && Date.now() - rec.ts < DAYS * 86400000) {
            Object.assign(out, { utm_source: rec.utm_source, utm_medium: rec.utm_medium, utm_campaign: rec.utm_campaign, utm_content: rec.utm_content, referrer: rec.referrer, landing: rec.landing });
            if (rec.fbclid) out.fbc = `fb.1.${rec.ts}.${rec.fbclid}`;
        }
    } catch {
        // none
    }
    const fbp = readCookie("_fbp");
    const fbc = readCookie("_fbc");
    if (fbp) out.fbp = fbp;
    if (fbc) out.fbc = fbc;
    return out;
}
