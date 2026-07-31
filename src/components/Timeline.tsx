import { useMemo, useState, useRef, useCallback, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { timelineEvents, timelineContextEvents, mosques, getUniqueCountries } from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry } from "@/data/regions";
import {
  parseEstablishmentYear,
  formatYearDisplay,
  ISLAMIC_HISTORY_PERIODS,
  yearRangeOverlaps,
} from "@/lib/timeline-utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getMosqueImageSrc, setMosqueImageFallback } from "@/lib/mosque-image";
import type { TimelineEvent } from "@/types/mosque";
import type { Mosque } from "@/types/mosque";

/** Initial batch size — keeps first paint fast (History off ≈ 200 mosques; History on ≈ 400+) */
const ITEMS_PER_PAGE = 24;

type SortOrder = "oldest" | "newest";

type HistoryCategory =
  | "era"
  | "migration"
  | "expansion"
  | "caliphate"
  | "architecture"
  | "education"
  | "trade"
  | "destruction"
  | "colonization"
  | "independence";

interface ContextEvent {
  isContextEvent: true;
  year: string;
  label: string;
  description: string;
  source: string;
  category: HistoryCategory;
}

type TimelineItem = TimelineEvent | ContextEvent;

function isContextEvent(event: TimelineItem): event is ContextEvent {
  return "isContextEvent" in event && event.isContextEvent === true;
}

