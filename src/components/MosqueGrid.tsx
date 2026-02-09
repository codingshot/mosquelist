import {
  mosques,
  getUniqueCountries,
  getUniqueArchitecturalStyles,
} from "@/data/mosques";
import { getUniqueRegions, getRegionForCountry } from "@/data/regions";
import { filterMosquesByQuery } from "@/lib/search";
import { MosqueCard } from "./MosqueCard";
import { SwipeDeck } from "./SwipeDeck";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  LayoutGrid,
  Smartphone,
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  XCircle,
  MapPin,
  Table2,
} from "lucide-react";
import { ExploreMapView } from "@/components/ExploreMapView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

/** Items per page for infinite scroll */
const ITEMS_PER_PAGE = 12;

const PARAM_QUERY = "q";
const PARAM_FILTER = "filter";
const PARAM_VIEW = "view";
const PARAM_SORT = "sort";
const PARAM_COUNTRY = "country";
const PARAM_REGION = "region";
const PARAM_WOMEN = "women";
const PARAM_TOURIST = "tourist";
const PARAM_CAP_MIN = "capMin";
const PARAM_CAP_MAX = "capMax";
const PARAM_AREA_MIN = "areaMin";
const PARAM_AREA_MAX = "areaMax";
const PARAM_EST_MIN = "estMin";
const PARAM_EST_MAX = "estMax";
const PARAM_STYLE = "style";
const PARAM_DENOMINATION = "denomination";
const PARAM_FACILITY_GUIDED = "facilityGuided";
const PARAM_FACILITY_WHEELCHAIR = "facilityWheelchair";

type FilterType = "all" | "holy" | "tourist" | "biggest";
type ViewType = "grid" | "swipe" | "map" | "table";
type SortType =
  | "relevance"
  | "holyCapacity"
  | "touristFirst"
  | "name"
  | "capacity"
  | "area"
  | "established"
  | "country";

/** Parse year from established string (e.g. "622 CE" -> 622, "2007" -> 2007) */
function establishedYear(established: string): number {
  const match = established.match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

function formatTableNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function useMosqueSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get(PARAM_QUERY) ?? "";
  const filter = (searchParams.get(PARAM_FILTER) as FilterType) ?? "all";
  const viewParam = searchParams.get(PARAM_VIEW);
  const view: ViewType =
    viewParam === "grid" || viewParam === "swipe" || viewParam === "map" || viewParam === "table"
      ? viewParam
      : "grid";
  const sortParam = searchParams.get(PARAM_SORT) as SortType | null;
  // Default to relevance when searching, holyCapacity otherwise
  const sort = sortParam || "holyCapacity";
  const country = searchParams.get(PARAM_COUNTRY) ?? "";
  const region = searchParams.get(PARAM_REGION) ?? "";
  const womenOnly = searchParams.get(PARAM_WOMEN) === "1";
  const touristOnly = searchParams.get(PARAM_TOURIST) === "1";
  const capMin = searchParams.get(PARAM_CAP_MIN) ?? "";
  const capMax = searchParams.get(PARAM_CAP_MAX) ?? "";
  const areaMin = searchParams.get(PARAM_AREA_MIN) ?? "";
  const areaMax = searchParams.get(PARAM_AREA_MAX) ?? "";
  const estMin = searchParams.get(PARAM_EST_MIN) ?? "";
  const estMax = searchParams.get(PARAM_EST_MAX) ?? "";
  const architecturalStyle = searchParams.get(PARAM_STYLE) ?? "";
  const denominationParam = searchParams.get(PARAM_DENOMINATION) ?? "";
  const denomination =
    denominationParam === "sunni" || denominationParam === "shia"
      ? denominationParam
      : "";
  const facilityGuided = searchParams.get(PARAM_FACILITY_GUIDED) === "1";
  const facilityWheelchair =
    searchParams.get(PARAM_FACILITY_WHEELCHAIR) === "1";

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === "" || value === "all") next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setQuery = (v: string) => setParam(PARAM_QUERY, v);
  const setFilter = (v: FilterType) => setParam(PARAM_FILTER, v);
  const setView = (v: ViewType) => setParam(PARAM_VIEW, v);
  const setSort = (v: SortType) => setParam(PARAM_SORT, v);
  const setCountry = (v: string) => setParam(PARAM_COUNTRY, v);
  const setRegion = (v: string) => setParam(PARAM_REGION, v);
  const setWomenOnly = (v: boolean) => setParam(PARAM_WOMEN, v ? "1" : "");
  const setTouristOnly = (v: boolean) => setParam(PARAM_TOURIST, v ? "1" : "");
  const setCapMin = (v: string) => setParam(PARAM_CAP_MIN, v);
  const setCapMax = (v: string) => setParam(PARAM_CAP_MAX, v);
  const setAreaMin = (v: string) => setParam(PARAM_AREA_MIN, v);
  const setAreaMax = (v: string) => setParam(PARAM_AREA_MAX, v);
  const setEstMin = (v: string) => setParam(PARAM_EST_MIN, v);
  const setEstMax = (v: string) => setParam(PARAM_EST_MAX, v);
  const setArchitecturalStyle = (v: string) => setParam(PARAM_STYLE, v);
  const setDenomination = (v: string) =>
    setParam(PARAM_DENOMINATION, v === "all" ? "" : v);
  const setFacilityGuided = (v: boolean) =>
    setParam(PARAM_FACILITY_GUIDED, v ? "1" : "");
  const setFacilityWheelchair = (v: boolean) =>
    setParam(PARAM_FACILITY_WHEELCHAIR, v ? "1" : "");

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    query,
    filter,
    view,
    sort,
    country,
    region,
    womenOnly,
    touristOnly,
    facilityGuided,
    facilityWheelchair,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    architecturalStyle,
    denomination,
    setQuery,
    setFilter,
    setView,
    setSort,
    setCountry,
    setRegion,
    setWomenOnly,
    setTouristOnly,
    setFacilityGuided,
    setFacilityWheelchair,
    setCapMin,
    setCapMax,
    setAreaMin,
    setAreaMax,
    setEstMin,
    setEstMax,
    setArchitecturalStyle,
    setDenomination,
    clearAllFilters,
  };
}

