"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/src/i18n/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignInForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const isArabic = locale === "ar";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formEl = e.currentTarget;
    const currentEmail = formData.email?.trim() || formEl.elements?.email?.value?.trim() || "";
    const currentPassword = formData.password || formEl.elements?.password?.value || "";

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: currentEmail,
        password: currentPassword,
        action: "login",
        callbackUrl: `/${locale}`,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.replace(`/`);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlurText duration={0.8}>
      <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Subtle top brand accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
              {t("EMAIL")} <span className="text-main">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141414] text-white placeholder:text-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 border border-neutral-800 transition-all duration-200 text-sm sm:text-base"
                placeholder={t("EMAIL_PLACEHOLDER")}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
              {t("PASSWORD")} <span className="text-main">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#141414] text-white placeholder:text-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 border border-neutral-800 transition-all duration-200 text-sm sm:text-base"
                placeholder={t("PASSWORD_PLACEHOLDER")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-main text-neutral-950 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(215,177,128,0.25)] hover:shadow-[0_0_30px_rgba(215,177,128,0.4)] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">{t("LOADING")}</span>
            ) : (
              <span className="inline-flex items-center gap-2">
                {t("SIGN_IN")}
                {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </span>
            )}
          </button>

          {/* Link to Sign Up */}
          <div className="text-center pt-2">
            <Link
              href={`/${locale}/auth/signup`}
              className="text-sm text-neutral-400 hover:text-main transition-colors inline-flex items-center gap-1.5"
            >
              {t("NO_ACCOUNT")}
            </Link>
          </div>
        </form>
      </div>
    </BlurText>
  );
}
