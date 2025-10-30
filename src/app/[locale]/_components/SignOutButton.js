"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SignOutButton({ locale }) {
  const t = useTranslations("Auth");

  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className="px-4 py-2 text-sm text-red-400 border border-red-400/40 rounded-lg hover:bg-white/10 transition-colors"
    >
      {t("SIGN_OUT")}
    </button>
  );
}


