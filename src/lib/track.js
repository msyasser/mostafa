// Sends a custom event to Google Analytics 4. It uses the same queue as the official gtag snippet,
// so events fired before gtag.js has loaded (it loads lazily) are replayed once it is ready.
export function track(name, params = {}) {
    if (typeof window === "undefined") return;
    try {
        window.dataLayer = window.dataLayer || [];
        // eslint-disable-next-line prefer-rest-params
        const gtag = function () { window.dataLayer.push(arguments); };
        gtag("event", name, params);
    } catch {
        // analytics must never break the page
    }
}
