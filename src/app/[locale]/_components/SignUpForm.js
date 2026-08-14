"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/src/i18n/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import CustomPhoneInput from "@/src/app/[locale]/_components/CustomPhoneInput";
import { Mail, User, Lock, Eye, EyeOff, RotateCw, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignUpForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const isArabic = locale === "ar";

  const [step, setStep] = useState("form"); // "form" | "verify"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verificationToken, setVerificationToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1: Send verification code via Resend
  const handleSendVerification = async (customData) => {
    setIsLoading(true);
    setError("");

    const targetEmail = customData?.email || formData.email;
    const targetName = customData?.name || formData.name;

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
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
      setSuccessMessage(data.message || `${t("VERIFICATION_SENT_TO")} ${targetEmail}`);
    } catch (err) {
      setError(err.message || t("AUTH_ERROR"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Finalize signup with verification code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Step 1: Form Validation & Send OTP
    if (step === "form") {
      const formEl = e.currentTarget;
      const currentName = formData.name?.trim() || formEl.elements?.name?.value?.trim() || "";
      const currentEmail = formData.email?.trim() || formEl.elements?.email?.value?.trim() || "";
      const currentPhone = formData.phone?.trim() || formEl.elements?.phone?.value?.trim() || "";
      const currentPassword = formData.password || formEl.elements?.password?.value || "";
      const currentConfirmPassword = formData.confirmPassword || formEl.elements?.confirmPassword?.value || "";

      // Sync state if form elements had autofilled values
      if (
        currentName !== formData.name ||
        currentEmail !== formData.email ||
        currentPhone !== formData.phone ||
        currentPassword !== formData.password ||
        currentConfirmPassword !== formData.confirmPassword
      ) {
        setFormData({
          name: currentName,
          email: currentEmail,
          phone: currentPhone,
          password: currentPassword,
          confirmPassword: currentConfirmPassword,
        });
      }

      if (
        !currentName ||
        !currentEmail ||
        !currentPhone ||
        !currentPassword ||
        !currentConfirmPassword
      ) {
        setError(t("ALL_FIELDS_REQUIRED"));
        return;
      }

      if (currentPassword !== currentConfirmPassword) {
        setError(t("PASSWORDS_DONT_MATCH"));
        return;
      }

      if (currentPassword.length < 6) {
        setError(t("PASSWORD_TOO_SHORT"));
        return;
      }

      await handleSendVerification({
        name: currentName,
        email: currentEmail,
      });
      return;
    }

    // Step 2: Code Verification & Account Creation
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
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setError("");
    setVerificationCode("");
    await handleSendVerification();
  };

  return (
    <BlurText duration={0.8}>
      <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Subtle top brand accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 2: VERIFY CODE */}
          {step === "verify" ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-main/10 border border-main/30 flex items-center justify-center text-main shadow-[0_0_20px_rgba(215,177,128,0.2)]">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5">{t("VERIFICATION_CODE")}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed max-w-sm mx-auto">
                  {t("VERIFICATION_SENT_TO")}{" "}
                  <span className="text-main font-semibold block mt-1 break-all">{formData.email}</span>
                </p>
              </div>

              <div className="pt-2">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[12px] font-mono text-3xl font-bold py-4 rounded-2xl bg-[#141414] text-main placeholder:text-neutral-600 focus:outline-none focus:border-main focus:ring-2 focus:ring-main/30 border border-neutral-800 transition-all duration-200"
                  placeholder={t("VERIFICATION_CODE_PLACEHOLDER")}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {successMessage && !error && (
                <div className="bg-main/10 border border-main/30 rounded-xl p-3 text-main text-xs text-center">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-main text-neutral-950 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(215,177,128,0.25)] hover:shadow-[0_0_30px_rgba(215,177,128,0.4)] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">{t("LOADING")}</span>
                ) : (
                  <span>{t("VERIFY_AND_CREATE")}</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  {t("CHANGE_EMAIL")}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-main hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <RotateCw size={13} className={isLoading ? "animate-spin" : ""} />
                  {resendCooldown > 0
                    ? `${t("RESEND_IN")} ${resendCooldown}s`
                    : t("RESEND_CODE")}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: SIGNUP FORM INPUTS */
            <>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                  {t("NAME")} <span className="text-main">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141414] text-white placeholder:text-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 border border-neutral-800 transition-all duration-200 text-sm sm:text-base"
                    placeholder={t("NAME_PLACEHOLDER")}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
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

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-300">
                  {t("PHONE")} <span className="text-main">*</span>
                </label>
                <CustomPhoneInput
                  id="phone"
                  name="phone"
                  defaultCountry="EG"
                  placeholder={t("PHONE_PLACEHOLDER")}
                  value={formData.phone}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      phone: value || "",
                    }));
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300">
                  {t("CONFIRM_PASSWORD")} <span className="text-main">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#141414] text-white placeholder:text-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 border border-neutral-800 transition-all duration-200 text-sm sm:text-base"
                    placeholder={t("CONFIRM_PASSWORD_PLACEHOLDER")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                className="w-full py-4 bg-main text-neutral-950 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(215,177,128,0.25)] hover:shadow-[0_0_30px_rgba(215,177,128,0.4)] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">{t("LOADING")}</span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {t("SIGN_UP")}
                    {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </span>
                )}
              </button>

              {/* Link to Sign In */}
              <div className="text-center pt-2">
                <Link
                  href={`/${locale}/auth/signin`}
                  className="text-sm text-neutral-400 hover:text-main transition-colors inline-flex items-center gap-1.5"
                >
                  {t("HAVE_ACCOUNT")}
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </BlurText>
  );
}
