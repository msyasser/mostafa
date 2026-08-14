"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaBlog, FaTools, FaPlay } from "react-icons/fa";
import AnimatedWrapper from "./AnimatedWrapper";
import AnimatedInView from "./AnimatedInView";
import PomodoroWidget from "@/src/components/widgets/Pomodoro";

const YOUTUBE_ID = "Ocl3MNGa2Fg";

function YouTubeFacade() {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${YOUTUBE_ID}?si=7_5ndgHZu1m1JWu_&autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="relative w-full h-full group/yt cursor-pointer"
      aria-label="Play YouTube video"
    >
      <Image
        src={`https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`}
        alt="YouTube video thumbnail"
        fill
        className="object-cover"
        loading="lazy"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover/yt:bg-black/10 transition-colors duration-300" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover/yt:scale-110 transition-transform duration-200">
          <FaPlay className="text-white text-xl ml-1" />
        </div>
      </div>
    </button>
  );
}

export default function ContentAuthoritySection() {
    const t = useTranslations("HomePage");
    const tTools = useTranslations("ToolsPage");
    const locale = useLocale();

    return (
        <section className="w-full py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <AnimatedInView threshold={0.1}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            {t("contentTitle")}
                        </h2>
                    </AnimatedInView>
                    <AnimatedInView threshold={0.1}>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-2">
                            {t("contentDescription")}
                        </p>
                    </AnimatedInView>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left: YouTube Video Embed */}
                    <AnimatedWrapper delay={0.1}>
                        <div className="h-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-main/50 transition-all duration-500 hover:shadow-2xl hover:shadow-main/10 flex flex-col group">
                            {/* YouTube Facade */}
                            <div className="relative aspect-video w-full bg-black border-b border-neutral-800">
                                <YouTubeFacade />

                            </div>
                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                                        <FaYoutube className="text-xl text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-main transition-colors">
                                        {t("youtubeCard")}
                                    </h3>
                                </div>
                                <p className="text-neutral-400 text-base leading-relaxed mb-4 flex-1">
                                    {t("youtubeDesc")}
                                </p>
                                <Link
                                    href="https://www.youtube.com/@engmsyasser"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-main font-medium hover:gap-3 transition-all"
                                >
                                    {t("visitChannel")} <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    </AnimatedWrapper>

                    {/* Middle: Blog with Image */}
                    <AnimatedWrapper delay={0.2}>
                        <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-main/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-main/10 group">
                            <Link href={`/${locale}/blog/what-is-notion`} className="flex flex-col flex-1">
                                {/* Blog Image */}
                                <div className="relative aspect-video w-full bg-neutral-800 overflow-hidden border-b border-neutral-800">
                                    <Image
                                        src="/blogs/ENBlogs/1.webp"
                                        alt="What is Notion?"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-main/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-bold text-black uppercase tracking-wider">Featured</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 pb-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-main/20 transition-colors">
                                            <FaBlog className="text-xl text-main" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-main transition-colors">
                                            {t("blogTitle")}
                                        </h3>
                                    </div>
                                    <p className="text-neutral-400 text-base leading-relaxed mb-4 flex-1">
                                        {t("blogDesc")}
                                    </p>
                                </div>
                            </Link>
                            <div className="p-6 pt-0 mt-auto">
                                <Link
                                    href={`/${locale}/blog`}
                                    className="inline-flex items-center gap-2 text-main font-medium hover:gap-3 transition-all"
                                >
                                    {t("viewBlogs")} <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    </AnimatedWrapper>

                    {/* Right: Tool with Image */}
                    <AnimatedWrapper delay={0.3}>
                        <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-main/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-main/10 group">
                            <Link href={`/${locale}/tools/pomodoro`} className="flex flex-col flex-1">
                                {/* Tool Preview */}
                                <div className="relative aspect-video w-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center overflow-hidden border-b border-neutral-800">
                                    <div className="scale-75 opacity-90 group-hover:scale-90 transition-transform duration-500">
                                        <PomodoroWidget />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Tool</span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 pb-2">
                                    <div className="items-center gap-3 mb-3 inline-flex">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                            <FaTools className="text-xl text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-main transition-colors">
                                            {tTools("pomodoroTitle")}
                                        </h3>
                                    </div>
                                    <p className="text-neutral-400 text-base leading-relaxed mb-4 flex-1">
                                        {tTools("pomodoroDesc")}
                                    </p>
                                </div>
                            </Link>
                            <div className="p-6 pt-0 mt-auto">
                                <Link
                                    href={`/${locale}/tools`}
                                    className="inline-flex items-center gap-2 text-main font-medium hover:gap-3 transition-all"
                                >
                                    {t("viewTools")} <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    </AnimatedWrapper>

                </div>
            </div>
        </section>
    );
}
