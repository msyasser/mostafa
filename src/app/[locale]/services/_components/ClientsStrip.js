"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

// The clients listed on the Notion Marketplace profile (notion.com/@mostafayasser), in the same order
const clients = [
    { name: "Trend Design", logo: "/Clients/client-trend-design.webp" },
    { name: "Shoiep Studio", logo: "/Clients/client-shoiep-studio.webp" },
    { name: "Resaltk App", logo: "/Clients/client-resaltk-app.webp" },
    { name: "YuYan Academy", logo: "/Clients/client-yuyan-academy.webp" },
    { name: "Hazem", logo: "/Clients/client-hazem.webp" },
    { name: "Sustain Energy Academy", logo: "/Clients/client-sustain-energy-academy.webp" },
    { name: "Giftisan", logo: "/Clients/client-giftisan.webp" },
];

export default function ClientsStrip() {
    const locale = useLocale();
    const isArabic = locale === "ar";

    return (
        <div className="w-full py-12 bg-neutral-950 border-y border-neutral-900">
            <div className="container mx-auto px-6">
                <p className="text-neutral-400 font-mono text-xs tracking-[0.3em] uppercase rtl:tracking-normal rtl:normal-case rtl:text-sm text-center mb-8">
                    {isArabic ? "فرق بنيت لها أنظمة" : "Teams I've built systems for"}
                </p>

                <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {clients.map((client) => (
                        <li
                            key={client.name}
                            title={client.name}
                            className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden ring-1 ring-white/10"
                        >
                            <Image
                                src={client.logo}
                                alt={client.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
