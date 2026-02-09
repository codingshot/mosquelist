import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageSEO } from "@/components/PageSEO";
import { ISLAMIC_HISTORY_PERIODS } from "@/lib/timeline-utils";
import { History, ExternalLink, Filter, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type CategoryFilter = "all" | "era" | "migration" | "expansion" | "caliphate" | "architecture" | "education";

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All Events",
  era: "Eras & Turning Points",
  migration: "Migrations",
  expansion: "Conquests & Expansion",
  caliphate: "Caliphates & Empires",
  architecture: "Architecture",
  education: "Education & Scholarship",
};

const CATEGORY_COLORS: Record<string, string> = {
  era: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700",
  migration: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
  expansion: "bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700",
  caliphate: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
  architecture: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700",
  education: "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700",
};

export default function IslamicHistoryPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filteredEvents = useMemo(() => {
    if (category === "all") return ISLAMIC_HISTORY_PERIODS;
    return ISLAMIC_HISTORY_PERIODS.filter((e) => e.category === category);
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Islamic History Timeline - MosqueList | Key Events & Milestones"
        description="Explore 1400+ years of Islamic history—from the first revelation (610 CE) to the founding of modern Muslim-majority nations. Major caliphates, conquests, and architectural milestones."
        path="/islamic-history"
      />
      <Navigation />
      <main id="main-content" className="pt-16 pb-8 md:pb-0">
        <section className="py-16 md:py-24 bg-background scroll-mt-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-4">
                <History className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  1400+ Years of History
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Islamic History Timeline
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Key milestones from the first revelation to modern Muslim-majority nations—
                caliphates, conquests, migrations, and architectural achievements.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end mb-8 md:mb-10 max-w-4xl mx-auto">
              <div className="space-y-2 w-full sm:w-auto sm:min-w-[200px]">
                <Label className="text-sm text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
                  <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by category">
                    <Filter className="mr-2 h-4 w-4 shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground w-full sm:w-auto sm:self-center">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} shown
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Center Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              {/* Events */}
              <div className="space-y-6 md:space-y-8">
                {filteredEvents.map((event, index) => (
                  <div
                    key={`${event.year}-${event.label}`}
                    className={`relative flex items-center gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-600 border-4 border-background z-10 md:-translate-x-1/2" />

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <div className={`rounded-lg shadow-md border overflow-hidden min-w-0 ${CATEGORY_COLORS[event.category] || "bg-card border-border"}`}>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Calendar className="h-4 w-4 text-foreground/70" />
                            <span className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                              {CATEGORY_LABELS[event.category] || event.category}
                            </span>
                          </div>
                          <span className="font-handwriting text-xl sm:text-2xl text-foreground font-semibold">
                            {event.year} CE
                          </span>
                          <h2 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
                            {event.label}
                          </h2>
                          <p className="text-muted-foreground text-sm sm:text-base mt-2">
                            {event.description}
                          </p>
                          {/* Source link — only when event has a source URL */}
                          {event.source && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={event.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Source
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs">
                                <p className="text-xs break-all">{event.source}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
