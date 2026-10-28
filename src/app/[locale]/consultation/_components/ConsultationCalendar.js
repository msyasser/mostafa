"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const NAMESPACE = "consultation";

export default function ConsultationCalendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#d7b180" },
          dark: { "cal-brand": "#d7b180" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink="mostafayasser/consultation"
      style={{ width: "100%", height: "100%", minHeight: "650px", overflow: "scroll" }}
      config={{
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme: "dark",
      }}
    />
  );
}
