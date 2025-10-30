"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";

export default function SignInForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignup) {
        // Validation for signup
        if (!formData.name || !formData.email || !formData.password) {
          setError(t("ALL_FIELDS_REQUIRED"));
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError(t("PASSWORDS_DONT_MATCH"));
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError(t("PASSWORD_TOO_SHORT"));
          setIsLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        callbackUrl: `/`,
        action: isSignup ? "signup" : "login",
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Successful authentication → go to locale home (locale-aware)
        router.replace(`/`);
      }
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <BlurText duration={1}>
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 sm:p-8 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t("NAME")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
                placeholder={t("NAME_PLACEHOLDER")}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("EMAIL")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
              placeholder={t("EMAIL_PLACEHOLDER")}
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                {t("PHONE")}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
                placeholder={t("PHONE_PLACEHOLDER")}
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t("PASSWORD")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
              placeholder={t("PASSWORD_PLACEHOLDER")}
            />
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("CONFIRM_PASSWORD")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
                placeholder={t("CONFIRM_PASSWORD_PLACEHOLDER")}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-main text-black font-semibold rounded-lg shadow-md hover:bg-transparent hover:text-main border border-main transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? t("LOADING")
              : isSignup
              ? t("SIGN_UP")
              : t("SIGN_IN")}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  phone: "",
                });
              }}
              className="text-main hover:underline text-sm"
            >
              {isSignup ? t("HAVE_ACCOUNT") : t("NO_ACCOUNT")}
            </button>
          </div>
        </form>
      </div>
    </BlurText>
  );
}