/** Build combined timeline with mosque events and Islamic history context */
function buildCombinedTimeline(
  mosqueEvents: TimelineEvent[],
  includeContext: boolean,
  categoryFilter: string,
  sortOrder: SortOrder,
  jsonContextEvents: TimelineEvent[],
): TimelineItem[] {
  let contextEvents: ContextEvent[] = [];

  if (includeContext) {
    const fromPeriods: ContextEvent[] = ISLAMIC_HISTORY_PERIODS.map((p) => ({
      isContextEvent: true as const,
      year: String(p.year),
      label: p.label,
      description: p.description,
      source: p.source,
      category: p.category as HistoryCategory,
    }));

    const fromJson: ContextEvent[] = jsonContextEvents.map((e) => ({
      isContextEvent: true as const,
      year: e.year,
      label: e.mosque,
      description: e.event,
      source: e.source ?? "",
      category: (e.category ?? "era") as HistoryCategory,
    }));

    const seen = new Set<string>();
    contextEvents = [...fromPeriods, ...fromJson].filter((e) => {
      const key = `${e.year}|${e.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (categoryFilter) {
      contextEvents = contextEvents.filter((e) => e.category === categoryFilter);
    }
  }

  // History category filter shows only context milestones, not all mosques
  const mosqueSlice =
    includeContext && categoryFilter ? [] : mosqueEvents;

  const combined = [...mosqueSlice, ...contextEvents];
  const order = sortOrder === "newest" ? -1 : 1;
  return combined.sort(
    (a, b) =>
      order * (parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year)),
  );
}

const allArchitectureStyles = Array.from(
  new Set(mosques.map((m) => m.architecturalStyle).filter(Boolean)),
).sort() as string[];

const allYears = [
  ...timelineEvents.map((e) => parseEstablishmentYear(e.year)),
  ...ISLAMIC_HISTORY_PERIODS.map((p) => p.year),
].filter((y) => y > 0);
const MIN_YEAR = Math.min(...allYears);
const MAX_YEAR = Math.max(...allYears, new Date().getFullYear());

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
  { value: "trade", label: "Trade & Commerce" },
  { value: "destruction", label: "Destruction & Loss" },
];

const mosqueTypeOptions = [
  { value: "all", label: "All mosques" },
  { value: "holySite", label: "Holy Sites" },
  { value: "womenArea", label: "Women's Prayer Area" },
  { value: "touristFriendly", label: "Tourist-Friendly" },
  { value: "sunni", label: "Sunni Tradition" },
  { value: "shia", label: "Shia Tradition" },
];

const ContextEventRow = memo(function ContextEventRow({
  event,
  index,
}: {
  event: ContextEvent;
  index: number;
}) {
  return (
    <div
      data-timeline-event
      data-year={parseEstablishmentYear(event.year)}
      className={`relative flex items-center gap-6 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 dark:bg-emerald-600 border-4 border-background z-10 md:-translate-x-1/2" />
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
              {formatYearDisplay(event.year)}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
              {event.label}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">{event.description}</p>
            {event.source && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={event.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
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
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
});

const MosqueEventRow = memo(function MosqueEventRow({
  event,
  mosque,
  index,
}: {
  event: TimelineEvent;
  mosque: Mosque | undefined;
  index: number;
}) {
  const { src: imageSrc, fallbackUrl: imageFallback } = mosque
    ? getMosqueImageSrc(mosque)
    : { src: "/placeholder.svg", fallbackUrl: null };

  return (
    <div
      data-timeline-event
      data-year={parseEstablishmentYear(event.year)}
      className={`relative flex items-center gap-6 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 md:-translate-x-1/2" />
      <div
        className={`ml-12 md:ml-0 md:w-1/2 ${
          index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
        }`}
      >
        <div className="bg-card rounded-lg shadow-lg border border-border mosque-card-shadow overflow-hidden min-w-0">
          <div className={`flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
            <div className="shrink-0 w-24 sm:w-28 md:w-32 self-stretch min-h-0 overflow-hidden bg-muted">
              <Link to={`/mosque/${event.mosqueId}`} className="block h-full w-full">
                <img
                  src={imageSrc}
                  alt={mosque ? `${mosque.name} - ${event.year}` : ""}
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
                {formatYearDisplay(event.year)}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mt-1">
                <Link
                  to={`/mosque/${event.mosqueId}`}
                  className="hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  {event.mosque}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">{event.event}</p>
              {mosque?.location && mosque?.country && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  {mosque.location}, {mosque.country}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
});

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
  // Off by default — History adds 200+ milestones and made /timeline feel broken
  const [showHistoryContext, setShowHistoryContext] = useState(false);
  const [eventCategory, setEventCategory] = useState<string>("");
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [yearRangeMode, setYearRangeMode] = useState<"all" | "custom">("all");
  const [jumpToYear, setJumpToYear] = useState<string>("");
  const [architectureStyle, setArchitectureStyle] = useState<string>("");
  const [mosqueType, setMosqueType] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pendingJumpYear, setPendingJumpYear] = useState<number | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);

  const mosqueById = useMemo(() => new Map(mosques.map((m) => [m.id, m])), []);
  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => getUniqueRegions(countries), [countries]);

  const filteredAndSortedEvents = useMemo(() => {
    let list = timelineEvents.filter((event) => {
      const mosque = mosqueById.get(event.mosqueId);
      if (!mosque) return false;
      if (!isPreview) {
        if (country && mosque.country !== country) return false;
        if (region) {
          const mosqueRegion = getRegionForCountry(mosque.country);
          if (mosqueRegion !== region) return false;
        }
        if (visitorFriendlyOnly && !mosque.touristFriendly) return false;

        const [minY, maxY] = yearRangeMode === "all" ? [MIN_YEAR, MAX_YEAR] : yearRange;
        if (!yearRangeOverlaps(event.year, minY, maxY)) return false;

        if (architectureStyle && mosque.architecturalStyle !== architectureStyle) return false;

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
    list = [...list].sort(
      (a, b) => order * (parseEstablishmentYear(a.year) - parseEstablishmentYear(b.year)),
    );
    return list;
  }, [
    mosqueById,
    country,
    region,
    sortOrder,
    isPreview,
    visitorFriendlyOnly,
    yearRange,
    yearRangeMode,
    architectureStyle,
    mosqueType,
  ]);

  const effectiveYearRange: [number, number] =
    yearRangeMode === "all" ? [MIN_YEAR, MAX_YEAR] : yearRange;

  const combinedEvents = useMemo(() => {
    const combined = buildCombinedTimeline(
      filteredAndSortedEvents,
      showHistoryContext && !isPreview,
      eventCategory,
      sortOrder,
      timelineContextEvents,
    );
    return combined.filter((e) =>
      yearRangeOverlaps(e.year, effectiveYearRange[0], effectiveYearRange[1]),
    );
  }, [
    filteredAndSortedEvents,
    showHistoryContext,
    isPreview,
    eventCategory,
    sortOrder,
    effectiveYearRange,
  ]);

  const fullEventList = isPreview ? filteredAndSortedEvents : combinedEvents;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    sortOrder,
    region,
    country,
    visitorFriendlyOnly,
    showHistoryContext,
    eventCategory,
    yearRange,
    yearRangeMode,
    architectureStyle,
    mosqueType,
  ]);

  const visibleCount = isPreview
    ? Math.min(limit ?? ITEMS_PER_PAGE, fullEventList.length)
    : Math.min(page * ITEMS_PER_PAGE, fullEventList.length);

  const displayedEvents = fullEventList.slice(0, visibleCount);
  const hasMorePreview = isPreview && filteredAndSortedEvents.length > (limit ?? 0);
  const hasMoreFull = !isPreview && visibleCount < fullEventList.length;

  const scrollToYear = useCallback((year: number) => {
    if (!timelineRef.current) return false;
    const elements = Array.from(
      timelineRef.current.querySelectorAll<HTMLElement>("[data-timeline-event]"),
    );
    if (elements.length === 0) return false;

    const withYears = elements.map((el) => ({
      el,
      year: parseInt(el.getAttribute("data-year") ?? "0", 10),
    }));

    const atOrAfter = withYears.find((w) => w.year >= year);
    const target =
      atOrAfter ??
      withYears.reduce((best, cur) =>
        Math.abs(cur.year - year) < Math.abs(best.year - year) ? cur : best,
      );

    target.el.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  }, []);

  const handleJumpToYear = useCallback(() => {
    const year = parseInt(jumpToYear, 10);
    if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) return;

    // Expand pages until the target year is in the loaded slice, then scroll
    const idx = fullEventList.findIndex((e) => parseEstablishmentYear(e.year) >= year);
    const targetIndex = idx >= 0 ? idx : fullEventList.length - 1;
    if (targetIndex < 0) return;

    const neededPage = Math.ceil((targetIndex + 1) / ITEMS_PER_PAGE);
    if (neededPage > page) {
      setPage(neededPage);
      setPendingJumpYear(year);
    } else {
      scrollToYear(year);
    }
  }, [jumpToYear, fullEventList, page, scrollToYear]);

  useEffect(() => {
    if (pendingJumpYear == null) return;
    const id = requestAnimationFrame(() => {
      scrollToYear(pendingJumpYear);
      setPendingJumpYear(null);
    });
    return () => cancelAnimationFrame(id);
  }, [pendingJumpYear, displayedEvents.length, scrollToYear]);

  const activeAdvancedFilters = [
    yearRangeMode === "custom" && (yearRange[0] !== MIN_YEAR || yearRange[1] !== MAX_YEAR),
    architectureStyle,
    mosqueType,
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeAdvancedFilters > 0 ||
    region ||
    country ||
    eventCategory ||
    visitorFriendlyOnly ||
    showHistoryContext ||
    sortOrder !== "oldest";

  const resetFilters = () => {
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setYearRangeMode("all");
    setArchitectureStyle("");
    setMosqueType("");
    setJumpToYear("");
    setRegion("");
    setCountry("");
    setEventCategory("");
    setVisitorFriendlyOnly(false);
    setShowHistoryContext(false);
    setSortOrder("oldest");
    setPage(1);
  };

  return (
    <section
      id="timeline"
      className="py-16 md:py-24 bg-background scroll-mt-20"
      aria-labelledby="timeline-heading"
      role="region"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4" aria-hidden="true">
            <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              1400+ Years of History
            </span>
          </div>
          <h2 id="timeline-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Timeline of Major Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Journey through history—from 622 CE to today—and discover when
            the world&apos;s most significant mosques and holy sites were built.
            {" "}
            <Link to="/islamic-history" className="text-primary hover:underline">
              View full Islamic history timeline
            </Link>
          </p>
        </header>

        {showFilters && (
        <div className="mb-6 md:mb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
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

            <Select
              value={eventCategory || "all"}
              onValueChange={(v) => setEventCategory(v === "all" ? "" : v)}
              disabled={!showHistoryContext}
            >
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

          <div className="flex flex-col sm:flex-row gap-3 mt-3 items-start sm:items-center">
            <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{effectiveYearRange[0]}</span>
              <Slider
                value={yearRange}
                min={MIN_YEAR}
                max={MAX_YEAR}
                step={10}
                onValueChange={(v) => {
                  setYearRange(v as [number, number]);
                  setYearRangeMode("custom");
                }}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{effectiveYearRange[1]} CE</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder="Year"
                value={jumpToYear}
                onChange={(e) => setJumpToYear(e.target.value)}
                min={MIN_YEAR}
                max={MAX_YEAR}
                className="h-8 w-20 text-sm"
                aria-label="Jump to year"
                onKeyDown={(e) => e.key === "Enter" && handleJumpToYear()}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={handleJumpToYear}
                className="h-8 px-2"
                aria-label="Jump to year"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>

            <RadioGroup
              value={yearRangeMode}
              onValueChange={(v) => {
                if (v === "all" || v === "custom") {
                  setYearRangeMode(v);
                  if (v === "all") setYearRange([MIN_YEAR, MAX_YEAR]);
                }
              }}
              className="flex items-center gap-3 flex-shrink-0"
              aria-label="Timeline years filter"
            >
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="all" id="year-all" />
                <Label htmlFor="year-all" className="text-xs cursor-pointer font-normal">
                  All years
                </Label>
              </div>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="custom" id="year-custom" />
                <Label htmlFor="year-custom" className="text-xs cursor-pointer font-normal">
                  Custom
                </Label>
              </div>
            </RadioGroup>

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
                  onChange={(e) => {
                    setShowHistoryContext(e.target.checked);
                    if (!e.target.checked) setEventCategory("");
                  }}
                  className="h-3.5 w-3.5 rounded border-border"
                />
                <span className="hidden sm:inline">History events</span>
                <span className="sm:hidden">History</span>
              </label>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Showing {displayedEvents.length} of {fullEventList.length} event
            {fullEventList.length !== 1 ? "s" : ""}
            {showHistoryContext && ` · ${filteredAndSortedEvents.length} mosques`}
            {!showHistoryContext && (
              <span className="ml-1">· turn on History events for milestones</span>
            )}
          </p>
        </div>
        )}

        <div
          ref={timelineRef}
          className="relative max-w-4xl mx-auto"
          role="feed"
          aria-label={`Timeline showing ${displayedEvents.length} of ${fullEventList.length} events`}
        >
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" aria-hidden="true" />

          <div className="space-y-6 md:space-y-8" role="list">
            {displayedEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                {eventCategory && showHistoryContext
                  ? "No history events match this category and year range. Try a different event type or widen the year range."
                  : visitorFriendlyOnly
                    ? "No visitor-friendly mosques match the selected filters. Try a different region or country, or clear Non-Muslims can visit."
                    : "No events match the selected filters. Try a different region, country, or year range."}
              </p>
            ) : (
              displayedEvents.map((event, index) =>
                isContextEvent(event) ? (
                  <ContextEventRow
                    key={`context-${event.year}-${event.label}-${index}`}
                    event={event}
                    index={index}
                  />
                ) : (
                  <MosqueEventRow
                    key={`${event.mosqueId}-${event.year}-${index}`}
                    event={event}
                    mosque={mosqueById.get(event.mosqueId)}
                    index={index}
                  />
                ),
              )
            )}
          </div>

          {hasMoreFull && (
            <div className="text-center mt-10">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage((p) => p + 1)}
                className="gap-2"
              >
                Load more events
                <span className="text-muted-foreground font-normal">
                  ({Math.min(ITEMS_PER_PAGE, fullEventList.length - visibleCount)} more)
                </span>
              </Button>
            </div>
          )}

          {!isPreview && !hasMoreFull && fullEventList.length > ITEMS_PER_PAGE && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              End of timeline · {fullEventList.length} events
            </p>
          )}

          {hasMorePreview && (
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
