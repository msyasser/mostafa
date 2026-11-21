// Site events that are also sent to Meta (Facebook / Instagram ads) as standard events, so ads can
// optimise for them and retarget. Only sent when the Meta Pixel is on (NEXT_PUBLIC_META_PIXEL_ID).
const META_EVENTS = {
    course_notify_signup: "Lead",
    course_checkout_start: "InitiateCheckout",
    course_purchase: "Purchase",
};

// Sends a custom event to Google Analytics 4. It uses the same queue as the official gtag snippet,
// so events fired before gtag.js has loaded (it loads lazily) are replayed once it is ready.
export function track(name, params = {}, options = {}) {
    if (typeof window === "undefined") return;
    try {
        window.dataLayer = window.dataLayer || [];
        // eslint-disable-next-line prefer-rest-params
        const gtag = function () { window.dataLayer.push(arguments); };
        gtag("event", name, params);
    } catch {
        // analytics must never break the page
    }
    try {
        const metaEvent = META_EVENTS[name];
        if (metaEvent && typeof window.fbq === "function") {
            window.fbq("track", metaEvent, { content_name: "notion-course", ...(options.value > 0 ? { value: options.value, currency: options.currency || "EGP" } : {}) }, options.eventId ? { eventID: options.eventId } : undefined);
        }
    } catch {
        // same rule for the Meta Pixel
    }
}
