"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Settings } from "lucide-react";

export default function QuoteWidget({ theme = "dark" }) {
    const locale = useLocale();
    const isDark = theme === "dark";
    const containerClass = isDark
        ? "bg-neutral-900 border border-neutral-800"
        : "bg-white border border-gray-200";
    const markClass = isDark ? "text-neutral-700" : "text-gray-200";
    const quoteClass = isDark ? "text-white" : "text-gray-900";
    const authorClass = isDark ? "text-gray-400" : "text-gray-600";

    const isArabic = locale === "ar";
    const [quote, setQuote] = useState({
        text: "Productivity is doing the right things, not just doing things right.",
        text_ar: "الإنتاجية إنك تعمل الحاجات الصح، مش إنك تعمل الحاجات بشكل صح وبس.",
        author: "Peter Drucker",
        author_ar: "بيتر دراكر",
    });

    useEffect(() => {
        const quotes = [
            {
                text: "The way to get started is to quit talking and begin doing.",
                text_ar: "طريقة البداية إنك تبطّل كلام وتبدأ تنفّذ.",
                author: "Walt Disney",
                author_ar: "والت ديزني",
            },
            {
                text: "Your time is limited, so don't waste it living someone else's life.",
                text_ar: "وقتك محدود، فمتضيّعوش وانت عايش حياة حد تاني.",
                author: "Steve Jobs",
                author_ar: "ستيف جوبز",
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                text_ar: "المستقبل بتاع اللي بيؤمنوا بجمال أحلامهم.",
                author: "Eleanor Roosevelt",
                author_ar: "إليانور روزفلت",
            },
            {
                text: "If you look at what you have in life, you'll always have more.",
                text_ar: "لو بصّيت على اللي عندك في حياتك، هتلاقي عندك دايمًا أكتر.",
                author: "Oprah Winfrey",
                author_ar: "أوبرا وينفري",
            },
        ];
        // Pick a random quote each day or refresh
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className={`${containerClass} rounded-2xl p-6 text-center w-full max-w-full mx-auto shadow-xl relative overflow-hidden group transition-colors duration-300`}>
            <button
                onClick={() => window.open(`/${locale}/tools/quote`, '_blank')}
                className="absolute top-4 right-4 z-20 p-1.5 hover:bg-neutral-800/10 rounded-lg transition-colors text-neutral-500 hover:text-current cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
                <Settings size={16} />
            </button>
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-main via-purple-500 to-blue-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`text-4xl absolute top-4 left-4 font-serif ${markClass}`}>
                &quot;
            </div>
            <blockquote className={`text-lg md:text-xl font-medium mb-4 relative z-10 px-6 pt-2 ${quoteClass}`}>
                {isArabic ? quote.text_ar : quote.text}
            </blockquote>
            <cite className={`block text-sm font-light not-italic ${authorClass}`}>
                - {isArabic ? quote.author_ar : quote.author}
            </cite>
        </div>
    );
}
