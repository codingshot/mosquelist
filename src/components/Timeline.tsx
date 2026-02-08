import { useMemo, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { timelineEvents, mosques, getUniqueCountries } from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry } from "@/data/regions";
import { parseEstablishmentYear, formatYearDisplay, ISLAMIC_HISTORY_PERIODS } from "@/lib/timeline-utils";
import { Calendar, ArrowUpDown, MapPin, ChevronRight, History, ExternalLink, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import type { TimelineEvent } from "@/types/mosque";

/** Context event type with source URL */
interface ContextEvent {
  isContextEvent: true;
  year: string;
  label: string;
  description: string;
  source: string;
  category: "era" | "migration" | "expansion" | "caliphate" | "architecture" | "education" | "colonization" | "independence";
}

/** Build combined timeline with mosque events and Islamic history context */
function buildCombinedTimeline(
  mosqueEvents: TimelineEvent[], 
  includeContext: boolean,
  categoryFilter: string
): (TimelineEvent | ContextEvent)[] {
  let contextEvents: ContextEvent[] = [];
  
  if (includeContext) {
    // Combine mosque events with history periods
    contextEvents = ISLAMIC_HISTORY_PERIODS.map((p) => ({
      isContextEvent: true as const,
      year: String(p.year),
      label: p.label,
      description: p.description,
      source: p.source,
      category: p.category,
    }));
    
    // Filter context events by category if specified
    if (categoryFilter) {
      contextEvents = contextEvents.filter((e) => e.category === categoryFilter);
    }
  }
  
  const combined = [...mosqueEvents, ...contextEvents];
  return combined.sort((a, b) => {
    const yearA = parseEstablishmentYear(a.year);
    const yearB = parseEstablishmentYear(b.year);
    return yearA - yearB;
  });
}

type SortOrder = "oldest" | "newest";

// Get all unique architecture styles from mosques
const allArchitectureStyles = Array.from(
  new Set(mosques.map(m => m.architecturalStyle).filter(Boolean))
).sort() as string[];

// Get min/max years from data
const allYears = [
  ...timelineEvents.map(e => parseEstablishmentYear(e.year)),
  ...ISLAMIC_HISTORY_PERIODS.map(p => p.year)
].filter(y => y > 0);
const MIN_YEAR = Math.min(...allYears);
const MAX_YEAR = Math.max(...allYears, new Date().getFullYear());

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
  const [eventCategory, setEventCategory] = useState<string>("");
  
  // Advanced filters
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [jumpToYear, setJumpToYear] = useState<string>("");
  const [architectureStyle, setArchitectureStyle] = useState<string>("");
  const [mosqueType, setMosqueType] = useState<string>("");
  
  const timelineRef = useRef<HTMLDivElement>(null);

  const categoryOptions = [
    { value: "all", label: "All events" },
    { value: "expansion", label: "Islamic Expansion" },
    { value: "colonization", label: "Colonization" },
    { value: "independence", label: "Independence" },
    { value: "caliphate", label: "Caliphates" },
    { value: "architecture", label: "Architecture" },
    { value: "education", label: "Education" },
    { value: "era", label: "Historical Eras" },
    { value: "migration", label: "Migration" },
  ];
  
  const mosqueTypeOptions = [
    { value: "all", label: "All mosques" },
    { value: "holySite", label: "Holy Sites" },
    { value: "womenArea", label: "Women's Prayer Area" },
    { value: "touristFriendly", label: "Tourist-Friendly" },
    { value: "sunni", label: "Sunni Tradition" },
    { value: "shia", label: "Shia Tradition" },
  ];

  const mosqueById = useMemo(() => new Map(mosques.map((m) => [m.id, m])), []);
  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => getUniqueRegions(countries), [countries]);
  
  // Jump to year handler
  const handleJumpToYear = useCallback(() => {
    const year = parseInt(jumpToYear, 10);
    if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) return;
    
    // Find the event closest to this year
    const targetId = `year-marker-${year}`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // Find closest event
      const closestEvent = displayedEvents.find(e => parseEstablishmentYear(e.year) >= year);
      if (closestEvent && timelineRef.current) {
        const eventIndex = displayedEvents.indexOf(closestEvent);
        const eventElements = timelineRef.current.querySelectorAll("[data-timeline-event]");
        if (eventElements[eventIndex]) {
          eventElements[eventIndex].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [jumpToYear]);

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
        
        // Year range filter
        const eventYear = parseEstablishmentYear(event.year);
        if (eventYear < yearRange[0] || eventYear > yearRange[1]) return false;
        
        // Architecture style filter
        if (architectureStyle && mosque.architecturalStyle !== architectureStyle) return false;
        
        // Mosque type filter
        if (mosqueType) {
          switch (mosqueType) {
            case "holySite":
              if (!mosque.isHolySite) return false;
              break;
            case "womenArea":
              if (!mosque.womenPrayerArea) return false;
              break;
            case "touristFriendly":
              if (!mosque.touristFriendly) return false;
              break;
            case "sunni":
              if (mosque.denomination !== "sunni") return false;
              break;
            case "shia":
              if (mosque.denomination !== "shia") return false;
              break;
          }
        }
      }
      return true;
    });
    const order = sortOrder === "newest" ? -1 : 1;
    list = [...list].sort((a, b) => order * (parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year)));
    return list;
  }, [timelineEvents, mosqueById, country, region, sortOrder, isPreview, visitorFriendlyOnly, yearRange, architectureStyle, mosqueType]);

  // Combine with Islamic history context if enabled (also apply year range)
  const combinedEvents = useMemo(() => {
    const combined = buildCombinedTimeline(filteredAndSortedEvents, showHistoryContext && !isPreview, eventCategory);
    // Apply year range to combined events
    return combined.filter(e => {
      const year = parseEstablishmentYear(e.year);
      return year >= yearRange[0] && year <= yearRange[1];
    });
  }, [filteredAndSortedEvents, showHistoryContext, isPreview, eventCategory, yearRange]);

  // Apply limit for preview mode - use combinedEvents for full page, filteredAndSortedEvents for preview
  const displayedEvents = isPreview
    ? filteredAndSortedEvents.slice(0, limit)
    : combinedEvents;
  const hasMore = isPreview && filteredAndSortedEvents.length > limit;
  
  // Count active advanced filters
  const activeAdvancedFilters = [
    yearRange[0] !== MIN_YEAR || yearRange[1] !== MAX_YEAR,
    architectureStyle,
    mosqueType,
  ].filter(Boolean).length;

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
        <div className="mb-6 md:mb-8 max-w-5xl mx-auto">
          {/* Compact Filter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {/* Sort */}
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Sort timeline">
                <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
              </SelectContent>
            </Select>

            {/* Region */}
            <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" ? "" : v)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Filter by region">
                <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country */}
            <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Filter by country">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Event Type */}
            <Select value={eventCategory || "all"} onValueChange={(v) => setEventCategory(v === "all" ? "" : v)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Filter by event type">
                <History className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Architecture Style */}
            <Select value={architectureStyle || "all"} onValueChange={(v) => setArchitectureStyle(v === "all" ? "" : v)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Filter by architecture">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All styles</SelectItem>
                {allArchitectureStyles.map((style) => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mosque Type */}
            <Select value={mosqueType || "all"} onValueChange={(v) => setMosqueType(v === "all" ? "" : v)}>
              <SelectTrigger className="h-10 text-sm" aria-label="Filter by mosque type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {mosqueTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Second Row: Year Range + Toggles + Jump */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3 items-start sm:items-center">
            {/* Year Range Slider - compact */}
            <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{yearRange[0]}</span>
              <Slider
                value={yearRange}
                min={MIN_YEAR}
                max={MAX_YEAR}
                step={10}
                onValueChange={(v) => setYearRange(v as [number, number])}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{yearRange[1]} CE</span>
            </div>

            {/* Jump to Year - compact */}
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Year"
                value={jumpToYear}
                onChange={(e) => setJumpToYear(e.target.value)}
                min={MIN_YEAR}
                max={MAX_YEAR}
                className="h-8 w-20 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleJumpToYear()}
              />
              <Button size="sm" variant="secondary" onClick={handleJumpToYear} className="h-8 px-2">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Toggles - compact */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer px-2 py-1.5 rounded border border-border bg-background hover:bg-secondary/50">
                <input
                  type="checkbox"
                  checked={visitorFriendlyOnly}
                  onChange={(e) => setVisitorFriendlyOnly(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border"
                />
                <span className="hidden sm:inline">Non-Muslims</span>
                <span className="sm:hidden">Visitor</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer px-2 py-1.5 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10">
                <input
                  type="checkbox"
                  checked={showHistoryContext}
                  onChange={(e) => setShowHistoryContext(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border"
                />
                <span className="hidden sm:inline">History events</span>
                <span className="sm:hidden">History</span>
              </label>
            </div>

            {/* Reset - only show when filters active */}
            {(activeAdvancedFilters > 0 || region || country || eventCategory || visitorFriendlyOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setYearRange([MIN_YEAR, MAX_YEAR]);
                  setArchitectureStyle("");
                  setMosqueType("");
                  setJumpToYear("");
                  setRegion("");
                  setCountry("");
                  setEventCategory("");
                  setVisitorFriendlyOnly(false);
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Results count - inline */}
          <p className="text-xs text-muted-foreground mt-2">
            {displayedEvents.length} event{displayedEvents.length !== 1 ? "s" : ""}
            {showHistoryContext && ` (${filteredAndSortedEvents.length} mosques)`}
          </p>
        </div>
        )}

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
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
