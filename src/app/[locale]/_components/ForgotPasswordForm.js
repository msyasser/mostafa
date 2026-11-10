"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getSafeCallbackUrl } from "@/src/lib/redirect";
import BlurText from "@/src/app/[locale]/_components/BlurText";
import ConfirmationCard, { StatusHeader } from "@/src/app/[locale]/_components/ConfirmationCard";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, RotateCw } from "lucide-react";

const inputClass =
  "w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141414] text-white placeholder:text-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 border border-neutral-800 transition-all duration-200 text-sm sm:text-base";
const buttonClass =
  "w-full py-4 bg-main text-neutral-950 font-bold text-base rounded-xl shadow-[0_0_20px_rgba(215,177,128,0.25)] hover:shadow-[0_0_30px_rgba(215,177,128,0.4)] hover:bg-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
const errorClass = "bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-400 text-sm text-center";

export default function ForgotPasswordForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), locale);
  const signinHref = `/${locale}/auth/signin${callbackUrl && callbackUrl !== `/${locale}` ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;

  const [step, setStep] = useState("email"); // "email" | "reset" | "done"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (step !== "done") return;
    const timer = setTimeout(() => router.replace(signinHref), 2500);
    return () => clearTimeout(timer);
  }, [step, router, signinHref]);

  const post = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, locale }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || t("AUTH_ERROR"));
    return data;
  };

  const sendCode = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await post("/api/auth/forgot-password", { email: email.trim() });
      setToken(data.verificationToken);
      setStep("reset");
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (code.trim().length !== 6) return setError(t("ENTER_CODE_ERROR"));
    if (password.length < 6) return setError(t("PASSWORD_TOO_SHORT"));
    setIsLoading(true);
    try {
      await post("/api/auth/reset-password", {
        email: email.trim(),
        verificationToken: token,
        verificationCode: code.trim(),
        password,
      });
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlurText duration={0.8}>
      <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />

        {step === "email" && (
          <form onSubmit={sendCode} className="space-y-5">
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
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder={t("EMAIL_PLACEHOLDER")}
                />
              </div>
            </div>
            {error && <div className={errorClass}>{error}</div>}
            <button type="submit" disabled={isLoading} className={buttonClass}>
              {isLoading ? t("LOADING") : t("SEND_CODE")}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword} className="space-y-5">
            <StatusHeader state="wait" title={t("VERIFICATION_CODE")}>
              <span className="text-sm">{t("RESET_CODE_SENT")} <bdi className="text-white font-medium">{email}</bdi></span>
            </StatusHeader>
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-neutral-300">
                {t("VERIFICATION_CODE")} <span className="text-main">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <ShieldCheck size={18} />
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className={`${inputClass} tracking-[0.4em] font-mono`}
                  placeholder={t("VERIFICATION_CODE_PLACEHOLDER")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                {t("NEW_PASSWORD")} <span className="text-main">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-11`}
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
            {error && <div className={errorClass}>{error}</div>}
            <button type="submit" disabled={isLoading} className={buttonClass}>
              {isLoading ? t("LOADING") : t("RESET_PASSWORD")}
            </button>
            <button
              type="button"
              onClick={sendCode}
              disabled={isLoading || cooldown > 0}
              className="w-full text-sm text-neutral-400 hover:text-main transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCw size={14} />
              {t("RESEND_CODE")}
              {cooldown > 0 ? ` (${cooldown})` : ""}
            </button>
          </form>
        )}

        {step === "done" && (
          <ConfirmationCard bare state="success" title={t("PASSWORD_UPDATED_TITLE")} action={{ href: signinHref, label: t("SIGN_IN") }}>
            {t("PASSWORD_UPDATED")}
          </ConfirmationCard>
        )}

        {step !== "done" && (
          <div className="text-center pt-5">
            <Link href={signinHref} className="text-sm text-neutral-400 hover:text-main transition-colors">
              {t("BACK_TO_SIGNIN")}
            </Link>
          </div>
        )}
      </div>
    </BlurText>
  );
}
