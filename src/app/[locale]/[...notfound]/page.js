import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "الصفحة غير موجودة"
    : "Page Not Found";
  const description = isArabic
    ? "عذرًا، الصفحة التي تبحث عنها غير موجودة. تحقق من الرابط أو الرجوع إلى الصفحة الرئيسية."
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

export default function CatchAll() {
  notFound();
}
