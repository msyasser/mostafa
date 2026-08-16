"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

function SubscriptionForm({ children, className, includeName = false, buttonText }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const t = useTranslations("Subscription");
  const locale = useLocale();

  const submitLabel = buttonText || t("button");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isSubmitted || errorMessage) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        // Reset states after animation
        setTimeout(() => {
          setIsSubmitted(false);
          setErrorMessage("");
        }, 300); // Wait for fade out animation
      }, 3000); // Show message for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, errorMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const name = event.target.name?.value || "";

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage(t("error"));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          language: locale === 'ar' ? 'Arabic' : 'English'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        event.target.reset(); // Clear the form
      } else {
        setErrorMessage(data.error || t("error"));
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setErrorMessage(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div>
        <form className={className}>
          {includeName && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              disabled
              className="w-full px-5 py-3.5 rounded-xl shadow-md bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none transition disabled:opacity-50"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            required
            disabled
            className="w-full px-5 py-3.5 rounded-xl shadow-md bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled
            className="w-full px-6 py-3.5 bg-main text-black font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            Subscribe
          </button>
        </form>
        {children}
      </div>
    );
  }

  return (
    <div>
      <form
        className={className}
        onSubmit={handleSubmit}
      >
        {includeName && (
          <input
            type="text"
            name="name"
            placeholder={t("namePlaceholder")}
            required
            disabled={isLoading}
            className="w-full px-5 py-3.5 rounded-xl shadow-md bg-neutral-800/80 border border-neutral-700/80 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition duration-200"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder={t("placeholder")}
          required
          disabled={isLoading}
          className="w-full px-5 py-3.5 rounded-xl shadow-md bg-neutral-800/80 border border-neutral-700/80 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition duration-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3.5 bg-main text-black font-bold rounded-xl shadow-[0_0_20px_rgba(215,177,128,0.3)] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? t("loading") || "Loading..." : submitLabel}
        </button>
      </form>

      {isSubmitted && !errorMessage && showMessage && (
        <div className={`mt-4 text-center transition-all duration-500 ease-out transform ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
          <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
            <svg
              className="w-5 h-5 transition-all duration-300 ease-out"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{t("success")}</span>
          </div>
        </div>
      )}
      {errorMessage && showMessage && (
        <div className={`mt-4 text-center transition-all duration-500 ease-out transform ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
          <div className="flex items-center justify-center gap-2 text-red-400 font-medium">
            <svg
              className="w-5 h-5 transition-all duration-300 ease-out"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export default SubscriptionForm;
