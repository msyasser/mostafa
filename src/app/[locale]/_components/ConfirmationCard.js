import Link from "next/link";
import { Check, X, ShieldCheck } from "lucide-react";

// One look for every "it worked / it failed / we're waiting for you" moment on the site.
const STATES = {
  success: { Icon: Check, ring: "border-[#A8C49A]/40 bg-[#A8C49A]/10 text-[#A8C49A]" },
  error: { Icon: X, ring: "border-[#F0A29A]/40 bg-[#F0A29A]/10 text-[#F0A29A]" },
  wait: { Icon: ShieldCheck, ring: "border-main/40 bg-main/10 text-main" },
};

const primaryClass =
  "inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-main text-neutral-950 font-bold text-sm sm:text-base hover:bg-white transition-colors cursor-pointer";

// Logo, state icon and heading: also used above a form (for example "enter the code").
export function StatusHeader({ state = "success", title, children }) {
  const { Icon, ring } = STATES[state] || STATES.success;
  return (
    <div className="text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos/my-mark-email.png" width={70} height={50} alt="" className="mx-auto mb-6" />
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${ring}`} aria-hidden="true">
        <Icon size={26} strokeWidth={2.4} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">{title}</h1>
      {children ? <div className="text-neutral-400 leading-relaxed">{children}</div> : null}
    </div>
  );
}

function Action({ action }) {
  if (!action) return null;
  if (action.href) {
    return <Link href={action.href} className={primaryClass}>{action.label}</Link>;
  }
  return <button type="button" onClick={action.onClick} className={primaryClass}>{action.label}</button>;
}

// bare = the content only, for placing inside a panel that already exists.
export default function ConfirmationCard({ state = "success", title, children, action, footer, bare = false }) {
  const content = (
    <>
      <StatusHeader state={state} title={title}>{children}</StatusHeader>
      {action ? <div className="mt-8"><Action action={action} /></div> : null}
      {footer ? <div className="mt-4 text-center">{footer}</div> : null}
    </>
  );
  if (bare) return content;
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden bg-neutral-950">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-main/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-lg w-full mx-auto">
        <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />
          {content}
        </div>
      </div>
    </div>
  );
}
