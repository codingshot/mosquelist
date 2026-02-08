import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { timelineEvents, mosques, getUniqueCountries } from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry } from "@/data/regions";
import { parseEstablishmentYear, formatYearDisplay, ISLAMIC_HISTORY_PERIODS } from "@/lib/timeline-utils";
import { Calendar, ArrowUpDown, MapPin, ChevronRight, History, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import type { TimelineEvent } from "@/types/mosque";

/** Context event type with source URL */
interface ContextEvent {
  isContextEvent: true;
  year: string;
  label: string;
  description: string;
  source: string;
  category: "era" | "migration" | "expansion" | "caliphate" | "architecture" | "education";
}

/** Build combined timeline with mosque events and Islamic history context */
function buildCombinedTimeline(mosqueEvents: TimelineEvent[], includeContext: boolean): (TimelineEvent | ContextEvent)[] {
  if (!includeContext) {
    return mosqueEvents;
  }
  
  // Combine mosque events with history periods
  const contextEvents: ContextEvent[] = ISLAMIC_HISTORY_PERIODS.map((p) => ({
    isContextEvent: true as const,
    year: String(p.year),
    label: p.label,
    description: p.description,
    source: p.source,
    category: p.category,
  }));
  
  const combined = [...mosqueEvents, ...contextEvents];
  return combined.sort((a, b) => {
    const yearA = parseEstablishmentYear(a.year);
    const yearB = parseEstablishmentYear(b.year);
    return yearA - yearB;
  });
}

type SortOrder = "oldest" | "newest";

interface TimelineProps {
  /** Limit displayed events (for homepage preview) */
  limit?: number;
  /** Show header filters (false for preview mode) */
  showFilters?: boolean;
}

export const Timeline = ({ limit, showFilters = true }: TimelineProps) => {
  const isPreview = typeof limit === "number" && limit > 0;
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest");
  const [region, setRegion] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [visitorFriendlyOnly, setVisitorFriendlyOnly] = useState(false);
  const [showHistoryContext, setShowHistoryContext] = useState(!isPreview);

  const mosqueById = useMemo(() => new Map(mosques.map((m) => [m.id, m])), []);
  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => getUniqueRegions(countries), [countries]);

  const filteredAndSortedEvents = useMemo(() => {
    let list = timelineEvents.filter((event) => {
      const mosque = mosqueById.get(event.mosqueId);
      if (!mosque) return false;
      // In preview mode, skip filters
      if (!isPreview) {
        if (country && mosque.country !== country) return false;
        if (region) {
          const mosqueRegion = getRegionForCountry(mosque.country);
          if (mosqueRegion !== region) return false;
        }
        if (visitorFriendlyOnly && !mosque.touristFriendly) return false;
      }
      return true;
    });
    const order = sortOrder === "newest" ? -1 : 1;
    list = [...list].sort((a, b) => order * (parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year)));
    return list;
  }, [timelineEvents, mosqueById, country, region, sortOrder, isPreview, visitorFriendlyOnly]);

  // Combine with Islamic history context if enabled
  const combinedEvents = useMemo(() => {
    return buildCombinedTimeline(filteredAndSortedEvents, showHistoryContext && !isPreview);
  }, [filteredAndSortedEvents, showHistoryContext, isPreview]);

  // Apply limit for preview mode - use combinedEvents for full page, filteredAndSortedEvents for preview
  const displayedEvents = isPreview
    ? filteredAndSortedEvents.slice(0, limit)
    : combinedEvents;
  const hasMore = isPreview && filteredAndSortedEvents.length > limit;

  return (
    <section id="timeline" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              1400+ Years of History
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Timeline of Major Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Journey through history—from 622 CE to today—and discover when
            the world's most significant mosques and holy sites were built.
          </p>
        </div>

        {/* Sort & Filters — hidden in preview mode */}
        {showFilters && (
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end mb-8 md:mb-10 max-w-4xl mx-auto">
          <div className="space-y-2 w-full sm:w-auto sm:min-w-[160px]">
            <Label className="text-sm text-muted-foreground">Sort</Label>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
              <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Sort timeline">
                <ArrowUpDown className="mr-2 h-4 w-4 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full sm:w-auto sm:min-w-[160px]">
            <Label className="text-sm text-muted-foreground">Region</Label>
            <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by region">
                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full sm:w-auto sm:min-w-[160px] sm:flex-1 sm:max-w-[220px]">
            <Label className="text-sm text-muted-foreground">Country</Label>
            <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by country">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-secondary/50 touch-manipulation self-end sm:self-center">
            <input
              type="checkbox"
              checked={visitorFriendlyOnly}
              onChange={(e) => setVisitorFriendlyOnly(e.target.checked)}
              className="rounded border-border"
              aria-label="Show only mosques where non-Muslims can visit"
            />
            <span className="text-sm text-foreground">Non-Muslims can visit</span>
          </label>
          <label className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 touch-manipulation self-end sm:self-center">
            <History className="h-4 w-4 text-primary" />
            <input
              type="checkbox"
              checked={showHistoryContext}
              onChange={(e) => setShowHistoryContext(e.target.checked)}
              className="rounded border-border"
              aria-label="Show Islamic history milestones"
            />
            <span className="text-sm text-foreground">Show Islamic eras</span>
          </label>
          <p className="text-sm text-muted-foreground w-full sm:w-auto sm:self-center">
            {filteredAndSortedEvents.length} mosque{filteredAndSortedEvents.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        )}

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

          {/* Events (filtered & sorted) */}
          <div className="space-y-6 md:space-y-8">
            {displayedEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                {visitorFriendlyOnly
                  ? "No visitor-friendly mosques match the selected filters. Try a different region or country, or clear Non-Muslims can visit."
                  : "No mosques match the selected filters. Try a different region or country."}
              </p>
            ) : (
            displayedEvents.map((event, index) => {
              // Check if this is a context event (Islamic history milestone)
              const isContext = "isContextEvent" in event && event.isContextEvent;
              
              if (isContext) {
                // Cast to context event type
                const contextEvent = event as ContextEvent;
                
                // Render context event (Islamic history milestone)
                return (
                  <div
                    key={`context-${contextEvent.year}-${index}`}
                    className={`relative flex items-center gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot - accent color for context events */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-600 border-4 border-background z-10 md:-translate-x-1/2" />

                    {/* Content - styled differently for context events */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg shadow-md border border-emerald-200 dark:border-emerald-800 overflow-hidden min-w-0">
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-1">
                            <History className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                              Islamic History
                            </span>
                          </div>
                          <span className="font-handwriting text-xl sm:text-2xl text-emerald-800 dark:text-emerald-300 font-semibold">
                            {formatYearDisplay(contextEvent.year)}
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
                            {contextEvent.label}
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base mt-2">{contextEvent.description}</p>
                          {/* Source tooltip */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={contextEvent.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Source
                              </a>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="text-xs break-all">{contextEvent.source}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              }
              
              // Regular mosque event
              const mosqueEvent = event as TimelineEvent;
              const mosque = mosqueById.get(mosqueEvent.mosqueId);
              const { src: imageSrc, fallbackUrl: imageFallback } = mosque ? getMosqueImageSrc(mosque) : { src: "/placeholder.svg", fallbackUrl: null };

              return (
                <div
                  key={`${mosqueEvent.mosqueId}-${mosqueEvent.year}-${index}`}
                  className={`relative flex items-center gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 md:-translate-x-1/2" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-card rounded-lg shadow-lg border border-border mosque-card-shadow overflow-hidden min-w-0">
                      <div className={`flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                        <div className="shrink-0 w-24 sm:w-28 md:w-32 self-stretch min-h-0 overflow-hidden bg-muted">
                          <Link to={`/mosque/${mosqueEvent.mosqueId}`} className="block h-full w-full">
                            <img
                              src={imageSrc}
                              alt={mosque ? `${mosque.name} - ${mosqueEvent.year}` : ""}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                setMosqueImageFallback(e.currentTarget, imageFallback);
                              }}
                            />
                          </Link>
                        </div>
                        <div className="p-4 sm:p-5 min-w-0 flex-1">
                          <span className="font-handwriting text-xl sm:text-2xl text-primary font-semibold">
                            {formatYearDisplay(mosqueEvent.year)}
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
                            <Link
                              to={`/mosque/${mosqueEvent.mosqueId}`}
                              className="hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                            >
                              {mosqueEvent.mosque}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base mt-2">{mosqueEvent.event}</p>
                          {mosque?.location && mosque?.country && (
                            <p className="text-xs text-muted-foreground mt-1.5">
                              {mosque.location}, {mosque.country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })
            )}
          </div>

          {/* See All link for preview mode */}
          {hasMore && (
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/timeline" className="gap-2">
                  See All {filteredAndSortedEvents.length} Events
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
