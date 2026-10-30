import NotFoundClient from "@/src/app/[locale]/_components/NotFoundClient";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "الصفحة مش موجودة | مصطفى ياسر"
    : "Page Not Found | Mostafa Yasser";
  const description = isArabic
    ? "معلش، الصفحة اللي بتدوّر عليها مش موجودة. اتأكد من الرابط أو ارجع للرئيسية."
    : "Sorry, the page you are looking for does not exist. Check the URL or return to the homepage.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://mostafayasser.com",
      images: [
        {
          url: "/mostafa/mostafa.webp",
          width: 800,
          height: 600,
          alt: "Mostafa Yasser",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/mostafa/mostafa.webp"],
    },
  };
}

export default function NotFoundPage() {
  return <NotFoundClient />;
}
