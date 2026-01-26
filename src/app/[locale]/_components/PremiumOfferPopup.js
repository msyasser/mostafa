"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Gift, Percent } from "lucide-react";

export default function PremiumOfferPopup({ template, isOpen, onClose }) {
  const t = useTranslations("TemplateSlug");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Coupon code - MS30 for 30% off
  const couponCode = "MS30";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-2 left-2 right-2 sm:bottom-3 sm:right-3 sm:left-auto md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 z-50 w-auto sm:w-80 md:w-80 lg:w-80 xl:w-80 sm:max-w-80"
        >
          {/* Popup Content */}
          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </button>

            {/* Header with Gift Icon - Hidden on small screens */}
            <div className="hidden sm:block relative bg-gradient-to-r from-main to-main/80 p-3 text-center">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full flex-shrink-0"
                >
                  <Gift className="w-4 h-4 text-white" />
                </motion.div>
                <div className="flex-1 text-left min-w-0">
                  <h2 className="text-sm font-bold text-white truncate">
                    {t("premiumOffer.title")}
                  </h2>
                  <p className="text-white/90 text-xs line-clamp-2">
                    {t("premiumOffer.subtitle")}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
              {/* Discount Badge */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                  className="inline-flex items-center gap-1 bg-main/10 text-main px-2 py-1 rounded-full text-xs font-bold"
                >
                  <Percent className="w-3 h-3" />
                  50% OFF
                </motion.div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2">
                <p className="hidden sm:block text-center text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                  {t("premiumOffer.couponDescription")}
                </p>

                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-2 border-2 border-dashed border-main/30">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <code className="flex-1 font-mono text-sm font-bold text-main bg-white dark:bg-neutral-700 px-2 py-1.5 sm:py-1 rounded text-center sm:text-left">
                      {couponCode}
                    </code>
                    <button
                      onClick={handleCopyCoupon}
                      className={`flex items-center justify-center gap-1 px-3 py-1.5 sm:py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${copied
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-main text-black hover:bg-main/80"
                        }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          {t("premiumOffer.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          {t("premiumOffer.copy")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Hidden on small screens */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {t("premiumOffer.maybeLater")}
                </button>
                <button
                  onClick={() => {
                    // You can add navigation to checkout or pricing section here
                    window.location.href = `#pricing`;
                    onClose();
                  }}
                  className="flex-1 px-3 py-2 bg-main text-black rounded-lg text-sm font-bold hover:bg-main/80 transition-colors cursor-pointer"
                >
                  {t("premiumOffer.getOffer")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
