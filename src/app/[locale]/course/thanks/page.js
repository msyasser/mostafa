import Link from "next/link";

// Paymob sends people here after they pay for a course from the desktop app.
// The course itself opens inside the app, so this page only confirms and points back to it.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تم الدفع" : "Payment received",
    robots: { index: false, follow: false },
  };
}

export default async function CourseThanksPage({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden bg-neutral-950">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-main/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-md w-full mx-auto text-center">
        <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-green-400 text-2xl" aria-hidden="true">
            ✓
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            {isArabic ? "تم الدفع بنجاح" : "Payment received"}
          </h1>
          <p className="text-neutral-400 leading-relaxed mb-2">
            {isArabic
              ? "ارجع لتطبيق الكورسات، والكورس هيظهر عندك في «كورساتي» خلال ثواني."
              : "Go back to the courses app. Your course will show up under My Courses within a few seconds."}
          </p>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            {isArabic
              ? "لو ما ظهرش بعد دقيقتين، اقفل التطبيق وافتحه تاني."
              : "If it does not appear after two minutes, close the app and open it again."}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center w-full py-3.5 rounded-xl border border-neutral-700 text-neutral-200 hover:border-main hover:text-main transition-colors text-sm font-medium"
          >
            {isArabic ? "الرجوع للموقع" : "Back to the site"}
          </Link>
        </div>
      </div>
    </div>
  );
}
