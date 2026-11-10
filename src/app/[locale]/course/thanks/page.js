import ConfirmationCard from "../../_components/ConfirmationCard";

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
    <ConfirmationCard
      state="success"
      title={isArabic ? "تم الدفع بنجاح" : "Payment received"}
      action={{ href: `/${locale}`, label: isArabic ? "الرجوع للموقع" : "Back to the site" }}
    >
      <p className="mb-2">
        {isArabic ? (
          <>ارجع لتطبيق <bdi>MY Hub</bdi>، والكورس هيظهر عندك في «كورساتي» خلال ثواني.</>
        ) : (
          "Go back to the MY Hub app. Your course will show up under My courses within a few seconds."
        )}
      </p>
      <p className="text-neutral-500 text-sm">
        {isArabic
          ? "لو ما ظهرش بعد دقيقتين، اقفل التطبيق وافتحه تاني."
          : "If it does not appear after two minutes, close the app and open it again."}
      </p>
    </ConfirmationCard>
  );
}
