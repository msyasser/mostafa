import ContactHero from "./_components/ContactHero";

import ContactForm from "./_components/ContactForm";
import BlurText from "@/src/app/[locale]/_components/BlurText";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const siteUrl = "https://www.mostafayasser.com";
  const title = isArabic ? "اتصل بنا" : "Contact";
  const description = isArabic
    ? "تواصل مع مصطفى ياسر للحصول على قوالب نوشن مخصصة، التعاون، فرص التسويق بالعمولة، أو أي استفسارات."
    : "Reach out to Mostafa Yasser for custom Notion templates, collaborations, affiliate opportunities, or any inquiries.";
  const url = `${siteUrl}/${locale}/contact`;
  const imageUrl = `${siteUrl}/icon.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: isArabic ? "تواصل مع مصطفى ياسر" : "Contact Mostafa Yasser",
      description,
      type: "website",
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic ? "تواصل مع مصطفى ياسر" : "Contact Mostafa Yasser",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ContactPage() {
  return (
    <BlurText>
      <div className="bg-neutral-950 min-h-screen text-white selection:bg-main selection:text-neutral-900">
        <ContactHero />
        <ContactForm />
      </div>
    </BlurText>
  );
}
