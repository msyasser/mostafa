import { Oswald, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "@/src/app/[locale]/_styles/globals.css";

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    preload: true,
    fallback: ["system-ui", "arial"],
});

const tajawal = Tajawal({
    subsets: ["arabic", "latin"],
    weight: ["400", "700"],
    display: "swap",
    preload: true,
    fallback: ["system-ui", "arial"],
});

export const metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function EmbedLayout({ children, params }) {
    const { locale } = await params;
    const messages = await getMessages();
    const dir = locale === "ar" ? "rtl" : "ltr";

    // Validate that the incoming `locale` parameter is valid
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html
            lang={locale}
            dir={dir}
            className={locale === "ar" ? tajawal.className : oswald.className}
            suppressHydrationWarning={true}
        >
            <body className="bg-transparent min-h-screen flex flex-col overflow-y-auto">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <main className="flex-1 flex flex-col w-full">
                        {children}
                    </main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
