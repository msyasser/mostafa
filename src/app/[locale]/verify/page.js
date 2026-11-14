import { StatusHeader } from "../_components/ConfirmationCard";
import VerifyForm from "./VerifyForm";

// The address printed on every certificate (mostafayasser.com/verify): type the number to check it.
// Scanning the QR code goes straight to /verify/<code>.
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "التحقق من الاعتمادية" : "Verify a credential",
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({ params }) {
  const { locale } = await params;
  const ar = locale === "ar";
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden bg-neutral-950">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-main/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-lg w-full mx-auto">
        <div className="relative bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-neutral-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-gradient-to-r from-transparent via-main to-transparent rounded-full" />
          <StatusHeader state="wait" title={ar ? "التحقق من الاعتمادية" : "Verify a credential"}>
            {ar
              ? "اكتب الرقم المكتوب على الاعتمادية أو الشهادة، أو امسح الـQR اللي عليها، وهتظهر لك بياناتها لو كانت حقيقية."
              : "Enter the number printed on the credential or certificate, or scan its QR code, to see its details if it is genuine."}
          </StatusHeader>
          <VerifyForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
