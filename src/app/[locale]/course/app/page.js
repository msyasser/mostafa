import ConfirmationCard from "../../_components/ConfirmationCard";

// Where the course app is downloaded. The Microsoft Store address is set with NEXT_PUBLIC_MYHUB_STORE_URL
// once the listing is live; until then the page says "coming soon" instead of linking to nothing.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تطبيق MY Hub" : "MY Hub app",
    robots: { index: false, follow: true },
  };
}

export default async function CourseAppPage({ params }) {
  const { locale } = await params;
  const ar = locale === "ar";
  const storeUrl = process.env.NEXT_PUBLIC_MYHUB_STORE_URL || "";
  const live = /^https:\/\//.test(storeUrl);

  return (
    <ConfirmationCard
      state="wait"
      title={ar ? "تطبيق MY Hub" : "The MY Hub app"}
      action={live
        ? { href: storeUrl, label: ar ? "حمّله من متجر مايكروسوفت" : "Get it from the Microsoft Store" }
        : { href: `/${locale}/courses`, label: ar ? "شوف الكورسات" : "See the courses" }}
    >
      <p className="mb-3">
        {ar
          ? "كورس نوشن بيتفتح جوّه تطبيق MY Hub على ويندوز، بفيديوهات محمية واختبارات ومشروع تخرج واعتمادية."
          : "The Notion Course opens inside the MY Hub app for Windows, with protected videos, quizzes, a graduation project and a credential."}
      </p>
      {live ? (
        <p className="text-neutral-500 text-sm">
          {ar ? "بعد التحميل، سجّل الدخول بنفس الإيميل اللي اشتريت بيه." : "After installing, sign in with the same email you bought with."}
        </p>
      ) : (
        <p className="text-neutral-400 text-sm">
          {ar ? "التطبيق قريبًا على متجر مايكروسوفت. هنعلن هنا أول ما يتاح." : "The app is coming soon to the Microsoft Store. We will announce it here as soon as it is available."}
        </p>
      )}
    </ConfirmationCard>
  );
}
