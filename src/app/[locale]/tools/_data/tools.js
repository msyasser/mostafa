import PomodoroWidget from "@/src/components/widgets/Pomodoro";
import LifeProgressWidget from "@/src/components/widgets/LifeProgress";
import QuoteWidget from "@/src/components/widgets/QuoteWidget";
import RamadanPrayers from "@/src/components/widgets/RamadanPrayers";
import EventCountdown from "@/src/components/widgets/EventCountdown";
import HabitTracker from "@/src/components/widgets/HabitTracker";
import AssetTracker from "@/src/components/widgets/AssetTracker";
import WeatherWidget from "@/src/components/widgets/WeatherWidget";
import StudyPlanner from "@/src/components/widgets/StudyPlanner";

export const tools = [
    {
        slug: "pomodoro",
        titleKey: "pomodoroTitle",
        descriptionKey: "pomodoroDesc",
        component: PomodoroWidget,
    },
    {
        slug: "ramadan-prayers",
        titleKey: "ramadanPrayersTitle",
        descriptionKey: "ramadanPrayersDesc",
        component: RamadanPrayers,
        config: [
            { key: "city", type: "text", labelKey: "enterCity", placeholder: "Cairo, London..." }
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
    }
];
