"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { track } from "@/src/lib/track";
import { course } from "../_data/course";

const field =
    "h-12 w-full rounded-lg border border-[#857564] bg-neutral-950 px-3.5 text-[15px] text-white placeholder:text-neutral-500 focus:border-main focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d9b6]";
const label = "mb-1.5 block text-sm font-medium text-neutral-200";
const primary =
    "inline-flex h-12 w-full items-center justify-center rounded-full bg-main px-8 text-[15px] font-semibold text-neutral-900 transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";

// Sales open: name + email + phone, then the platform API creates the order and we go to Paymob's page.
function PayForm() {
    const t = useTranslations("NotionCoursePage.enroll.form");
    const { data: session } = useSession();
    const locale = useLocale();
    const [agreed, setAgreed] = useState(false);
    const [values, setValues] = useState({ name: "", email: "", phone: "" });
    const [error, setError] = useState(null); // { field, message }
    const [loading, setLoading] = useState(false);
    // Coupon: hidden behind a small link; checked against the platform before paying (price shown live).
    const [couponOpen, setCouponOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null); // { code, finalCents, priceCents } once accepted
    const [couponState, setCouponState] = useState("idle"); // idle | checking | error
    const [couponMsg, setCouponMsg] = useState("");

    const egp = (cents) => new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 2 }).format(cents / 100);

    const applyCoupon = async () => {
        const code = couponCode.trim();
        if (!code || couponState === "checking") return;
        setCouponState("checking");
        setCouponMsg("");
        try {
            const response = await fetch(`${course.apiBase}/coupon/check`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ courseId: course.id, code, email: values.email.trim() }),
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok && data.valid) {
                setCoupon({ code, finalCents: data.finalCents, priceCents: data.priceCents });
                setCouponState("idle");
                track("course_coupon_applied", { place: "notion_course_form" });
                return;
            }
            setCoupon(null);
            setCouponState("error");
            setCouponMsg(locale === "ar" && data.message ? data.message : t("coupon.invalid"));
        } catch {
            setCoupon(null);
            setCouponState("error");
            setCouponMsg(t("coupon.invalid"));
        }
    };
    const removeCoupon = () => {
        setCoupon(null);
        setCouponCode("");
        setCouponState("idle");
        setCouponMsg("");
    };

    // Signed-in visitors get their name and email filled in (they can still change them).
    useEffect(() => {
        if (!session?.user) return;
        setValues((v) => ({
            ...v,
            name: v.name || session.user.name || "",
            email: v.email || session.user.email || "",
        }));
    }, [session]);

    const set = (key) => (event) => {
        setValues((v) => ({ ...v, [key]: event.target.value }));
        if (error?.field === key || error?.field === "form") setError(null);
    };

    const fail = (code) => {
        const known = ["invalid_name", "invalid_email", "invalid_phone", "already_owned", "agree"];
        const key = known.includes(code) ? code : "generic";
        const fieldOf = { invalid_name: "name", invalid_email: "email", invalid_phone: "phone", already_owned: "email", agree: "agree" };
        setError({ field: fieldOf[key] || "form", message: t(`errors.${key}`) });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;
        const name = values.name.trim();
        const email = values.email.trim();
        const phone = values.phone.replace(/[^\d+]/g, "");
        if (name.length < 2) return fail("invalid_name");
        if (!/^\S+@\S+\.\S+$/.test(email)) return fail("invalid_email");
        if (phone.length < 8) return fail("invalid_phone");
        if (!agreed) return fail("agree");

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${course.apiBase}/checkout`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, email, phone, courseId: course.id, ...(coupon ? { coupon: coupon.code } : {}) }),
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok && data.granted) {
                // A 100% coupon: no payment, the course is already on this email.
                track("course_coupon_granted", { place: "notion_course_form" });
                window.location.assign(`/${locale}/course/thanks?granted=1`);
                return;
            }
            if (data.error === "coupon_invalid") {
                setCoupon(null);
                setCouponOpen(true);
                setCouponState("error");
                setCouponMsg(locale === "ar" && data.message ? data.message : t("coupon.invalid"));
                setLoading(false);
                return;
            }
            if (response.ok && data.checkoutUrl) {
                track("course_checkout_start", { place: "notion_course_form" });
                window.location.assign(data.checkoutUrl);
                return; // keep the button busy while the payment page loads
            }
            fail(data.error);
        } catch {
            fail("generic");
        }
        setLoading(false);
    };

    const errorFor = (key) =>
        error?.field === key ? (
            <p id={`enroll-${key}-error`} role="alert" className="mt-1.5 text-sm text-[#f0a29a]">
                {error.message}
            </p>
        ) : null;

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
                <label htmlFor="enroll-name" className={label}>{t("name")}</label>
                <input
                    id="enroll-name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    placeholder={t("namePlaceholder")}
                    value={values.name}
                    onChange={set("name")}
                    aria-invalid={error?.field === "name"}
                    aria-describedby={error?.field === "name" ? "enroll-name-error" : undefined}
                    className={field}
                />
                {errorFor("name")}
            </div>
            <div>
                <label htmlFor="enroll-email" className={label}>{t("email")}</label>
                <input
                    id="enroll-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={set("email")}
                    aria-invalid={error?.field === "email"}
                    aria-describedby={error?.field === "email" ? "enroll-email-error" : "enroll-email-hint"}
                    className={`${field} rtl:text-right`}
                />
                {errorFor("email") || (
                    <p id="enroll-email-hint" className="mt-1.5 text-[13px] text-neutral-400">{t("emailHint")}</p>
                )}
            </div>
            <div>
                <label htmlFor="enroll-phone" className={label}>{t("phone")}</label>
                <input
                    id="enroll-phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01xxxxxxxxx"
                    value={values.phone}
                    onChange={set("phone")}
                    aria-invalid={error?.field === "phone"}
                    aria-describedby={error?.field === "phone" ? "enroll-phone-error" : undefined}
                    className={`${field} rtl:text-right`}
                />
                {errorFor("phone")}
            </div>

            <div>
                <label htmlFor="enroll-agree" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-200">
                    <input
                        id="enroll-agree"
                        name="agree"
                        type="checkbox"
                        checked={agreed}
                        onChange={(event) => {
                            setAgreed(event.target.checked);
                            if (error?.field === "agree") setError(null);
                        }}
                        aria-invalid={error?.field === "agree"}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#d7b180]"
                    />
                    <span>
                        {t("agreePrefix")}{" "}
                        <a href={`/${locale}/terms-of-service`} target="_blank" rel="noopener noreferrer" className="text-main underline underline-offset-4">
                            {t("terms")}
                        </a>{" "}
                        {t("agreeAnd")}{" "}
                        <a href={`/${locale}/refund-policy`} target="_blank" rel="noopener noreferrer" className="text-main underline underline-offset-4">
                            {t("refund")}
                        </a>
                        {t("agreeSuffix")}
                    </span>
                </label>
                {errorFor("agree")}
            </div>

            <div>
                {!couponOpen && !coupon ? (
                    <button type="button" onClick={() => setCouponOpen(true)} className="text-sm text-main underline underline-offset-4">
                        {t("coupon.open")}
                    </button>
                ) : coupon ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-main/50 bg-main/10 px-3.5 py-2.5 text-sm">
                        <span className="text-neutral-100">
                            {t("coupon.applied", { code: coupon.code.toUpperCase() })}{" "}
                            <span className="text-neutral-400 line-through">{egp(coupon.priceCents)}</span>{" "}
                            <b className="text-main">{coupon.finalCents <= 0 ? t("coupon.free") : `${egp(coupon.finalCents)} ${t("coupon.unit")}`}</b>
                        </span>
                        <button type="button" onClick={removeCoupon} className="shrink-0 text-neutral-400 underline underline-offset-4 hover:text-white">
                            {t("coupon.remove")}
                        </button>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="enroll-coupon" className={label}>{t("coupon.label")}</label>
                        <div className="flex gap-2">
                            <input
                                id="enroll-coupon"
                                name="coupon"
                                dir="ltr"
                                autoComplete="off"
                                autoCapitalize="characters"
                                maxLength={40}
                                value={couponCode}
                                onChange={(event) => {
                                    setCouponCode(event.target.value);
                                    if (couponState === "error") setCouponState("idle");
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        applyCoupon();
                                    }
                                }}
                                aria-invalid={couponState === "error"}
                                aria-describedby={couponState === "error" ? "enroll-coupon-error" : undefined}
                                className={`${field} uppercase rtl:text-right`}
                            />
                            <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={!couponCode.trim() || couponState === "checking"}
                                className="h-12 shrink-0 rounded-lg border border-main px-5 text-sm font-semibold text-main disabled:opacity-50"
                            >
                                {couponState === "checking" ? t("loading") : t("coupon.apply")}
                            </button>
                        </div>
                        {couponState === "error" && (
                            <p id="enroll-coupon-error" role="alert" className="mt-1.5 text-sm text-[#f0a29a]">{couponMsg}</p>
                        )}
                    </div>
                )}
            </div>

            {errorFor("form")}

            <button type="submit" disabled={loading} className={primary}>
                {loading ? t("loading") : coupon && coupon.finalCents <= 0 ? t("coupon.submitFree") : t("submit")}
            </button>
            <p className="text-center text-[13px] text-neutral-400">{t("secure")}</p>
            <p className="text-center text-[13px] text-neutral-400">{t("methods")}</p>
        </form>
    );
}

// Sales not open yet: one email field that saves the visitor to the newsletter list.
function NotifyForm() {
    const t = useTranslations("NotionCoursePage.enroll.soon");
    const locale = useLocale();
    const [email, setEmail] = useState("");
    const [state, setState] = useState("idle"); // idle | loading | done | error

    const onSubmit = async (event) => {
        event.preventDefault();
        if (state === "loading") return;
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setState("error");
        setState("loading");
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), language: locale === "ar" ? "Arabic" : "English" }),
            });
            if (!response.ok) return setState("error");
            track("course_notify_signup", { place: "notion_course_form" });
            setState("done");
        } catch {
            setState("error");
        }
    };

    if (state === "done") {
        return (
            <p role="status" className="rounded-lg border border-[#a8c49a]/40 bg-[#a8c49a]/10 px-4 py-3.5 text-[15px] text-[#a8c49a]">
                {t("success")}
            </p>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
                <h3 className="text-2xl font-semibold text-white">{t("title")}</h3>
                <p className="mt-1.5 text-[15px] text-neutral-400">{t("desc")}</p>
            </div>
            <div>
                <label htmlFor="notify-email" className={label}>{t("email")}</label>
                <input
                    id="notify-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        if (state === "error") setState("idle");
                    }}
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "notify-email-error" : undefined}
                    className={`${field} rtl:text-right`}
                />
                {state === "error" && (
                    <p id="notify-email-error" role="alert" className="mt-1.5 text-sm text-[#f0a29a]">{t("error")}</p>
                )}
            </div>
            <button type="submit" disabled={state === "loading"} className={primary}>
                {state === "loading" ? t("loading") : t("button")}
            </button>
        </form>
    );
}

export default function EnrollForm() {
    return course.salesOpen ? <PayForm /> : <NotifyForm />;
}