/** Preview shows this many to fill grid rows (multiple of 12 = full rows for 2, 3, or 4 columns). */
const PREVIEW_GRID_SIZE = 12;

export const MosqueGrid = ({
  mode = "full",
}: {
  mode?: "full" | "preview";
}) => {
  const isPreview = mode === "preview";
  const {
    query,
    filter,
    view,
    sort,
    country,
    region,
    womenOnly,
    touristOnly,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    setQuery,
    setFilter,
    setView,
    setSort,
    setCountry,
    setRegion,
    setWomenOnly,
    setTouristOnly,
    facilityGuided,
    facilityWheelchair,
    setFacilityGuided,
    setFacilityWheelchair,
    setCapMin,
    setCapMax,
    setAreaMin,
    setAreaMax,
    setEstMin,
    setEstMax,
    architecturalStyle,
    setArchitecturalStyle,
    denomination,
    setDenomination,
    clearAllFilters: clearAllFiltersFromHook,
  } = useMosqueSearchParams();

  const countries = useMemo(() => getUniqueCountries(), []);
  const regions = useMemo(() => getUniqueRegions(countries), [countries]);
  const styles = useMemo(() => getUniqueArchitecturalStyles(), []);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [searchInput, setSearchInput] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, filter, country, region, womenOnly, touristOnly, facilityGuided, facilityWheelchair, capMin, capMax, areaMin, areaMax, estMin, estMax, architecturalStyle, denomination, sort]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const setQueryDebounced = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setQuery(value.trim());
        debounceRef.current = null;
      }, 280);
    },
    [setQuery],
  );

  const clearSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSearchInput("");
    setQuery("");
  }, [setQuery]);

  const hasActiveFilters =
    query !== "" ||
    filter !== "all" ||
    country !== "" ||
    region !== "" ||
    denomination !== "" ||
    womenOnly ||
    touristOnly ||
    facilityGuided ||
    facilityWheelchair ||
    capMin !== "" ||
    capMax !== "" ||
    areaMin !== "" ||
    areaMax !== "" ||
    estMin !== "" ||
    estMax !== "" ||
    architecturalStyle !== "";

  const activeFilterCount = [
    country,
    region,
    womenOnly,
    touristOnly,
    facilityGuided,
    facilityWheelchair,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    architecturalStyle,
  ].filter(Boolean).length;

  const clearAllFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSearchInput("");
    clearAllFiltersFromHook();
  }, [clearAllFiltersFromHook]);

  const filteredMosques = useMemo(() => {
    let list = mosques;

    if (filter === "holy") list = list.filter((m) => m.isHolySite);
    if (filter === "tourist") list = list.filter((m) => m.touristFriendly);
    if (filter === "biggest") list = list.filter((m) => m.capacity >= 100_000);
    if (country) list = list.filter((m) => m.country === country);
    if (region)
      list = list.filter((m) => getRegionForCountry(m.country) === region);
    if (denomination)
      list = list.filter((m) => m.denomination === denomination);
    if (womenOnly) list = list.filter((m) => m.womenPrayerArea);
    if (touristOnly) list = list.filter((m) => m.touristFriendly);
    if (facilityGuided)
      list = list.filter((m) =>
        (m.facilities || []).some((f) => /guided|tour/i.test(f)),
      );
    if (facilityWheelchair)
      list = list.filter((m) =>
        (m.facilities || []).some((f) => /wheelchair|accessible/i.test(f)),
      );
    if (architecturalStyle)
      list = list.filter((m) => m.architecturalStyle === architecturalStyle);

    const minCap = capMin ? parseInt(capMin, 10) : NaN;
    const maxCap = capMax ? parseInt(capMax, 10) : NaN;
    if (!Number.isNaN(minCap)) list = list.filter((m) => m.capacity >= minCap);
    if (!Number.isNaN(maxCap)) list = list.filter((m) => m.capacity <= maxCap);

    const minArea = areaMin ? parseInt(areaMin, 10) : NaN;
    const maxArea = areaMax ? parseInt(areaMax, 10) : NaN;
    if (!Number.isNaN(minArea)) list = list.filter((m) => m.area >= minArea);
    if (!Number.isNaN(maxArea)) list = list.filter((m) => m.area <= maxArea);

    const minEst = estMin ? parseInt(estMin, 10) : NaN;
    const maxEst = estMax ? parseInt(estMax, 10) : NaN;
    if (!Number.isNaN(minEst))
      list = list.filter((m) => establishedYear(m.established) >= minEst);
    if (!Number.isNaN(maxEst))
      list = list.filter((m) => establishedYear(m.established) <= maxEst);

    list = filterMosquesByQuery(list, query);

    // When there's a search query and no explicit sort, keep relevance order from filterMosquesByQuery
    // Otherwise, apply the selected sort
    const order = sort || "holyCapacity";

    // If searching and using default sort, use relevance (keep search order)
    const effectiveSort =
      query && order === "holyCapacity" ? "relevance" : order;

    if (effectiveSort === "relevance") {
      // Keep the order from filterMosquesByQuery (already sorted by relevance)
      return list;
    }

    const sorted = [...list].sort((a, b) => {
      switch (effectiveSort) {
        case "holyCapacity":
          if (a.isHolySite !== b.isHolySite) return a.isHolySite ? -1 : 1;
          return b.capacity - a.capacity;
        case "touristFirst":
          if (a.touristFriendly !== b.touristFriendly)
            return a.touristFriendly ? -1 : 1;
          if (a.isHolySite !== b.isHolySite) return a.isHolySite ? -1 : 1;
          return b.capacity - a.capacity;
        case "name":
          return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          });
        case "capacity":
          return b.capacity - a.capacity;
        case "area":
          return b.area - a.area;
        case "established": {
          const ya = establishedYear(a.established);
          const yb = establishedYear(b.established);
          return ya - yb;
        }
        case "country":
          return (
            a.country.localeCompare(b.country, undefined, {
              sensitivity: "base",
            }) || a.name.localeCompare(b.name)
          );
        default:
          return 0;
      }
    });
    return sorted;
  }, [
    query,
    filter,
    country,
    region,
    denomination,
    womenOnly,
    touristOnly,
    facilityGuided,
    facilityWheelchair,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    architecturalStyle,
    sort,
  ]);

  // Calculate paginated mosques for infinite scroll
  const paginatedMosques = useMemo(() => {
    if (isPreview) {
      return filteredMosques.slice(0, PREVIEW_GRID_SIZE);
    }
    return filteredMosques.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredMosques, isPreview, page]);

  const hasMore = !isPreview && paginatedMosques.length < filteredMosques.length;

  // Load more handler
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simulate small delay for smooth UX
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore]);

  // Infinite scroll hook
  const { setSentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  const displayedMosques = paginatedMosques;

  const filteredMosquesWithCoords = useMemo(
    () =>
      filteredMosques.filter(
        (m): m is typeof m & { coordinates: { lat: number; lng: number } } =>
          !!m.coordinates,
      ),
    [filteredMosques],
  );

  return (
    <section
      id="mosques"
      className="py-16 md:py-24 bg-paper-cream islamic-pattern scroll-mt-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Magnificent Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From the three holiest sites in Islam to historic and modern
            masterpieces across 50+ countries. Search, filter, and add to your
            list.
          </p>
        </div>

        {/* Search + filters: hidden in preview mode to save space */}
        {!isPreview && (
          <div className="print:hidden flex flex-col gap-4 mb-6 md:mb-8">
            {/* Search: full width, 44px min height for touch, 16px font to avoid iOS zoom */}
            <div className="relative w-full min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search by name, city, country, style"
                value={searchInput}
                onChange={(e) => setQueryDebounced(e.target.value)}
                className="pl-9 pr-10 w-full h-11 min-h-[44px] text-base touch-manipulation rounded-lg border-border"
                aria-label="Search mosques by name, location, country, region, or description"
                autoComplete="off"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 w-full min-w-0">
              <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto sm:flex-wrap">
                <Filter
                  className="w-5 h-5 text-muted-foreground shrink-0 hidden sm:block"
                  aria-hidden
                />
                <div className="flex overflow-x-auto gap-1.5 sm:gap-2 py-1 -mx-1 px-1 sm:overflow-visible sm:mx-0 sm:px-0 sm:flex-wrap touch-manipulation [scrollbar-width:thin] overflow-y-hidden">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={`shrink-0 min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "all" ? "gradient-gold text-primary-foreground" : ""}`}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "holy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("holy")}
                    className={`shrink-0 min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "holy" ? "gradient-gold text-primary-foreground" : ""}`}
                  >
                    Holy Sites
                  </Button>
                  <Button
                    variant={filter === "tourist" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("tourist")}
                    className={`shrink-0 min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "tourist" ? "gradient-gold text-primary-foreground" : ""}`}
                    title="Non-Muslims can visit"
                  >
                    Visitors
                  </Button>
                  <Button
                    variant={filter === "biggest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("biggest")}
                    className={`shrink-0 min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "biggest" ? "gradient-gold text-primary-foreground" : ""}`}
                  >
                    Biggest
                  </Button>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="shrink-0 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline touch-manipulation min-h-[44px] sm:min-h-0 sm:self-center py-2 sm:py-0"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              {/* Sort + Filters row on mobile; same row as view on sm+ */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto min-w-0">
                <div className="flex items-center gap-2 w-full min-w-0 sm:w-auto">
                  <Select
                    value={sort}
                    onValueChange={(v) =>
                      setSort((v || "holyCapacity") as SortType)
                    }
                  >
                    <SelectTrigger
                      className="flex-1 min-w-0 sm:flex-none sm:w-[160px] h-11 min-h-[44px] touch-manipulation text-base"
                      aria-label="Sort by"
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4 shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holyCapacity">
                        Holy first, then biggest
                      </SelectItem>
                      <SelectItem value="touristFirst">
                        Visitor-friendly first
                      </SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="capacity">Capacity</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                      <SelectItem value="established">Date</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                    </SelectContent>
                  </Select>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 h-11 min-h-[44px] min-w-[44px] sm:min-w-0 shrink-0 relative touch-manipulation"
                      >
                        <SlidersHorizontal className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFilterCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-5 px-1.5 text-xs flex items-center justify-center"
                          >
                            {activeFilterCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[min(100vw-1rem,24rem)] max-w-[calc(100vw-1rem)] overflow-y-auto pb-8"
                    >
                      <SheetHeader>
                        <SheetTitle>Advanced filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                          <Label>Region</Label>
                          <Select
                            value={region || "all"}
                            onValueChange={(v) =>
                              setRegion(v === "all" ? "" : v)
                            }
                          >
                            <SelectTrigger className="min-h-[44px] touch-manipulation text-base">
                              <SelectValue placeholder="Any region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any region</SelectItem>
                              {regions.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select
                            value={country || "all"}
                            onValueChange={(v) =>
                              setCountry(v === "all" ? "" : v)
                            }
                          >
                            <SelectTrigger className="min-h-[44px] touch-manipulation text-base">
                              <SelectValue placeholder="Any country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any country</SelectItem>
                              {countries.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Denomination</Label>
                          <p className="text-xs text-muted-foreground">
                            Where clearly associated (fact-checked). Many
                            mosques welcome all Muslims.
                          </p>
                          <Select
                            value={denomination || "all"}
                            onValueChange={setDenomination}
                          >
                            <SelectTrigger className="min-h-[44px] touch-manipulation text-base">
                              <SelectValue placeholder="Any denomination" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Any denomination
                              </SelectItem>
                              <SelectItem value="sunni">Sunni</SelectItem>
                              <SelectItem value="shia">Shia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Architectural style</Label>
                          <p className="text-xs text-muted-foreground">
                            Filter by regional/historical style (see About for
                            reference).
                          </p>
                          <Select
                            value={architecturalStyle || "all"}
                            onValueChange={(v) =>
                              setArchitecturalStyle(v === "all" ? "" : v)
                            }
                          >
                            <SelectTrigger className="min-h-[44px] touch-manipulation text-base">
                              <SelectValue placeholder="Any style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any style</SelectItem>
                              {styles.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <span className="line-clamp-1">{s}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Visitor access
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Filter by whether non-Muslims can visit and key
                            facilities.
                          </p>
                          <div className="flex items-center space-x-3 min-h-[44px]">
                            <Checkbox
                              id="tourist-adv"
                              checked={touristOnly}
                              onCheckedChange={(c) => setTouristOnly(!!c)}
                              className="touch-manipulation size-5"
                            />
                            <Label
                              htmlFor="tourist-adv"
                              className="font-normal cursor-pointer touch-manipulation flex-1 py-2"
                            >
                              Non-Muslims can visit only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 min-h-[44px]">
                            <Checkbox
                              id="women"
                              checked={womenOnly}
                              onCheckedChange={(c) => setWomenOnly(!!c)}
                              className="touch-manipulation size-5"
                            />
                            <Label
                              htmlFor="women"
                              className="font-normal cursor-pointer touch-manipulation flex-1 py-2"
                            >
                              Women&apos;s prayer area only
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Facilities
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Mosques that list these facilities.
                          </p>
                          <div className="flex items-center space-x-3 min-h-[44px]">
                            <Checkbox
                              id="facility-guided"
                              checked={facilityGuided}
                              onCheckedChange={(c) => setFacilityGuided(!!c)}
                              className="touch-manipulation size-5"
                            />
                            <Label
                              htmlFor="facility-guided"
                              className="font-normal cursor-pointer touch-manipulation flex-1 py-2"
                            >
                              Has guided tours
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 min-h-[44px]">
                            <Checkbox
                              id="facility-wheelchair"
                              checked={facilityWheelchair}
                              onCheckedChange={(c) =>
                                setFacilityWheelchair(!!c)
                              }
                              className="touch-manipulation size-5"
                            />
                            <Label
                              htmlFor="facility-wheelchair"
                              className="font-normal cursor-pointer touch-manipulation flex-1 py-2"
                            >
                              Wheelchair accessible
                            </Label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="capMin">Min capacity</Label>
                            <Input
                              id="capMin"
                              type="number"
                              min={0}
                              placeholder="e.g. 10000"
                              value={capMin}
                              onChange={(e) => setCapMin(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="capMax">Max capacity</Label>
                            <Input
                              id="capMax"
                              type="number"
                              min={0}
                              placeholder="e.g. 500000"
                              value={capMax}
                              onChange={(e) => setCapMax(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="areaMin">Min area (m²)</Label>
                            <Input
                              id="areaMin"
                              type="number"
                              min={0}
                              placeholder="e.g. 10000"
                              value={areaMin}
                              onChange={(e) => setAreaMin(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="areaMax">Max area (m²)</Label>
                            <Input
                              id="areaMax"
                              type="number"
                              min={0}
                              placeholder="e.g. 100000"
                              value={areaMax}
                              onChange={(e) => setAreaMax(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="estMin">
                              Established after (year)
                            </Label>
                            <Input
                              id="estMin"
                              type="number"
                              min={500}
                              max={2100}
                              placeholder="e.g. 1900"
                              value={estMin}
                              onChange={(e) => setEstMin(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estMax">
                              Established before (year)
                            </Label>
                            <Input
                              id="estMax"
                              type="number"
                              min={500}
                              max={2100}
                              placeholder="e.g. 2000"
                              value={estMax}
                              onChange={(e) => setEstMax(e.target.value)}
                              className="min-h-[44px] text-base touch-manipulation"
                            />
                          </div>
                        </div>
                      </div>
                      {activeFilterCount > 0 && (
                        <div className="mt-6 pt-4 border-t border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full min-h-[44px] touch-manipulation"
                            onClick={clearAllFilters}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Clear all filters
                          </Button>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                </div>
                <div
                  className="flex items-center gap-2 min-w-0 overflow-x-auto py-1 -mx-1 px-1 sm:overflow-visible sm:mx-0 sm:px-0 [scrollbar-width:thin]"
                  role="group"
                  aria-label="View mode"
                >
                  <Button
                    variant={view === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={view === "swipe" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                    onClick={() => setView("swipe")}
                    aria-label="Swipe mode"
                    aria-pressed={view === "swipe"}
                  >
                    <Smartphone className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={view === "map" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                    onClick={() => setView("map")}
                    aria-label="Map view"
                    aria-pressed={view === "map"}
                  >
                    <MapPin className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={view === "table" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                    onClick={() => setView("table")}
                    aria-label="Table view"
                    aria-pressed={view === "table"}
                  >
                    <Table2 className="w-5 h-5" />
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 min-h-[44px] shrink-0 text-muted-foreground touch-manipulation"
                      onClick={clearAllFilters}
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear all</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Active filter chips - wrap on mobile, touch-friendly remove */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {query && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal max-w-full min-w-0"
                  >
                    <span className="truncate max-w-[200px] sm:max-w-none">
                      &quot;{query}&quot;
                    </span>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation -m-1 sm:m-0"
                      aria-label="Remove search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {filter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    {filter === "holy"
                      ? "Holy Sites"
                      : filter === "tourist"
                        ? "Visitors"
                        : "Biggest"}
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation -m-1 sm:m-0"
                      aria-label="Remove filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {region && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {region}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegion("")}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label={`Remove region ${region}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {country && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {country}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCountry("")}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label={`Remove country ${country}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {denomination && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    {denomination === "sunni" ? "Sunni" : "Shia"}
                    <button
                      type="button"
                      onClick={() => setDenomination("all")}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label={`Remove denomination filter`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {womenOnly && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    Women&apos;s area
                    <button
                      type="button"
                      onClick={() => setWomenOnly(false)}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label="Remove women's area filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {touristOnly && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    Non-Muslims can visit
                    <button
                      type="button"
                      onClick={() => setTouristOnly(false)}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label="Remove non-Muslims can visit filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {facilityGuided && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    Guided tours
                    <button
                      type="button"
                      onClick={() => setFacilityGuided(false)}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label="Remove guided tours filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {facilityWheelchair && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    Wheelchair access
                    <button
                      type="button"
                      onClick={() => setFacilityWheelchair(false)}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label="Remove wheelchair access filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {(capMin || capMax) && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal"
                  >
                    Capacity {capMin && `≥${Number(capMin).toLocaleString()}`}
                    {capMin && capMax && " "}
                    {capMax && `≤${Number(capMax).toLocaleString()}`}
                    <button
                      type="button"
                      onClick={() => {
                        setCapMin("");
                        setCapMax("");
                      }}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted touch-manipulation shrink-0 -m-1 sm:m-0"
                      aria-label="Remove capacity filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {architecturalStyle && (
                  <Badge
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-1 font-normal max-w-[180px] min-w-0"
                  >
                    <span className="truncate">{architecturalStyle}</span>
                    <button
                      type="button"
                      onClick={() => setArchitecturalStyle("")}
                      className="rounded-full p-2 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center hover:bg-muted shrink-0 touch-manipulation -m-1 sm:m-0"
                      aria-label="Remove style filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayedMosques.length === 0
            ? "No mosques match your filters. Try adjusting search or filters."
            : isPreview
              ? "Explore preview. Link to see all mosques below."
              : `${filteredMosques.length} mosque${filteredMosques.length === 1 ? "" : "s"} found.`}
        </p>

        {displayedMosques.length > 0 && !isPreview && (
          <p className="text-sm text-muted-foreground mb-4" aria-hidden="true">
            {filteredMosques.length} mosque
            {filteredMosques.length === 1 ? "" : "s"} found
          </p>
        )}

        {view === "map" ? (
          <ExploreMapView mosques={filteredMosquesWithCoords} />
        ) : view === "swipe" ? (
          <SwipeDeck
            mosques={displayedMosques}
            onLike={(mosque) => toggleFavorite(mosque.id)}
            isFavorite={isFavorite}
          />
        ) : view === "table" ? (
          filteredMosques.length === 0 ? null : (
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0 z-10 border-b border-border">
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("name")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Name
                        {sort === "name" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Location</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("country")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Country
                        {sort === "country" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("capacity")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Capacity
                        {sort === "capacity" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("area")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Area (m²)
                        {sort === "area" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("established")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Established
                        {sort === "established" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Style</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        onClick={() => setSort("touristFirst")}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                      >
                        Visitors
                        {sort === "touristFirst" && <ArrowUpDown className="w-4 h-4" />}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMosques.map((mosque) => (
                    <TableRow key={mosque.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <Link
                          to={`/mosque/${mosque.id}`}
                          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
                        >
                          {mosque.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {mosque.location}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{mosque.country}</TableCell>
                      <TableCell className="tabular-nums whitespace-nowrap">
                        {formatTableNumber(mosque.capacity)}
                      </TableCell>
                      <TableCell className="tabular-nums whitespace-nowrap">
                        {mosque.area ? formatTableNumber(mosque.area) : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{mosque.established || "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[140px] truncate" title={mosque.architecturalStyle ?? ""}>
                        {mosque.architecturalStyle || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {mosque.touristFriendly ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          )
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-2 px-1">
            {displayedMosques.map((mosque, index) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                index={index}
                view={view}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel and loading indicator */}
        {!isPreview && view !== "map" && view !== "swipe" && view !== "table" && hasMore && (
          <>
            <div
              ref={setSentinelRef}
              className="h-8 w-full mt-4"
              aria-hidden="true"
            />
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading more mosques...
                </span>
              </div>
            )}
          </>
        )}

        {!isPreview && view !== "table" && !hasMore && displayedMosques.length > 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            You&apos;ve reached the end. {filteredMosques.length} mosques total.
          </p>
        )}

        {isPreview && displayedMosques.length > 0 && (
          <div className="mt-8 text-center">
            <Button size="lg" className="gap-2" asChild>
              <Link
                to="/explore"
                onMouseEnter={() => import("@/pages/ExplorePage")}
                onFocus={() => import("@/pages/ExplorePage")}
              >
                <MapPin className="w-4 h-4" />
                See all mosques
              </Link>
            </Button>
          </div>
        )}

        {displayedMosques.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              No mosques match your filters.
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="lg"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Clear all filters and search
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Try a different search term or filter.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
