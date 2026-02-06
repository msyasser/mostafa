import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Calendar,
  PlusSquare,
  BarChart3,
  BookOpen,
  CheckSquare,
  Notebook,
  BookMarked,
  Repeat,
  Target,
  CalendarDays,
  Database,
  Sparkles,
  Star,
  AlarmClock,
  Layers,
  ClipboardList,
  Trophy,
  BrainCircuit,
  Lightbulb,
  Wallet,
  DollarSign,
  PieChart,
  TrendingUp,
  FileText,
  NotebookPen,
  PlaySquare,
  Users,
  ArchiveBox,
} from "lucide-react";

const iconsMap = {
  default: [
    LayoutDashboard,
    Calendar,
    PlusSquare,
    BarChart3,
    BookOpen,
    CheckSquare,
    Notebook,
    BookMarked,
    Repeat,
    Target,
    CalendarDays,
    Database,
  ],
  "study-hub": [
    LayoutDashboard,
    Calendar,
    AlarmClock,
    BookOpen,
    ClipboardList,
    CheckSquare,
    Trophy,
    Target,
    Layers,
    PlusSquare,
    Star,
    Sparkles,
  ],
  "second-brain": [
    Target,
    ClipboardList,
    CheckSquare,
    Repeat,
    Lightbulb,
    Notebook,
    BookMarked,
    Repeat,
    NotebookPen,
    LayoutDashboard,
    ClipboardList,
    BrainCircuit,
    LayoutDashboard,
    BrainCircuit,
  ],
  "finance-hub": [
    BarChart3,
    Calendar,
    PieChart,
    CheckSquare,
    Target,
    Wallet,
    DollarSign,
    FileText,
    Layers,
    FileText,
    Trophy,
    TrendingUp,
    Layers,
    BarChart3,
  ],
  "quranhub": [
    LayoutDashboard,  // Quran Overview
    Layers,          // Juz Tracking
    FileText,        // Surah Insights
    BookOpen,        // Verse Details
    Trophy,          // Achievement Tracking
    NotebookPen,     // Reflection Notes
  ],
  "ibadat-hub": [
    LayoutDashboard,  // Fard Prayer Tracking
    BookOpen,        // Nafl & Sunnah Worship
    Notebook,        // Adhkar & Dhikr System
    FileText,        // Quran Integration
    Calendar,        // Prayer Times Widget
    BarChart3,       // Spiritual Dashboard
    Star,            // Quick Access Shortcuts
    TrendingUp,      // Progress Analytics
    CalendarDays,    // Weekly Calendar View
    Users,           // Profile & Stats
    Database,        // Pre-built Database System
  ],
  "second-brain-muslim-edition": [
    Target,          // Goals
    ClipboardList,   // Projects
    CheckSquare,     // Tasks
    Repeat,          // Recurring Tasks
    Lightbulb,       // Ideas
    Notebook,        // Notes
    BookMarked,      // Resources
    Repeat,          // Habits
    NotebookPen,     // Journalling
    LayoutDashboard, // Dashboard
    ClipboardList,   // Smart Filters
    BrainCircuit,    // Linked System
    LayoutDashboard, // Profile Overview
    BrainCircuit,    // Fully Customizable
    Calendar,        // Fard Prayer Tracking
    BookOpen,        // Nafl & Sunnah Worship
    Notebook,        // Adhkar System
    FileText,        // Quran Integration
    Calendar,        // Prayer Times Widget
    BarChart3,       // Spiritual Dashboard
  ],
};

function Essentials({ template }) {
  const t = useTranslations("TemplateSlug");

  // Dynamically select icons based on template slug
  const icons = iconsMap[template.slug] || iconsMap["default"];

  // Dynamically determine feature count based on the number of icons available
  const featureCount = icons.length;
  const features = Array.from({ length: featureCount }, (_, i) => i.toString());

  return (
    <section
      id="essentials"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
    >
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-3 text-main leading-tight text-center">
        {t(`${template.name}.essentialsSec.title`)}
      </h2>

      <p className="text-lg sm:text-xl md:text-3xl text-muted-foreground mb-14 max-w-3xl leading-relaxed text-center mx-auto">
        {t(`${template.name}.essentialsSec.description`)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {features.map((feature, index) => {
          const Icon = icons[index];
          return (
            <div
              key={index}
              className="
                rounded-3xl
                bg-white/70 dark:bg-neutral-900/50
                backdrop-blur-md
                p-6 sm:p-8
                border border-neutral-200 dark:border-neutral-700
                shadow-xl hover:shadow-2xl
                transform hover:-translate-y-1
                transition-all duration-300 ease-out
                group
                flex flex-col
                h-full
              "
            >
              <div className="flex items-center gap-3 mb-4">
                {Icon && (
                  <Icon
                    className="
                      w-6 h-6 sm:w-7 sm:h-7
                      text-main
                      group-hover:scale-110
                      transition-transform duration-300
                    "
                  />
                )}
                <h3
                  className="
                    text-lg sm:text-xl md:text-2xl
                    font-semibold
                    text-neutral-900 dark:text-neutral-100
                    leading-tight
                  "
                >
                  {t(
                    `${template.name}.essentialsSec.features.${feature}.title`
                  )}
                </h3>
              </div>
              <p
                className="
                  text-sm sm:text-base
                  text-neutral-700 dark:text-neutral-300
                  leading-relaxed
                  max-w-prose
                "
              >
                {t(
                  `${template.name}.essentialsSec.features.${feature}.description`
                )}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Essentials;
