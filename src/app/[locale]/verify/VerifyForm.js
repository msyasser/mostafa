"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CODE_RE = /^MY-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

// "my 64l3 6y9q a4uf", "MY64L36Y9QA4UF" and "MY-64L3-6Y9Q-A4UF" all mean the same code.
function normalize(value) {
  const s = String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return s.startsWith("MY") && s.length === 14 ? `MY-${s.slice(2, 6)}-${s.slice(6, 10)}-${s.slice(10)}` : String(value || "").trim().toUpperCase();
}

export default function VerifyForm({ locale }) {
  const ar = locale === "ar";
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const code = normalize(value);
    if (!CODE_RE.test(code)) {
      setError(ar ? "الكود مش مكتوب صح. شكله: MY-XXXX-XXXX-XXXX" : "That code is not in the right format. It looks like MY-XXXX-XXXX-XXXX");
      return;
    }
    setError("");
    router.push(`/${locale}/verify/${code}`);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 text-start">
      <label htmlFor="cert-code" className="block text-sm text-neutral-400 mb-2">
        {ar ? "رقم الاعتمادية أو الشهادة" : "Credential or certificate number"}
      </label>
      <input
        id="cert-code"
        dir="ltr"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        onChange={(e) => { setValue(e.target.value); if (error) setError(""); }}
        placeholder="MY-XXXX-XXXX-XXXX"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "cert-code-error" : undefined}
        className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-4 py-3.5 text-white text-center text-lg tracking-widest placeholder:text-neutral-600 focus:outline-none focus:border-main"
      />
      {error ? <p id="cert-code-error" role="alert" className="mt-2 text-sm text-[#F0A29A]">{error}</p> : null}
      <button
        type="submit"
        className="mt-6 inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-main text-neutral-950 font-bold text-sm sm:text-base hover:bg-white transition-colors cursor-pointer"
      >
        {ar ? "تحقق" : "Verify"}
      </button>
    </form>
  );
}
