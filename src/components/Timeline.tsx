import { useMemo, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { timelineEvents, mosques, getUniqueCountries } from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry } from "@/data/regions";
import { parseEstablishmentYear, formatYearDisplay, ISLAMIC_HISTORY_PERIODS } from "@/lib/timeline-utils";
import { ARCHITECTURE_STYLE_DESCRIPTIONS } from "@/data/architecture-styles";
import { Calendar, ArrowUpDown, MapPin, ChevronRight, History, ExternalLink, SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [advancedOpen, setAdvancedOpen] = useState(false);
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
        <div className="mb-8 md:mb-10 max-w-4xl mx-auto">
          {/* Basic Filters Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
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
            {/* Category filter for history events */}
            <div className="space-y-2 w-full sm:w-auto sm:min-w-[180px]">
              <Label className="text-sm text-muted-foreground">Event Type</Label>
              <Select value={eventCategory || "all"} onValueChange={(v) => setEventCategory(v === "all" ? "" : v)}>
                <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by event type">
                  <History className="mr-2 h-4 w-4 shrink-0" />
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
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
              <input
                type="checkbox"
                checked={showHistoryContext}
                onChange={(e) => setShowHistoryContext(e.target.checked)}
                className="rounded border-border"
                aria-label="Show Islamic history milestones"
              />
              <span className="text-sm text-foreground">Show history events</span>
            </label>
          </div>

          {/* Advanced Filters Collapsible */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
                {activeAdvancedFilters > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                    {activeAdvancedFilters}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="p-4 rounded-lg border border-border bg-card/50 space-y-6">
                {/* Jump to Year */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                  <div className="space-y-2 flex-1 max-w-[200px]">
                    <Label className="text-sm text-muted-foreground">Jump to Year</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`${MIN_YEAR}–${MAX_YEAR}`}
                        value={jumpToYear}
                        onChange={(e) => setJumpToYear(e.target.value)}
                        min={MIN_YEAR}
                        max={MAX_YEAR}
                        className="w-full"
                        onKeyDown={(e) => e.key === "Enter" && handleJumpToYear()}
                      />
                      <Button size="icon" variant="secondary" onClick={handleJumpToYear} aria-label="Jump to year">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Year Range Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Year Range</Label>
                    <span className="text-sm font-medium text-foreground">
                      {yearRange[0]} CE – {yearRange[1]} CE
                    </span>
                  </div>
                  <Slider
                    value={yearRange}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    step={10}
                    onValueChange={(v) => setYearRange(v as [number, number])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{MIN_YEAR} CE</span>
                    <span>{MAX_YEAR} CE</span>
                  </div>
                </div>

                {/* Architecture Style & Mosque Type */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-2 w-full sm:w-auto sm:min-w-[200px]">
                    <Label className="text-sm text-muted-foreground">Architecture Style</Label>
                    <Select value={architectureStyle || "all"} onValueChange={(v) => setArchitectureStyle(v === "all" ? "" : v)}>
                      <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by architecture style">
                        <SelectValue placeholder="All styles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All styles</SelectItem>
                        {allArchitectureStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                            {ARCHITECTURE_STYLE_DESCRIPTIONS[style] && (
                              <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
                                — {ARCHITECTURE_STYLE_DESCRIPTIONS[style].split(";")[0]}
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-full sm:w-auto sm:min-w-[200px]">
                    <Label className="text-sm text-muted-foreground">Mosque Type</Label>
                    <Select value={mosqueType || "all"} onValueChange={(v) => setMosqueType(v === "all" ? "" : v)}>
                      <SelectTrigger className="w-full min-h-[44px] touch-manipulation text-base" aria-label="Filter by mosque type">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        {mosqueTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setYearRange([MIN_YEAR, MAX_YEAR]);
                    setArchitectureStyle("");
                    setMosqueType("");
                    setJumpToYear("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset advanced filters
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mt-4">
            {displayedEvents.length} event{displayedEvents.length !== 1 ? "s" : ""} shown
            {showHistoryContext && ` (${filteredAndSortedEvents.length} mosques + history)`}
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
