"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  BsPerson,
  BsShieldLock,
  BsSliders,
  BsGrid,
  BsCheckCircleFill,
  BsExclamationCircleFill,
  BsArrowRight,
  BsArrowLeft,
  BsGoogle,
  BsPatchCheckFill,
  BsClock,
  BsGlobe,
  BsTelephone,
  BsEnvelope,
  BsKey,
  BsLayers,
  BsBook,
  BsTools,
  BsCalendarCheck,
  BsTrash,
  BsExclamationTriangle,
} from "react-icons/bs";
import AnimatedInView from "../../_components/AnimatedInView";

export default function ProfileClient({ user: initialUser, locale }) {
  const t = useTranslations("ProfilePage");
  const isArabic = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: initialUser?.name || "",
    email: initialUser?.email || "",
    phone: "",
    createdAt: "",
    isGoogleUser: !!initialUser?.image,
  });

  const [loading, setLoading] = useState(true);

  // Form states - Profile
  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Form states - Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Danger Zone / Delete Account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfileData(data.user);
            setFormData({
              name: data.user.name || "",
              phone: data.user.phone || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Auto-dismiss messages after 3.5 seconds
  useEffect(() => {
    if (profileMessage.text) {
      const timer = setTimeout(() => {
        setProfileMessage({ type: "", text: "" });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [profileMessage]);

  useEffect(() => {
    if (passwordMessage.text) {
      const timer = setTimeout(() => {
        setPasswordMessage({ type: "", text: "" });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileMessage({ type: "error", text: data.error || t("personalInfo.saveError") });
      } else {
        setProfileMessage({ type: "success", text: t("personalInfo.saveSuccess") });
        setProfileData((prev) => ({
          ...prev,
          name: formData.name,
          phone: formData.phone,
        }));
        router.refresh();
      }
    } catch (err) {
      setProfileMessage({ type: "error", text: t("personalInfo.saveError") });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: t("security.passwordMismatch") });
      setPasswordSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: t("security.passwordTooShort") });
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordMessage({ type: "error", text: data.error || "Failed to update password" });
      } else {
        setPasswordMessage({ type: "success", text: t("security.passwordSuccess") });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        setDeletingAccount(false);
      } else {
        setShowDeleteModal(false);
        // Sign out user and redirect to homepage
        await signOut({ callbackUrl: `/${locale}` });
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
      setDeletingAccount(false);
    }
  };

  const switchLanguage = (newLocale) => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const tabs = [
    { id: "profile", label: t("tabs.profile"), icon: BsPerson },
    { id: "security", label: t("tabs.security"), icon: BsShieldLock },
    { id: "preferences", label: t("tabs.preferences"), icon: BsSliders },
    { id: "hub", label: t("tabs.hub"), icon: BsGrid },
  ];

  const ArrowIcon = isArabic ? BsArrowLeft : BsArrowRight;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-main/5 blur-[150px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-main/5 blur-[130px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <AnimatedInView threshold={0.1} className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
            <div>
              <span className="px-3.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/80 text-main text-xs font-mono tracking-wider uppercase mb-3 inline-block backdrop-blur-md">
                {t("badge")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t("title")}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-xl">
                {t("subtitle")}
              </p>
            </div>

            {/* Account Status Card */}
            <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md shadow-lg">
              <div className="w-10 h-10 rounded-full bg-main/10 border border-main/20 flex items-center justify-center text-main">
                <BsPatchCheckFill className="text-xl" />
              </div>
              <div className="text-xs">
                <span className="text-neutral-400 block">{t("stats.status")}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t("stats.active")} • {t("stats.standardClient")}
                </span>
              </div>
            </div>
          </div>
        </AnimatedInView>

        {/* User Quick Info Banner */}
        <AnimatedInView threshold={0.1} className="mb-8">
          <div className="bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-900/90 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Initial or Picture */}
              <div className="relative">
                {initialUser?.image ? (
                  <Image
                    src={initialUser.image}
                    alt={profileData.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-main/40 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-main flex items-center justify-center text-black font-extrabold text-3xl shadow-xl ring-4 ring-main/20">
                    {profileData.name?.[0]?.toUpperCase() || profileData.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                {profileData.isGoogleUser && (
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-md text-xs font-bold"
                    title="Google Connected"
                  >
                    <BsGoogle className="text-neutral-900" />
                  </div>
                )}
              </div>

              {/* Identity & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {profileData.name || "Client User"}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-main/10 border border-main/30 text-main text-xs font-semibold">
                    {profileData.isGoogleUser ? "Google Auth" : "Direct Account"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-xs sm:text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <BsEnvelope className="text-main/80 text-sm" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center gap-2">
                      <BsTelephone className="text-main/80 text-sm" />
                      <span dir="ltr">{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.createdAt && (
                    <div className="flex items-center gap-2">
                      <BsClock className="text-main/80 text-sm" />
                      <span>
                        {t("stats.memberSince")}: {profileData.createdAt}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedInView>

        {/* Main Grid: Tabs & Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs (Sidebar on desktop) */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-2.5 backdrop-blur-xl shadow-xl sticky top-28">
              <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-main text-black font-semibold shadow-lg shadow-main/10"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                      }`}
                    >
                      <Icon className={`text-lg ${isActive ? "text-black" : "text-main"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-8">
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl min-h-[420px]">
              {/* TAB 1: PROFILE INFO */}
              {activeTab === "profile" && (
                <div>
                  <div className="border-b border-neutral-800 pb-5 mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <BsPerson className="text-main text-2xl" />
                      {t("personalInfo.title")}
                    </h3>
                    <p className="text-neutral-400 text-sm mt-1">
                      {t("personalInfo.description")}
                    </p>
                  </div>

                  {profileMessage.text && (
                    <div
                      className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm transition-all duration-300 animate-fadeIn ${
                        profileMessage.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                          : "bg-red-500/10 border border-red-500/30 text-red-300"
                      }`}
                    >
                      {profileMessage.type === "success" ? (
                        <BsCheckCircleFill className="text-emerald-400 shrink-0 text-lg" />
                      ) : (
                        <BsExclamationCircleFill className="text-red-400 shrink-0 text-lg" />
                      )}
                      <span>{profileMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        {t("personalInfo.fullName")}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("personalInfo.fullNamePlaceholder")}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-sm"
                      />
                    </div>

                    {/* Email (Readonly) */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        {t("personalInfo.email")}
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-neutral-400 cursor-not-allowed text-sm"
                      />
                      <p className="text-xs text-neutral-500 mt-1.5">
                        {t("personalInfo.emailHint")}
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                        {t("personalInfo.phone")}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t("personalInfo.phonePlaceholder")}
                        dir="ltr"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-sm text-left"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="px-6 py-3 rounded-xl bg-main hover:bg-main/90 text-black font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-main/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {profileSaving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>{t("personalInfo.saving")}</span>
                          </>
                        ) : (
                          <span>{t("personalInfo.saveChanges")}</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === "security" && (
                <div>
                  <div className="border-b border-neutral-800 pb-5 mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <BsShieldLock className="text-main text-2xl" />
                      {t("security.title")}
                    </h3>
                    <p className="text-neutral-400 text-sm mt-1">
                      {t("security.description")}
                    </p>
                  </div>

                  {profileData.isGoogleUser ? (
                    <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                      <div className="w-12 h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center text-xl mx-auto mb-3 shadow-lg">
                        <BsGoogle />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">
                        {t("security.googleAccount")}
                      </h4>
                      <p className="text-neutral-400 text-sm max-w-md mx-auto">
                        {t("security.googleAccountDesc")}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {passwordMessage.text && (
                        <div
                          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm transition-all duration-300 animate-fadeIn ${
                            passwordMessage.type === "success"
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                              : "bg-red-500/10 border border-red-500/30 text-red-300"
                          }`}
                        >
                          {passwordMessage.type === "success" ? (
                            <BsCheckCircleFill className="text-emerald-400 shrink-0 text-lg" />
                          ) : (
                            <BsExclamationCircleFill className="text-red-400 shrink-0 text-lg" />
                          )}
                          <span>{passwordMessage.text}</span>
                        </div>
                      )}

                      <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                            {t("security.currentPassword")}
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            placeholder={t("security.currentPasswordPlaceholder")}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                              {t("security.newPassword")}
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                              }
                              placeholder={t("security.newPasswordPlaceholder")}
                              required
                              minLength={6}
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                              {t("security.confirmPassword")}
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                              }
                              placeholder={t("security.confirmPasswordPlaceholder")}
                              required
                              minLength={6}
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-sm"
                            />
                          </div>
                        </div>

                        <div className="pt-3">
                          <button
                            type="submit"
                            disabled={passwordSaving}
                            className="px-6 py-3 rounded-xl bg-main hover:bg-main/90 text-black font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-main/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {passwordSaving ? (
                              <>
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                <span>{t("security.updatingPassword")}</span>
                              </>
                            ) : (
                              <span>{t("security.updatePassword")}</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Danger Zone: Delete Account */}
                  <div className="mt-10 pt-8 border-t border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-base mb-1">
                      <BsExclamationTriangle className="text-lg" />
                      <h4>{t("dangerZone.title")}</h4>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4">
                      {t("dangerZone.deleteDesc")}
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                      <BsTrash className="text-sm" />
                      <span>{t("dangerZone.deleteBtn")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: PREFERENCES */}
              {activeTab === "preferences" && (
                <div>
                  <div className="border-b border-neutral-800 pb-5 mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <BsSliders className="text-main text-2xl" />
                      {t("preferences.title")}
                    </h3>
                    <p className="text-neutral-400 text-sm mt-1">
                      {t("preferences.description")}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Language Switcher */}
                    <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <BsGlobe className="text-main" />
                          <span>{t("preferences.language")}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          {t("preferences.languageDesc")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
                        <button
                          onClick={() => switchLanguage("en")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            locale === "en"
                              ? "bg-main text-black shadow-md"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => switchLanguage("ar")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            locale === "ar"
                              ? "bg-main text-black shadow-md"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          العربية
                        </button>
                      </div>
                    </div>

                    {/* Theme Setting */}
                    <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold text-sm block">
                          {t("preferences.theme")}
                        </span>
                        <span className="text-xs text-neutral-400 mt-0.5 block">
                          {t("preferences.themeDark")}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
                        Dark
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MY HUB */}
              {activeTab === "hub" && (
                <div>
                  <div className="border-b border-neutral-800 pb-5 mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <BsGrid className="text-main text-2xl" />
                      {t("hub.title")}
                    </h3>
                    <p className="text-neutral-400 text-sm mt-1">
                      {t("hub.description")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Templates */}
                    <Link
                      href={`/${locale}/templates`}
                      className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-main/50 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center text-main mb-3 group-hover:scale-110 transition-transform">
                          <BsLayers className="text-xl" />
                        </div>
                        <h4 className="text-white font-bold text-base mb-1">
                          {t("hub.templatesTitle")}
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          {t("hub.templatesDesc")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-main text-xs font-semibold mt-4">
                        <span>{t("hub.browse")}</span>
                        <ArrowIcon className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </Link>

                    {/* Courses */}
                    <Link
                      href={`/${locale}/courses`}
                      className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-main/50 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center text-main mb-3 group-hover:scale-110 transition-transform">
                          <BsBook className="text-xl" />
                        </div>
                        <h4 className="text-white font-bold text-base mb-1">
                          {t("hub.coursesTitle")}
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          {t("hub.coursesDesc")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-main text-xs font-semibold mt-4">
                        <span>{t("hub.browse")}</span>
                        <ArrowIcon className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </Link>

                    {/* Tools */}
                    <Link
                      href={`/${locale}/tools`}
                      className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-main/50 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center text-main mb-3 group-hover:scale-110 transition-transform">
                          <BsTools className="text-xl" />
                        </div>
                        <h4 className="text-white font-bold text-base mb-1">
                          {t("hub.toolsTitle")}
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          {t("hub.toolsDesc")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-main text-xs font-semibold mt-4">
                        <span>{t("hub.browse")}</span>
                        <ArrowIcon className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </Link>

                    {/* Contact & Systems */}
                    <Link
                      href={`/${locale}/contact`}
                      className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 hover:border-main/50 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center text-main mb-3 group-hover:scale-110 transition-transform">
                          <BsCalendarCheck className="text-xl" />
                        </div>
                        <h4 className="text-white font-bold text-base mb-1">
                          {t("hub.contactTitle")}
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          {t("hub.contactDesc")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-main text-xs font-semibold mt-4">
                        <span>{t("hub.browse")}</span>
                        <ArrowIcon className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center text-xl mb-4 mx-auto">
              <BsTrash />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              {t("dangerZone.modalTitle")}
            </h3>
            <p className="text-sm text-neutral-400 text-center mb-6 leading-relaxed">
              {t("dangerZone.modalDesc")}
            </p>

            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
                className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {t("dangerZone.cancel")}
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingAccount ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("dangerZone.deleting")}</span>
                  </>
                ) : (
                  <span>{t("dangerZone.confirmDelete")}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
