"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function SignInForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}`;
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
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.replace(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
      setIsGoogleLoading(false);
    }
  };

  return (
    <BlurText duration={0.8}>
      <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Subtle top brand accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#141414] hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
        >
          {isGoogleLoading ? (
            <span className="inline-flex items-center gap-2 text-neutral-300 text-sm">
              {t("LOADING")}
            </span>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-neutral-200 group-hover:text-white transition-colors">
                {t("CONTINUE_WITH_GOOGLE")}
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative bg-neutral-900 px-3 text-xs uppercase tracking-wider text-neutral-500 font-mono">
            {t("OR")}
          </div>
        </div>

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
            disabled={isLoading || isGoogleLoading}
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
              href={`/${locale}/auth/signup${callbackUrl && callbackUrl !== `/${locale}` ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
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
