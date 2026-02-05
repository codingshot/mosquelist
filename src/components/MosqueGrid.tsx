import { mosques, getUniqueCountries, getUniqueArchitecturalStyles } from "@/data/mosques";
import { filterMosquesByQuery } from "@/lib/search";
import { MosqueCard } from "./MosqueCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
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
import { Filter, LayoutGrid, List, AlignLeft, Smartphone, SlidersHorizontal, Search, X, ArrowUpDown, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const PARAM_QUERY = "q";
const PARAM_FILTER = "filter";
const PARAM_VIEW = "view";
const PARAM_SORT = "sort";
const PARAM_COUNTRY = "country";
const PARAM_WOMEN = "women";
const PARAM_TOURIST = "tourist";
const PARAM_CAP_MIN = "capMin";
const PARAM_CAP_MAX = "capMax";
const PARAM_AREA_MIN = "areaMin";
const PARAM_AREA_MAX = "areaMax";
const PARAM_EST_MIN = "estMin";
const PARAM_EST_MAX = "estMax";
const PARAM_STYLE = "style";

type FilterType = "all" | "holy" | "tourist" | "biggest";
type ViewType = "grid" | "list" | "compact" | "swipe";
type SortType = "holyCapacity" | "name" | "capacity" | "area" | "established" | "country";

/** Parse year from established string (e.g. "622 CE" -> 622, "2007" -> 2007) */
function establishedYear(established: string): number {
  const match = established.match(/\d{1,4}/);
  return match ? parseInt(match[0], 10) : 0;
}

function useMosqueSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get(PARAM_QUERY) ?? "";
  const filter = (searchParams.get(PARAM_FILTER) as FilterType) ?? "all";
  const viewParam = searchParams.get(PARAM_VIEW);
  const view: ViewType =
    viewParam === "grid" || viewParam === "list" || viewParam === "compact" || viewParam === "swipe"
      ? viewParam
      : "grid";
  const sort = (searchParams.get(PARAM_SORT) as SortType) || "holyCapacity";
  const country = searchParams.get(PARAM_COUNTRY) ?? "";
  const womenOnly = searchParams.get(PARAM_WOMEN) === "1";
  const touristOnly = searchParams.get(PARAM_TOURIST) === "1";
  const capMin = searchParams.get(PARAM_CAP_MIN) ?? "";
  const capMax = searchParams.get(PARAM_CAP_MAX) ?? "";
  const areaMin = searchParams.get(PARAM_AREA_MIN) ?? "";
  const areaMax = searchParams.get(PARAM_AREA_MAX) ?? "";
  const estMin = searchParams.get(PARAM_EST_MIN) ?? "";
  const estMax = searchParams.get(PARAM_EST_MAX) ?? "";
  const architecturalStyle = searchParams.get(PARAM_STYLE) ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      });
    },
    [setSearchParams]
  );

  const setQuery = (v: string) => setParam(PARAM_QUERY, v);
  const setFilter = (v: FilterType) => setParam(PARAM_FILTER, v);
  const setView = (v: ViewType) => setParam(PARAM_VIEW, v);
  const setSort = (v: SortType) => setParam(PARAM_SORT, v);
  const setCountry = (v: string) => setParam(PARAM_COUNTRY, v);
  const setWomenOnly = (v: boolean) => setParam(PARAM_WOMEN, v ? "1" : "");
  const setTouristOnly = (v: boolean) => setParam(PARAM_TOURIST, v ? "1" : "");
  const setCapMin = (v: string) => setParam(PARAM_CAP_MIN, v);
  const setCapMax = (v: string) => setParam(PARAM_CAP_MAX, v);
  const setAreaMin = (v: string) => setParam(PARAM_AREA_MIN, v);
  const setAreaMax = (v: string) => setParam(PARAM_AREA_MAX, v);
  const setEstMin = (v: string) => setParam(PARAM_EST_MIN, v);
  const setEstMax = (v: string) => setParam(PARAM_EST_MAX, v);
  const setArchitecturalStyle = (v: string) => setParam(PARAM_STYLE, v);

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    query,
    filter,
    view,
    sort,
    country,
    womenOnly,
    touristOnly,
    capMin,
    capMax,
    areaMin,
    areaMax,
    estMin,
    estMax,
    architecturalStyle,
    setQuery,
    setFilter,
    setView,
    setSort,
    setCountry,
    setWomenOnly,
    setTouristOnly,
    setCapMin,
    setCapMax,
    setAreaMin,
    setAreaMax,
    setEstMin,
    setEstMax,
    setArchitecturalStyle,
    clearAllFilters,
  };
}

