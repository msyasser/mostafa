// Settings of the paid Notion course page.
export const course = {
    // Course id in the platform API (the Worker reads the price from its own table, never from here).
    id: "notion-course",
    priceEgp: 1500,
    apiBase: process.env.NEXT_PUBLIC_COURSE_API_BASE || "https://api.mostafayasser.com",
    // The payment form shows only when NEXT_PUBLIC_COURSE_SALES=open (set it in Vercel when Paymob is live
    // and the app can be downloaded). Otherwise the page shows a "notify me" email field instead.
    salesOpen: process.env.NEXT_PUBLIC_COURSE_SALES === "open",
    freePlaylistUrl: "https://www.youtube.com/playlist?list=PL_Ygc7HIAnRczriiuR2wSURpo_wOnk0jf",
};
