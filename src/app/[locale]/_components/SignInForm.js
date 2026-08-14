"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import PhoneInput from "react-phone-number-input";
import { Mail, ArrowLeft, RotateCw } from "lucide-react";

export default function SignInForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "verify"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [verificationToken, setVerificationToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Countdown timer for resend code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 1: Send verification code via Resend
  const handleSendVerification = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          locale: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("AUTH_ERROR"));
      }

      setVerificationToken(data.verificationToken);
      setStep("verify");
      setResendCooldown(60); // 60s cooldown
      setSuccessMessage(data.message || t("VERIFICATION_SENT_TO") + " " + formData.email);
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Finalize signup with verification code or login directly
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // LOGIN Flow
    if (!isSignup) {
      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
          action: "login",
          callbackUrl: `/`,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          router.replace(`/`);
        }
      } catch (err) {
        setError(err.message || t("AUTH_ERROR"));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // SIGNUP Flow - Step 1: Validate inputs and send code
    if (step === "form") {
      if (!formData.name || !formData.email || !formData.password) {
        setError(t("ALL_FIELDS_REQUIRED"));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError(t("PASSWORDS_DONT_MATCH"));
        return;
      }

      if (formData.password.length < 6) {
        setError(t("PASSWORD_TOO_SHORT"));
        return;
      }

      await handleSendVerification();
      return;
    }

    // SIGNUP Flow - Step 2: Verify code and create user
    if (step === "verify") {
      if (!verificationCode || verificationCode.trim().length !== 6) {
        setError(t("ENTER_CODE_ERROR"));
        return;
      }

      setIsLoading(true);

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          action: "signup",
          verificationToken: verificationToken,
          verificationCode: verificationCode.trim(),
          callbackUrl: `/`,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          router.replace(`/`);
        }
      } catch (err) {
        setError(err.message || t("AUTH_ERROR"));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setError("");
    setVerificationCode("");
    await handleSendVerification();
  };

  return (
    <BlurText duration={1}>
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* VERIFY CODE STEP */}
          {isSignup && step === "verify" ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-main/10 border border-main/30 flex items-center justify-center text-main">
                  <Mail size={26} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{t("VERIFICATION_CODE")}</h3>
                <p className="text-gray-300 text-sm">
                  {t("VERIFICATION_SENT_TO")}{" "}
                  <span className="text-main font-semibold block mt-0.5">{formData.email}</span>
                </p>
              </div>

              <div>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[8px] font-mono text-2xl px-4 py-3.5 rounded-xl bg-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-main border border-white/20"
                  placeholder={t("VERIFICATION_CODE_PLACEHOLDER")}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {successMessage && !error && (
                <div className="bg-main/10 border border-main/30 rounded-lg p-3 text-main text-xs text-center">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3.5 bg-main text-black font-bold rounded-xl shadow-md hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("LOADING") : t("VERIFY_AND_CREATE")}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={14} />
                  {t("CHANGE_EMAIL")}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-main hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                >
                  <RotateCw size={12} className={isLoading ? "animate-spin" : ""} />
                  {resendCooldown > 0
                    ? `${t("RESEND_IN")} ${resendCooldown}s`
                    : t("RESEND_CODE")}
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD FORM (LOGIN OR SIGNUP STEP 1) */
            <>
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
                  <PhoneInput
                    id="phone"
                    international
                    defaultCountry="EG"
                    value={formData.phone}
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        phone: value || "",
                      });
                    }}
                    className="phone-input-custom"
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
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
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
                {isLoading ? t("LOADING") : isSignup ? t("SIGN_UP") : t("SIGN_IN")}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setStep("form");
                    setError("");
                    setSuccessMessage("");
                    setVerificationCode("");
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
            </>
          )}
        </form>
      </div>
    </BlurText>
  );
}