export const MosqueGrid = () => {
  const {
    query,
    filter,
    view,
    sort,
    country,
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
    setWomenOnly,
    setTouristOnly,
    setCapMin,
    setCapMax,
    setAreaMin,
    setAreaMax,
    setEstMin,
    setEstMax,
    architecturalStyle,
    setArchitecturalStyle,
    clearAllFilters: clearAllFiltersFromHook,
  } = useMosqueSearchParams();

  const countries = useMemo(() => getUniqueCountries(), []);
  const styles = useMemo(() => getUniqueArchitecturalStyles(), []);

  const [searchInput, setSearchInput] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
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
    [setQuery]
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
    womenOnly ||
    touristOnly ||
    capMin !== "" ||
    capMax !== "" ||
    areaMin !== "" ||
    areaMax !== "" ||
    estMin !== "" ||
    estMax !== "" ||
    architecturalStyle !== "";

  const activeFilterCount = [
    country,
    womenOnly,
    touristOnly,
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
    if (womenOnly) list = list.filter((m) => m.womenPrayerArea);
    if (touristOnly) list = list.filter((m) => m.touristFriendly);
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
    if (!Number.isNaN(minEst)) list = list.filter((m) => establishedYear(m.established) >= minEst);
    if (!Number.isNaN(maxEst)) list = list.filter((m) => establishedYear(m.established) <= maxEst);

    list = filterMosquesByQuery(list, query);

    const order = sort || "holyCapacity";
    const sorted = [...list].sort((a, b) => {
      switch (order) {
        case "holyCapacity":
          if (a.isHolySite !== b.isHolySite) return a.isHolySite ? -1 : 1;
          return b.capacity - a.capacity;
        case "name":
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
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
          return a.country.localeCompare(b.country, undefined, { sensitivity: "base" }) || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [query, filter, country, womenOnly, touristOnly, capMin, capMax, areaMin, areaMax, estMin, estMax, architecturalStyle, sort]);

  return (
    <section id="mosques" className="py-16 md:py-24 bg-paper-cream islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Magnificent Mosques
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From the three holiest sites in Islam to architectural masterpieces
            around the world, discover mosques that have inspired millions.
          </p>
        </div>

        {/* Search + filters row: mobile stacked, desktop inline */}
        <div className="print:hidden flex flex-col gap-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <div className="relative flex-1 w-full min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search by name, city, country, style, history — Press / to focus"
                value={searchInput}
                onChange={(e) => setQueryDebounced(e.target.value)}
                className="pl-9 pr-9 w-full"
                aria-label="Search mosques by name, location, country, or description"
                autoComplete="off"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-secondary text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Filter className="w-5 h-5 text-muted-foreground shrink-0 hidden sm:block" aria-hidden />
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 touch-manipulation">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={`min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "all" ? "gradient-gold text-primary-foreground" : ""}`}
                >
                  All
                </Button>
                <Button
                  variant={filter === "holy" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("holy")}
                  className={`min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "holy" ? "gradient-gold text-primary-foreground" : ""}`}
                >
                  Holy Sites
                </Button>
                <Button
                  variant={filter === "tourist" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("tourist")}
                  className={`min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "tourist" ? "gradient-gold text-primary-foreground" : ""}`}
                >
                  Tourist
                </Button>
                <Button
                  variant={filter === "biggest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("biggest")}
                  className={`min-h-[44px] sm:min-h-0 touch-manipulation ${filter === "biggest" ? "gradient-gold text-primary-foreground" : ""}`}
                >
                  Biggest
                </Button>
              </div>
              <Select value={sort} onValueChange={(v) => setSort((v || "holyCapacity") as SortType)}>
                <SelectTrigger className="w-[160px] h-11 min-h-[44px] shrink-0 touch-manipulation" aria-label="Sort by">
                  <ArrowUpDown className="mr-2 h-4 w-4 shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holyCapacity">Holy first, then biggest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="established">Date</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1" role="group" aria-label="View mode">
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
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                >
                  <List className="w-5 h-5" />
                </Button>
                <Button
                  variant={view === "compact" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation"
                  onClick={() => setView("compact")}
                  aria-label="Compact view"
                  aria-pressed={view === "compact"}
                >
                  <AlignLeft className="w-5 h-5" />
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
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 md:shrink-0 relative">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Advanced filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
                        <SelectTrigger>
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
                      <Label>Architectural style</Label>
                      <Select
                        value={architecturalStyle || "all"}
                        onValueChange={(v) => setArchitecturalStyle(v === "all" ? "" : v)}
                      >
                        <SelectTrigger>
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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="women"
                        checked={womenOnly}
                        onCheckedChange={(c) => setWomenOnly(!!c)}
                      />
                      <Label htmlFor="women" className="font-normal cursor-pointer">
                        Women&apos;s prayer area only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tourist-adv"
                        checked={touristOnly}
                        onCheckedChange={(c) => setTouristOnly(!!c)}
                      />
                      <Label htmlFor="tourist-adv" className="font-normal cursor-pointer">
                        Tourist friendly only
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="capMin">Min capacity</Label>
                        <Input
                          id="capMin"
                          type="number"
                          min={0}
                          placeholder="e.g. 10000"
                          value={capMin}
                          onChange={(e) => setCapMin(e.target.value)}
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
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="areaMin">Min area (m²)</Label>
                        <Input
                          id="areaMin"
                          type="number"
                          min={0}
                          placeholder="e.g. 10000"
                          value={areaMin}
                          onChange={(e) => setAreaMin(e.target.value)}
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
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="estMin">Established after (year)</Label>
                        <Input
                          id="estMin"
                          type="number"
                          min={500}
                          max={2100}
                          placeholder="e.g. 1900"
                          value={estMin}
                          onChange={(e) => setEstMin(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estMax">Established before (year)</Label>
                        <Input
                          id="estMax"
                          type="number"
                          min={500}
                          max={2100}
                          placeholder="e.g. 2000"
                          value={estMax}
                          onChange={(e) => setEstMax(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full" onClick={clearAllFilters}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={clearAllFilters}>
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </Button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {query && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  &quot;{query}&quot;
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label="Remove search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filter !== "all" && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  {filter === "holy" ? "Holy Sites" : filter === "tourist" ? "Tourist" : "Biggest"}
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {country && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  {country}
                  <button
                    type="button"
                    onClick={() => setCountry("")}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label={`Remove country ${country}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {womenOnly && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  Women&apos;s area
                  <button
                    type="button"
                    onClick={() => setWomenOnly(false)}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label="Remove women's area filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {touristOnly && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  Tourist only
                  <button
                    type="button"
                    onClick={() => setTouristOnly(false)}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label="Remove tourist filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(capMin || capMax) && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal">
                  Capacity {capMin && `≥${Number(capMin).toLocaleString()}`}
                  {capMin && capMax && " "}
                  {capMax && `≤${Number(capMax).toLocaleString()}`}
                  <button
                    type="button"
                    onClick={() => {
                      setCapMin("");
                      setCapMax("");
                    }}
                    className="rounded-full p-0.5 hover:bg-muted"
                    aria-label="Remove capacity filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {architecturalStyle && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 font-normal max-w-[180px]">
                  <span className="truncate">{architecturalStyle}</span>
                  <button
                    type="button"
                    onClick={() => setArchitecturalStyle("")}
                    className="rounded-full p-0.5 hover:bg-muted shrink-0"
                    aria-label="Remove style filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

        </div>

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {filteredMosques.length === 0
            ? "No mosques match your filters. Try adjusting search or filters."
            : `${filteredMosques.length} mosque${filteredMosques.length === 1 ? "" : "s"} found.`}
        </p>

        {filteredMosques.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4" aria-hidden="true">
            {filteredMosques.length} mosque{filteredMosques.length === 1 ? "" : "s"} found
          </p>
        )}

        {view === "swipe" ? (
          <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: false,
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {filteredMosques.map((mosque, index) => (
                  <CarouselItem key={mosque.id} className="pl-2 sm:pl-4 basis-full">
                    <MosqueCard mosque={mosque} index={index} view="swipe" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 sm:-left-4 h-12 w-12 min-h-[44px] min-w-[44px] touch-manipulation" aria-label="Previous mosque" />
              <CarouselNext className="-right-2 sm:-right-4 h-12 w-12 min-h-[44px] min-w-[44px] touch-manipulation" aria-label="Next mosque" />
            </Carousel>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Swipe or use arrows to browse
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : view === "compact"
                  ? "grid-cols-1 max-w-2xl mx-auto gap-2"
                  : "grid-cols-1 max-w-3xl mx-auto"
            }`}
          >
            {filteredMosques.map((mosque, index) => (
              <MosqueCard key={mosque.id} mosque={mosque} index={index} view={view} />
            ))}
          </div>
        )}

        {filteredMosques.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              No mosques match your filters.
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" size="lg" onClick={clearAllFilters} className="gap-2">
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
