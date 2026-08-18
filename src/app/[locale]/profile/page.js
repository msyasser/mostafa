import { redirect } from "next/navigation";
import { auth } from "@/src/app/api/auth/[...nextauth]/route";
import ProfileClient from "./_components/ProfileClient";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "الملف الشخصي والإعدادات | مصطفى ياسر" : "Profile & Settings | Mostafa Yasser",
    description: isArabic
      ? "إدارة معلوماتك الشخصية، الأمان، وتفضيلات حسابك على منصة مصطفى ياسر."
      : "Manage your personal information, security, and account preferences on Mostafa Yasser's platform.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProfilePage({ params }) {
  const { locale } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${locale}/auth/signin?callbackUrl=/${locale}/profile`);
  }

  return <ProfileClient user={session.user} locale={locale} />;
}
