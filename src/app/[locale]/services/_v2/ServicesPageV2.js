import { useTranslations } from "next-intl";
import Hero from "./Hero";
import Quotes from "./Quotes";
import Offers from "./Offers";
import Process from "./Process";
import Cases from "./Cases";
import Pricing from "./Pricing";
import Fit from "./Fit";
import Faq from "./Faq";
import Booking from "./Booking";
import StickyBookBar from "./StickyBookBar";

export default function ServicesPageV2() {
    const t = useTranslations("ServicesPage.v2.sticky");

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-main selection:text-neutral-900">
            <Hero />
            <Quotes />
            <Offers />
            <Process />
            <Cases />
            <Pricing />
            <Fit />
            <Faq />
            <Booking />
            <StickyBookBar label={t("cta")} sub={t("sub")} />
        </div>
    );
}
