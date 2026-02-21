import PomodoroWidget from "@/src/components/widgets/Pomodoro";
import LifeProgressWidget from "@/src/components/widgets/LifeProgress";
import QuoteWidget from "@/src/components/widgets/QuoteWidget";
import RamadanPrayers from "@/src/components/widgets/RamadanPrayers";
import EventCountdown from "@/src/components/widgets/EventCountdown";
import HabitTracker from "@/src/components/widgets/HabitTracker";
import AssetTracker from "@/src/components/widgets/AssetTracker";
import WeatherWidget from "@/src/components/widgets/WeatherWidget";
import StudyPlanner from "@/src/components/widgets/StudyPlanner";
import QuranWidget from "@/src/components/widgets/QuranWidget";
import QuranicPlanner from "@/src/components/widgets/QuranicPlanner";

export const tools = [
    {
        slug: "pomodoro",
        titleKey: "pomodoroTitle",
        descriptionKey: "pomodoroDesc",
        component: PomodoroWidget,
    },
    {
        slug: "quran-verse",
        titleKey: "dailyQuranTitle",
        descriptionKey: "dailyQuranDesc",
        component: QuranWidget,
        config: [
            {
                key: "displayMode",
                type: "select",
                labelKey: "displayMode",
                defaultValue: "both",
                options: [
                    { value: "both", labelKey: "bothLanguages" },
                    { value: "arabic", labelKey: "arabicOnly" },
                    { value: "english", labelKey: "englishOnly" }
                ]
            },
            {
                key: "reciter",
                type: "select",
                labelKey: "selectReciter",
                defaultValue: "ar.alafasy",
                options: [
                    { value: "ar.alafasy", labelKey: "misharyAlafasy" },
                    { value: "ar.abdulbasitmurattal", labelKey: "abdulBasit" },
                    { value: "ar.hudhaify", labelKey: "alHudhaify" },
                    { value: "ar.husary", labelKey: "alHusary" },
                    { value: "ar.minshawi", labelKey: "alMinshawi" }
                ]
            },
            {
                key: "fontStyle",
                type: "select",
                labelKey: "fontStyle",
                defaultValue: "uthmani",
                options: [
                    { value: "uthmani", labelKey: "uthmaniSimple" },
                    { value: "indopak", labelKey: "indopak" },
                    { value: "clean", labelKey: "cleanNoDiacritics" },
                    { value: "ruqaa", labelKey: "ruqaa" },
                    { value: "kufi", labelKey: "kufi" },
                    { value: "messiri", labelKey: "messiri" }
                ]
            }
        ]
    },
    {
        slug: "ramadan-prayers",
        titleKey: "ramadanPrayersTitle",
        descriptionKey: "ramadanPrayersDesc",
        component: RamadanPrayers,
        config: [
            { key: "city", type: "text", labelKey: "enterCity", placeholder: "Cairo, London..." },
            {
                key: "lang",
                type: "select",
                labelKey: "selectLanguage",
                defaultValue: "en",
                options: [
                    { value: "ar", labelKey: "arabic" },
                    { value: "en", labelKey: "english" }
                ]
            }
        ]
    },
    {
        slug: "event-countdown",
        titleKey: "eventCountdownTitle",
        descriptionKey: "eventCountdownDesc",
        component: EventCountdown,
        config: [
            { key: "title", type: "text", labelKey: "eventName", placeholder: "Wedding, Birthday..." },
            { key: "date", type: "datetime-local", labelKey: "targetDate" }
        ]
    },
    {
        slug: "habit-tracker",
        titleKey: "habitTrackerTitle",
        descriptionKey: "habitTrackerDesc",
        component: HabitTracker,
    },
    {
        slug: "asset-tracker",
        titleKey: "assetTrackerTitle",
        descriptionKey: "assetTrackerDesc",
        component: AssetTracker,
    },
    {
        slug: "weather-widget",
        titleKey: "weatherWidgetTitle",
        descriptionKey: "weatherWidgetDesc",
        component: WeatherWidget,
        config: [
            { key: "city", type: "text", labelKey: "enterCity", placeholder: "Cairo, London..." }
        ]
    },
    {
        slug: "year-progress",
        titleKey: "lifeProgressTitle",
        descriptionKey: "lifeProgressDesc",
        component: LifeProgressWidget,
    },
    {
        slug: "quote",
        titleKey: "quoteTitle",
        descriptionKey: "quoteDesc",
        component: QuoteWidget,
    },
    {
        slug: "study-planner",
        titleKey: "studyPlannerTitle",
        descriptionKey: "studyPlannerDesc",
        component: StudyPlanner,
    },
    {
        slug: "quran-planner",
        titleKey: "quranPlannerTitle",
        descriptionKey: "quranPlannerDesc",
        component: QuranicPlanner,
        config: [
            {
                key: "startSura",
                type: "select",
                labelKey: "startLabel",
                defaultValue: "fatiha",
                options: [
                    { value: "fatiha", labelKey: "fatihaOption" },
                    { value: "nas", labelKey: "nasOption" }
                ]
            },
            { key: "days", type: "number", labelKey: "daysLabel", placeholder: "30" },
            { key: "startDate", type: "date", labelKey: "startDateLabel" },
            {
                key: "lang",
                type: "select",
                labelKey: "selectLanguage",
                defaultValue: "en",
                options: [
                    { value: "ar", labelKey: "arabic" },
                    { value: "en", labelKey: "english" }
                ]
            }
        ]
    }
];
