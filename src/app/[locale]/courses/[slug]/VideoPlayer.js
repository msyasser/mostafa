"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { PlayIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function VideoPlayer({ course, playlistVideos }) {
  const t = useTranslations("CoursesPage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [selectedVideo, setSelectedVideo] = useState(playlistVideos[0]);
  const [watchedVideos, setWatchedVideos] = useState(new Set());

  // Load watched videos from localStorage on component mount
  useEffect(() => {
    const savedWatchedVideos = localStorage.getItem('watchedVideos');
    if (savedWatchedVideos) {
      try {
        const parsedVideos = JSON.parse(savedWatchedVideos);
        setWatchedVideos(new Set(parsedVideos));
      } catch (error) {
        // Silently handle parsing errors
      }
    }
  }, []);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const toggleVideoWatched = (videoId) => {
    const newWatchedVideos = new Set(watchedVideos);
    
    if (newWatchedVideos.has(videoId)) {
      // If already watched, remove it (unmark)
      newWatchedVideos.delete(videoId);
    } else {
      // If not watched, add it (mark as watched)
      newWatchedVideos.add(videoId);
    }
    
    setWatchedVideos(newWatchedVideos);
    
    // Save to localStorage
    localStorage.setItem('watchedVideos', JSON.stringify([...newWatchedVideos]));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Video Player Section */}
      <div className="flex-1">
        <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 mb-6">
          {/* Video Player */}
          <div className="aspect-video bg-black relative">
            <iframe
              key={selectedVideo.id}
              src={`https://www.youtube.com/embed/${selectedVideo.id}?rel=0&modestbranding=1`}
              title={isArabic ? selectedVideo.title_ar : selectedVideo.title}
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Video Info */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-3">
              {isArabic ? selectedVideo.title_ar : selectedVideo.title}
            </h2>
            <p className="text-gray-400 mb-4">
              {isArabic ? selectedVideo.description_ar : selectedVideo.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{selectedVideo.duration}</span>
                <span>•</span>
                <span>{isArabic ? "فيديو" : "Video"} {playlistVideos.indexOf(selectedVideo) + 1} {isArabic ? "من" : "of"} {playlistVideos.length}</span>
              </div>
              <button
                onClick={() => toggleVideoWatched(selectedVideo.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-colors duration-200 ${
                  watchedVideos.has(selectedVideo.id)
                    ? "text-gray-400 hover:text-white"
                    : "text-main hover:text-white"
                }`}
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm">
                  {watchedVideos.has(selectedVideo.id) 
                    ? (isArabic ? "إلغاء المشاهدة" : "Mark as Not Watched")
                    : (isArabic ? "تم المشاهدة" : "Mark as Watched")
                  }
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <h3 className="text-xl font-bold text-white mb-4">
            {isArabic ? "مميزات الدورة" : "Course Features"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-main flex-shrink-0" />
                <span className="text-gray-300">
                  {isArabic ? course.features_ar[index] : feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video List Sidebar */}
      <div className="lg:w-96">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-lg font-semibold text-white">
              {isArabic ? "فيديوهات الدورة" : "Course Videos"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {playlistVideos.length} {isArabic ? "فيديو" : "videos"}
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {playlistVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors duration-200 ${
                  selectedVideo.id === video.id
                    ? "bg-main/10 border-main/30"
                    : "hover:bg-neutral-800"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={video.thumbnail}
                      alt={isArabic ? video.title_ar : video.title}
                      width={64}
                      height={48}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                      {isArabic ? video.title_ar : video.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {isArabic ? video.description_ar : video.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {isArabic ? "فيديو" : "Video"} {index + 1}
                      </span>
                      {watchedVideos.has(video.id) && (
                        <CheckCircleIcon className="w-4 h-4 text-main" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {isArabic ? "إحصائيات الدورة" : "Course Stats"}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{isArabic ? "إجمالي الفيديوهات" : "Total Videos"}</span>
              <span className="text-white font-medium">{playlistVideos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{isArabic ? "المدة الإجمالية" : "Total Duration"}</span>
              <span className="text-white font-medium">29:50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
