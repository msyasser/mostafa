import ConfirmationCard from "../../_components/ConfirmationCard";

// Where people land after buying a course: from Paymob after paying (website or app), or straight from the
// website form when a 100% coupon added the course (?granted=1). The course opens inside MY Hub.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تم الاشتراك" : "You are enrolled",
    robots: { index: false, follow: false },
  };
}

export default async function CourseThanksPage({ params, searchParams }) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const isArabic = locale === "ar";
  const granted = query.granted === "1";
  const storeUrl = process.env.NEXT_PUBLIC_MYHUB_STORE_URL || "";
  const action = /^https:\/\//.test(storeUrl)
    ? { href: storeUrl, label: isArabic ? "حمّل MY Hub من متجر مايكروسوفت" : "Get MY Hub from the Microsoft Store" }
    : { href: `/${locale}/course/app`, label: isArabic ? "تطبيق MY Hub" : "The MY Hub app" };

  const title = granted
    ? isArabic ? "تم تفعيل الكورس" : "Your course is active"
    : isArabic ? "تم الدفع بنجاح" : "Payment received";

  return (
    <ConfirmationCard state="success" title={title} action={action}>
      <p className="mb-2">
        {isArabic ? (
          <>الكورس بيتشاف جوه تطبيق <bdi>MY Hub</bdi> على ويندوز. حمّله، وسجّل دخولك بنفس الإيميل اللي اشتركت بيه، وهتلاقي الكورس في «كورساتي».</>
        ) : (
          "The course is watched inside the MY Hub app on Windows. Install it, sign in with the same email you enrolled with, and the course will be under My courses."
        )}
      </p>
      <p className="mb-2">
        {isArabic
          ? "ولو التطبيق مفتوح عندك فعلاً، الكورس هيظهر خلال ثواني."
          : "If the app is already open, the course will show up within a few seconds."}
      </p>
      <p className="text-neutral-500 text-sm">
        {isArabic
          ? "هيوصلك كمان إيميل فيه تفاصيل الاشتراك. لو ما ظهرش الكورس بعد دقيقتين، اقفل التطبيق وافتحه تاني."
          : "You will also get an email with your enrollment details. If the course does not appear after two minutes, close the app and open it again."}
      </p>
    </ConfirmationCard>
  );
}
