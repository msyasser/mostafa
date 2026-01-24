"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";

function CheckoutButton({
  checkoutLink,
  checkoutText,
  arabicCheckoutLink,
  arabicCheckoutText,
  englishCheckoutLink,
  englishCheckoutText
}) {
  const locale = useLocale();
  const t = useTranslations("TemplateSlug");
  const [isClient, setIsClient] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(locale === 'ar' ? 'ar' : 'en'); // Start with current website locale
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const dropdownRef = useRef(null);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine which link and text to use based on selected language
  const getLinkAndText = () => {
    if (selectedLanguage === 'ar' && arabicCheckoutLink) {
      return {
        link: arabicCheckoutLink,
        text: checkoutText // Always use the current locale's text for UI
      };
    } else if (selectedLanguage === 'en' && englishCheckoutLink) {
      return {
        link: englishCheckoutLink,
        text: checkoutText // Always use the current locale's text for UI
      };
    } else {
      return {
        link: checkoutLink,
        text: checkoutText
      };
    }
  };

  const { link, text } = getLinkAndText();

  // Check if link is empty
  const isLinkEmpty = !link || link.trim() === '';

  // Check if specific language links are empty
  const isArabicLinkEmpty = !arabicCheckoutLink || arabicCheckoutLink.trim() === '';
  const isEnglishLinkEmpty = !englishCheckoutLink || englishCheckoutLink.trim() === '';

  const handleLanguageSelect = (lang) => {
    // Prevent selection if the language link is empty
    if (lang === 'ar' && isArabicLinkEmpty) {
      setIsDropdownOpen(false);
      return;
    }
    if (lang === 'en' && isEnglishLinkEmpty) {
      setIsDropdownOpen(false);
      return;
    }
    if (lang === selectedLanguage) {
      setIsDropdownOpen(false);
      return;
    }

    // Start transition
    setIsTextTransitioning(true);
    setIsDropdownOpen(false);

    // Change language after fade out
    setTimeout(() => {
      setSelectedLanguage(lang);
      // End transition after text changes
      setTimeout(() => {
        setIsTextTransitioning(false);
      }, 50);
    }, 200);
  };

  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="relative inline-block overflow-hidden px-6 py-4 sm:px-6 sm:py-3 font-normal text-black bg-white rounded-full group shadow-lg w-full sm:w-auto text-center touch-manipulation">
        <span className="relative block text-base sm:text-lg">
          {checkoutText}
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex group" ref={dropdownRef}>
      {/* Main Checkout Button */}
      {isLinkEmpty ? (
        <button
          disabled
          className={`relative inline-block overflow-hidden px-6 py-4 sm:px-6 sm:py-3 font-normal text-gray-400 bg-gray-200 shadow-lg cursor-not-allowed w-full sm:w-auto text-center touch-manipulation opacity-60 ${locale === 'ar' ? 'rounded-r-full' : 'rounded-l-full'
            }`}
        >
          <span className="relative block text-base sm:text-lg min-w-0">
            <span className={`inline-block transition-all duration-300 ease-in-out ${isTextTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {text}
            </span>
          </span>
        </button>
      ) : (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative inline-block overflow-hidden px-6 py-4 sm:px-6 sm:py-3 font-normal text-black bg-white shadow-lg group-hover:shadow-gray-300/50 active:scale-95 group-hover:scale-[1.02] transition-all duration-300 ease-in-out w-full sm:w-auto text-center touch-manipulation ${locale === 'ar' ? 'rounded-r-full' : 'rounded-l-full'
            }`}
        >
          <span className="absolute top-0 left-0 w-full h-full bg-main transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 ease-in-out origin-left" />
          <span className="relative block text-base sm:text-lg transform transition-all duration-500 ease-in-out group-hover:text-white min-w-0">
            <span className={`inline-block transition-all duration-300 ease-in-out ${isTextTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {text}
            </span>
          </span>
        </a>
      )}

      {/* Dropdown Toggle Button */}
      <button
        onClick={() => !isLinkEmpty && setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLinkEmpty}
        className={`inline-flex items-center justify-center px-3 py-4 sm:py-3 border border-gray-200 transition-colors duration-200 touch-manipulation ${isLinkEmpty
          ? 'bg-gray-200 cursor-not-allowed opacity-60'
          : 'bg-white hover:bg-gray-50 cursor-pointer'
          } ${locale === 'ar'
            ? 'border-r rounded-l-full'
            : 'border-l rounded-r-full'
          }`}
        aria-label="Select language"
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (() => {
        const isArabicSelected = selectedLanguage === 'ar';
        const orderedOptions = isArabicSelected
          ? ['ar', 'en']
          : ['en', 'ar'];
        const getLanguageLabel = (lang) => {
          if (locale === 'ar') {
            return lang === 'ar' ? 'العربية' : 'الإنجليزية';
          }
          return lang === 'ar' ? 'Arabic' : 'English';
        };

        const renderOption = (lang) => {
          const isArabic = lang === 'ar';
          const isSelected = selectedLanguage === lang;
          const isDisabled = isArabic ? isArabicLinkEmpty : isEnglishLinkEmpty;

          return (
            <button
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              disabled={isDisabled}
              className={`w-full px-4 py-3 text-sm transition-colors duration-150 ${isArabic ? 'text-right' : 'text-left'} ${isDisabled
                ? 'cursor-not-allowed opacity-50 text-gray-400'
                : isSelected
                  ? 'bg-gray-50 text-main cursor-pointer'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-main cursor-pointer'
                }`}
            >
              <span className="flex items-center justify-between">
                <span>{getLanguageLabel(lang)}</span>
                {!isDisabled && isSelected && (
                  <span className="text-xs text-main">✓</span>
                )}
              </span>
            </button>
          );
        };

        return (
          <div
            className={`absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-md z-50 overflow-hidden ${locale === 'ar' ? 'right-0' : 'left-0'
              }`}
          >
            <div className="px-4 py-2 text-sm font-semibold text-gray-600 text-center">
              {t("templateLanguage")}
            </div>
            <div className="border-t border-gray-100" />
            {orderedOptions.map((lang, index) => (
              <div key={lang}>
                {renderOption(lang)}
                {index === 0 && <div className="border-t border-gray-100" />}
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

export default CheckoutButton;
