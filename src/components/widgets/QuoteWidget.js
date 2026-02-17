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

    const [quote, setQuote] = useState({
        text: "Productivity is doing the right things, not just doing things right.",
        author: "Peter Drucker",
    });

    useEffect(() => {
        const quotes = [
            {
                text: "The way to get started is to quit talking and begin doing.",
                author: "Walt Disney",
            },
            {
                text: "Your time is limited, so don't waste it living someone else's life.",
                author: "Steve Jobs",
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt",
            },
            {
                text: "If you look at what you have in life, you'll always have more.",
                author: "Oprah Winfrey",
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
                {quote.text}
            </blockquote>
            <cite className={`block text-sm font-light not-italic ${authorClass}`}>
                - {quote.author}
            </cite>
        </div>
    );
}
